import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

type AuthMode = "login" | "signup";

type ToastState = {
  message: string;
  tone: "success" | "info";
} | null;

<<<<<<< HEAD
const authCopy: Record<AuthMode, { title: string; description: string; cta: string }> = {
  login: {
    title: "Bienvenido de vuelta",
    description: "Ingresa para continuar con tus solicitudes, monitorear tus pagos y descubrir nuevas oportunidades.",
    cta: "Ingresar",
  },
  signup: {
    title: "Crea tu cuenta en minutos",
    description: "Diseña un perfil financiero a tu medida y obtén ofertas personalizadas de créditos sin fricción.",
    cta: "Crear cuenta",
  },
};

const navigation = [
  { href: "#servicios", label: "Servicios" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#seguridad", label: "Seguridad" },
  { href: "#preguntas", label: "Preguntas" },
];

const features = [
  {
    title: "Simula en segundos",
    description:
      "Calcula cuotas, tasas y plazos al instante. Guardamos tus simulaciones para que tomes decisiones informado.",
    badge: "IA financiera",
  },
  {
    title: "Asesoría humana",
    description:
      "Un ejecutivo te acompaña en cada paso con recomendaciones claras y transparentes, disponibles 24/7.",
    badge: "Premium",
  },
  {
    title: "Pagos automatizados",
    description:
      "Programa débitos inteligentes, recibe recordatorios preventivos y mantén tu historial impecable.",
    badge: "Smart",
  },
];

const highlights = [
  { value: "98%", label: "Clientes satisfechos" },
  { value: "24h", label: "Tiempo máximo de respuesta" },
  { value: "+$120M", label: "En créditos gestionados" },
];

const benefits = [
  {
    title: "Ofertas a tu medida",
    description:
      "Analizamos tu comportamiento financiero para ofrecerte créditos que se ajustan a tu capacidad real y metas personales.",
  },
  {
    title: "Dashboard integral",
    description:
      "Visualiza todos tus productos, pagos programados y simulaciones desde una consola clara y accionable.",
  },
  {
    title: "Integración con tu banco",
    description:
      "Conectamos con las principales instituciones bancarias para sincronizar tus movimientos y acelerar evaluaciones.",
  },
];

const faqItems = [
  {
    question: "¿Necesito tener una cuenta bancaria para registrarme?",
    answer:
      "No es obligatorio. Puedes comenzar con tu identificación y correo electrónico; la conexión con tu banco es opcional y se puede agregar después.",
  },
  {
    question: "¿Qué tan segura es mi información?",
    answer:
      "Aplicamos cifrado de extremo a extremo, autenticación multifactor y monitoreo continuo para mantener tus datos protegidos.",
  },
  {
    question: "¿Puedo pausar mis pagos?",
    answer:
      "Sí, ofrecemos planes de alivio temporales y reprogramaciones flexibles en coordinación con tu ejecutivo.",
  },
];

const securityPoints = [
  "Autenticación biométrica opcional",
  "Alertas en tiempo real por actividad sospechosa",
  "Certificaciones PCI DSS y ISO/IEC 27001",
];

const Badge = ({ label }: { label: string }) => (
  <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-600">
    {label}
  </span>
);
=======
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
>>>>>>> codex/create-homepage-for-banking-app-12abjb

const OutlineButton = ({
  children,
  onClick,
  className = "",
<<<<<<< HEAD
=======
  type = "button",
>>>>>>> codex/create-homepage-for-banking-app-12abjb
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
<<<<<<< HEAD
}) => (
  <button
    onClick={onClick}
    className={`rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-500 ${className}`.trim()}
=======
  type?: "button" | "submit" | "reset";
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-full border border-slate-300/70 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 ${className}`.trim()}
>>>>>>> codex/create-homepage-for-banking-app-12abjb
  >
    {children}
  </button>
);

const PrimaryButton = ({
  children,
  onClick,
  className = "",
<<<<<<< HEAD
=======
  type = "button",
>>>>>>> codex/create-homepage-for-banking-app-12abjb
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
<<<<<<< HEAD
}) => (
  <button
    onClick={onClick}
    className={`rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 ${className}`.trim()}
=======
  type?: "button" | "submit" | "reset";
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-700 ${className}`.trim()}
>>>>>>> codex/create-homepage-for-banking-app-12abjb
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
<<<<<<< HEAD
  <label className="flex flex-col gap-1.5 text-left">
    <span className="text-sm font-medium text-slate-600">{label}</span>
    <input
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm shadow-indigo-100/30 outline-none transition focus:border-indigo-400 focus:ring focus:ring-indigo-200/50"
=======
  <label className="grid gap-1 text-left">
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
    <input
      className="w-full rounded-xl border border-white/30 bg-white/70 px-4 py-3 text-sm font-medium text-slate-800 shadow-inner shadow-white/60 outline-none transition focus:border-slate-900 focus:bg-white focus:ring focus:ring-slate-900/10"
>>>>>>> codex/create-homepage-for-banking-app-12abjb
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
<<<<<<< HEAD
            label="Correo electrónico"
            type="email"
            name="email"
            placeholder="sofia@ejemplo.com"
=======
            label="Correo"
            type="email"
            name="email"
            placeholder="sofia@aurora.com"
>>>>>>> codex/create-homepage-for-banking-app-12abjb
            autoComplete="email"
          />
          <InputField
            label="Contraseña"
            type="password"
            name="password"
<<<<<<< HEAD
            placeholder="Crea una contraseña segura"
=======
            placeholder="••••••••"
>>>>>>> codex/create-homepage-for-banking-app-12abjb
            autoComplete="new-password"
          />
        </>
      );
    }
<<<<<<< HEAD

    return (
      <>
        <InputField
          label="Correo electrónico"
          type="email"
          name="email"
          placeholder="tu-correo@ejemplo.com"
=======
    return (
      <>
        <InputField
          label="Correo"
          type="email"
          name="email"
          placeholder="tu@aurora.com"
>>>>>>> codex/create-homepage-for-banking-app-12abjb
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

<<<<<<< HEAD
  return (
    <div className="relative isolate overflow-hidden rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-xl shadow-indigo-100/60">
      <div className="mb-6 flex items-center gap-4 text-xs font-semibold text-slate-500">
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className={`rounded-full px-3 py-1 transition ${
            mode === "login" ? "bg-indigo-100 text-indigo-600" : "hover:text-indigo-500"
          }`}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => onModeChange("signup")}
          className={`rounded-full px-3 py-1 transition ${
            mode === "signup" ? "bg-indigo-100 text-indigo-600" : "hover:text-indigo-500"
          }`}
        >
          Crear cuenta
        </button>
      </div>
      <h3 className="text-2xl font-semibold tracking-tight text-slate-900">{authCopy[mode].title}</h3>
      <p className="mt-2 text-sm text-slate-600">{authCopy[mode].description}</p>
      <form className="mt-6 flex flex-col gap-4" onSubmit={(event) => onSubmit(mode, event)}>
        {fields}
        {mode === "signup" && (
          <label className="flex items-start gap-2 text-xs text-slate-500">
            <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" required />
            Acepto los términos de servicio y autorizo el tratamiento de mis datos de acuerdo a la política de privacidad.
          </label>
        )}
        <PrimaryButton className="mt-2 w-full">{authCopy[mode].cta}</PrimaryButton>
        {mode === "login" && (
          <a className="text-center text-xs font-semibold text-indigo-500 transition hover:text-indigo-400" href="#recuperar">
            Recuperar contraseña
          </a>
        )}
      </form>
    </div>
  );
};

const FAQ = ({
  openIndex,
  onToggle,
}: {
  openIndex: number | null;
  onToggle: (index: number) => void;
}) => (
  <div className="space-y-4" id="preguntas">
    {faqItems.map((item, index) => {
      const isOpen = openIndex === index;
      return (
        <div key={item.question} className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-6 text-left"
            onClick={() => onToggle(index)}
            aria-expanded={isOpen}
          >
            <span className="text-base font-semibold text-slate-800">{item.question}</span>
            <span className="text-xl font-medium text-indigo-500">{isOpen ? "–" : "+"}</span>
          </button>
          {isOpen && <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>}
        </div>
      );
    })}
  </div>
);

const Toast = ({ toast }: { toast: ToastState }) => {
  if (!toast) return null;

  return (
    <div
      className={`pointer-events-auto fixed inset-x-0 top-5 mx-auto flex max-w-md items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl transition ${
        toast.tone === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-indigo-200 bg-indigo-50 text-indigo-700"
      }`}
      role="status"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-lg">
        {toast.tone === "success" ? "✓" : "ℹ"}
      </span>
      {toast.message}
=======
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
>>>>>>> codex/create-homepage-for-banking-app-12abjb
    </div>
  );
};

<<<<<<< HEAD
function HomeApp() {
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [toast, setToast] = useState<ToastState>(null);

  const handleAuthSubmit = (mode: AuthMode, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("fullName")?.toString();
    const email = formData.get("email")?.toString();
=======
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
>>>>>>> codex/create-homepage-for-banking-app-12abjb

    setToast({
      tone: mode === "signup" ? "success" : "info",
      message:
        mode === "signup"
<<<<<<< HEAD
          ? `¡Hola ${name ?? ""}! Te enviamos un correo a ${email} para activar tu cuenta.`
          : `Bienvenido nuevamente${email ? `, ${email}` : ""}. Cargando tu panel personalizado...`,
    });

    setTimeout(() => setToast(null), 4200);
    event.currentTarget.reset();
  };

  return (
    <>
      <Toast toast={toast} />
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-24 -z-10 mx-auto h-[28rem] max-w-4xl rounded-full bg-gradient-to-br from-indigo-400/40 via-sky-300/40 to-purple-300/40 blur-3xl"></div>
        <header className="sticky top-0 z-20 border-b border-white/20 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <a className="flex items-center gap-3" href="#inicio" aria-label="Ir al inicio">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 text-lg font-semibold text-white shadow-lg shadow-indigo-500/20">
                BA
              </span>
              <div>
                <p className="text-lg font-semibold tracking-tight text-slate-900">Banco Aurora</p>
                <p className="text-sm font-medium text-slate-500">Créditos inteligentes, decisiones brillantes</p>
              </div>
            </a>
            <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
              {navigation.map((item) => (
                <a key={item.href} className="transition hover:text-indigo-500" href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="hidden items-center gap-3 md:flex">
              <OutlineButton onClick={() => setAuthMode("login")}>Iniciar sesión</OutlineButton>
              <PrimaryButton onClick={() => setAuthMode("signup")}>Crear cuenta</PrimaryButton>
            </div>
            <button
              className="rounded-xl border border-slate-200/70 p-2 text-slate-600 transition hover:border-indigo-400 hover:text-indigo-500 md:hidden"
              onClick={() => setMobileMenuOpen((value) => !value)}
              aria-label="Abrir menú"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {isMobileMenuOpen && (
            <div className="border-t border-slate-200/70 bg-white px-6 pb-6 pt-4 md:hidden">
              <nav className="flex flex-col gap-4 text-sm font-medium text-slate-600">
                {navigation.map((item) => (
                  <a
                    key={item.href}
                    className="transition hover:text-indigo-500"
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-3">
                <OutlineButton onClick={() => setAuthMode("login")}>Iniciar sesión</OutlineButton>
                <PrimaryButton onClick={() => setAuthMode("signup")}>Crear cuenta</PrimaryButton>
              </div>
            </div>
          )}
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-16" id="inicio">
          <section className="grid gap-12 md:grid-cols-[1.05fr_0.95fr] md:items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-500">
                Nueva banca digital
              </span>
              <div className="space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                  Crédito inteligente, diseñado para tu siguiente paso.
                </h1>
                <p className="text-lg leading-8 text-slate-600">
                  Banco Aurora combina analítica avanzada y asesoría humana para ayudarte a obtener el préstamo ideal sin
                  trámites eternos. Gestiona todo desde una plataforma elegante y confiable.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <PrimaryButton onClick={() => setAuthMode("signup")}>Quiero mi cuenta</PrimaryButton>
                <OutlineButton onClick={() => setAuthMode("login")}>Ya tengo cuenta</OutlineButton>
              </div>
              <div className="grid gap-6 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-center shadow-sm">
                    <p className="text-2xl font-semibold text-indigo-600">{item.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="floating-glow relative">
              <div className="glass-surface rounded-3xl border border-white/60 p-6 shadow-xl shadow-indigo-200/60">
                <AuthPanel mode={authMode} onModeChange={setAuthMode} onSubmit={handleAuthSubmit} />
              </div>
            </div>
          </section>

          <section className="space-y-10" id="servicios">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold text-slate-900">Una plataforma pensada para crecer contigo</h2>
              <p className="mt-3 text-base text-slate-600">
                Nuestra suite de herramientas te acompaña desde la simulación hasta la gestión diaria de tus créditos. Todo con
                indicadores claros, alertas proactivas y soporte en vivo.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="group flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-indigo-100/40 transition hover:-translate-y-1 hover:border-indigo-300"
                >
                  <Badge label={feature.badge} />
                  <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{feature.description}</p>
                  <span className="text-sm font-semibold text-indigo-500 opacity-0 transition group-hover:opacity-100">
                    Explorar servicios →
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-12 rounded-[2.5rem] border border-slate-200/80 bg-gradient-to-br from-white/95 via-indigo-50/70 to-white/90 p-12 shadow-xl shadow-indigo-100/60 md:grid-cols-2" id="beneficios">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-slate-900">Beneficios exclusivos para tu estrategia financiera</h2>
              <p className="text-base text-slate-600">
                Optimiza tus finanzas con herramientas automatizadas, reportes predictivos y aliados especialistas que entienden
                tus objetivos.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit.title} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                    <p className="text-base font-semibold text-slate-900">{benefit.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{benefit.description}</p>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <PrimaryButton>Hablar con un ejecutivo</PrimaryButton>
                <OutlineButton>Ver planes empresariales</OutlineButton>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-900">Seguridad de nivel bancario</h3>
                <p className="mt-3 text-sm text-slate-600">
                  En Banco Aurora tu información es sagrada. Implementamos estándares globales y un monitoreo constante para que
                  tengas tranquilidad absoluta.
                </p>
                <ul className="mt-5 space-y-3 text-sm text-slate-600" id="seguridad">
                  {securityPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-white/70 bg-indigo-600/90 p-6 text-white shadow-xl">
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-100">Historias reales</p>
                <p className="mt-4 text-lg font-semibold">
                  “En menos de 10 minutos tenía mi aprobación preliminar y un plan hecho a mi medida. La plataforma es espectacular”.
                </p>
                <p className="mt-6 text-sm font-medium text-indigo-100">María Fernanda • Emprendedora tech</p>
              </div>
            </div>
          </section>

          <section>
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1fr]">
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold text-slate-900">Preguntas frecuentes</h2>
                <p className="text-base text-slate-600">
                  Resolvemos las dudas más comunes antes de que inicies tu solicitud. ¿Tienes otra pregunta? Escríbenos por el chat
                  en vivo y un especialista responderá en minutos.
                </p>
              </div>
              <FAQ openIndex={openFaq} onToggle={(index) => setOpenFaq((current) => (current === index ? null : index))} />
            </div>
          </section>
        </main>

        <footer className="border-t border-slate-200/70 bg-white/70">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold text-slate-900">Banco Aurora</p>
              <p className="mt-1 text-sm text-slate-500">Innovación financiera con rostro humano.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
              <a className="transition hover:text-indigo-500" href="#servicios">Servicios</a>
              <a className="transition hover:text-indigo-500" href="#beneficios">Beneficios</a>
              <a className="transition hover:text-indigo-500" href="#seguridad">Seguridad</a>
              <a className="transition hover:text-indigo-500" href="#preguntas">Preguntas</a>
            </div>
            <p className="text-xs text-slate-400">© {new Date().getFullYear()} Banco Aurora. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

const container = document.getElementById("root");

if (container) {
  createRoot(container).render(<HomeApp />);
}
=======
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
>>>>>>> codex/create-homepage-for-banking-app-12abjb
