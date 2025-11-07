import create from "zustand";
import { findBenchmark } from "../data/chileanRates";
import { buildSimulationResult } from "./math";
import { loadHistory, persistHistory, upsertHistoryEntry } from "./persistence";
const defaultInput = {
    amount: 15000000,
    term: 60,
    rate: 12.5,
    creditType: "Crédito de consumo",
    monthlyIncome: 2200000,
    institution: "Banco tradicional",
};
export const useSimulatorStore = create((set, get) => ({
    input: defaultInput,
    currentResult: null,
    history: [],
    optimalId: null,
    setField: (key, value) => {
        set((state) => ({
            input: { ...state.input, [key]: value },
        }));
    },
    hydrate: () => {
        const history = loadHistory();
        const optimal = history
            .slice()
            .sort((a, b) => a.cae - b.cae)[0]?.id ?? null;
        set(() => ({ history, optimalId: optimal }));
    },
    compute: () => {
        const { input, history } = get();
        const result = buildSimulationResult(input);
        const nextHistory = upsertHistoryEntry(history, result);
        persistHistory(nextHistory);
        const optimal = nextHistory.slice().sort((a, b) => a.cae - b.cae)[0]?.id ?? result.id;
        set(() => ({ currentResult: result, history: nextHistory, optimalId: optimal }));
        return result;
    },
    loadFromHistory: (id) => {
        const { history } = get();
        const entry = history.find((item) => item.id === id);
        if (!entry)
            return;
        set(() => ({
            input: {
                amount: entry.amount,
                term: entry.term,
                rate: entry.rate,
                creditType: entry.creditType,
                monthlyIncome: entry.monthlyIncome,
                institution: entry.institution,
            },
            currentResult: entry,
        }));
    },
}));
export function compareAgainstBenchmark(simulation) {
    const benchmark = findBenchmark(simulation.creditType, simulation.institution);
    if (!benchmark) {
        return null;
    }
    const delta = simulation.rate - benchmark.averageRate;
    return {
        benchmark,
        delta,
        isBelow: delta <= 0,
    };
}
