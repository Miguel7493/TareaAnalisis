import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/simulador", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "simulador.html"));
});

app.post("/api/simulations", (req, res) => {
  const payload = req.body ?? {};
  // Ejemplo de integración futura con PostgreSQL: aquí persistiríamos la simulación.
  res.status(202).json({
    status: "queued",
    reference: `AUR-${Date.now().toString(16).toUpperCase()}`,
    received: payload,
  });
});

app.listen(3000, () => console.log("Servidor escuchando en puerto 3000"));
