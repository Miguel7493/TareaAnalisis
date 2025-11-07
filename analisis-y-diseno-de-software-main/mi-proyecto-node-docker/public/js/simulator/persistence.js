const STORAGE_KEY = "aurora-prive-simulations";
const HISTORY_LIMIT = 10;
function isBrowser() {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
export function loadHistory() {
    if (!isBrowser()) {
        return [];
    }
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.slice(0, HISTORY_LIMIT) : [];
    }
    catch (error) {
        console.error("No se pudo leer el historial desde localStorage", error);
        return [];
    }
}
export function persistHistory(history) {
    if (!isBrowser()) {
        return;
    }
    try {
        const payload = JSON.stringify(history.slice(0, HISTORY_LIMIT));
        localStorage.setItem(STORAGE_KEY, payload);
    }
    catch (error) {
        console.error("No se pudo guardar el historial en localStorage", error);
    }
}
export function upsertHistoryEntry(history, entry) {
    const withoutDuplicate = history.filter((item) => item.id !== entry.id);
    return [entry, ...withoutDuplicate].slice(0, HISTORY_LIMIT);
}
