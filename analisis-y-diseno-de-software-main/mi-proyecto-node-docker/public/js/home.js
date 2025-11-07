import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
const passwordRules = [
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
const validateEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.trim());
const normalizeRut = (value) => value
    .replace(/[^0-9kK]/g, "")
    .toUpperCase()
    .replace(/K/g, "K");
const formatRut = (value) => {
    const clean = normalizeRut(value);
    if (!clean)
        return "";
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedBody}-${dv}`;
};
const validateRut = (rut) => {
    const clean = normalizeRut(rut);
    if (clean.length < 2)
        return false;
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    let multiplier = 2;
    let sum = 0;
    for (let i = body.length - 1; i >= 0; i -= 1) {
        sum += parseInt(body[i], 10) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const modulus = 11 - (sum % 11);
    const expected = modulus === 11 ? "0" : modulus === 10 ? "K" : modulus.toString();
    return expected === dv;
};
const PasswordStrength = ({ password }) => {
    const { score, label, tone, statuses } = useMemo(() => {
        const states = passwordRules.map((rule) => ({
            id: rule.id,
            label: rule.label,
            passed: rule.test(password),
        }));
        const passedCount = states.filter((item) => item.passed).length;
        const toneMap = {
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
    return (_jsxs("div", { className: "space-y-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-1.5 flex-1 overflow-hidden rounded-full bg-white", children: passwordRules.map((rule, index) => (_jsx("span", { className: `flex-1 transition ${index < score ? "bg-emerald-500" : "bg-transparent"}` }, rule.id))) }), _jsx("span", { className: `text-xs font-semibold uppercase tracking-[0.3em] ${tone}`, children: label })] }), _jsx("ul", { className: "grid gap-1.5 text-[0.7rem] text-slate-500", children: statuses.map((item) => (_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("span", { "aria-hidden": true, className: `flex h-4 w-4 items-center justify-center rounded-full text-[0.55rem] font-semibold ${item.passed ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`, children: item.passed ? "✓" : "" }), _jsx("span", { className: item.passed ? "text-slate-600" : "text-slate-400", children: item.label })] }, item.id))) })] }));
};
const TextField = ({ label, name, type = "text", value, placeholder, autoComplete, onChange, onBlur, error, }) => (_jsxs("label", { className: "grid gap-2 text-left", children: [_jsx("span", { className: "text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-400", children: label }), _jsx("input", { className: `w-full rounded-xl border px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 ${error ? "border-rose-400/80 bg-rose-50/70" : "border-slate-200/60 bg-white/70"}`, type: type, name: name, value: value, placeholder: placeholder, autoComplete: autoComplete, onChange: (event) => onChange(event.currentTarget.value), onBlur: onBlur, required: true }), error ? _jsx("span", { className: "text-[0.65rem] font-medium text-rose-500", children: error }) : null] }));
const RememberToggle = ({ checked, onChange, }) => (_jsxs("button", { type: "button", onClick: () => onChange(!checked), className: `flex items-center gap-2 text-xs font-medium transition ${checked ? "text-slate-800" : "text-slate-500"}`, children: [_jsx("span", { className: `flex h-4 w-7 items-center rounded-full border border-slate-300/80 bg-white px-0.5 transition ${checked ? "border-slate-900 bg-slate-900" : ""}`, children: _jsx("span", { className: `h-3 w-3 rounded-full bg-slate-500 transition ${checked ? "translate-x-3.5 bg-white" : "translate-x-0"}`, style: { transform: checked ? "translateX(0.75rem)" : "translateX(0px)" } }) }), "Recordarme en este equipo"] }));
const AuthPanel = ({ mode, onClose, signupForm, loginForm, signupErrors, loginErrors, onSignupChange, onLoginChange, onBlur, onSubmit, }) => {
    const isSignup = mode === "signup";
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center px-4", children: [_jsx("button", { type: "button", className: "absolute inset-0 bg-slate-900/30 backdrop-blur-sm", "aria-label": "Cerrar", onClick: onClose }), _jsxs("section", { className: "relative w-full max-w-md space-y-6 overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white/85 p-8 shadow-xl shadow-slate-900/15", children: [_jsx("div", { className: "pointer-events-none absolute -top-16 left-1/2 hidden h-32 w-32 -translate-x-1/2 rounded-full bg-gradient-to-br from-slate-900/15 to-rose-300/20 blur-2xl sm:block" }), _jsxs("header", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.4em] text-slate-400", children: isSignup ? "Regístrate" : "Inicia sesión" }), _jsx("h2", { className: "mt-1 text-2xl font-semibold text-slate-900", children: isSignup ? "Únete a Aurora Privé" : "Accede a tu cuenta" }), _jsx("p", { className: "mt-1 text-xs text-slate-500", children: isSignup ? "Completa tus datos para activar tu banca privada." : "Ingresa con tu correo y clave blindada." })] }), _jsx("button", { type: "button", onClick: onClose, className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 text-slate-500 transition hover:border-slate-300 hover:text-slate-800", children: "\u2715" })] }), _jsxs("form", { className: "space-y-5", onSubmit: (event) => onSubmit(mode, event), children: [isSignup ? (_jsxs(_Fragment, { children: [_jsx(TextField, { label: "Nombre completo", name: "fullName", placeholder: "Mar\u00EDa Jos\u00E9 Gonz\u00E1lez", value: signupForm.fullName, onChange: (value) => onSignupChange("fullName", value), onBlur: () => onBlur("signup", "fullName"), error: signupErrors.fullName }), _jsx(TextField, { label: "RUT", name: "rut", placeholder: "12.345.678-9", value: signupForm.rut, onChange: (value) => onSignupChange("rut", formatRut(value)), onBlur: () => onBlur("signup", "rut"), error: signupErrors.rut }), _jsx(TextField, { label: "Correo electr\u00F3nico", name: "email", type: "email", placeholder: "nombre@empresa.cl", autoComplete: "email", value: signupForm.email, onChange: (value) => onSignupChange("email", value), onBlur: () => onBlur("signup", "email"), error: signupErrors.email }), _jsx(TextField, { label: "Clave de acceso", name: "password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoComplete: "new-password", value: signupForm.password, onChange: (value) => onSignupChange("password", value), onBlur: () => onBlur("signup", "password"), error: signupErrors.password }), _jsx(TextField, { label: "Confirma tu clave", name: "confirm", type: "password", placeholder: "Repite tu clave", autoComplete: "new-password", value: signupForm.confirm, onChange: (value) => onSignupChange("confirm", value), onBlur: () => onBlur("signup", "confirm"), error: signupErrors.confirm }), _jsx(PasswordStrength, { password: signupForm.password })] })) : (_jsxs(_Fragment, { children: [_jsx(TextField, { label: "Correo electr\u00F3nico", name: "email", type: "email", placeholder: "nombre@empresa.cl", autoComplete: "email", value: loginForm.email, onChange: (value) => onLoginChange("email", value), onBlur: () => onBlur("login", "email"), error: loginErrors.email }), _jsx(TextField, { label: "Clave de acceso", name: "password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoComplete: "current-password", value: loginForm.password, onChange: (value) => onLoginChange("password", value), onBlur: () => onBlur("login", "password"), error: loginErrors.password }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(RememberToggle, { checked: loginForm.remember, onChange: (value) => onLoginChange("remember", value) }), _jsx("button", { type: "button", className: "text-xs font-semibold text-slate-500 transition hover:text-slate-800", children: "Recuperar acceso" })] })] })), _jsx("button", { type: "submit", className: "inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-700", children: isSignup ? "Crear acceso privado" : "Ingresar" })] })] })] }));
};
const App = () => {
    const [activeMode, setActiveMode] = useState(null);
    const [toast, setToast] = useState(null);
    const [signupForm, setSignupForm] = useState({
        fullName: "",
        rut: "",
        email: "",
        password: "",
        confirm: "",
    });
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
        remember: true,
    });
    const [signupErrors, setSignupErrors] = useState({});
    const [loginErrors, setLoginErrors] = useState({});
    const resetState = () => {
        setSignupErrors({});
        setLoginErrors({});
    };
    const showToast = (message, tone) => {
        setToast({ message, tone });
        window.setTimeout(() => setToast(null), 3200);
    };
    const validateSignup = (form) => {
        const errors = {};
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
    const validateLogin = (form) => {
        const errors = {};
        if (!validateEmail(form.email)) {
            errors.email = "Correo inválido";
        }
        if (!form.password) {
            errors.password = "Ingresa tu clave";
        }
        return errors;
    };
    const handleSignupChange = (field, value) => {
        setSignupForm((prev) => ({ ...prev, [field]: value }));
    };
    const handleLoginChange = (field, value) => {
        setLoginForm((prev) => ({ ...prev, [field]: value }));
    };
    const handleBlur = (form, field) => {
        if (form === "signup") {
            const updated = validateSignup(signupForm);
            setSignupErrors(updated);
        }
        else {
            const updated = validateLogin(loginForm);
            setLoginErrors(updated);
        }
    };
    const handleSubmit = (mode, event) => {
        event.preventDefault();
        if (mode === "signup") {
            const errors = validateSignup(signupForm);
            setSignupErrors(errors);
            if (Object.keys(errors).length === 0) {
                showToast("Cuenta creada. Te contactaremos en minutos.", "success");
                setActiveMode(null);
                setSignupForm({ fullName: "", rut: "", email: "", password: "", confirm: "" });
            }
        }
        else {
            const errors = validateLogin(loginForm);
            setLoginErrors(errors);
            if (Object.keys(errors).length === 0) {
                showToast("Bienvenido de regreso.", "success");
                setActiveMode(null);
                setLoginForm({ email: "", password: "", remember: true });
            }
        }
    };
    return (_jsxs("div", { className: "relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-200", children: [_jsxs("div", { className: "pointer-events-none absolute inset-0 overflow-hidden", children: [_jsx("div", { className: "aurora-gradient absolute -left-24 top-16 h-64 w-64 rounded-full blur-3xl opacity-40" }), _jsx("div", { className: "aurora-gradient absolute right-[-6rem] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-3xl opacity-30" }), _jsx("div", { className: "aurora-gradient absolute -bottom-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl opacity-20" })] }), _jsxs("header", { className: "mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-10", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white", children: "AP" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.4em] text-slate-500", children: "Aurora Priv\u00E9" }), _jsx("p", { className: "text-sm text-slate-500", children: "Experiencia privada de cr\u00E9dito" })] })] }), _jsxs("div", { className: "hidden items-center gap-2 md:flex", children: [_jsx("button", { type: "button", onClick: () => {
                                    resetState();
                                    setActiveMode("login");
                                }, className: "rounded-full border border-slate-300/70 px-5 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900", children: "Ingresar" }), _jsx("button", { type: "button", onClick: () => {
                                    resetState();
                                    setActiveMode("signup");
                                }, className: "rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-700", children: "Crear cuenta" })] })] }), _jsx("main", { className: "mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-20", children: _jsxs("section", { className: "relative isolate w-full overflow-hidden rounded-[3rem] border border-white/60 bg-white/75 p-10 text-center shadow-xl shadow-slate-900/10", children: [_jsxs("div", { className: "pointer-events-none absolute inset-0 opacity-70", children: [_jsx("div", { className: "absolute left-1/2 top-0 h-48 w-72 -translate-x-1/2 rounded-full bg-gradient-to-r from-slate-900/10 to-slate-900/0 blur-2xl" }), _jsx("div", { className: "absolute bottom-0 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-gradient-to-r from-rose-300/20 to-indigo-300/20 blur-3xl" })] }), _jsxs("div", { className: "relative mx-auto flex max-w-3xl flex-col items-center gap-12", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("span", { className: "inline-flex items-center rounded-full border border-slate-200/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-slate-400", children: "Bienvenido a Aurora Priv\u00E9" }), _jsx("h1", { className: "text-4xl font-semibold text-slate-900 sm:text-5xl", children: "Una entrada serena a tu pr\u00F3ximo cr\u00E9dito" }), _jsx("p", { className: "text-sm text-slate-500 sm:text-base", children: "Decide en segundos: registra tu acceso, ingresa de forma segura o explora el simulador premium cuando est\u00E9 disponible." })] }), _jsxs("div", { className: "flex w-full flex-col items-center justify-center gap-3 sm:flex-row", children: [_jsxs("button", { type: "button", onClick: () => {
                                                resetState();
                                                setActiveMode("signup");
                                            }, className: "group inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 sm:w-auto", children: [_jsx("span", { className: "mr-2 text-base", children: "\u25CF" }), " Crear cuenta privada"] }), _jsx("button", { type: "button", onClick: () => {
                                                resetState();
                                                setActiveMode("login");
                                            }, className: "inline-flex w-full items-center justify-center rounded-full border border-slate-300/70 px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 sm:w-auto", children: "Ingresar" }), _jsx("button", { type: "button", onClick: () => showToast("Nuestro simulador premium se despliega muy pronto.", "info"), className: "inline-flex w-full items-center justify-center rounded-full border border-transparent bg-white/80 px-7 py-3 text-sm font-semibold text-slate-700 shadow-inner shadow-white/70 transition hover:border-slate-300 hover:bg-white sm:w-auto", children: "Simula tu cr\u00E9dito" })] }), _jsx("dl", { className: "grid w-full gap-4 sm:grid-cols-3", children: [
                                        { label: "Clientes asesorados", value: "1.200+" },
                                        { label: "Tiempo promedio de activación", value: "< 5 min" },
                                        { label: "Cobertura", value: "Todo Chile" },
                                    ].map((item) => (_jsxs("div", { className: "rounded-2xl border border-slate-200/70 bg-white/80 px-5 py-6 text-left shadow-sm shadow-white/70", children: [_jsx("dt", { className: "text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-400", children: item.label }), _jsx("dd", { className: "mt-2 text-xl font-semibold text-slate-900", children: item.value })] }, item.label))) })] })] }) }), _jsx("footer", { className: "mx-auto w-full max-w-6xl px-6 pb-12 text-left", children: _jsxs("p", { className: "text-xs text-slate-400", children: ["\u00A9 ", new Date().getFullYear(), " Aurora Priv\u00E9. Todos los derechos reservados."] }) }), toast ? (_jsx("div", { className: "fixed bottom-6 right-6 z-50", children: _jsx("div", { className: `rounded-2xl border px-5 py-3 text-sm font-medium shadow-lg ${toast.tone === "success"
                        ? "border-emerald-400/60 bg-emerald-50 text-emerald-700"
                        : "border-slate-300/70 bg-white/90 text-slate-600"}`, children: toast.message }) })) : null, activeMode ? (_jsx(AuthPanel, { mode: activeMode, onClose: () => setActiveMode(null), signupForm: signupForm, loginForm: loginForm, signupErrors: signupErrors, loginErrors: loginErrors, onSignupChange: handleSignupChange, onLoginChange: handleLoginChange, onBlur: handleBlur, onSubmit: handleSubmit })) : null] }));
};
const container = document.getElementById("root");
if (container) {
    const root = createRoot(container);
    root.render(_jsx(App, {}));
}
