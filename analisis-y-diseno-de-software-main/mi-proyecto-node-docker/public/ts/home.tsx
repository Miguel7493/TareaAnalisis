import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

type AuthMode = "login" | "signup" | null;

type ToastTone = "success" | "info";

type Toast = { message: string; tone: ToastTone } | null;

type SignupForm = {
  fullName: string;
  rut: string;
  email: string;
  password: string;
  confirm: string;
};

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

type FieldErrors<T> = Partial<Record<keyof T, string>>;

type PasswordRule = {
  id: string;
  label: string;
  test: (value: string) => boolean;
};

const passwordRules: PasswordRule[] = [
  {
    id: "length",
    label: "Mínimo 10 caracteres",
    test: (value) => value.length >= 10,
  },
  {
    id: "uppercase",
    label: "Incluye mayúscula",
    test: (value) => /[A-ZÁÉÍÓÚÑ]/.test(value),
  },
  {
    id: "number",
    label: "Incluye número",
    test: (value) => /\d/.test(value),
  },
  {
    id: "symbol",
    label: "Incluye símbolo",
    test: (value) => /[^\w\s]/.test(value),
  },
];

const validateEmail = (email: string) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.trim());

const normalizeRut = (value: string) =>
  value
    .replace(/[^0-9kK]/g, "")
    .toUpperCase()
    .replace(/K/g, "K");

const formatRut = (value: string) => {
  const clean = normalizeRut(value);
  if (!clean) return "";
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedBody}-${dv}`;
};

const validateRut = (rut: string) => {
  const clean = normalizeRut(rut);
  if (clean.length < 2) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let multiplier = 2;
  let sum = 0;
  for (let i = body.length - 1; i >= 0; i -= 1) {
    sum += parseInt(body[i]!, 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const modulus = 11 - (sum % 11);
  const expected = modulus === 11 ? "0" : modulus === 10 ? "K" : modulus.toString();
  return expected === dv;
};

const PasswordStrength = ({ password }: { password: string }) => {
  const { score, label, tone, statuses } = useMemo(() => {
    const states = passwordRules.map((rule) => ({
      id: rule.id,
      label: rule.label,
      passed: rule.test(password),
    }));
    const passedCount = states.filter((item) => item.passed).length;
    const toneMap: Record<number, { label: string; tone: string }> = {
      0: { label: "Define una clave", tone: "text-slate-400" },
      1: { label: "Débil", tone: "text-rose-500" },
      2: { label: "Intermedia", tone: "text-amber-500" },
      3: { label: "Firme", tone: "text-emerald-500" },
      4: { label: "Blindada", tone: "text-emerald-500" },
    };
    return {
      score: passedCount,
      label: toneMap[passedCount].label,
      tone: toneMap[passedCount].tone,
      statuses: states,
    };
  }, [password]);

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200/70 bg-white/80 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          {passwordRules.map((rule, index) => (
            <span
              key={rule.id}
              className={`flex-1 transition ${index < score ? "bg-emerald-500" : "bg-transparent"}`}
            />
          ))}
        </div>
        <span className={`text-xs font-semibold uppercase tracking-[0.3em] ${tone}`}>{label}</span>
      </div>
      <ul className="grid gap-1.5 text-[0.7rem] text-slate-500">
        {statuses.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <span
              aria-hidden
              className={`flex h-4 w-4 items-center justify-center rounded-full text-[0.55rem] font-semibold ${
                item.passed ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {item.passed ? "✓" : ""}
            </span>
            <span className={item.passed ? "text-slate-600" : "text-slate-400"}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const TextField = ({
  label,
  name,
  type = "text",
  value,
  placeholder,
  autoComplete,
  onChange,
  onBlur,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder: string;
  autoComplete?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}) => (
  <label className="grid gap-2 text-left">
    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-400">{label}</span>
    <input
      className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/70 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 ${
        error ? "border-rose-400/80 bg-rose-50/60" : "border-white/60 bg-white/80"
      }`}
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget.value)}
      onBlur={onBlur}
      required
    />
    {error ? <span className="text-[0.65rem] font-medium text-rose-500">{error}</span> : null}
  </label>
);

const RememberToggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`flex items-center gap-2 text-xs font-medium transition ${checked ? "text-slate-800" : "text-slate-500"}`}
  >
    <span
      className={`flex h-4 w-7 items-center rounded-full border border-slate-300/80 bg-white px-0.5 transition ${
        checked ? "border-slate-900 bg-slate-900" : ""
      }`}
    >
      <span
        className={`h-3 w-3 rounded-full bg-slate-500 transition ${checked ? "translate-x-3.5 bg-white" : "translate-x-0"}`}
        style={{ transform: checked ? "translateX(0.75rem)" : "translateX(0px)" }}
      />
    </span>
    Recordarme en este equipo
  </button>
);

const AuthPanel = ({
  mode,
  onClose,
  signupForm,
  loginForm,
  signupErrors,
  loginErrors,
  onSignupChange,
  onLoginChange,
  onBlur,
  onSubmit,
}: {
  mode: Exclude<AuthMode, null>;
  onClose: () => void;
  signupForm: SignupForm;
  loginForm: LoginForm;
  signupErrors: FieldErrors<SignupForm>;
  loginErrors: FieldErrors<LoginForm>;
  onSignupChange: (field: keyof SignupForm, value: string) => void;
  onLoginChange: (field: keyof LoginForm, value: string | boolean) => void;
  onBlur: (form: "signup" | "login", field: string) => void;
  onSubmit: (mode: Exclude<AuthMode, null>, event: FormEvent<HTMLFormElement>) => void;
}) => {
  const isSignup = mode === "signup";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <section className="relative w-full max-w-md space-y-6 rounded-[2rem] border border-white/60 bg-white/90 p-8 shadow-2xl shadow-slate-900/20">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
              {isSignup ? "Regístrate" : "Inicia sesión"}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">
              {isSignup ? "Únete a Aurora Privé" : "Accede a tu cuenta"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
          >
            ✕
          </button>
        </header>
        <form
          className="space-y-5"
          onSubmit={(event: FormEvent<HTMLFormElement>) => onSubmit(mode, event)}
        >
          {isSignup ? (
            <>
              <TextField
                label="Nombre completo"
                name="fullName"
                placeholder="María José González"
                value={signupForm.fullName}
                onChange={(value) => onSignupChange("fullName", value)}
                onBlur={() => onBlur("signup", "fullName")}
                error={signupErrors.fullName}
              />
              <TextField
                label="RUT"
                name="rut"
                placeholder="12.345.678-9"
                value={signupForm.rut}
                onChange={(value) => onSignupChange("rut", formatRut(value))}
                onBlur={() => onBlur("signup", "rut")}
                error={signupErrors.rut}
              />
              <TextField
                label="Correo electrónico"
                name="email"
                type="email"
                placeholder="nombre@empresa.cl"
                autoComplete="email"
                value={signupForm.email}
                onChange={(value) => onSignupChange("email", value)}
                onBlur={() => onBlur("signup", "email")}
                error={signupErrors.email}
              />
              <TextField
                label="Clave de acceso"
                name="password"
                type="password"
                placeholder="••••••••••"
                autoComplete="new-password"
                value={signupForm.password}
                onChange={(value) => onSignupChange("password", value)}
                onBlur={() => onBlur("signup", "password")}
                error={signupErrors.password}
              />
              <TextField
                label="Confirma tu clave"
                name="confirm"
                type="password"
                placeholder="Repite tu clave"
                autoComplete="new-password"
                value={signupForm.confirm}
                onChange={(value) => onSignupChange("confirm", value)}
                onBlur={() => onBlur("signup", "confirm")}
                error={signupErrors.confirm}
              />
              <PasswordStrength password={signupForm.password} />
            </>
          ) : (
            <>
              <TextField
                label="Correo electrónico"
                name="email"
                type="email"
                placeholder="nombre@empresa.cl"
                autoComplete="email"
                value={loginForm.email}
                onChange={(value) => onLoginChange("email", value)}
                onBlur={() => onBlur("login", "email")}
                error={loginErrors.email}
              />
              <TextField
                label="Clave de acceso"
                name="password"
                type="password"
                placeholder="••••••••••"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={(value) => onLoginChange("password", value)}
                onBlur={() => onBlur("login", "password")}
                error={loginErrors.password}
              />
              <div className="flex items-center justify-between">
                <RememberToggle
                  checked={loginForm.remember}
                  onChange={(value) => onLoginChange("remember", value)}
                />
                <button
                  type="button"
                  className="text-xs font-semibold text-slate-500 transition hover:text-slate-800"
                >
                  Recuperar acceso
                </button>
              </div>
            </>
          )}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-700"
          >
            {isSignup ? "Crear acceso privado" : "Ingresar"}
          </button>
        </form>
      </section>
    </div>
  );
};

const App = () => {
  const [activeMode, setActiveMode] = useState<AuthMode>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [signupForm, setSignupForm] = useState<SignupForm>({
    fullName: "",
    rut: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
    remember: true,
  });
  const [signupErrors, setSignupErrors] = useState<FieldErrors<SignupForm>>({});
  const [loginErrors, setLoginErrors] = useState<FieldErrors<LoginForm>>({});

  const resetState = () => {
    setSignupErrors({});
    setLoginErrors({});
  };

  const showToast = (message: string, tone: ToastTone) => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3200);
  };

  const validateSignup = (form: SignupForm) => {
    const errors: FieldErrors<SignupForm> = {};
    if (!form.fullName.trim()) {
      errors.fullName = "Ingresa tu nombre";
    }
    if (!validateRut(form.rut)) {
      errors.rut = "RUT no válido";
    }
    if (!validateEmail(form.email)) {
      errors.email = "Correo inválido";
    }
    if (form.password.length < 10 || passwordRules.some((rule) => !rule.test(form.password))) {
      errors.password = "Refuerza tu clave";
    }
    if (form.confirm !== form.password) {
      errors.confirm = "Las claves no coinciden";
    }
    return errors;
  };

  const validateLogin = (form: LoginForm) => {
    const errors: FieldErrors<LoginForm> = {};
    if (!validateEmail(form.email)) {
      errors.email = "Correo inválido";
    }
    if (!form.password) {
      errors.password = "Ingresa tu clave";
    }
    return errors;
  };

  const handleSignupChange = (field: keyof SignupForm, value: string) => {
    setSignupForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLoginChange = (field: keyof LoginForm, value: string | boolean) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (form: "signup" | "login", field: string) => {
    if (form === "signup") {
      const updated = validateSignup(signupForm);
      setSignupErrors(updated);
    } else {
      const updated = validateLogin(loginForm);
      setLoginErrors(updated);
    }
  };

  const handleSubmit = (mode: Exclude<AuthMode, null>, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "signup") {
      const errors = validateSignup(signupForm);
      setSignupErrors(errors);
      if (Object.keys(errors).length === 0) {
        showToast("Cuenta creada. Te contactaremos en minutos.", "success");
        setActiveMode(null);
        setSignupForm({ fullName: "", rut: "", email: "", password: "", confirm: "" });
      }
    } else {
      const errors = validateLogin(loginForm);
      setLoginErrors(errors);
      if (Object.keys(errors).length === 0) {
        showToast("Bienvenido de regreso.", "success");
        setActiveMode(null);
        setLoginForm({ email: "", password: "", remember: true });
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="pointer-events-none absolute inset-0 mix-blend-multiply">
        <div className="aurora-gradient absolute -left-32 top-20 h-72 w-72 rounded-full blur-3xl opacity-40" />
        <div className="aurora-gradient absolute bottom-10 right-0 h-80 w-80 rounded-full blur-3xl opacity-30" />
      </div>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-10">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
            AP
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">Aurora Privé</p>
            <p className="text-sm text-slate-500">Créditos personalizados para Chile</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            resetState();
            setActiveMode("login");
          }}
          className="hidden rounded-full border border-slate-300/70 px-5 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900 md:inline-flex"
        >
          Ingresar
        </button>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 pb-24 pt-16">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-400">Bienvenido</p>
          <h1 className="mt-6 text-4xl font-semibold text-slate-900 sm:text-5xl">
            Una banca privada que comienza con una experiencia impecable
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-slate-500 sm:text-base">
            Accede a un proceso de registro y autenticación diseñado para proteger tus datos y conectarte con especialistas de
            confianza.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                resetState();
                setActiveMode("signup");
              }}
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-700 sm:w-auto"
            >
              Crear cuenta
            </button>
            <button
              type="button"
              onClick={() => {
                resetState();
                setActiveMode("login");
              }}
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-300/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 sm:w-auto"
            >
              Ingresar
            </button>
            <a
              href="#simulacion"
              className="inline-flex w-full items-center justify-center rounded-full border border-transparent bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 shadow-inner shadow-white/80 transition hover:border-slate-300 hover:bg-white sm:w-auto"
            >
              Simula tu crédito
            </a>
          </div>
        </section>
        <section className="mt-16 grid w-full max-w-3xl gap-4 sm:grid-cols-3" aria-label="Pilares de confianza">
          {[
            "Identidad verificada",
            "Custodia cifrada",
            "Asesoría humana",
          ].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-white/60 bg-white/70 px-5 py-6 text-center text-sm font-medium text-slate-600 shadow-sm shadow-slate-900/5"
            >
              {item}
            </div>
          ))}
        </section>
        <section id="simulacion" className="mt-20 w-full max-w-3xl rounded-[2rem] border border-white/60 bg-white/80 p-8 text-left shadow-sm shadow-slate-900/10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Simula tu crédito</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Conoce tus condiciones en minutos</h2>
          <p className="mt-3 text-sm text-slate-500">
            Próximamente podrás estimar cuotas, tasas y beneficios exclusivos sin salir de esta experiencia.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => showToast("El simulador premium estará disponible pronto.", "info")}
              className="inline-flex items-center justify-center rounded-full border border-slate-300/70 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Notificarme
            </button>
            <span className="text-xs text-slate-400">Desarrollado para el mercado chileno</span>
          </div>
        </section>
      </main>
      <footer className="mx-auto w-full max-w-6xl px-6 pb-12 text-left">
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} Aurora Privé. Todos los derechos reservados.</p>
      </footer>
      {toast ? (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`rounded-2xl border px-5 py-3 text-sm font-medium shadow-lg ${
              toast.tone === "success"
                ? "border-emerald-400/60 bg-emerald-50 text-emerald-700"
                : "border-slate-300/70 bg-white/90 text-slate-600"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}
      {activeMode ? (
        <AuthPanel
          mode={activeMode}
          onClose={() => setActiveMode(null)}
          signupForm={signupForm}
          loginForm={loginForm}
          signupErrors={signupErrors}
          loginErrors={loginErrors}
          onSignupChange={handleSignupChange}
          onLoginChange={handleLoginChange}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
};

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
