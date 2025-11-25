/**
 * Conversion Modal Component
 * Aurora Privé - UsmBank
 * Modal para convertir usuarios anónimos en registrados
 */

import { useEffect } from 'react';
import { useSimulation } from '../store/useStore';

interface ConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: () => void;
  onLogin: () => void;
}

export function ConversionModal({
  isOpen,
  onClose,
  onSignup,
  onLogin,
}: ConversionModalProps) {
  const { current } = useSimulation();

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md">
        <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-900/10">
          {/* Decorative gradient */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.15),_rgba(15,23,42,0.05))]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            aria-label="Cerrar"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 shadow-lg">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>

            {/* Title */}
            <h3 className="mt-6 text-center text-2xl font-semibold text-slate-900">
              ¡Estás a un paso!
            </h3>

            {/* Subtitle */}
            <p className="mt-3 text-center text-base text-slate-600">
              Crea tu cuenta para acceder a tasas preferenciales y descubrir si
              calificas para mejores condiciones.
            </p>

            {/* Simulación resumida */}
            {current && (
              <div className="mt-6 rounded-2xl border border-slate-200/60 bg-white/70 p-4">
                <p className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Tu simulación
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-xs text-slate-500">Monto</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {formatCurrency(current.monto)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Plazo</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {current.plazo_meses} meses
                    </p>
                  </div>
                </div>
                <div className="mt-3 border-t border-slate-200 pt-3 text-center">
                  <p className="text-xs text-slate-500">Cuota mensual estimada</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">
                    {formatCurrency(current.cuota_mensual)}
                  </p>
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-900">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">
                  Evaluación crediticia en menos de 2 minutos
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-900">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">
                  Acceso a tasas desde 1.2% mensual
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-900">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">
                  Panel exclusivo para gestionar tus créditos
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 space-y-3">
              {/* Primary CTA */}
              <button
                onClick={onSignup}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-700"
              >
                <span>Crear Cuenta Gratis</span>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
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

              {/* Secondary CTA */}
              <button
                onClick={onLogin}
                className="flex w-full items-center justify-center rounded-full border border-slate-300/70 px-6 py-3.5 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
              >
                Ya tengo cuenta
              </button>
            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-slate-400">
              Sin costos ocultos · Proceso 100% en línea
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConversionModal;
