import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Chart from "chart.js/auto";
import { chileanRateBenchmarks } from "../data/chileanRates";
import { syncSimulationWithBackend } from "./mockBackend";
import {
  compareAgainstBenchmark,
  useSimulatorStore,
} from "./store";
import {
  calculateSimulationMetrics,
  formatCurrency,
  formatPercent,
  formatRatio,
} from "./math";
import type { CreditType, SimulationResult } from "./types";

const creditTypeOptions: { value: CreditType; label: string }[] = [
  { value: "Crédito de consumo", label: "Consumo" },
  { value: "Crédito hipotecario", label: "Hipotecario" },
  { value: "Consolidación", label: "Consolidación" },
  { value: "Automotriz", label: "Automotriz" },
  { value: "Educación", label: "Educación" },
];

const institutionOptions: Record<CreditType, string[]> = {
  "Crédito de consumo": ["Banco tradicional", "Fintech"],
  "Crédito hipotecario": ["Banco tradicional", "Cooperativa"],
  Consolidación: ["Banco tradicional"],
  Automotriz: ["Banco tradicional", "Financiera automotriz"],
  Educación: ["Banco tradicional", "Institución estatal"],
};

interface Insight {
  title: string;
  detail: string;
  tone: "positive" | "warning" | "info";
}

function generateInsights(
  preview: SimulationResult,
  history: SimulationResult[],
  optimalId: string | null,
): Insight[] {
  const insights: Insight[] = [];
  const comparison = compareAgainstBenchmark(preview);

  if (comparison) {
    if (comparison.isBelow) {
      insights.push({
        title: "Tasa competitiva",
        detail: `Estás ${Math.abs(comparison.delta).toFixed(2)} pts por ${comparison.delta < 0 ? "debajo" : "encima"} del promedio ${comparison.benchmark.institution.toLowerCase()} reportado por ${comparison.benchmark.source}.`,
        tone: comparison.delta < 0 ? "positive" : "warning",
      });
    } else {
      insights.push({
        title: "Oportunidad de reducir tasa",
        detail: `El promedio en Chile para ${comparison.benchmark.institution.toLowerCase()} es ${comparison.benchmark.averageRate.toFixed(2)}%. Negocia para reducir al menos ${comparison.delta.toFixed(2)} pts y acercarte a ese nivel.`,
        tone: "warning",
      });
    }
  } else {
    insights.push({
      title: "Benchmark no disponible",
      detail: "Ajusta el tipo de crédito o institución para comparar con referencias locales.",
      tone: "info",
    });
  }

  const debtRatio = preview.debtRatio;
  if (debtRatio >= 0.45) {
    insights.push({
      title: "Carga mensual alta",
      detail: "Destina más del 45% de tu ingreso mensual a la cuota. Reduce monto o amplía plazo para mejorar el flujo.",
      tone: "warning",
    });
  } else if (debtRatio >= 0.3) {
    insights.push({
      title: "Balance saludable",
      detail: "Tu endeudamiento mensual está dentro del rango recomendado (30%-45%). Mantén este perfil para conservar tu score.",
      tone: "positive",
    });
  } else {
    insights.push({
      title: "Espacio para invertir",
      detail: "La cuota representa menos del 30% de tu ingreso. Puedes evaluar amortizaciones anticipadas sin comprometer liquidez.",
      tone: "info",
    });
  }

  const sorted = history.slice().sort((a, b) => a.cae - b.cae);
  const optimal = sorted[0];
  if (optimal) {
    const delta = preview.cae - optimal.cae;
    const isCurrentOptimal = preview.id === optimalId || Math.abs(delta) < 0.01;
    insights.push({
      title: isCurrentOptimal ? "Simulación óptima" : "Compara con tu mejor CAE",
      detail: isCurrentOptimal
        ? "Estás obteniendo la CAE más baja registrada en tus simulaciones."
        : `Tu mejor registro tiene una CAE de ${optimal.cae.toFixed(2)}%. Ajusta tasa o plazo para reducir los ${delta.toFixed(2)} pts de diferencia.`,
      tone: isCurrentOptimal ? "positive" : "info",
    });
  }

  return insights;
}

const toneStyles: Record<Insight["tone"], string> = {
  positive: "border-emerald-200/60 bg-emerald-50 text-emerald-700",
  warning: "border-amber-300/70 bg-amber-50 text-amber-700",
  info: "border-slate-200/70 bg-slate-50 text-slate-600",
};

type SyncState = "idle" | "syncing" | "synced" | "error";

const MetricsChart = ({
  amount,
  totalInterest,
  totalPaid,
  monthlyInstallment,
  monthlyIncome,
}: {
  amount: number;
  totalInterest: number;
  totalPaid: number;
  monthlyInstallment: number;
  monthlyIncome: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const chart = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: ["Capital", "Interés", "Cuota mensual", "Ingreso neto"],
        datasets: [
          {
            label: "Distribución",
            data: [amount, totalInterest, monthlyInstallment, monthlyIncome],
            backgroundColor: [
              "rgba(15, 23, 42, 0.75)",
              "rgba(99, 102, 241, 0.75)",
              "rgba(14, 116, 144, 0.75)",
              "rgba(148, 163, 184, 0.6)",
            ],
            borderRadius: 18,
          },
        ],
      },
      options: {
        animation: {
          duration: 550,
          easing: "easeOutQuart",
        },
        scales: {
          y: {
            ticks: {
              callback: (value: number) => formatCurrency(value),
            },
            grid: {
              drawBorder: false,
              color: "rgba(148, 163, 184, 0.2)",
            },
          },
          x: {
            grid: { display: false },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context: any) => `${context.label}: ${formatCurrency(context.raw as number)}`,
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [amount, totalInterest, monthlyInstallment, monthlyIncome]);

  return <canvas ref={canvasRef} className="h-48 w-full" aria-label="Visualización de resultados" role="img" />;
};

export const CreditSimulator = () => {
  const input = useSimulatorStore((state) => state.input);
  const setField = useSimulatorStore((state) => state.setField);
  const hydrate = useSimulatorStore((state) => state.hydrate);
  const compute = useSimulatorStore((state) => state.compute);
  const history = useSimulatorStore((state) => state.history);
  const optimalId = useSimulatorStore((state) => state.optimalId);
  const loadFromHistory = useSimulatorStore((state) => state.loadFromHistory);

  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [backendReference, setBackendReference] = useState<string | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const allowedInstitutions = institutionOptions[input.creditType];
    if (!allowedInstitutions.includes(input.institution)) {
      setField("institution", allowedInstitutions[0]);
    }
  }, [input.creditType, input.institution, setField]);

  const preview = useMemo(() => ({
    ...input,
    ...calculateSimulationMetrics(input),
    id: "preview",
    createdAt: new Date().toISOString(),
  }), [input]);

  const insights = useMemo(() => generateInsights(preview as SimulationResult, history, optimalId), [
    preview,
    history,
    optimalId,
  ]);

  const rankedHistory = useMemo(
    () =>
      history
        .slice()
        .sort((a, b) => a.cae - b.cae)
        .map((item, index) => ({
          ...item,
          rank: index + 1,
        })),
    [history],
  );

  const handleConfirm = useCallback(async () => {
    setSyncState("syncing");
    setBackendReference(null);
    try {
      const stored = compute();
      const payload = await syncSimulationWithBackend(stored);
      setBackendReference(payload.reference);
      setSyncState("synced");
    } catch (error) {
      console.error("No se pudo sincronizar con el backend simulado", error);
      setSyncState("error");
    }
  }, [compute]);

  return (
    <section id="simulador" className="relative isolate overflow-hidden rounded-[2.5rem] bg-white/80 p-10 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200/60 backdrop-blur">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_rgba(15,23,42,0.05))]" />
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
        <form
          className="w-full space-y-6 lg:max-w-md"
          onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}
        >
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-slate-400">Simulador premium</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Diseña tu crédito inteligente</h2>
            <p className="mt-2 text-sm text-slate-500">
              Ajusta variables clave y visualiza el impacto inmediato antes de consolidar tu solicitud.
            </p>
          </div>

          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Monto solicitado</span>
              <input
                type="number"
                inputMode="numeric"
                min={1000000}
                step={50000}
                value={Math.round(input.amount)}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setField("amount", Number(event.currentTarget.value) || 0)
                }
                className="w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              />
            </label>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Plazo (meses)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={6}
                  max={360}
                  value={Math.round(input.term)}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setField("term", Number(event.currentTarget.value) || 0)
                  }
                  className="w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Tasa anual</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.1}
                  value={Number(input.rate.toFixed(2))}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setField("rate", Number(event.currentTarget.value) || 0)
                  }
                  className="w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Tipo de crédito</span>
                <select
                  value={input.creditType}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    setField("creditType", event.currentTarget.value as CreditType)
                  }
                  className="w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                >
                  {creditTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Institución</span>
                <select
                  value={input.institution}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    setField("institution", event.currentTarget.value)
                  }
                  className="w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                >
                  {institutionOptions[input.creditType].map((institution) => (
                    <option key={institution} value={institution}>
                      {institution}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Ingreso mensual</span>
              <input
                type="number"
                inputMode="numeric"
                min={200000}
                step={50000}
                value={Math.round(input.monthlyIncome)}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setField("monthlyIncome", Number(event.currentTarget.value) || 0)
                }
                className="w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:bg-slate-700"
          >
            {syncState === "syncing" ? "Guardando simulación…" : "Guardar y preaprobar"}
          </button>

          {syncState === "synced" && backendReference ? (
            <p className="text-center text-sm font-medium text-emerald-600">
              Simulación registrada. Referencia interna {backendReference}.
            </p>
          ) : null}
          {syncState === "error" ? (
            <p className="text-center text-sm font-medium text-amber-600">
              No pudimos registrar la simulación. Inténtalo nuevamente.
            </p>
          ) : null}
        </form>

        <div className="flex-1 space-y-8">
          <div className="grid gap-6 rounded-[2rem] border border-white/60 bg-white/90 p-6 shadow-lg shadow-slate-900/10">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard label="Cuota estimada" value={formatCurrency(preview.monthlyInstallment)} />
              <StatCard label="CAE" value={formatPercent(preview.cae)} subtle />
              <StatCard label="Total pagado" value={formatCurrency(preview.totalPaid)} />
              <StatCard label="Endeudamiento" value={formatRatio(preview.debtRatio)} subtle />
            </div>
            <MetricsChart
              amount={preview.amount}
              totalInterest={preview.totalInterest}
              totalPaid={preview.totalPaid}
              monthlyInstallment={preview.monthlyInstallment}
              monthlyIncome={preview.monthlyIncome}
            />
          </div>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-slate-200/70 bg-slate-900 text-slate-100 p-6 shadow-xl shadow-slate-900/30">
              <h3 className="text-lg font-semibold">Analista Aurora</h3>
              <p className="mt-1 text-sm text-slate-300">
                Recomendaciones generadas localmente para optimizar tu perfil.
              </p>
              <ul className="mt-5 grid gap-3">
                {insights.map((insight, index) => (
                  <li
                    key={`${insight.title}-${index}`}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium ${toneStyles[insight.tone]}`}
                  >
                    <span className="block text-[0.75rem] font-semibold uppercase tracking-wide text-white/60">
                      {insight.title}
                    </span>
                    <span className="mt-1 block text-white/80">{insight.detail}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-900/10">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Ranking de simulaciones</h3>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">CAE más baja</span>
              </div>
              <ul className="mt-5 grid gap-3">
                {rankedHistory.length === 0 ? (
                  <li className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
                    Aún no hay simulaciones guardadas.
                  </li>
                ) : (
                  rankedHistory.map((entry) => (
                    <li key={entry.id}>
                      <button
                        type="button"
                        onClick={() => loadFromHistory(entry.id)}
                        className={`group grid w-full gap-2 rounded-2xl border px-4 py-3 text-left transition ${
                          entry.id === optimalId
                            ? "border-emerald-400/60 bg-emerald-50"
                            : "border-slate-200/70 bg-white/80 hover:border-slate-400/70"
                        }`}
                      >
                        <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                          <span>#{entry.rank} · {formatCurrency(entry.amount)}</span>
                          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                            {formatPercent(entry.cae, 2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{entry.term} meses · {entry.creditType}</span>
                          <span>{entry.institution}</span>
                        </div>
                        {entry.id === optimalId ? (
                          <span className="mt-1 inline-flex items-center gap-2 text-xs font-semibold text-emerald-600">
                            Simulación óptima
                          </span>
                        ) : null}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </article>
          </section>

          <section className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-inner shadow-white/70">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Tasas promedio en Chile</h3>
              <span className="text-xs text-slate-400">Fuente referencial</span>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              {chileanRateBenchmarks.map((entry) => (
                <div
                  key={`${entry.creditType}-${entry.institution}`}
                  className="flex flex-wrap items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3"
                >
                  <span className="font-semibold text-slate-800">{entry.creditType}</span>
                  <span className="text-xs uppercase tracking-[0.25em] text-slate-400">{entry.institution}</span>
                  <span className="text-sm font-semibold text-slate-900">{entry.averageRate.toFixed(2)}%</span>
                  <span className="text-xs text-slate-400">Actualizado {entry.updatedAt}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({
  label,
  value,
  subtle = false,
}: {
  label: string;
  value: string;
  subtle?: boolean;
}) => (
  <article
    className={`rounded-2xl border px-5 py-4 shadow-sm transition ${
      subtle ? "border-slate-200/70 bg-slate-50 text-slate-600" : "border-white/60 bg-white text-slate-900"
    }`}
  >
    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">{label}</span>
    <span className="mt-2 block text-lg font-semibold">{value}</span>
  </article>
);
