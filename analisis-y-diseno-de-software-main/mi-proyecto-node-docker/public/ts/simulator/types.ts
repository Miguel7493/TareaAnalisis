export type CreditType =
  | "Crédito de consumo"
  | "Crédito hipotecario"
  | "Consolidación"
  | "Automotriz"
  | "Educación";

export interface SimulationInput {
  amount: number; // Monto solicitado en CLP
  term: number; // Plazo en meses
  rate: number; // Tasa anual en porcentaje
  creditType: CreditType;
  monthlyIncome: number; // Ingreso mensual del solicitante en CLP
  institution: string;
}

export interface SimulationMetrics {
  monthlyInstallment: number;
  totalInterest: number;
  totalPaid: number;
  cae: number;
  debtRatio: number;
}

export interface SimulationResult extends SimulationInput, SimulationMetrics {
  id: string;
  createdAt: string;
}

export interface SimulatorSnapshot {
  currentResult: SimulationResult | null;
  history: SimulationResult[];
  optimalId: string | null;
}
