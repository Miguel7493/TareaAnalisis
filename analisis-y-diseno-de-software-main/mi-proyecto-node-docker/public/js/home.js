import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
<<<<<<< Updated upstream
const navLinks = [
    { href: "#acceso", label: "Acceso" },
    { href: "#respaldo", label: "Respaldo" },
];
const stats = [
    { value: "12", label: "Años de solvencia" },
    { value: "98%", label: "Clientes retenidos" },
    { value: "$320M", label: "Activos gestionados" },
];
const assurances = [
    { title: "Gobierno serio", caption: "Comités de riesgo y auditoría continua." },
    { title: "Custodia blindada", caption: "Infraestructura certificada y cifrado integral." },
    { title: "Equipo privado", caption: "Asesores senior para decisiones sensibles." },
];
const authCopy = {
    signup: {
        title: "Abre tu acceso",
        hint: "Consolida tus créditos en Aurora Privé.",
        cta: "Crear cuenta",
    },
    login: {
        title: "Bienvenido",
        hint: "Ingresa a tu portafolio seguro.",
        cta: "Continuar",
    },
};
const OutlineButton = ({ children, onClick, className = "", type = "button", }) => (_jsx("button", { type: type, onClick: onClick, className: `inline-flex items-center justify-center rounded-full border border-slate-300/70 px-5 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900 ${className}`.trim(), children: children }));
const PrimaryButton = ({ children, onClick, className = "", type = "button", }) => (_jsx("button", { type: type, onClick: onClick, className: `inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-700 ${className}`.trim(), children: children }));
const InputField = ({ label, type, name, placeholder, autoComplete, }) => (_jsxs("label", { className: "grid gap-1 text-left", children: [_jsx("span", { className: "text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400", children: label }), _jsx("input", { className: "w-full rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-sm font-medium text-slate-800 shadow-inner shadow-white/70 outline-none transition focus:border-slate-900 focus:bg-white focus:ring focus:ring-slate-900/10", type: type, name: name, placeholder: placeholder, autoComplete: autoComplete, required: true })] }));
const AuthPanel = ({ mode, onModeChange, onSubmit, }) => {
    const fields = useMemo(() => {
        if (mode === "signup") {
            return (_jsxs(_Fragment, { children: [_jsx(InputField, { label: "Nombre", type: "text", name: "fullName", placeholder: "Sof\u00EDa Ram\u00EDrez", autoComplete: "name" }), _jsx(InputField, { label: "Correo", type: "email", name: "email", placeholder: "sofia@aurora.com", autoComplete: "email" }), _jsx(InputField, { label: "Contrase\u00F1a", type: "password", name: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoComplete: "new-password" })] }));
        }
        return (_jsxs(_Fragment, { children: [_jsx(InputField, { label: "Correo", type: "email", name: "email", placeholder: "tu@aurora.com", autoComplete: "email" }), _jsx(InputField, { label: "Contrase\u00F1a", type: "password", name: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoComplete: "current-password" })] }));
    }, [mode]);
    const copy = authCopy[mode];
    return (_jsxs("section", { id: "acceso", className: "relative isolate overflow-hidden rounded-[2rem] bg-white/75 p-8 shadow-xl shadow-slate-900/10 ring-1 ring-white/60 backdrop-blur", children: [_jsx("div", { className: "absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.2),_rgba(15,23,42,0.08))]" }), _jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-400", children: mode === "signup" ? "Alta" : "Ingreso" }), _jsx("h2", { className: "mt-2 text-2xl font-semibold text-slate-900", children: copy.title }), _jsx("p", { className: "mt-1 text-sm text-slate-500", children: copy.hint })] }), _jsxs("div", { className: "flex gap-2 rounded-full bg-slate-900/5 p-1", children: [_jsx("button", { type: "button", onClick: () => onModeChange("signup"), className: `rounded-full px-3 py-1 text-xs font-semibold transition ${mode === "signup" ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:text-slate-900"}`, children: "Registro" }), _jsx("button", { type: "button", onClick: () => onModeChange("login"), className: `rounded-full px-3 py-1 text-xs font-semibold transition ${mode === "login" ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:text-slate-900"}`, children: "Ingreso" })] })] }), _jsxs("form", { className: "mt-6 grid gap-5", onSubmit: (event) => onSubmit(mode, event), children: [fields, _jsx(PrimaryButton, { className: "mt-2 w-full", type: "submit", children: copy.cta })] }), _jsx("p", { className: "mt-5 text-center text-xs text-slate-400", children: "Al continuar aceptas el acuerdo de servicio." })] }));
};
const Toast = ({ state, onClose }) => {
    if (!state)
        return null;
    const toneStyles = state.tone === "success"
        ? "bg-emerald-500 text-white shadow-emerald-600/40"
        : "bg-slate-900 text-white shadow-slate-900/30";
    return (_jsx("div", { className: `pointer-events-auto fixed inset-x-0 top-6 z-50 mx-auto w-fit rounded-full px-5 py-3 text-sm font-medium shadow-lg ${toneStyles}`, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "inline-flex h-2.5 w-2.5 rounded-full bg-white/70" }), _jsx("span", { children: state.message }), _jsx("button", { type: "button", onClick: onClose, className: "rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-wide text-white/80 transition hover:bg-white/30", children: "Cerrar" })] }) }));
};
const App = () => {
    const [authMode, setAuthMode] = useState("signup");
    const [toast, setToast] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleSubmit = (mode, event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const name = form.get("fullName")?.toString();
        const email = form.get("email")?.toString();
        setToast({
            tone: mode === "signup" ? "success" : "info",
            message: mode === "signup" ? `Cuenta activada para ${name ?? email ?? "nuevo cliente"}` : `Bienvenido de nuevo, ${email ?? "cliente"}`,
        });
        window.setTimeout(() => {
            setToast(null);
        }, 3600);
    };
    return (_jsxs("div", { className: "relative min-h-screen bg-[#f5f7fb] text-slate-900", children: [_jsxs("div", { className: "pointer-events-none absolute inset-0 -z-10 overflow-hidden", children: [_jsx("div", { className: "absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(15,23,42,0.09),_rgba(15,23,42,0))]" }), _jsx("div", { className: "absolute right-[10%] top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(30,64,175,0.22),_rgba(30,64,175,0))]" }), _jsx("div", { className: "absolute left-[8%] bottom-14 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(14,116,144,0.22),_rgba(14,116,144,0))]" })] }), _jsx(Toast, { state: toast, onClose: () => setToast(null) }), _jsxs("header", { className: "mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8", children: [_jsxs("a", { href: "#", className: "flex items-center gap-2 text-lg font-semibold text-slate-900", children: [_jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white", children: "AP" }), "Aurora Priv\u00E9"] }), _jsx("nav", { className: "hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex", children: navLinks.map((link) => (_jsx("a", { href: link.href, className: "transition hover:text-slate-900", children: link.label }, link.href))) }), _jsxs("div", { className: "hidden gap-3 md:flex", children: [_jsx(OutlineButton, { onClick: () => setAuthMode("login"), children: "Iniciar sesi\u00F3n" }), _jsx(PrimaryButton, { onClick: () => setAuthMode("signup"), children: "Abrir cuenta" })] }), _jsxs("button", { type: "button", className: "md:hidden", onClick: () => setMobileOpen((prev) => !prev), "aria-label": "Alternar navegaci\u00F3n", children: [_jsx("span", { className: "block h-0.5 w-6 bg-slate-900" }), _jsx("span", { className: "mt-1 block h-0.5 w-6 bg-slate-900" }), _jsx("span", { className: "mt-1 block h-0.5 w-6 bg-slate-900" })] })] }), mobileOpen ? (_jsxs("div", { className: "mx-6 mb-6 rounded-3xl border border-slate-200/60 bg-white/90 p-6 text-sm text-slate-600 shadow-lg shadow-slate-900/10 backdrop-blur md:hidden", children: [_jsx("nav", { className: "grid gap-4", children: navLinks.map((link) => (_jsx("a", { href: link.href, className: "font-medium text-slate-700", onClick: () => setMobileOpen(false), children: link.label }, link.href))) }), _jsxs("div", { className: "mt-6 grid gap-3", children: [_jsx(OutlineButton, { className: "w-full", onClick: () => setAuthMode("login"), children: "Iniciar sesi\u00F3n" }), _jsx(PrimaryButton, { className: "w-full", onClick: () => setAuthMode("signup"), children: "Abrir cuenta" })] })] })) : null, _jsxs("main", { className: "mx-auto mt-2 flex w-full max-w-5xl flex-col gap-20 px-6 pb-24", children: [_jsxs("section", { className: "grid gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center", children: [_jsxs("div", { className: "flex flex-col gap-10", children: [_jsxs("div", { className: "max-w-xl space-y-6", children: [_jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-slate-300/60 bg-white/60 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500", children: ["Aurora Priv\u00E9", _jsx("span", { className: "h-1 w-1 rounded-full bg-slate-400" }), "Banca confidencial"] }), _jsx("h1", { className: "text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl", children: "Cr\u00E9ditos, sin ruido." }), _jsx("p", { className: "max-w-md text-base text-slate-500", children: "Gesti\u00F3n privada para quienes necesitan decisiones \u00E1giles y control absoluto." })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [_jsx(PrimaryButton, { onClick: () => setAuthMode("signup"), children: "Solicitar acceso" }), _jsx(OutlineButton, { onClick: () => setAuthMode("login"), children: "Entrar al portal" })] }), _jsx("dl", { className: "grid gap-6 sm:grid-cols-3", children: stats.map((item) => (_jsxs("div", { className: "rounded-3xl border border-slate-200/70 bg-white/60 px-6 py-5 text-slate-600 shadow-sm", children: [_jsx("dt", { className: "text-xs uppercase tracking-[0.3em] text-slate-400", children: item.label }), _jsx("dd", { className: "mt-2 text-2xl font-semibold text-slate-900", children: item.value })] }, item.label))) })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-white/80 via-white/40 to-transparent shadow-[0_45px_80px_-60px_rgba(15,23,42,0.45)]" }), _jsx(AuthPanel, { mode: authMode, onModeChange: setAuthMode, onSubmit: handleSubmit })] })] }), _jsxs("section", { id: "respaldo", className: "grid gap-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-semibold text-slate-900", children: "Respaldo Aurora" }), _jsx("span", { className: "text-xs uppercase tracking-[0.3em] text-slate-400", children: "Discreci\u00F3n total" })] }), _jsx("div", { className: "grid gap-6 lg:grid-cols-3", children: assurances.map((item) => (_jsxs("article", { className: "flex flex-col gap-3 rounded-3xl border border-slate-200/70 bg-white/70 p-6 text-slate-600 shadow-sm", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-900", children: item.title }), _jsx("p", { className: "text-sm text-slate-500", children: item.caption })] }, item.title))) })] })] })] }));
};
const container = document.getElementById("root");
if (!container) {
    throw new Error("No root element found");
}
createRoot(container).render(_jsx(App, {}));
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

const securityPoints = ["Cifrado integral", "MFA obligatorio", "Monitoreo 24/7"];

const advisorHighlights = ["Mesa de inversión", "Comités de riesgo", "Acompañamiento legal"];

const authCopy = {
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
}) =>
  _jsx("button", {
    type,
    onClick,
    className: `inline-flex items-center justify-center rounded-full border border-slate-300/70 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 ${className}`.trim(),
    children,
  });

const PrimaryButton = ({
  children,
  onClick,
  className = "",
  type = "button",
}) =>
  _jsx("button", {
    type,
    onClick,
    className: `inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-700 ${className}`.trim(),
    children,
  });

const InputField = ({
  label,
  type,
  name,
  placeholder,
  autoComplete,
}) =>
  _jsxs("label", {
    className: "grid gap-1 text-left",
    children: [
      _jsx("span", {
        className:
          "text-xs font-semibold uppercase tracking-wide text-slate-400",
        children: label,
      }),
      _jsx("input", {
        className:
          "w-full rounded-xl border border-white/30 bg-white/70 px-4 py-3 text-sm font-medium text-slate-800 shadow-inner shadow-white/60 outline-none transition focus:border-slate-900 focus:bg-white focus:ring focus:ring-slate-900/10",
        type,
        name,
        placeholder,
        autoComplete,
        required: true,
      }),
    ],
  });

const AuthPanel = ({ mode, onModeChange, onSubmit }) => {
  const fields = useMemo(() => {
    if (mode === "signup") {
      return _jsxs(_Fragment, {
        children: [
          _jsx(InputField, {
            label: "Nombre completo",
            type: "text",
            name: "fullName",
            placeholder: "Sofía Ramírez",
            autoComplete: "name",
          }),
          _jsx(InputField, {
            label: "Correo",
            type: "email",
            name: "email",
            placeholder: "sofia@aurora.com",
            autoComplete: "email",
          }),
          _jsx(InputField, {
            label: "Contraseña",
            type: "password",
            name: "password",
            placeholder: "••••••••",
            autoComplete: "new-password",
          }),
        ],
      });
    }

    return _jsxs(_Fragment, {
      children: [
        _jsx(InputField, {
          label: "Correo",
          type: "email",
          name: "email",
          placeholder: "tu@aurora.com",
          autoComplete: "email",
        }),
        _jsx(InputField, {
          label: "Contraseña",
          type: "password",
          name: "password",
          placeholder: "••••••••",
          autoComplete: "current-password",
        }),
      ],
    });
  }, [mode]);

  const copy = authCopy[mode];

  return _jsxs("div", {
    className:
      "relative isolate overflow-hidden rounded-3xl bg-white/70 p-8 shadow-xl shadow-slate-900/10 ring-1 ring-white/60 backdrop-blur",
    children: [
      _jsx("div", {
        className:
          "absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_rgba(15,23,42,0.08))]",
      }),
      _jsxs("div", {
        className: "flex items-center justify-between gap-4",
        children: [
          _jsxs("div", {
            children: [
              _jsx("p", {
                className:
                  "text-sm font-medium uppercase tracking-[0.35em] text-slate-400",
                children: mode === "signup" ? "Alta" : "Ingreso",
              }),
              _jsx("h2", {
                className: "mt-2 text-2xl font-semibold text-slate-900",
                children: copy.title,
              }),
              _jsx("p", {
                className: "mt-1 text-sm text-slate-500",
                children: copy.hint,
              }),
            ],
          }),
          _jsxs("div", {
            className: "flex gap-2 rounded-full bg-slate-900/5 p-1",
            children: [
              _jsx("button", {
                type: "button",
                onClick: () => onModeChange("signup"),
                className: `rounded-full px-3 py-1 text-xs font-semibold transition ${
                  mode === "signup"
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-500 hover:text-slate-900"
                }`,
                children: "Crear",
              }),
              _jsx("button", {
                type: "button",
                onClick: () => onModeChange("login"),
                className: `rounded-full px-3 py-1 text-xs font-semibold transition ${
                  mode === "login"
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-500 hover:text-slate-900"
                }`,
                children: "Entrar",
              }),
            ],
          }),
        ],
      }),
      _jsxs("form", {
        className: "mt-6 grid gap-5",
        onSubmit: (event) => onSubmit(mode, event),
        children: [
          fields,
          _jsx(PrimaryButton, {
            className: "mt-2 w-full",
            type: "submit",
            children: copy.cta,
          }),
        ],
      }),
      _jsx("p", {
        className: "mt-5 text-center text-xs text-slate-400",
        children: "Al continuar aceptas el acuerdo de servicio.",
      }),
    ],
  });
};

const Toast = ({ state, onClose }) => {
  if (!state) return null;

  const toneStyles =
    state.tone === "success"
      ? "bg-emerald-500 text-white shadow-emerald-600/40"
      : "bg-slate-900 text-white shadow-slate-900/30";

  return _jsx("div", {
    className:
      "pointer-events-auto fixed inset-x-0 top-6 z-50 mx-auto w-fit rounded-full px-5 py-3 text-sm font-medium shadow-lg " +
      toneStyles,
    children: _jsxs("div", {
      className: "flex items-center gap-3",
      children: [
        _jsx("span", {
          className:
            "inline-flex h-2.5 w-2.5 rounded-full bg-white/70",
        }),
        _jsx("span", { children: state.message }),
        _jsx("button", {
          type: "button",
          onClick: onClose,
          className:
            "rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-wide text-white/80 transition hover:bg-white/30",
          children: "Cerrar",
        }),
      ],
    }),
  });
};

const App = () => {
  const [authMode, setAuthMode] = useState("signup");
  const [toast, setToast] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSubmit = (mode, event) => {
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

    window.setTimeout(() => setToast(null), 3600);
  };

  return _jsxs("div", {
    className: "relative min-h-screen bg-[#f5f7fb] text-slate-900",
    children: [
      _jsxs("div", {
        className:
          "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        children: [
          _jsx("div", {
            className:
              "absolute left-1/2 top-0 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(15,23,42,0.08),_rgba(15,23,42,0))]",
          }),
          _jsx("div", {
            className:
              "absolute right-[12%] top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(30,64,175,0.22),_rgba(30,64,175,0))]",
          }),
          _jsx("div", {
            className:
              "absolute left-[8%] bottom-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(14,116,144,0.2),_rgba(14,116,144,0))]",
          }),
        ],
      }),
      _jsx(Toast, {
        state: toast,
        onClose: () => setToast(null),
      }),
      _jsxs("header", {
        className:
          "mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8",
        children: [
          _jsxs("a", {
            href: "#",
            className:
              "flex items-center gap-2 text-lg font-semibold text-slate-900",
            children: [
              _jsx("span", {
                className:
                  "flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white",
                children: "BA",
              }),
              "Banco Aurora",
            ],
          }),
          _jsx("nav", {
            className:
              "hidden items-center gap-10 text-sm font-medium text-slate-600 md:flex",
            children: navLinks.map((link) =>
              _jsx(
                "a",
                {
                  href: link.href,
                  className: "transition hover:text-slate-900",
                  children: link.label,
                },
                link.href,
              ),
            ),
          }),
          _jsxs("div", {
            className: "hidden gap-3 md:flex",
            children: [
              _jsx(OutlineButton, {
                onClick: () => setAuthMode("login"),
                children: "Iniciar sesión",
              }),
              _jsx(PrimaryButton, {
                onClick: () => setAuthMode("signup"),
                children: "Abrir cuenta",
              }),
            ],
          }),
          _jsxs("button", {
            type: "button",
            className: "md:hidden",
            onClick: () => setMobileOpen((prev) => !prev),
            "aria-label": "Toggle navigation",
            children: [
              _jsx("span", {
                className: "block h-0.5 w-6 bg-slate-900",
              }),
              _jsx("span", {
                className: "mt-1 block h-0.5 w-6 bg-slate-900",
              }),
              _jsx("span", {
                className: "mt-1 block h-0.5 w-6 bg-slate-900",
              }),
            ],
          }),
        ],
      }),
      mobileOpen
        ? _jsxs("div", {
            className:
              "mx-6 mb-6 rounded-3xl border border-slate-200/60 bg-white/90 p-6 text-sm text-slate-600 shadow-lg shadow-slate-900/10 backdrop-blur md:hidden",
            children: [
              _jsx("nav", {
                className: "grid gap-4",
                children: navLinks.map((link) =>
                  _jsx(
                    "a",
                    {
                      href: link.href,
                      className: "font-medium text-slate-700",
                      onClick: () => setMobileOpen(false),
                      children: link.label,
                    },
                    link.href,
                  ),
                ),
              }),
              _jsxs("div", {
                className: "mt-6 grid gap-3",
                children: [
                  _jsx(OutlineButton, {
                    className: "w-full",
                    onClick: () => setAuthMode("login"),
                    children: "Iniciar sesión",
                  }),
                  _jsx(PrimaryButton, {
                    className: "w-full",
                    onClick: () => setAuthMode("signup"),
                    children: "Abrir cuenta",
                  }),
                ],
              }),
            ],
          })
        : null,
      _jsxs("main", {
        className:
          "mx-auto mt-4 flex w-full max-w-6xl flex-col gap-24 px-6 pb-24",
        children: [
          _jsxs("section", {
            className:
              "grid gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center",
            children: [
              _jsxs("div", {
                className: "flex flex-col gap-10",
                children: [
                  _jsxs("div", {
                    className: "max-w-xl space-y-6",
                    children: [
                      _jsxs("div", {
                        className:
                          "inline-flex items-center gap-3 rounded-full border border-slate-300/60 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500",
                        children: [
                          "Banco Aurora",
                          _jsx("span", {
                            className:
                              "h-1 w-1 rounded-full bg-slate-400",
                          }),
                          "División Créditos Elite",
                        ],
                      }),
                      _jsx("h1", {
                        className:
                          "text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl",
                        children: "Crédito con criterio.",
                      }),
                      _jsx("p", {
                        className:
                          "max-w-md text-base text-slate-500",
                        children:
                          "Gestiona préstamos, inversiones y liquidez en una plataforma discreta.",
                      }),
                    ],
                  }),
                  _jsxs("div", {
                    className: "flex flex-wrap items-center gap-4",
                    children: [
                      _jsx(PrimaryButton, {
                        onClick: () => setAuthMode("signup"),
                        children: "Solicitar acceso",
                      }),
                      _jsx(OutlineButton, {
                        onClick: () => setAuthMode("login"),
                        children: "Entrar al portal",
                      }),
                    ],
                  }),
                  _jsx("dl", {
                    className: "grid gap-6 sm:grid-cols-3",
                    children: stats.map((item) =>
                      _jsxs(
                        "div",
                        {
                          className:
                            "rounded-3xl border border-slate-200/70 bg-white/50 px-6 py-5 text-slate-600 shadow-sm",
                          children: [
                            _jsx("dt", {
                              className:
                                "text-xs uppercase tracking-wider text-slate-400",
                              children: item.label,
                            }),
                            _jsx("dd", {
                              className:
                                "mt-2 text-2xl font-semibold text-slate-900",
                              children: item.value,
                            }),
                          ],
                        },
                        item.label,
                      ),
                    ),
                  }),
                ],
              }),
              _jsxs("div", {
                className: "relative",
                children: [
                  _jsx("div", {
                    className:
                      "absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-white/80 via-white/40 to-transparent shadow-[0_45px_80px_-60px_rgba(15,23,42,0.45)]",
                  }),
                  _jsx(AuthPanel, {
                    mode: authMode,
                    onModeChange: setAuthMode,
                    onSubmit: handleSubmit,
                  }),
                ],
              }),
            ],
          }),
          _jsxs("section", {
            id: "soluciones",
            className: "grid gap-10",
            children: [
              _jsxs("div", {
                className: "flex items-end justify-between",
                children: [
                  _jsx("h2", {
                    className:
                      "text-3xl font-semibold text-slate-900",
                    children: "Portafolio minimalista",
                  }),
                  _jsx("span", {
                    className: "text-sm text-slate-500",
                    children: "Selección curada",
                  }),
                ],
              }),
              _jsx("div", {
                className:
                  "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
                children: solutionTiles.map((solution) =>
                  _jsxs(
                    "article",
                    {
                      className:
                        "group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:border-slate-300/60",
                      children: [
                        _jsx("div", {
                          className:
                            "absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.07),_rgba(15,23,42,0))] opacity-0 transition group-hover:opacity-100",
                        }),
                        _jsx("h3", {
                          className:
                            "text-lg font-semibold text-slate-900",
                          children: solution.title,
                        }),
                        _jsx("p", {
                          className:
                            "mt-3 text-sm text-slate-500",
                          children: solution.caption,
                        }),
                        _jsxs("span", {
                          className:
                            "mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400",
                          children: [
                            "Detalle",
                            _jsx("span", {
                              className:
                                "h-px w-12 bg-slate-300 transition group-hover:w-16",
                            }),
                          ],
                        }),
                      ],
                    },
                    solution.title,
                  ),
                ),
              }),
            ],
          }),
          _jsxs("section", {
            id: "seguridad",
            className:
              "grid gap-12 rounded-[3rem] border border-slate-200/80 bg-white/70 px-10 py-14 shadow-[0_35px_70px_-65px_rgba(15,23,42,0.55)] lg:grid-cols-[1.1fr_0.9fr]",
            children: [
              _jsxs("div", {
                className: "space-y-6",
                children: [
                  _jsx("p", {
                    className:
                      "text-xs font-semibold uppercase tracking-[0.4em] text-slate-400",
                    children: "Seguridad",
                  }),
                  _jsx("h2", {
                    className:
                      "text-3xl font-semibold text-slate-900",
                    children: "Blindaje continuo",
                  }),
                  _jsx("p", {
                    className:
                      "max-w-sm text-sm text-slate-500",
                    children:
                      "Protocolos diseñados para instituciones de alto patrimonio.",
                  }),
                  _jsx("ul", {
                    className:
                      "grid gap-3 text-sm text-slate-600 sm:grid-cols-2",
                    children: securityPoints.map((point) =>
                      _jsxs(
                        "li",
                        {
                          className:
                            "flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/60 px-4 py-3",
                          children: [
                            _jsx("span", {
                              className:
                                "h-2 w-2 rounded-full bg-slate-900",
                            }),
                            point,
                          ],
                        },
                        point,
                      ),
                    ),
                  }),
                ],
              }),
              _jsxs("div", {
                className:
                  "flex flex-col justify-between gap-6",
                children: [
                  _jsxs("div", {
                    className:
                      "rounded-[2.5rem] border border-slate-200/70 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-10 text-white shadow-2xl shadow-slate-900/30",
                    children: [
                      _jsx("p", {
                        className:
                          "text-xs uppercase tracking-[0.4em] text-white/60",
                        children: "Audit Trail",
                      }),
                      _jsx("h3", {
                        className:
                          "mt-4 text-2xl font-semibold",
                        children: "Cada movimiento firmado",
                      }),
                      _jsx("p", {
                        className:
                          "mt-4 text-sm text-white/70",
                        children:
                          "Autorizaciones biométricas y control granular de límites.",
                      }),
                    ],
                  }),
                  _jsxs("div", {
                    className:
                      "rounded-[2.5rem] border border-slate-200/60 bg-white/80 px-8 py-8 text-sm text-slate-600 shadow-xl shadow-slate-900/10",
                    children: [
                      _jsx("p", {
                        className:
                          "text-xs uppercase tracking-[0.35em] text-slate-400",
                        children: "Certificaciones",
                      }),
                      _jsx("p", {
                        className:
                          "mt-3 text-base font-semibold text-slate-900",
                        children:
                          "ISO/IEC 27001 · SOC 2 Type II",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          _jsxs("section", {
            id: "asesores",
            className:
              "grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center",
            children: [
              _jsxs("div", {
                className:
                  "rounded-[3rem] border border-slate-200/70 bg-white/70 px-8 py-10 shadow-xl shadow-slate-900/10",
                children: [
                  _jsx("p", {
                    className:
                      "text-xs font-semibold uppercase tracking-[0.35em] text-slate-400",
                    children: "Mesa Aurora",
                  }),
                  _jsx("h2", {
                    className:
                      "mt-4 text-3xl font-semibold text-slate-900",
                    children: "Equipo boutique",
                  }),
                  _jsx("p", {
                    className:
                      "mt-4 text-sm text-slate-500",
                    children:
                      "Expertos que acompañan cada decisión crediticia.",
                  }),
                  _jsx("div", {
                    className: "mt-6 flex flex-wrap gap-3",
                    children: advisorHighlights.map((item) =>
                      _jsx(
                        "span",
                        {
                          className:
                            "rounded-full border border-slate-200/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500",
                          children: item,
                        },
                        item,
                      ),
                    ),
                  }),
                ],
              }),
              _jsxs("div", {
                className: "grid gap-6 sm:grid-cols-2",
                children: [
                  _jsxs("div", {
                    className:
                      "rounded-3xl border border-slate-200/60 bg-white/70 p-6 text-sm text-slate-600 shadow-lg shadow-slate-900/10",
                    children: [
                      _jsx("p", {
                        className:
                          "text-xs uppercase tracking-[0.35em] text-slate-400",
                        children: "Concierge",
                      }),
                      _jsx("h3", {
                        className:
                          "mt-3 text-lg font-semibold text-slate-900",
                        children: "Acompañamiento 24/7",
                      }),
                      _jsx("p", {
                        className:
                          "mt-3 text-sm text-slate-500",
                        children:
                          "Canales privados y respuestas en menos de 30 minutos.",
                      }),
                    ],
                  }),
                  _jsxs("div", {
                    className:
                      "rounded-3xl border border-slate-200/60 bg-white/70 p-6 text-sm text-slate-600 shadow-lg shadow-slate-900/10",
                    children: [
                      _jsx("p", {
                        className:
                          "text-xs uppercase tracking-[0.35em] text-slate-400",
                        children: "Insights",
                      }),
                      _jsx("h3", {
                        className:
                          "mt-3 text-lg font-semibold text-slate-900",
                        children: "Reportes curados",
                      }),
                      _jsx("p", {
                        className:
                          "mt-3 text-sm text-slate-500",
                        children:
                          "Indicadores estratégicos listos para presentar a directorio.",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsx("footer", {
        className:
          "border-t border-slate-200/70 bg-white/60 py-10",
        children: _jsxs("div", {
          className:
            "mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 text-sm text-slate-500 sm:flex-row sm:justify-between",
          children: [
            _jsxs("p", {
              children: [
                "© ",
                new Date().getFullYear(),
                " Banco Aurora. Todos los derechos reservados.",
              ],
            }),
            _jsxs("div", {
              className: "flex items-center gap-5",
              children: [
                _jsx("a", {
                  href: "#",
                  className:
                    "transition hover:text-slate-900",
                  children: "Política de privacidad",
                }),
                _jsx("a", {
                  href: "#",
                  className:
                    "transition hover:text-slate-900",
                  children: "Contacto directo",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
};

const container = document.getElementById("root");
if (!container) {
  throw new Error("No se encontró el contenedor raíz");
}
const root = createRoot(container);
root.render(_jsx(App, {}));
>>>>>>> Stashed changes
