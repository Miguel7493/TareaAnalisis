import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
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
            0: { label: "Define tu clave", tone: "text-slate-400" },
            1: { label: "Débil", tone: "text-rose-500" },
            2: { label: "Intermedia", tone: "text-amber-500" },
            3: { label: "Sólida", tone: "text-emerald-500" },
            4: { label: "Blindada", tone: "text-emerald-500" },
        };
        return {
            score: passedCount,
            label: toneMap[passedCount].label,
            tone: toneMap[passedCount].tone,
            statuses: states,
        };
    }, [password]);
    return (_jsxs("div", { className: "space-y-2 rounded-2xl border border-slate-200/70 bg-white/70 p-3", children: [_jsxs("div", { className: "flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400", children: [_jsx("span", { children: "Fortaleza" }), _jsx("span", { className: `text-slate-600 ${tone}`, children: label })] }), _jsx("div", { className: "flex h-1.5 overflow-hidden rounded-full bg-slate-100", children: passwordRules.map((rule, index) => (_jsx("span", { className: `flex-1 transition ${index < score ? "bg-emerald-500" : "bg-transparent"}` }, rule.id))) }), _jsx("div", { className: "grid grid-cols-2 gap-1 text-[0.6rem] font-medium text-slate-400", children: statuses.map((item) => (_jsx("span", { className: `rounded-full border px-2 py-1 text-center transition ${item.passed
                        ? "border-emerald-200/70 bg-emerald-50/80 text-emerald-600"
                        : "border-slate-200/70 bg-white/60"}`, children: item.label }, item.id))) })] }));
};
const signupSteps = [
    {
        id: "identity",
        title: "¿Cómo te llamas?",
        description: "Cuéntanos tu nombre tal como aparece en tu documento.",
        fields: ["fullName"],
    },
    {
        id: "rut",
        title: "Confirma tu RUT",
        description: "Validamos tu identidad en nuestros sistemas.",
        fields: ["rut"],
    },
    {
        id: "contact",
        title: "Tu correo principal",
        description: "Lo usaremos para enviarte las novedades y la activación.",
        fields: ["email"],
    },
    {
        id: "security",
        title: "Define tu clave blindada",
        description: "Debe cumplir con los estándares de la banca privada.",
        fields: ["password", "confirm"],
    },
];
const signupFieldMeta = {
    fullName: {
        label: "Nombre completo",
        placeholder: "Camila Torres Díaz",
        autoComplete: "name",
    },
    rut: {
        label: "RUT",
        placeholder: "12.345.678-9",
        autoComplete: "off",
    },
    email: {
        label: "Correo electrónico",
        placeholder: "nombre@empresa.cl",
        type: "email",
        autoComplete: "email",
    },
    password: {
        label: "Clave privada",
        placeholder: "••••••••••",
        type: "password",
        autoComplete: "new-password",
    },
    confirm: {
        label: "Confirma tu clave",
        placeholder: "Repite tu clave",
        type: "password",
        autoComplete: "new-password",
    },
};
const TextField = ({ label, name, type = "text", value, placeholder, autoComplete, onChange, onBlur, error, }) => (_jsxs("label", { className: "grid gap-2 text-left", children: [_jsx("span", { className: "text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-400", children: label }), _jsx("input", { className: `w-full rounded-xl border px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 ${error ? "border-rose-400/80 bg-rose-50/70" : "border-slate-200/60 bg-white/70"}`, type: type, name: name, value: value, placeholder: placeholder, autoComplete: autoComplete, onChange: (event) => onChange(event.currentTarget.value), onBlur: onBlur, required: true }), error ? _jsx("span", { className: "text-[0.65rem] font-medium text-rose-500", children: error }) : null] }));
const RememberToggle = ({ checked, onChange, }) => (_jsxs("button", { type: "button", onClick: () => onChange(!checked), className: `flex items-center gap-2 text-xs font-medium transition ${checked ? "text-slate-800" : "text-slate-500"}`, children: [_jsx("span", { className: `flex h-4 w-7 items-center rounded-full border px-0.5 transition ${checked
                ? "justify-end border-slate-900 bg-slate-900"
                : "justify-start border-slate-300/80 bg-white"}`, children: _jsx("span", { className: "h-3 w-3 rounded-full bg-white shadow-sm transition" }) }), "Recordarme en este equipo"] }));
const AuthPanel = ({ mode, onClose, signupForm, loginForm, signupErrors, loginErrors, onSignupChange, onLoginChange, onBlur, onSubmit, validateForm, }) => {
    const isSignup = mode === "signup";
    const [stepIndex, setStepIndex] = useState(0);
    useEffect(() => {
        if (isSignup) {
            setStepIndex(0);
        }
    }, [isSignup]);
    useEffect(() => {
        if (!isSignup) {
            setStepIndex(0);
        }
    }, [mode]);
    const step = signupSteps[stepIndex];
    const handleSubmitInternal = (event) => {
        if (isSignup) {
            event.preventDefault();
            const errors = validateForm("signup");
            const hasStepError = step.fields.some((field) => errors[field]);
            if (hasStepError) {
                return;
            }
            if (stepIndex < signupSteps.length - 1) {
                setStepIndex((prev) => prev + 1);
                return;
            }
        }
        onSubmit(mode, event);
    };
    const progress = ((stepIndex + 1) / signupSteps.length) * 100;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center px-4", children: [_jsx("button", { type: "button", className: "absolute inset-0 bg-slate-900/30 backdrop-blur-sm", "aria-label": "Cerrar", onClick: onClose }), _jsxs("section", { className: "relative w-full max-w-sm space-y-6 overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-7 shadow-xl shadow-slate-900/10 backdrop-blur", children: [_jsx("div", { className: "pointer-events-none absolute -top-14 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-slate-900/10 blur-3xl" }), _jsxs("header", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-slate-400", children: isSignup ? "Nuevo acceso" : "Bienvenido" }), _jsx("h2", { className: "text-2xl font-semibold text-slate-900", children: isSignup ? step.title : "Ingresa a Aurora Privé" }), _jsx("p", { className: "text-xs text-slate-500", children: isSignup
                                            ? step.description
                                            : "Verifica tu correo y clave para continuar." })] }), _jsx("button", { type: "button", onClick: onClose, className: "inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/70 text-slate-500 transition hover:text-slate-900", children: "\u2715" })] }), isSignup ? (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-400", children: [_jsxs("span", { children: ["Paso ", stepIndex + 1] }), _jsxs("span", { children: [Math.round(progress), "%"] })] }), _jsx("div", { className: "h-1.5 overflow-hidden rounded-full bg-slate-100", children: _jsx("span", { className: "block h-full rounded-full bg-slate-900 transition-all", style: { width: `${progress}%` } }) })] })) : null, _jsxs("form", { className: "space-y-5", onSubmit: handleSubmitInternal, children: [isSignup ? (_jsxs("div", { className: "space-y-4", children: [step.fields.map((field) => {
                                        const meta = signupFieldMeta[field];
                                        return (_jsx("div", { children: _jsx(TextField, { label: meta.label, name: field, type: meta.type, placeholder: meta.placeholder, autoComplete: meta.autoComplete, value: signupForm[field], onChange: (value) => onSignupChange(field, field === "rut" ? formatRut(value) : value), onBlur: () => onBlur("signup", field), error: signupErrors[field] }) }, field));
                                    }), step.id === "security" ? (_jsx(PasswordStrength, { password: signupForm.password })) : null] })) : (_jsxs("div", { className: "space-y-4", children: [_jsx(TextField, { label: "Correo electr\u00F3nico", name: "email", type: "email", placeholder: "nombre@empresa.cl", autoComplete: "email", value: loginForm.email, onChange: (value) => onLoginChange("email", value), onBlur: () => onBlur("login", "email"), error: loginErrors.email }), _jsx(TextField, { label: "Clave de acceso", name: "password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoComplete: "current-password", value: loginForm.password, onChange: (value) => onLoginChange("password", value), onBlur: () => onBlur("login", "password"), error: loginErrors.password }), _jsxs("div", { className: "flex items-center justify-between text-xs text-slate-500", children: [_jsx(RememberToggle, { checked: loginForm.remember, onChange: (value) => onLoginChange("remember", value) }), _jsx("button", { type: "button", className: "font-semibold transition hover:text-slate-900", children: "Recuperar acceso" })] })] })), _jsxs("div", { className: "flex items-center justify-between gap-3", children: [isSignup && stepIndex > 0 ? (_jsx("button", { type: "button", className: "inline-flex flex-1 items-center justify-center rounded-full border border-slate-300/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 transition hover:border-slate-400 hover:text-slate-800", onClick: () => setStepIndex((prev) => Math.max(prev - 1, 0)), children: "Atr\u00E1s" })) : null, _jsx("button", { type: "submit", className: `inline-flex flex-1 items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition ${isSignup ? "bg-slate-900 hover:bg-slate-800" : "bg-slate-900 hover:bg-slate-800"}`, children: isSignup
                                            ? stepIndex === signupSteps.length - 1
                                                ? "Crear acceso"
                                                : "Continuar"
                                            : "Ingresar" })] })] })] })] }));
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
    const triggerValidation = (form) => {
        if (form === "signup") {
            const errors = validateSignup(signupForm);
            setSignupErrors(errors);
            return errors;
        }
        const errors = validateLogin(loginForm);
        setLoginErrors(errors);
        return errors;
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
    return (_jsxs("div", { className: "relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-200", children: [_jsxs("div", { className: "pointer-events-none absolute inset-0 overflow-hidden", children: [_jsx("div", { className: "aurora-gradient absolute -left-32 top-10 h-56 w-56 rounded-full opacity-30 blur-3xl" }), _jsx("div", { className: "aurora-gradient absolute right-[-5rem] top-1/2 h-64 w-64 -translate-y-1/2 rounded-full opacity-30 blur-3xl" }), _jsx("div", { className: "aurora-gradient absolute bottom-[-6rem] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full opacity-20 blur-3xl" })] }), _jsxs("header", { className: "mx-auto flex w-full max-w-5xl items-center justify-between px-6 pt-10", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white", children: "AP" }), _jsxs("div", { children: [_jsx("p", { className: "text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-slate-500", children: "Aurora Priv\u00E9" }), _jsx("p", { className: "text-xs text-slate-400", children: "Banca privada digital" })] })] }), _jsx("button", { type: "button", onClick: () => showToast("El simulador estará disponible en los próximos días.", "info"), className: "hidden items-center gap-2 rounded-full border border-slate-300/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 transition hover:border-slate-400 hover:text-slate-900 sm:flex", children: "Simula tu cr\u00E9dito" })] }), _jsx("main", { className: "mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-6 py-20", children: _jsxs("section", { className: "relative isolate w-full max-w-3xl overflow-hidden rounded-[2.75rem] border border-white/60 bg-white/70 px-8 py-14 text-center shadow-xl shadow-slate-900/10 backdrop-blur", children: [_jsxs("div", { className: "pointer-events-none absolute inset-0", children: [_jsx("div", { className: "absolute left-1/2 top-8 h-32 w-56 -translate-x-1/2 rounded-full bg-slate-900/10 blur-3xl" }), _jsx("div", { className: "absolute bottom-6 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-gradient-to-r from-slate-900/10 to-slate-900/0 blur-3xl" })] }), _jsxs("div", { className: "relative mx-auto flex max-w-2xl flex-col items-center gap-10", children: [_jsxs("div", { className: "space-y-5", children: [_jsx("span", { className: "inline-flex items-center rounded-full border border-slate-200/70 px-4 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-slate-400", children: "Bienvenido" }), _jsx("h1", { className: "text-4xl font-semibold text-slate-900 sm:text-[2.75rem]", children: "Tu acceso privado sin distracciones" }), _jsx("p", { className: "mx-auto max-w-xl text-sm text-slate-500 sm:text-base", children: "Elige c\u00F3mo avanzar: crea tu cuenta exclusiva, ingresa con tu clave blindada o agenda tu simulaci\u00F3n premium." })] }), _jsxs("div", { className: "grid w-full gap-3 sm:grid-cols-3", children: [_jsx("button", { type: "button", onClick: () => {
                                                resetState();
                                                setActiveMode("signup");
                                            }, className: "inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800", children: "Crear cuenta" }), _jsx("button", { type: "button", onClick: () => {
                                                resetState();
                                                setActiveMode("login");
                                            }, className: "inline-flex items-center justify-center rounded-full border border-slate-300/70 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900", children: "Ingresar" }), _jsx("button", { type: "button", onClick: () => showToast("El simulador estará disponible en los próximos días.", "info"), className: "inline-flex items-center justify-center rounded-full border border-transparent bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 shadow-inner shadow-white/60 transition hover:border-slate-300 hover:text-slate-900", children: "Simula tu cr\u00E9dito" })] }), _jsxs("div", { className: "grid w-full gap-4 text-left sm:grid-cols-2", children: [_jsxs("div", { className: "rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm shadow-white/80", children: [_jsx("p", { className: "text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-400", children: "Identidad protegida" }), _jsx("p", { className: "mt-3 text-sm text-slate-600", children: "Validamos tu RUT y correo con protocolos bancarios chilenos para una incorporaci\u00F3n segura." })] }), _jsxs("div", { className: "rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm shadow-white/80", children: [_jsx("p", { className: "text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-400", children: "Acompa\u00F1amiento experto" }), _jsx("p", { className: "mt-3 text-sm text-slate-600", children: "Nuestro equipo te guiar\u00E1 en la simulaci\u00F3n de cr\u00E9dito personalizada apenas est\u00E9 disponible." })] })] })] })] }) }), _jsx("footer", { className: "mx-auto w-full max-w-5xl px-6 pb-12 text-left", children: _jsxs("p", { className: "text-xs text-slate-400", children: ["\u00A9 ", new Date().getFullYear(), " Aurora Priv\u00E9. Todos los derechos reservados."] }) }), toast ? (_jsx("div", { className: "fixed bottom-6 right-6 z-50", children: _jsx("div", { className: `rounded-2xl border px-5 py-3 text-sm font-medium shadow-lg ${toast.tone === "success"
                        ? "border-emerald-400/60 bg-emerald-50 text-emerald-700"
                        : "border-slate-300/70 bg-white/90 text-slate-600"}`, children: toast.message }) })) : null, activeMode ? (_jsx(AuthPanel, { mode: activeMode, onClose: () => setActiveMode(null), signupForm: signupForm, loginForm: loginForm, signupErrors: signupErrors, loginErrors: loginErrors, onSignupChange: handleSignupChange, onLoginChange: handleLoginChange, onBlur: handleBlur, onSubmit: handleSubmit, validateForm: triggerValidation })) : null] }));
};
const container = document.getElementById("root");
if (container) {
    const root = createRoot(container);
    root.render(_jsx(App, {}));
}
