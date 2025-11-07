import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState, } from "react";
import Chart from "chart.js/auto";
import { chileanRateBenchmarks } from "../data/chileanRates";
import { syncSimulationWithBackend } from "./mockBackend";
import { compareAgainstBenchmark, useSimulatorStore, } from "./store";
import { calculateSimulationMetrics, formatCurrency, formatPercent, formatRatio, } from "./math";
const creditTypeOptions = [
    { value: "Crédito de consumo", label: "Consumo" },
    { value: "Crédito hipotecario", label: "Hipotecario" },
    { value: "Consolidación", label: "Consolidación" },
    { value: "Automotriz", label: "Automotriz" },
    { value: "Educación", label: "Educación" },
];
const institutionOptions = {
    "Crédito de consumo": ["Banco tradicional", "Fintech"],
    "Crédito hipotecario": ["Banco tradicional", "Cooperativa"],
    Consolidación: ["Banco tradicional"],
    Automotriz: ["Banco tradicional", "Financiera automotriz"],
    Educación: ["Banco tradicional", "Institución estatal"],
};
function generateInsights(preview, history, optimalId) {
    const insights = [];
    const comparison = compareAgainstBenchmark(preview);
    if (comparison) {
        if (comparison.isBelow) {
            insights.push({
                title: "Tasa competitiva",
                detail: `Estás ${Math.abs(comparison.delta).toFixed(2)} pts por ${comparison.delta < 0 ? "debajo" : "encima"} del promedio ${comparison.benchmark.institution.toLowerCase()} reportado por ${comparison.benchmark.source}.`,
                tone: comparison.delta < 0 ? "positive" : "warning",
            });
        }
        else {
            insights.push({
                title: "Oportunidad de reducir tasa",
                detail: `El promedio en Chile para ${comparison.benchmark.institution.toLowerCase()} es ${comparison.benchmark.averageRate.toFixed(2)}%. Negocia para reducir al menos ${comparison.delta.toFixed(2)} pts y acercarte a ese nivel.`,
                tone: "warning",
            });
        }
    }
    else {
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
    }
    else if (debtRatio >= 0.3) {
        insights.push({
            title: "Balance saludable",
            detail: "Tu endeudamiento mensual está dentro del rango recomendado (30%-45%). Mantén este perfil para conservar tu score.",
            tone: "positive",
        });
    }
    else {
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
const toneStyles = {
    positive: "border-emerald-200/60 bg-emerald-50 text-emerald-700",
    warning: "border-amber-300/70 bg-amber-50 text-amber-700",
    info: "border-slate-200/70 bg-slate-50 text-slate-600",
};
const MetricsChart = ({ amount, totalInterest, totalPaid, monthlyInstallment, monthlyIncome, }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        if (!canvasRef.current)
            return;
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
                            callback: (value) => formatCurrency(value),
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
                            label: (context) => `${context.label}: ${formatCurrency(context.raw)}`,
                        },
                    },
                },
            },
        });
        return () => {
            chart.destroy();
        };
    }, [amount, totalInterest, monthlyInstallment, monthlyIncome]);
    return _jsx("canvas", { ref: canvasRef, className: "h-48 w-full", "aria-label": "Visualizaci\u00F3n de resultados", role: "img" });
};
export const CreditSimulator = () => {
    const input = useSimulatorStore((state) => state.input);
    const setField = useSimulatorStore((state) => state.setField);
    const hydrate = useSimulatorStore((state) => state.hydrate);
    const compute = useSimulatorStore((state) => state.compute);
    const history = useSimulatorStore((state) => state.history);
    const optimalId = useSimulatorStore((state) => state.optimalId);
    const loadFromHistory = useSimulatorStore((state) => state.loadFromHistory);
    const [syncState, setSyncState] = useState("idle");
    const [backendReference, setBackendReference] = useState(null);
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
    const insights = useMemo(() => generateInsights(preview, history, optimalId), [
        preview,
        history,
        optimalId,
    ]);
    const rankedHistory = useMemo(() => history
        .slice()
        .sort((a, b) => a.cae - b.cae)
        .map((item, index) => ({
        ...item,
        rank: index + 1,
    })), [history]);
    const handleConfirm = useCallback(async () => {
        setSyncState("syncing");
        setBackendReference(null);
        try {
            const stored = compute();
            const payload = await syncSimulationWithBackend(stored);
            setBackendReference(payload.reference);
            setSyncState("synced");
        }
        catch (error) {
            console.error("No se pudo sincronizar con el backend simulado", error);
            setSyncState("error");
        }
    }, [compute]);
    return (_jsxs("section", { id: "simulador", className: "relative isolate overflow-hidden rounded-[2.5rem] bg-white/80 p-10 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200/60 backdrop-blur", children: [_jsx("div", { className: "absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_rgba(15,23,42,0.05))]" }), _jsxs("div", { className: "flex flex-col gap-10 lg:flex-row lg:gap-14", children: [_jsxs("form", { className: "w-full space-y-6 lg:max-w-md", onSubmit: (event) => event.preventDefault(), children: [_jsxs("div", { children: [_jsx("p", { className: "text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-slate-400", children: "Simulador premium" }), _jsx("h2", { className: "mt-3 text-3xl font-semibold text-slate-900", children: "Dise\u00F1a tu cr\u00E9dito inteligente" }), _jsx("p", { className: "mt-2 text-sm text-slate-500", children: "Ajusta variables clave y visualiza el impacto inmediato antes de consolidar tu solicitud." })] }), _jsxs("div", { className: "grid gap-5", children: [_jsxs("label", { className: "grid gap-2", children: [_jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-slate-500", children: "Monto solicitado" }), _jsx("input", { type: "number", inputMode: "numeric", min: 1000000, step: 50000, value: Math.round(input.amount), onChange: (event) => setField("amount", Number(event.currentTarget.value) || 0), className: "w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2", children: [_jsxs("label", { className: "grid gap-2", children: [_jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-slate-500", children: "Plazo (meses)" }), _jsx("input", { type: "number", inputMode: "numeric", min: 6, max: 360, value: Math.round(input.term), onChange: (event) => setField("term", Number(event.currentTarget.value) || 0), className: "w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10" })] }), _jsxs("label", { className: "grid gap-2", children: [_jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-slate-500", children: "Tasa anual" }), _jsx("input", { type: "number", inputMode: "decimal", min: 0, step: 0.1, value: Number(input.rate.toFixed(2)), onChange: (event) => setField("rate", Number(event.currentTarget.value) || 0), className: "w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10" })] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2", children: [_jsxs("label", { className: "grid gap-2", children: [_jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-slate-500", children: "Tipo de cr\u00E9dito" }), _jsx("select", { value: input.creditType, onChange: (event) => setField("creditType", event.currentTarget.value), className: "w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10", children: creditTypeOptions.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) })] }), _jsxs("label", { className: "grid gap-2", children: [_jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-slate-500", children: "Instituci\u00F3n" }), _jsx("select", { value: input.institution, onChange: (event) => setField("institution", event.currentTarget.value), className: "w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10", children: institutionOptions[input.creditType].map((institution) => (_jsx("option", { value: institution, children: institution }, institution))) })] })] }), _jsxs("label", { className: "grid gap-2", children: [_jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-slate-500", children: "Ingreso mensual" }), _jsx("input", { type: "number", inputMode: "numeric", min: 200000, step: 50000, value: Math.round(input.monthlyIncome), onChange: (event) => setField("monthlyIncome", Number(event.currentTarget.value) || 0), className: "w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10" })] })] }), _jsx("button", { type: "button", onClick: handleConfirm, className: "inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:bg-slate-700", children: syncState === "syncing" ? "Guardando simulación…" : "Guardar y preaprobar" }), syncState === "synced" && backendReference ? (_jsxs("p", { className: "text-center text-sm font-medium text-emerald-600", children: ["Simulaci\u00F3n registrada. Referencia interna ", backendReference, "."] })) : null, syncState === "error" ? (_jsx("p", { className: "text-center text-sm font-medium text-amber-600", children: "No pudimos registrar la simulaci\u00F3n. Int\u00E9ntalo nuevamente." })) : null] }), _jsxs("div", { className: "flex-1 space-y-8", children: [_jsxs("div", { className: "grid gap-6 rounded-[2rem] border border-white/60 bg-white/90 p-6 shadow-lg shadow-slate-900/10", children: [_jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsx(StatCard, { label: "Cuota estimada", value: formatCurrency(preview.monthlyInstallment) }), _jsx(StatCard, { label: "CAE", value: formatPercent(preview.cae), subtle: true }), _jsx(StatCard, { label: "Total pagado", value: formatCurrency(preview.totalPaid) }), _jsx(StatCard, { label: "Endeudamiento", value: formatRatio(preview.debtRatio), subtle: true })] }), _jsx(MetricsChart, { amount: preview.amount, totalInterest: preview.totalInterest, totalPaid: preview.totalPaid, monthlyInstallment: preview.monthlyInstallment, monthlyIncome: preview.monthlyIncome })] }), _jsxs("section", { className: "grid gap-6 lg:grid-cols-2", children: [_jsxs("article", { className: "rounded-[2rem] border border-slate-200/70 bg-slate-900 text-slate-100 p-6 shadow-xl shadow-slate-900/30", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Analista Aurora" }), _jsx("p", { className: "mt-1 text-sm text-slate-300", children: "Recomendaciones generadas localmente para optimizar tu perfil." }), _jsx("ul", { className: "mt-5 grid gap-3", children: insights.map((insight, index) => (_jsxs("li", { className: `rounded-2xl border px-4 py-3 text-sm font-medium ${toneStyles[insight.tone]}`, children: [_jsx("span", { className: "block text-[0.75rem] font-semibold uppercase tracking-wide text-white/60", children: insight.title }), _jsx("span", { className: "mt-1 block text-white/80", children: insight.detail })] }, `${insight.title}-${index}`))) })] }), _jsxs("article", { className: "rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-900/10", children: [_jsxs("div", { className: "flex items-baseline justify-between", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-900", children: "Ranking de simulaciones" }), _jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-slate-400", children: "CAE m\u00E1s baja" })] }), _jsx("ul", { className: "mt-5 grid gap-3", children: rankedHistory.length === 0 ? (_jsx("li", { className: "rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400", children: "A\u00FAn no hay simulaciones guardadas." })) : (rankedHistory.map((entry) => (_jsx("li", { children: _jsxs("button", { type: "button", onClick: () => loadFromHistory(entry.id), className: `group grid w-full gap-2 rounded-2xl border px-4 py-3 text-left transition ${entry.id === optimalId
                                                            ? "border-emerald-400/60 bg-emerald-50"
                                                            : "border-slate-200/70 bg-white/80 hover:border-slate-400/70"}`, children: [_jsxs("div", { className: "flex items-center justify-between text-sm font-semibold text-slate-900", children: [_jsxs("span", { children: ["#", entry.rank, " \u00B7 ", formatCurrency(entry.amount)] }), _jsx("span", { className: "rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white", children: formatPercent(entry.cae, 2) })] }), _jsxs("div", { className: "flex items-center justify-between text-xs text-slate-500", children: [_jsxs("span", { children: [entry.term, " meses \u00B7 ", entry.creditType] }), _jsx("span", { children: entry.institution })] }), entry.id === optimalId ? (_jsx("span", { className: "mt-1 inline-flex items-center gap-2 text-xs font-semibold text-emerald-600", children: "Simulaci\u00F3n \u00F3ptima" })) : null] }) }, entry.id)))) })] })] }), _jsxs("section", { className: "rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-inner shadow-white/70", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-900", children: "Tasas promedio en Chile" }), _jsx("span", { className: "text-xs text-slate-400", children: "Fuente referencial" })] }), _jsx("div", { className: "mt-4 grid gap-3 text-sm text-slate-600", children: chileanRateBenchmarks.map((entry) => (_jsxs("div", { className: "flex flex-wrap items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3", children: [_jsx("span", { className: "font-semibold text-slate-800", children: entry.creditType }), _jsx("span", { className: "text-xs uppercase tracking-[0.25em] text-slate-400", children: entry.institution }), _jsxs("span", { className: "text-sm font-semibold text-slate-900", children: [entry.averageRate.toFixed(2), "%"] }), _jsxs("span", { className: "text-xs text-slate-400", children: ["Actualizado ", entry.updatedAt] })] }, `${entry.creditType}-${entry.institution}`))) })] })] })] })] }));
};
const StatCard = ({ label, value, subtle = false, }) => (_jsxs("article", { className: `rounded-2xl border px-5 py-4 shadow-sm transition ${subtle ? "border-slate-200/70 bg-slate-50 text-slate-600" : "border-white/60 bg-white text-slate-900"}`, children: [_jsx("span", { className: "text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400", children: label }), _jsx("span", { className: "mt-2 block text-lg font-semibold", children: value })] }));
