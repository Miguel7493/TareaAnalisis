/**
 * Dashboard Home Component
 * Aurora Privé - UsmBank
 * Main dashboard view with scoring widgets and private simulator
 * Inspired by Upstart, SoFi, Marcus
 */

import { useAuth } from '../store/useStore';
import { PrivateSimulator } from './PrivateSimulator';

// Score gauge component (inspired by Upstart)
function ScoreGauge({ score, maxScore = 1000 }: { score: number; maxScore?: number }) {
  const percentage = (score / maxScore) * 100;

  // Color based on score
  const getScoreColor = () => {
    if (percentage >= 80) return { primary: '#10b981', secondary: '#d1fae5' }; // Green
    if (percentage >= 60) return { primary: '#3b82f6', secondary: '#dbeafe' }; // Blue
    if (percentage >= 40) return { primary: '#f59e0b', secondary: '#fef3c7' }; // Yellow
    return { primary: '#ef4444', secondary: '#fee2e2' }; // Red
  };

  const colors = getScoreColor();

  // Calculate circle parameters
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      {/* SVG Circle */}
      <svg className="h-40 w-40 -rotate-90 transform">
        {/* Background circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke={colors.secondary}
          strokeWidth="12"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke={colors.primary}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-4xl font-bold" style={{ color: colors.primary }}>
          {score}
        </p>
        <p className="text-xs text-slate-500">de {maxScore}</p>
      </div>
    </div>
  );
}

// Cupo pre-aprobado card
function CupoPreAprobado({ monto }: { monto: number }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl transition hover:shadow-2xl">
      {/* Animated background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(148,163,184,0.2),_transparent_50%)] opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Cupo Pre-Aprobado
            </p>
            <p className="text-sm text-slate-300">Disponible para solicitar</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-4xl font-bold text-white">{formatCurrency(monto)}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Aprobación instantánea</span>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-xs text-slate-300">
            Este monto está pre-aprobado según tu perfil crediticio. Puedes solicitar
            hasta esta cantidad con aprobación automática.
          </p>
        </div>
      </div>
    </div>
  );
}

// Score info card
function ScoreInfoCard({ score }: { score: number }) {
  const getScoreLabel = () => {
    if (score >= 800) return { text: 'Excelente', color: 'text-emerald-600' };
    if (score >= 650) return { text: 'Muy Bueno', color: 'text-blue-600' };
    if (score >= 500) return { text: 'Bueno', color: 'text-yellow-600' };
    return { text: 'Regular', color: 'text-red-600' };
  };

  const label = getScoreLabel();

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tu Score Crediticio
          </p>
          <p className={`mt-1 text-lg font-semibold ${label.color}`}>
            {label.text}
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          Actualizado hoy
        </div>
      </div>

      <ScoreGauge score={score} maxScore={1000} />

      {/* Score breakdown */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Historial de pagos</span>
          <span className="font-semibold text-slate-900">95%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Utilización de crédito</span>
          <span className="font-semibold text-slate-900">32%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Antigüedad crediticia</span>
          <span className="font-semibold text-slate-900">5 años</span>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-3">
        <div className="flex items-start gap-2">
          <svg
            className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-xs font-semibold text-blue-900">
              Consejo para mejorar
            </p>
            <p className="mt-1 text-xs text-blue-700">
              Mantén tu utilización de crédito bajo 30% para mejorar tu score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Home component
export function DashboardHome() {
  const { user } = useAuth();

  // Obtener score del cliente (o valor por defecto)
  const score = user?.cliente?.score_credito || 950;

  // Calcular cupo pre-aprobado basado en ingresos
  const ingresosmensuales = user?.cliente?.ingresos_mensuales || 0;
  const cupoPreAprobado = Math.min(ingresosmensuales * 3, 10000000); // Máximo 3x ingresos o $10M

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Bienvenido, {user?.nombre || 'Usuario'}
        </h1>
        <p className="mt-2 text-slate-600">
          Gestiona tus créditos y solicita nuevos financiamientos
        </p>
      </div>

      {/* Widget Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ScoreInfoCard score={score} />
        <CupoPreAprobado monto={cupoPreAprobado} />
      </div>

      {/* Simulador Privado */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Simula tu Próximo Crédito
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Usa el simulador avanzado con tus tasas preferenciales
          </p>
        </div>
        <PrivateSimulator />
      </div>

      {/* Info adicional */}
      <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white p-6">
        <h3 className="text-lg font-semibold text-slate-900">
          ¿Necesitas ayuda?
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Nuestro equipo de asesores está disponible para ayudarte con tus consultas.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>Llamar ahora</span>
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>Chat en vivo</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
