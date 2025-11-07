import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

type AuthMode = "login" | "signup";

type ToastState = {
  message: string;
  tone: "success" | "info";
} | null;

const navLinks = [
  { href: "#soluciones", label: "Soluciones" },
  { href: "#seguridad", label: "Seguridad" },
  { href: "#asesores", label: "Asesores" },
];

const stats = [
  { value: "15", label: "Años activos" },
  { value: "4.9", label: "Índice de confianza" },
  { value: "$250M", label: "Capital gestionado" },
];

const solutionTiles = [
  { title: "Crédito Personal", caption: "Decisiones en minutos" },
  { title: "Línea Pyme", caption: "Liquidez precisa" },
  { title: "Hipotecario", caption: "Asesoría dedicada" },
];

const securityPoints = [
  "Cifrado integral",
  "MFA obligatorio",
  "Monitoreo 24/7",
];

const advisorHighlights = [
  "Mesa de inversión",
  "Comités de riesgo",
  "Acompañamiento legal",
];

const authCopy: Record<AuthMode, { title: string; hint: string; cta: string }> = {
  signup: {
    title: "Crear acceso",
    hint: "Activa tu banca digital en segundos",
    cta: "Crear cuenta",
  },
  login: {
    title: "Ingresar",
    hint: "Retoma tu portafolio",
    cta: "Continuar",
  },
};

const OutlineButton = ({
  children,
  onClick,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-full border border-slate-300/70 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 ${className}`.trim()}
  >
    {children}
  </button>
);

const PrimaryButton = ({
  children,
  onClick,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-700 ${className}`.trim()}
  >
    {children}
  </button>
);

const InputField = ({
  label,
  type,
  name,
  placeholder,
  autoComplete,
}: {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  autoComplete?: string;
}) => (
  <label className="grid gap-1 text-left">
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
    <input
      className="w-full rounded-xl border border-white/30 bg-white/70 px-4 py-3 text-sm font-medium text-slate-800 shadow-inner shadow-white/60 outline-none transition focus:border-slate-900 focus:bg-white focus:ring focus:ring-slate-900/10"
      type={type}
      name={name}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required
    />
  </label>
);

const AuthPanel = ({
  mode,
  onModeChange,
  onSubmit,
}: {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (mode: AuthMode, event: FormEvent<HTMLFormElement>) => void;
}) => {
  const fields = useMemo(() => {
    if (mode === "signup") {
      return (
        <>
          <InputField
            label="Nombre completo"
            type="text"
            name="fullName"
            placeholder="Sofía Ramírez"
            autoComplete="name"
          />
          <InputField
            label="Correo"
            type="email"
            name="email"
            placeholder="sofia@aurora.com"
            autoComplete="email"
          />
          <InputField
            label="Contraseña"
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </>
      );
    }
    return (
      <>
        <InputField
          label="Correo"
          type="email"
          name="email"
          placeholder="tu@aurora.com"
          autoComplete="email"
        />
        <InputField
          label="Contraseña"
          type="password"
          name="password"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </>
    );
  }, [mode]);

  const copy = authCopy[mode];

  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-white/70 p-8 shadow-xl shadow-slate-900/10 ring-1 ring-white/60 backdrop-blur">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_rgba(15,23,42,0.08))]" />
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-400">{mode === "signup" ? "Alta" : "Ingreso"}</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{copy.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{copy.hint}</p>
        </div>
        <div className="flex gap-2 rounded-full bg-slate-900/5 p-1">
          <button
            type="button"
            onClick={() => onModeChange("signup")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              mode === "signup"
                ? "bg-slate-900 text-white shadow"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Crear
          </button>
          <button
            type="button"
            onClick={() => onModeChange("login")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              mode === "login"
                ? "bg-slate-900 text-white shadow"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Entrar
          </button>
        </div>
      </div>
      <form
        className="mt-6 grid gap-5"
        onSubmit={(event: FormEvent<HTMLFormElement>) => onSubmit(mode, event)}
      >
        {fields}
        <PrimaryButton className="mt-2 w-full" type="submit">
          {copy.cta}
        </PrimaryButton>
      </form>
      <p className="mt-5 text-center text-xs text-slate-400">
        Al continuar aceptas el acuerdo de servicio.
      </p>
    </div>
  );
};

const Toast = ({ state, onClose }: { state: ToastState; onClose: () => void }) => {
  if (!state) return null;
  const toneStyles =
    state.tone === "success"
      ? "bg-emerald-500 text-white shadow-emerald-600/40"
      : "bg-slate-900 text-white shadow-slate-900/30";
  return (
    <div className={`pointer-events-auto fixed inset-x-0 top-6 z-50 mx-auto w-fit rounded-full px-5 py-3 text-sm font-medium shadow-lg ${toneStyles}`}>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-white/70" />
        <span>{state.message}</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-wide text-white/80 transition hover:bg-white/30"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [toast, setToast] = useState<ToastState>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSubmit = (mode: AuthMode, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("fullName")?.toString();
    const email = form.get("email")?.toString();

    setToast({
      tone: mode === "signup" ? "success" : "info",
      message:
        mode === "signup"
          ? `Cuenta lista para ${name ?? email ?? "nuevo cliente"}`
          : `Bienvenido de nuevo, ${email ?? "cliente"}`,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 3600);
  };

  return (
    <div className="relative min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(15,23,42,0.08),_rgba(15,23,42,0))]" />
        <div className="absolute right-[12%] top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(30,64,175,0.22),_rgba(30,64,175,0))]" />
        <div className="absolute left-[8%] bottom-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(14,116,144,0.2),_rgba(14,116,144,0))]" />
      </div>

      <Toast state={toast} onClose={() => setToast(null)} />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
        <a href="#" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
            BA
          </span>
          Banco Aurora
        </a>
        <nav className="hidden items-center gap-10 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-slate-900">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden gap-3 md:flex">
          <OutlineButton onClick={() => setAuthMode("login")}>Iniciar sesión</OutlineButton>
          <PrimaryButton onClick={() => setAuthMode("signup")}>Abrir cuenta</PrimaryButton>
        </div>
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="block h-0.5 w-6 bg-slate-900" />
          <span className="mt-1 block h-0.5 w-6 bg-slate-900" />
          <span className="mt-1 block h-0.5 w-6 bg-slate-900" />
        </button>
      </header>

      {mobileOpen ? (
        <div className="mx-6 mb-6 rounded-3xl border border-slate-200/60 bg-white/90 p-6 text-sm text-slate-600 shadow-lg shadow-slate-900/10 backdrop-blur md:hidden">
          <nav className="grid gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-medium text-slate-700"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 grid gap-3">
            <OutlineButton className="w-full" onClick={() => setAuthMode("login")}>Iniciar sesión</OutlineButton>
            <PrimaryButton className="w-full" onClick={() => setAuthMode("signup")}>Abrir cuenta</PrimaryButton>
          </div>
        </div>
      ) : null}

      <main className="mx-auto mt-4 flex w-full max-w-6xl flex-col gap-24 px-6 pb-24">
        <section className="grid gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
          <div className="flex flex-col gap-10">
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-slate-300/60 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Banco Aurora
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                División Créditos Elite
              </div>
              <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
                Crédito con criterio.
              </h1>
              <p className="max-w-md text-base text-slate-500">
                Gestiona préstamos, inversiones y liquidez en una plataforma discreta.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <PrimaryButton onClick={() => setAuthMode("signup")}>Solicitar acceso</PrimaryButton>
              <OutlineButton onClick={() => setAuthMode("login")}>Entrar al portal</OutlineButton>
            </div>
            <dl className="grid gap-6 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200/70 bg-white/50 px-6 py-5 text-slate-600 shadow-sm">
                  <dt className="text-xs uppercase tracking-wider text-slate-400">{item.label}</dt>
                  <dd className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-white/80 via-white/40 to-transparent shadow-[0_45px_80px_-60px_rgba(15,23,42,0.45)]" />
            <AuthPanel mode={authMode} onModeChange={setAuthMode} onSubmit={handleSubmit} />
          </div>
        </section>

        <section id="soluciones" className="grid gap-10">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-semibold text-slate-900">Portafolio minimalista</h2>
            <span className="text-sm text-slate-500">Selección curada</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutionTiles.map((solution) => (
              <article
                key={solution.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:border-slate-300/60"
              >
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.07),_rgba(15,23,42,0))] opacity-0 transition group-hover:opacity-100" />
                <h3 className="text-lg font-semibold text-slate-900">{solution.title}</h3>
                <p className="mt-3 text-sm text-slate-500">{solution.caption}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Detalle
                  <span className="h-px w-12 bg-slate-300 transition group-hover:w-16" />
                </span>
              </article>
            ))}
          </div>
        </section>

        <section id="seguridad" className="grid gap-12 rounded-[3rem] border border-slate-200/80 bg-white/70 px-10 py-14 shadow-[0_35px_70px_-65px_rgba(15,23,42,0.55)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Seguridad</p>
            <h2 className="text-3xl font-semibold text-slate-900">Blindaje continuo</h2>
            <p className="max-w-sm text-sm text-slate-500">
              Protocolos diseñados para instituciones de alto patrimonio.
            </p>
            <ul className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              {securityPoints.map((point) => (
                <li key={point} className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/60 px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-slate-900" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between gap-6">
            <div className="rounded-[2.5rem] border border-slate-200/70 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-10 text-white shadow-2xl shadow-slate-900/30">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Audit Trail</p>
              <h3 className="mt-4 text-2xl font-semibold">Cada movimiento firmado</h3>
              <p className="mt-4 text-sm text-white/70">
                Autorizaciones biométricas y control granular de límites.
              </p>
            </div>
            <div className="rounded-[2.5rem] border border-slate-200/60 bg-white/80 px-8 py-8 text-sm text-slate-600 shadow-xl shadow-slate-900/10">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Certificaciones</p>
              <p className="mt-3 text-base font-semibold text-slate-900">ISO/IEC 27001 · SOC 2 Type II</p>
            </div>
          </div>
        </section>

        <section id="asesores" className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-[3rem] border border-slate-200/70 bg-white/70 px-8 py-10 shadow-xl shadow-slate-900/10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Mesa Aurora</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900">Equipo boutique</h2>
            <p className="mt-4 text-sm text-slate-500">
              Expertos que acompañan cada decisión crediticia.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {advisorHighlights.map((item) => (
                <span key={item} className="rounded-full border border-slate-200/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/60 bg-white/70 p-6 text-sm text-slate-600 shadow-lg shadow-slate-900/10">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Concierge</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Acompañamiento 24/7</h3>
              <p className="mt-3 text-sm text-slate-500">Canales privados y respuestas en menos de 30 minutos.</p>
            </div>
            <div className="rounded-3xl border border-slate-200/60 bg-white/70 p-6 text-sm text-slate-600 shadow-lg shadow-slate-900/10">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Insights</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Reportes curados</h3>
              <p className="mt-3 text-sm text-slate-500">Indicadores estratégicos listos para presentar a directorio.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/70 bg-white/60 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 text-sm text-slate-500 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Banco Aurora. Todos los derechos reservados.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="transition hover:text-slate-900">
              Política de privacidad
            </a>
            <a href="#" className="transition hover:text-slate-900">
              Contacto directo
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const container = document.getElementById("root");

if (!container) {
  throw new Error("No se encontró el contenedor raíz");
}

const root = createRoot(container);
root.render(<App />);
