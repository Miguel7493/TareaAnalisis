/**
 * Private Loan Simulator Component
 * Aurora Privé - UsmBank
 * Advanced simulator with insurance options and precision controls
 * Inspired by SoFi, Upstart, Marcus by Goldman Sachs
 */

import { useState, useEffect } from 'react';
import { useSimulation, useLoanWizard, useAuth } from '../store/useStore';

// Tasas preferenciales según tipo de cliente
const TASAS_PREFERENCIALES = {
  REGULAR: 1.5,
  PREMIUM: 1.2,
  VIP: 1.0,
};

// Fórmula Sistema Francés
const calculateMonthlyPayment = (
  principal: number,
  monthlyRate: number,
  months: number
): number => {
  if (monthlyRate === 0) return principal / months;

  const numerator =
    principal * monthlyRate * Math.pow(1 + monthlyRate, months);
  const denominator = Math.pow(1 + monthlyRate, months) - 1;

  return numerator / denominator;
};

export function PrivateSimulator() {
  const { simulate, current } = useSimulation();
  const { setFormData, reset: resetWizard } = useLoanWizard();
  const { user } = useAuth();

  // Obtener tasa preferencial según tipo de cliente
  const tipoCliente = user?.cliente?.tipo || 'REGULAR';
  const tasaMensual = TASAS_PREFERENCIALES[tipoCliente];
  const tasaAnual = tasaMensual * 12;

  // State del simulador (inicializar con valores de la simulación actual si existe)
  const [monto, setMonto] = useState(current?.monto || 5000000);
  const [plazo, setPlazo] = useState(current?.plazo_meses || 24);
  const [seguroDesgravamen, setSeguroDesgravamen] = useState(false);
  const [seguroCesantia, setSeguroCesantia] = useState(false);
  const [primerVencimiento, setPrimerVencimiento] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // Default: 30 días
    return date.toISOString().split('T')[0];
  });

  // Cálculos
  const cuotaBase = calculateMonthlyPayment(monto, tasaMensual / 100, plazo);

  // Seguros (aproximadamente 2% adicional cada uno)
  const costoDesgravamen = seguroDesgravamen ? cuotaBase * 0.02 : 0;
  const costoCesantia = seguroCesantia ? cuotaBase * 0.02 : 0;

  const cuotaFinal = cuotaBase + costoDesgravamen + costoCesantia;
  const totalPagar = cuotaFinal * plazo;
  const totalIntereses = totalPagar - monto;
  const costoTotalCredito = totalIntereses + (costoDesgravamen + costoCesantia) * plazo;

  // Formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Guardar en store (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      simulate({
        monto,
        tasa_interes: tasaMensual,
        plazo_meses: plazo,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [monto, plazo, simulate, tasaMensual]);

  // Iniciar wizard de solicitud
  const handleComenzarSolicitud = () => {
    console.log('Iniciando Wizard de Solicitud');

    // Reset wizard y configurar datos iniciales
    resetWizard();
    setFormData({
      monto_solicitado: monto,
      plazo_meses: plazo,
      tasa_interes: tasaMensual,
      tipo_credito: 'CONSUMO',
      motivo: '',
    });

    // Por ahora solo log, después navegaremos al wizard
    console.log({
      monto,
      plazo,
      tasa: tasaMensual,
      seguroDesgravamen,
      seguroCesantia,
      primerVencimiento,
      cuotaFinal,
    });
  };

  // Calcular días de gracia
  const hoy = new Date();
  const vencimiento = new Date(primerVencimiento);
  const diasGracia = Math.ceil(
    (vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* Header con beneficio de tasa preferencial */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-600/30">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-900">
              Tasa Preferencial Activa
            </p>
            <p className="text-xs text-emerald-700">
              Como cliente {tipoCliente}, calificas a {tasaMensual}% mensual
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600">
              {tasaMensual}%
            </p>
            <p className="text-xs text-emerald-700">mensual</p>
          </div>
        </div>
      </div>

      {/* Simulador Principal */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">
          Simula tu Crédito Personalizado
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Ajusta los parámetros según tus necesidades
        </p>

        <div className="mt-6 space-y-6">
          {/* Monto */}
          <div>
            <div className="mb-3 flex items-end justify-between">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Monto a Solicitar
              </label>
              <span className="text-2xl font-bold text-slate-900">
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
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200"
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
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
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
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200"
              style={{
                background: `linear-gradient(to right, #0f172a 0%, #0f172a ${
                  ((plazo - 6) / (48 - 6)) * 100
                }%, #e2e8f0 ${
                  ((plazo - 6) / (48 - 6)) * 100
                }%, #e2e8f0 100%)`,
              }}
            />
            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>6 meses</span>
              <span>48 meses</span>
            </div>
          </div>

          {/* Seguros */}
          <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Protecciones Opcionales
            </p>

            <div className="space-y-3">
              {/* Seguro de Desgravamen */}
              <label className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-3 transition hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                      seguroDesgravamen
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Seguro de Desgravamen
                    </p>
                    <p className="text-xs text-slate-500">
                      Protege a tu familia (~2% adicional)
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={seguroDesgravamen}
                    onChange={(e) => setSeguroDesgravamen(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div
                    className={`h-6 w-11 rounded-full transition ${
                      seguroDesgravamen ? 'bg-slate-900' : 'bg-slate-300'
                    }`}
                  />
                  <div
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition ${
                      seguroDesgravamen ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </label>

              {/* Seguro de Cesantía */}
              <label className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-3 transition hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                      seguroCesantia
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Seguro de Cesantía
                    </p>
                    <p className="text-xs text-slate-500">
                      Cobertura de empleo (~2% adicional)
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={seguroCesantia}
                    onChange={(e) => setSeguroCesantia(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div
                    className={`h-6 w-11 rounded-full transition ${
                      seguroCesantia ? 'bg-slate-900' : 'bg-slate-300'
                    }`}
                  />
                  <div
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition ${
                      seguroCesantia ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Primer Vencimiento */}
          <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4">
            <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Primer Vencimiento
            </label>
            <input
              type="date"
              value={primerVencimiento}
              onChange={(e) => setPrimerVencimiento(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              max={
                new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0]
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
            <p className="mt-2 text-xs text-slate-500">
              {diasGracia > 0
                ? `${diasGracia} días de gracia (hasta 90 días permitidos)`
                : 'Selecciona una fecha futura'}
            </p>
          </div>
        </div>
      </div>

      {/* Resumen - Tarjeta destacada */}
      <div className="overflow-hidden rounded-2xl border border-slate-900/10 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Resumen de tu Crédito
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Valores finales con protecciones
              </p>
            </div>
            <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
              Tasa {tasaMensual}% mensual
            </div>
          </div>

          {/* Cuota Mensual Destacada */}
          <div className="mb-6 text-center">
            <p className="text-sm text-slate-400">Cuota Mensual Final</p>
            <p className="mt-2 text-5xl font-bold text-white">
              {formatCurrency(cuotaFinal)}
            </p>
            {(seguroDesgravamen || seguroCesantia) && (
              <p className="mt-2 text-xs text-slate-400">
                Base: {formatCurrency(cuotaBase)} + Seguros:{' '}
                {formatCurrency(costoDesgravamen + costoCesantia)}
              </p>
            )}
          </div>

          {/* Grid de detalles */}
          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div className="text-center">
              <p className="text-xs text-slate-400">Total a Pagar</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {formatCurrency(totalPagar)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">Total Intereses</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {formatCurrency(totalIntereses)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">CAE Estimado</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {((costoTotalCredito / monto) * (12 / plazo) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="border-t border-white/10 bg-white/5 p-4">
          <button
            onClick={handleComenzarSolicitud}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-base font-semibold text-slate-900 shadow-xl transition hover:bg-slate-50"
          >
            <span>Comenzar Solicitud</span>
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
          <p className="mt-3 text-center text-xs text-slate-400">
            * Valores referenciales. CAE incluye costos y gastos del crédito.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivateSimulator;
