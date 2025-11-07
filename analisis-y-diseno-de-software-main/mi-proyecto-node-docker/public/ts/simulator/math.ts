import type { SimulationInput, SimulationMetrics, SimulationResult } from "./types";

export function calculateSimulationMetrics(input: SimulationInput): SimulationMetrics {
  const amount = Math.max(input.amount, 0);
  const term = Math.max(input.term, 1);
  const rate = Math.max(input.rate, 0);
  const income = Math.max(input.monthlyIncome, 1);

  const monthlyRate = rate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, term);

  const monthlyInstallment = monthlyRate === 0
    ? amount / term
    : (amount * monthlyRate * factor) / (factor - 1);

  const totalPaid = monthlyInstallment * term;
  const totalInterest = totalPaid - amount;
  const cae = (Math.pow(1 + monthlyRate, 12) - 1) * 100;
  const debtRatio = monthlyInstallment / income;

  return {
    monthlyInstallment,
    totalInterest,
    totalPaid,
    cae,
    debtRatio,
  };
}

export function buildSimulationResult(
  input: SimulationInput,
  previousId?: string,
): SimulationResult {
  const metrics = calculateSimulationMetrics(input);
  const id = previousId ?? (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const createdAt = new Date().toISOString();

  return {
    ...input,
    ...metrics,
    id,
    createdAt,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatPercent(value: number, digits = 2): string {
  return `${value.toFixed(digits)}%`;
}

export function formatRatio(value: number, digits = 2): string {
  return `${(value * 100).toFixed(digits)}%`;
}
