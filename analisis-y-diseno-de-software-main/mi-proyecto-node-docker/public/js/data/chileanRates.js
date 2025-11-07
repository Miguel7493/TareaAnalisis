export const chileanRateBenchmarks = [
    {
        creditType: "Crédito de consumo",
        institution: "Banco tradicional",
        averageRate: 26.4,
        updatedAt: "2024-02-29",
        source: "CMF - Informe mensual de créditos de consumo",
    },
    {
        creditType: "Crédito de consumo",
        institution: "Fintech",
        averageRate: 32.5,
        updatedAt: "2024-02-29",
        source: "ABIF - Radiografía al crédito digital",
    },
    {
        creditType: "Crédito hipotecario",
        institution: "Banco tradicional",
        averageRate: 4.35,
        updatedAt: "2024-03-31",
        source: "CMF - Tasas promedio hipotecarias",
    },
    {
        creditType: "Crédito hipotecario",
        institution: "Cooperativa",
        averageRate: 4.95,
        updatedAt: "2024-03-31",
        source: "Cooperativas de Ahorro y Crédito",
    },
    {
        creditType: "Consolidación",
        institution: "Banco tradicional",
        averageRate: 18.2,
        updatedAt: "2024-01-31",
        source: "Banco Central - Reporte de hogares endeudados",
    },
    {
        creditType: "Automotriz",
        institution: "Banco tradicional",
        averageRate: 16.4,
        updatedAt: "2024-01-31",
        source: "Asociación Nacional Automotriz de Chile",
    },
    {
        creditType: "Automotriz",
        institution: "Financiera automotriz",
        averageRate: 22.3,
        updatedAt: "2024-01-31",
        source: "Asociación Nacional Automotriz de Chile",
    },
    {
        creditType: "Educación",
        institution: "Banco tradicional",
        averageRate: 14.1,
        updatedAt: "2024-02-15",
        source: "Mineduc - Estadísticas de financiamiento",
    },
    {
        creditType: "Educación",
        institution: "Institución estatal",
        averageRate: 6.5,
        updatedAt: "2024-02-15",
        source: "Ingresa - Créditos estudiantiles",
    },
];
export function findBenchmark(creditType, institution) {
    return chileanRateBenchmarks.find((entry) => entry.creditType === creditType && entry.institution === institution);
}
