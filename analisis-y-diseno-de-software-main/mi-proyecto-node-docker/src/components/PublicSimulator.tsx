/**
 * Public Loan Simulator Component
 * Aurora Privé - UsmBank
 */

import { useState, useEffect } from 'react';
import { useSimulation } from '../store/useStore';

interface PublicSimulatorProps {
  onRequestLoan?: () => void;
}

// Fórmula Sistema Francés
const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  months: number
): number => {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;

  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months);
  const denominator = Math.pow(1 + monthlyRate, months) - 1;

  return numerator / denominator;
};

export function PublicSimulator({ onRequestLoan }: PublicSimulatorProps) {
  const { simulate, current, isLoading } = useSimulation();

  // State local para los sliders
  const [monto, setMonto] = useState(5000000);
  const [plazo, setPlazo] = useState(24);
  const [tasaAnual] = useState(18); // 1.5% mensual = 18% anual

  // Calcular cuota en tiempo real
  const cuotaMensual = calculateMonthlyPayment(monto, tasaAnual, plazo);
  const totalPagar = cuotaMensual * plazo;
  const totalIntereses = totalPagar - monto;

  // Formatear números como moneda chilena
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Guardar simulación en el store cuando el usuario hace cambios
  useEffect(() => {
    const timer = setTimeout(() => {
      simulate({
        monto,
        tasa_interes: tasaAnual / 12,
        plazo_meses: plazo,
      });
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timer);
  }, [monto, plazo, simulate, tasaAnual]);

  const handleSolicitar = () => {
    // Guardar simulación antes de abrir modal
    simulate({
      monto,
      tasa_interes: tasaAnual / 12,
      plazo_meses: plazo,
    });

    if (onRequestLoan) {
      onRequestLoan();
    }
  };

  return (
    <section
      id="simulador"
      className="relative isolate overflow-hidden rounded-[2rem] bg-white/75 p-8 shadow-xl shadow-slate-900/10 ring-1 ring-white/60 backdrop-blur"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.2),_rgba(15,23,42,0.08))]" />

      {/* Header */}
      <div className="mb-8">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-400">
          Simulador Público
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Calcula tu cuota mensual
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Ajusta el monto y plazo para ver tu cuota estimada
        </p>
      </div>

      {/* Controles */}
      <div className="space-y-6">
        {/* Monto */}
        <div>
          <div className="mb-3 flex items-end justify-between">
            <label className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Monto
            </label>
            <span className="text-2xl font-semibold text-slate-900">
              {formatCurrency(monto)}
            </span>
          </div>
          <input
            type="range"
            min="1000000"
            max="50000000"
            step="500000"
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 transition"
            style={{
              background: `linear-gradient(to right, #0f172a 0%, #0f172a ${
                ((monto - 1000000) / (50000000 - 1000000)) * 100
              }%, #e2e8f0 ${
                ((monto - 1000000) / (50000000 - 1000000)) * 100
              }%, #e2e8f0 100%)`,
            }}
          />
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>$1M</span>
            <span>$50M</span>
          </div>
        </div>

        {/* Plazo */}
        <div>
          <div className="mb-3 flex items-end justify-between">
            <label className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Plazo
            </label>
            <span className="text-xl font-semibold text-slate-900">
              {plazo} meses
            </span>
          </div>
          <input
            type="range"
            min="6"
            max="48"
            step="1"
            value={plazo}
            onChange={(e) => setPlazo(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 transition"
            style={{
              background: `linear-gradient(to right, #0f172a 0%, #0f172a ${
                ((plazo - 6) / (48 - 6)) * 100
              }%, #e2e8f0 ${((plazo - 6) / (48 - 6)) * 100}%, #e2e8f0 100%)`,
            }}
          />
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>6 meses</span>
            <span>48 meses</span>
          </div>
        </div>

        {/* Tasa de interés (informativa) */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/70 px-4 py-3 text-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
            Tasa estimada
          </p>
          <p className="mt-1 text-sm font-medium text-slate-600">
            {(tasaAnual / 12).toFixed(2)}% mensual · {tasaAnual}% anual
          </p>
        </div>

        {/* Resultados */}
        <div className="rounded-2xl border border-slate-900/10 bg-slate-900 p-6 shadow-lg">
          <div className="grid gap-4">
            {/* Cuota mensual */}
            <div className="text-center">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-400">
                Cuota Mensual
              </p>
              <p className="mt-2 text-4xl font-semibold text-white">
                {formatCurrency(cuotaMensual)}
              </p>
            </div>

            {/* Detalles */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
              <div className="text-center">
                <p className="text-xs text-slate-400">Total a pagar</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {formatCurrency(totalPagar)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">Intereses</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {formatCurrency(totalIntereses)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSolicitar}
          disabled={isLoading}
          className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-700 disabled:opacity-50"
        >
          <span>SOLICITAR AHORA</span>
          <svg
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Disclaimer */}
        <p className="mt-4 text-center text-xs text-slate-400">
          * Simulación referencial. Tasa sujeta a evaluación crediticia.
        </p>
      </div>
    </section>
  );
}

export default PublicSimulator;
