import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

type AuthMode = "login" | "signup";

type ToastState = {
  message: string;
  tone: "success" | "info";
} | null;

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

const OutlineButton = ({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-500 ${className}`.trim()}
  >
    {children}
  </button>
);

const PrimaryButton = ({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 ${className}`.trim()}
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
  <label className="flex flex-col gap-1.5 text-left">
    <span className="text-sm font-medium text-slate-600">{label}</span>
    <input
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm shadow-indigo-100/30 outline-none transition focus:border-indigo-400 focus:ring focus:ring-indigo-200/50"
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
            label="Correo electrónico"
            type="email"
            name="email"
            placeholder="sofia@ejemplo.com"
            autoComplete="email"
          />
          <InputField
            label="Contraseña"
            type="password"
            name="password"
            placeholder="Crea una contraseña segura"
            autoComplete="new-password"
          />
        </>
      );
    }

    return (
      <>
        <InputField
          label="Correo electrónico"
          type="email"
          name="email"
          placeholder="tu-correo@ejemplo.com"
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
    </div>
  );
};

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

    setToast({
      tone: mode === "signup" ? "success" : "info",
      message:
        mode === "signup"
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
