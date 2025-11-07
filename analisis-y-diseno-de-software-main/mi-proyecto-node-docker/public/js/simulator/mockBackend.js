/**
 * Simula la integración futura con un backend en Node.js + PostgreSQL.
 * Registra la simulación y devuelve un identificador de seguimiento.
 */
export async function syncSimulationWithBackend(simulation) {
    try {
        const response = await fetch("/api/simulations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(simulation),
        });
        if (response.ok) {
            const json = (await response.json());
            return json;
        }
    }
    catch (error) {
        console.warn("Fallo la sincronización con el backend simulado, se usará un fallback local", error);
    }
    await new Promise((resolve) => setTimeout(resolve, 450));
    return {
        status: "queued",
        reference: `AUR-${simulation.id.slice(0, 8).toUpperCase()}`,
    };
}
