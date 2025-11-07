<<<<<<< HEAD
const authPanels = document.getElementById('auth-panels');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const toastElement = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const currentYearElement = document.getElementById('copyright-year');

const authCopies = {
  login: {
    title: 'Bienvenido de vuelta',
    subtitle: 'Accede a tu panel financiero para continuar administrando tus préstamos.',
    cta: 'Iniciar sesión',
  },
  signup: {
    title: 'Crea tu cuenta',
    subtitle: 'Regístrate en minutos para simular, solicitar y gestionar créditos inteligentes.',
    cta: 'Crear cuenta',
  },
};

let activeAuthMode = 'login';
let toastTimeout;

const buildInput = (options) => {
  const inputType = options.type ?? 'text';
  const field = document.createElement('label');
  field.className = 'grid gap-2 text-sm font-medium text-slate-600';
  field.htmlFor = options.id;

  const span = document.createElement('span');
  span.textContent = options.label;
  span.className = 'text-xs font-semibold uppercase tracking-wide text-slate-500';

  const input = document.createElement('input');
  input.id = options.id;
  input.name = options.id;
  input.type = inputType;
  input.placeholder = options.placeholder ?? '';
  input.autocomplete = options.autocomplete ?? 'off';
  input.required = true;
  input.className = 'w-full rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 shadow-inner shadow-slate-900/5 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100';

  field.append(span, input);
  return field;
};

const buildAuthForm = (mode) => {
  const form = document.createElement('form');
  form.id = `${mode}-form`;
  form.className = 'grid gap-4';
  form.setAttribute('aria-label', mode === 'login' ? 'Formulario de inicio de sesión' : 'Formulario de registro');

  const controls = [];

  if (mode === 'signup') {
    controls.push(
      buildInput({
        id: 'fullName',
        label: 'Nombre completo',
        placeholder: 'Camila González',
        autocomplete: 'name',
      }),
    );
  }

  controls.push(
    buildInput({
      id: 'email',
      label: 'Correo electrónico',
      type: 'email',
      placeholder: 'tu@email.com',
      autocomplete: 'email',
    }),
  );

  controls.push(
    buildInput({
      id: 'password',
      label: 'Contraseña',
      type: 'password',
      placeholder: '••••••••',
      autocomplete: mode === 'login' ? 'current-password' : 'new-password',
    }),
  );

  if (mode === 'signup') {
    const termsWrapper = document.createElement('label');
    termsWrapper.className = 'flex items-start gap-3 text-xs text-slate-500';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.required = true;
    checkbox.className = 'mt-1 h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-300';

    const text = document.createElement('span');
    text.innerHTML =
      'Acepto recibir comunicaciones relevantes y confirmo que he leído la política de privacidad.';

    termsWrapper.append(checkbox, text);
    form.append(...controls, termsWrapper);
  } else {
    const rememberWrapper = document.createElement('label');
    rememberWrapper.className = 'flex items-center justify-between text-xs text-slate-500';

    const rememberBox = document.createElement('label');
    rememberBox.className = 'flex items-center gap-2';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-300';

    const rememberText = document.createElement('span');
    rememberText.textContent = 'Recordar acceso seguro';

    rememberBox.append(checkbox, rememberText);

    const recoveryLink = document.createElement('a');
    recoveryLink.href = '#';
    recoveryLink.className = 'font-semibold text-indigo-500 hover:text-indigo-400';
    recoveryLink.textContent = '¿Olvidaste tu contraseña?';

    rememberWrapper.append(rememberBox, recoveryLink);
    form.append(...controls, rememberWrapper);
  }

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'group flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500';
  submitButton.innerHTML = `
    <span>${authCopies[mode].cta}</span>
    <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  `;

  form.append(submitButton);
  return form;
};

const renderAuthPanels = (mode) => {
  if (!authPanels) return;
  authPanels.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'flex items-center justify-between';

  const copyGroup = document.createElement('div');
  copyGroup.className = 'space-y-1';

  const title = document.createElement('h3');
  title.className = 'text-lg font-semibold text-slate-900';
  title.textContent = authCopies[mode].title;

  const subtitle = document.createElement('p');
  subtitle.className = 'text-sm text-slate-500';
  subtitle.textContent = authCopies[mode].subtitle;

  copyGroup.append(title, subtitle);

  const modeSwitcher = document.createElement('div');
  modeSwitcher.className = 'rounded-full border border-slate-200/80 bg-white/70 p-1 text-xs font-semibold text-slate-500 shadow-inner shadow-slate-900/5';

  ['login', 'signup'].forEach((authMode) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.mode = authMode;
    button.textContent = authMode === 'login' ? 'Ingresar' : 'Registrarme';
    button.className = `rounded-full px-4 py-1.5 transition ${
      authMode === mode
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
        : 'text-slate-500 hover:text-indigo-500'
    }`;
    button.addEventListener('click', () => setActiveAuthMode(authMode));
    modeSwitcher.appendChild(button);
  });

  header.append(copyGroup, modeSwitcher);
  authPanels.append(header, buildAuthForm(mode));

  const form = document.getElementById(`${mode}-form`);
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = String(formData.get('email') ?? '').trim();
    if (!email) {
      showToast('Por favor ingresa un correo válido.');
      return;
    }

    showToast(
      mode === 'login'
        ? 'Inicio de sesión simulado. Pronto podrás acceder a tu panel.'
        : 'Registro simulado con éxito. Te daremos la bienvenida muy pronto!'
    );
    form.reset();
  });
};

const showToast = (message) => {
  if (!toastElement || !toastMessage) return;
  toastMessage.textContent = message;
  toastElement.classList.remove('hidden');
  toastElement.classList.add('flex');

  if (toastTimeout) {
    window.clearTimeout(toastTimeout);
  }

  toastTimeout = window.setTimeout(() => {
    toastElement.classList.add('hidden');
    toastElement.classList.remove('flex');
  }, 3600);
};

const setActiveAuthMode = (mode) => {
  activeAuthMode = mode;
  renderAuthPanels(mode);
};

const initialiseMobileMenu = () => {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    menuToggle.setAttribute('aria-expanded', String(isHidden));
  });
};

const initialiseFaqAccordion = () => {
  const faqItems = document.querySelectorAll('#faq-list .faq-item');
  faqItems.forEach((item) => {
    const button = item.querySelector('button');
    const content = item.querySelector('div:last-of-type');
    const icon = item.querySelector('svg');

    if (!button || !content || !icon) return;

    content.classList.add('hidden');
    button.setAttribute('aria-expanded', 'false');

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      content.classList.toggle('hidden');
      icon.classList.toggle('rotate-180');
    });
  });
};

const initialiseAuthTriggers = () => {
  const triggers = document.querySelectorAll('[data-auth]');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const mode = trigger.dataset.auth;
      if (!mode) return;
      setActiveAuthMode(mode);
      toastElement?.classList.add('hidden');
      toastElement?.classList.remove('flex');
      const panel = authPanels?.getBoundingClientRect();
      if (!panel) return;
      window.scrollTo({ top: window.scrollY + panel.top - 120, behavior: 'smooth' });
    });
  });
};

const initialiseFooterYear = () => {
  if (!currentYearElement) return;
  currentYearElement.textContent = String(new Date().getFullYear());
};

const init = () => {
  initialiseMobileMenu();
  initialiseFaqAccordion();
  initialiseAuthTriggers();
  initialiseFooterYear();
  setActiveAuthMode(activeAuthMode);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
=======
import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";

const authCopy = {
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

const Badge = ({ label }) =>
  _jsx("span", {
    className: "inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-600",
    children: label,
  });

const OutlineButton = ({ children, onClick, className = "" }) =>
  _jsx("button", {
    onClick,
    className: `rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-500 ${className}`.trim(),
    children,
  });

const PrimaryButton = ({ children, onClick, className = "" }) =>
  _jsx("button", {
    onClick,
    className: `rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 ${className}`.trim(),
    children,
  });

const InputField = ({ label, type, name, placeholder, autoComplete }) =>
  _jsxs("label", {
    className: "flex flex-col gap-1.5 text-left",
    children: [
      _jsx("span", { className: "text-sm font-medium text-slate-600", children: label }),
      _jsx("input", {
        className:
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm shadow-indigo-100/30 outline-none transition focus:border-indigo-400 focus:ring focus:ring-indigo-200/50",
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
            label: "Correo electrónico",
            type: "email",
            name: "email",
            placeholder: "sofia@ejemplo.com",
            autoComplete: "email",
          }),
          _jsx(InputField, {
            label: "Contraseña",
            type: "password",
            name: "password",
            placeholder: "Crea una contraseña segura",
            autoComplete: "new-password",
          }),
        ],
      });
    }
    return _jsxs(_Fragment, {
      children: [
        _jsx(InputField, {
          label: "Correo electrónico",
          type: "email",
          name: "email",
          placeholder: "tu-correo@ejemplo.com",
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
  return _jsxs("div", {
    className:
      "relative isolate overflow-hidden rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-xl shadow-indigo-100/60",
    children: [
      _jsxs("div", {
        className: "mb-6 flex items-center gap-4 text-xs font-semibold text-slate-500",
        children: [
          _jsx("button", {
            type: "button",
            onClick: () => onModeChange("login"),
            className: `rounded-full px-3 py-1 transition ${
              mode === "login" ? "bg-indigo-100 text-indigo-600" : "hover:text-indigo-500"
            }`,
            children: "Iniciar sesión",
          }),
          _jsx("button", {
            type: "button",
            onClick: () => onModeChange("signup"),
            className: `rounded-full px-3 py-1 transition ${
              mode === "signup" ? "bg-indigo-100 text-indigo-600" : "hover:text-indigo-500"
            }`,
            children: "Crear cuenta",
          }),
        ],
      }),
      _jsx("h3", {
        className: "text-2xl font-semibold tracking-tight text-slate-900",
        children: authCopy[mode].title,
      }),
      _jsx("p", { className: "mt-2 text-sm text-slate-600", children: authCopy[mode].description }),
      _jsxs("form", {
        className: "mt-6 flex flex-col gap-4",
        onSubmit: (event) => onSubmit(mode, event),
        children: [
          fields,
          mode === "signup"
            ? _jsxs("label", {
                className: "flex items-start gap-2 text-xs text-slate-500",
                children: [
                  _jsx("input", {
                    type: "checkbox",
                    className: "mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500",
                    required: true,
                  }),
                  "Acepto los términos de servicio y autorizo el tratamiento de mis datos de acuerdo a la política de privacidad.",
                ],
              })
            : null,
          _jsx(PrimaryButton, { className: "mt-2 w-full", children: authCopy[mode].cta }),
          mode === "login"
            ? _jsx(
                "a",
                {
                  className: "text-center text-xs font-semibold text-indigo-500 transition hover:text-indigo-400",
                  href: "#recuperar",
                  children: "Recuperar contraseña",
                },
              )
            : null,
        ],
      }),
    ],
  });
};

const FAQ = ({ openIndex, onToggle }) =>
  _jsx("div", {
    className: "space-y-4",
    id: "preguntas",
    children: faqItems.map((item, index) => {
      const isOpen = openIndex === index;
      return _jsxs(
        "div",
        {
          className: "rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm",
          children: [
            _jsxs(
              "button",
              {
                type: "button",
                className: "flex w-full items-center justify-between gap-6 text-left",
                onClick: () => onToggle(index),
                "aria-expanded": isOpen,
                children: [
                  _jsx("span", {
                    className: "text-base font-semibold text-slate-800",
                    children: item.question,
                  }),
                  _jsx("span", {
                    className: "text-xl font-medium text-indigo-500",
                    children: isOpen ? "–" : "+",
                  }),
                ],
              },
            ),
            isOpen ? _jsx("p", { className: "mt-3 text-sm leading-6 text-slate-600", children: item.answer }) : null,
          ],
        },
        item.question,
      );
    }),
  });

const Toast = ({ toast }) => {
  if (!toast) return null;
  return _jsxs("div", {
    className: `pointer-events-auto fixed inset-x-0 top-5 mx-auto flex max-w-md items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl transition ${
      toast.tone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-indigo-200 bg-indigo-50 text-indigo-700"
    }`,
    role: "status",
    children: [
      _jsx("span", {
        className: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-lg",
        children: toast.tone === "success" ? "✓" : "ℹ",
      }),
      toast.message,
    ],
  });
};

function HomeApp() {
  const [authMode, setAuthMode] = useState("signup");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [toast, setToast] = useState(null);
  const handleAuthSubmit = (mode, event) => {
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
  return _jsxs(_Fragment, {
    children: [
      _jsx(Toast, { toast }),
      _jsxs("div", {
        className: "relative isolate overflow-hidden",
        children: [
          _jsx("div", {
            className:
              "absolute inset-x-0 -top-24 -z-10 mx-auto h-[28rem] max-w-4xl rounded-full bg-gradient-to-br from-indigo-400/40 via-sky-300/40 to-purple-300/40 blur-3xl",
          }),
          _jsxs("header", {
            className: "sticky top-0 z-20 border-b border-white/20 bg-white/80 backdrop-blur",
            children: [
              _jsxs("div", {
                className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-5",
                children: [
                  _jsxs(
                    "a",
                    {
                      className: "flex items-center gap-3",
                      href: "#inicio",
                      "aria-label": "Ir al inicio",
                      children: [
                        _jsx("span", {
                          className:
                            "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 text-lg font-semibold text-white shadow-lg shadow-indigo-500/20",
                          children: "BA",
                        }),
                        _jsxs("div", {
                          children: [
                            _jsx("p", {
                              className: "text-lg font-semibold tracking-tight text-slate-900",
                              children: "Banco Aurora",
                            }),
                            _jsx("p", {
                              className: "text-sm font-medium text-slate-500",
                              children: "Créditos inteligentes, decisiones brillantes",
                            }),
                          ],
                        }),
                      ],
                    },
                  ),
                  _jsx("nav", {
                    className: "hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex",
                    children: navigation.map((item) =>
                      _jsx(
                        "a",
                        {
                          className: "transition hover:text-indigo-500",
                          href: item.href,
                          children: item.label,
                        },
                        item.href,
                      ),
                    ),
                  }),
                  _jsxs("div", {
                    className: "hidden items-center gap-3 md:flex",
                    children: [
                      _jsx(OutlineButton, {
                        onClick: () => setAuthMode("login"),
                        children: "Iniciar sesión",
                      }),
                      _jsx(PrimaryButton, {
                        onClick: () => setAuthMode("signup"),
                        children: "Crear cuenta",
                      }),
                    ],
                  }),
                  _jsx("button", {
                    className:
                      "rounded-xl border border-slate-200/70 p-2 text-slate-600 transition hover:border-indigo-400 hover:text-indigo-500 md:hidden",
                    onClick: () => setMobileMenuOpen((value) => !value),
                    "aria-label": "Abrir menú",
                    children: _jsx("svg", {
                      className: "h-5 w-5",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      viewBox: "0 0 24 24",
                      children: _jsx("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        d: "M4 6h16M4 12h16M4 18h16",
                      }),
                    }),
                  }),
                ],
              }),
              isMobileMenuOpen
                ? _jsxs("div", {
                    className: "border-t border-slate-200/70 bg-white px-6 pb-6 pt-4 md:hidden",
                    children: [
                      _jsx("nav", {
                        className: "flex flex-col gap-4 text-sm font-medium text-slate-600",
                        children: navigation.map((item) =>
                          _jsx(
                            "a",
                            {
                              className: "transition hover:text-indigo-500",
                              href: item.href,
                              onClick: () => setMobileMenuOpen(false),
                              children: item.label,
                            },
                            item.href,
                          ),
                        ),
                      }),
                      _jsxs("div", {
                        className: "mt-6 flex flex-col gap-3",
                        children: [
                          _jsx(OutlineButton, {
                            onClick: () => setAuthMode("login"),
                            children: "Iniciar sesión",
                          }),
                          _jsx(PrimaryButton, {
                            onClick: () => setAuthMode("signup"),
                            children: "Crear cuenta",
                          }),
                        ],
                      }),
                    ],
                  })
                : null,
            ],
          }),
          _jsxs("main", {
            className: "mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-16",
            id: "inicio",
            children: [
              _jsxs("section", {
                className: "grid gap-12 md:grid-cols-[1.05fr_0.95fr] md:items-center",
                children: [
                  _jsxs("div", {
                    className: "space-y-8",
                    children: [
                      _jsxs("span", {
                        className:
                          "inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-500",
                        children: ["Nueva banca digital"],
                      }),
                      _jsxs("div", {
                        className: "space-y-6",
                        children: [
                          _jsx("h1", {
                            className: "text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl",
                            children: "Crédito inteligente, diseñado para tu siguiente paso.",
                          }),
                          _jsx("p", {
                            className: "text-lg leading-8 text-slate-600",
                            children:
                              "Banco Aurora combina analítica avanzada y asesoría humana para ayudarte a obtener el préstamo ideal sin trámites eternos. Gestiona todo desde una plataforma elegante y confiable.",
                          }),
                        ],
                      }),
                      _jsxs("div", {
                        className: "flex flex-wrap items-center gap-3",
                        children: [
                          _jsx(PrimaryButton, {
                            onClick: () => setAuthMode("signup"),
                            children: "Quiero mi cuenta",
                          }),
                          _jsx(OutlineButton, {
                            onClick: () => setAuthMode("login"),
                            children: "Ya tengo cuenta",
                          }),
                        ],
                      }),
                      _jsx("div", {
                        className: "grid gap-6 sm:grid-cols-3",
                        children: highlights.map((item) =>
                          _jsxs(
                            "div",
                            {
                              className: "rounded-2xl border border-slate-200 bg-white/90 p-4 text-center shadow-sm",
                              children: [
                                _jsx("p", {
                                  className: "text-2xl font-semibold text-indigo-600",
                                  children: item.value,
                                }),
                                _jsx("p", {
                                  className:
                                    "mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500",
                                  children: item.label,
                                }),
                              ],
                            },
                            item.label,
                          ),
                        ),
                      }),
                    ],
                  }),
                  _jsx("div", {
                    className: "floating-glow relative",
                    children: _jsx("div", {
                      className: "glass-surface rounded-3xl border border-white/60 p-6 shadow-xl shadow-indigo-200/60",
                      children: _jsx(AuthPanel, {
                        mode: authMode,
                        onModeChange: setAuthMode,
                        onSubmit: handleAuthSubmit,
                      }),
                    }),
                  }),
                ],
              }),
              _jsxs("section", {
                className: "space-y-10",
                id: "servicios",
                children: [
                  _jsxs("div", {
                    className: "max-w-2xl",
                    children: [
                      _jsx("h2", {
                        className: "text-3xl font-semibold text-slate-900",
                        children: "Una plataforma pensada para crecer contigo",
                      }),
                      _jsx("p", {
                        className: "mt-3 text-base text-slate-600",
                        children:
                          "Nuestra suite de herramientas te acompaña desde la simulación hasta la gestión diaria de tus créditos. Todo con indicadores claros, alertas proactivas y soporte en vivo.",
                      }),
                    ],
                  }),
                  _jsx("div", {
                    className: "grid gap-6 md:grid-cols-3",
                    children: features.map((feature) =>
                      _jsxs(
                        "article",
                        {
                          className:
                            "group flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-indigo-100/40 transition hover:-translate-y-1 hover:border-indigo-300",
                          children: [
                            _jsx(Badge, { label: feature.badge }),
                            _jsx("h3", {
                              className: "text-xl font-semibold text-slate-900",
                              children: feature.title,
                            }),
                            _jsx("p", {
                              className: "text-sm leading-6 text-slate-600",
                              children: feature.description,
                            }),
                            _jsx("span", {
                              className: "text-sm font-semibold text-indigo-500 opacity-0 transition group-hover:opacity-100",
                              children: "Explorar servicios →",
                            }),
                          ],
                        },
                        feature.title,
                      ),
                    ),
                  }),
                ],
              }),
              _jsxs("section", {
                className:
                  "grid gap-12 rounded-[2.5rem] border border-slate-200/80 bg-gradient-to-br from-white/95 via-indigo-50/70 to-white/90 p-12 shadow-xl shadow-indigo-100/60 md:grid-cols-2",
                id: "beneficios",
                children: [
                  _jsxs("div", {
                    className: "space-y-6",
                    children: [
                      _jsx("h2", {
                        className: "text-3xl font-semibold text-slate-900",
                        children: "Beneficios exclusivos para tu estrategia financiera",
                      }),
                      _jsx("p", {
                        className: "text-base text-slate-600",
                        children:
                          "Optimiza tus finanzas con herramientas automatizadas, reportes predictivos y aliados especialistas que entienden tus objetivos.",
                      }),
                      _jsx("ul", {
                        className: "space-y-4",
                        children: benefits.map((benefit) =>
                          _jsxs(
                            "li",
                            {
                              className: "rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm",
                              children: [
                                _jsx("p", {
                                  className: "text-base font-semibold text-slate-900",
                                  children: benefit.title,
                                }),
                                _jsx("p", {
                                  className: "mt-1 text-sm text-slate-600",
                                  children: benefit.description,
                                }),
                              ],
                            },
                            benefit.title,
                          ),
                        ),
                      }),
                      _jsxs("div", {
                        className: "flex flex-wrap gap-3",
                        children: [
                          _jsx(PrimaryButton, { children: "Hablar con un ejecutivo" }),
                          _jsx(OutlineButton, { children: "Ver planes empresariales" }),
                        ],
                      }),
                    ],
                  }),
                  _jsxs("div", {
                    className: "space-y-6",
                    children: [
                      _jsxs("div", {
                        className: "rounded-3xl border border-white/70 bg-white/70 p-6 shadow-lg",
                        children: [
                          _jsx("h3", {
                            className: "text-lg font-semibold text-slate-900",
                            children: "Seguridad de nivel bancario",
                          }),
                          _jsx("p", {
                            className: "mt-3 text-sm text-slate-600",
                            children:
                              "En Banco Aurora tu información es sagrada. Implementamos estándares globales y un monitoreo constante para que tengas tranquilidad absoluta.",
                          }),
                          _jsx("ul", {
                            className: "mt-5 space-y-3 text-sm text-slate-600",
                            id: "seguridad",
                            children: securityPoints.map((point) =>
                              _jsxs(
                                "li",
                                {
                                  className: "flex items-start gap-2",
                                  children: [
                                    _jsx("span", {
                                      className: "mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400",
                                    }),
                                    _jsx("span", { children: point }),
                                  ],
                                },
                                point,
                              ),
                            ),
                          }),
                        ],
                      }),
                      _jsxs("div", {
                        className: "rounded-3xl border border-white/70 bg-indigo-600/90 p-6 text-white shadow-xl",
                        children: [
                          _jsx("p", {
                            className: "text-sm uppercase tracking-[0.2em] text-indigo-100",
                            children: "Historias reales",
                          }),
                          _jsx("p", {
                            className: "mt-4 text-lg font-semibold",
                            children:
                              "“En menos de 10 minutos tenía mi aprobación preliminar y un plan hecho a mi medida. La plataforma es espectacular”.",
                          }),
                          _jsx("p", {
                            className: "mt-6 text-sm font-medium text-indigo-100",
                            children: "María Fernanda • Emprendedora tech",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              _jsx("section", {
                children: _jsxs("div", {
                  className: "grid gap-12 lg:grid-cols-[0.7fr_1fr]",
                  children: [
                    _jsxs("div", {
                      className: "space-y-4",
                      children: [
                        _jsx("h2", {
                          className: "text-3xl font-semibold text-slate-900",
                          children: "Preguntas frecuentes",
                        }),
                        _jsx("p", {
                          className: "text-base text-slate-600",
                          children:
                            "Resolvemos las dudas más comunes antes de que inicies tu solicitud. ¿Tienes otra pregunta? Escríbenos por el chat en vivo y un especialista responderá en minutos.",
                        }),
                      ],
                    }),
                    _jsx(FAQ, {
                      openIndex: openFaq,
                      onToggle: (index) =>
                        setOpenFaq((current) => (current === index ? null : index)),
                    }),
                  ],
                }),
              }),
            ],
          }),
          _jsx("footer", {
            className: "border-t border-slate-200/70 bg-white/70",
            children: _jsxs("div", {
              className: "mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between",
              children: [
                _jsxs("div", {
                  children: [
                    _jsx("p", {
                      className: "text-lg font-semibold text-slate-900",
                      children: "Banco Aurora",
                    }),
                    _jsx("p", {
                      className: "mt-1 text-sm text-slate-500",
                      children: "Innovación financiera con rostro humano.",
                    }),
                  ],
                }),
                _jsxs("div", {
                  className: "flex flex-wrap gap-4 text-xs font-semibold text-slate-500",
                  children: [
                    _jsx("a", {
                      className: "transition hover:text-indigo-500",
                      href: "#servicios",
                      children: "Servicios",
                    }),
                    _jsx("a", {
                      className: "transition hover:text-indigo-500",
                      href: "#beneficios",
                      children: "Beneficios",
                    }),
                    _jsx("a", {
                      className: "transition hover:text-indigo-500",
                      href: "#seguridad",
                      children: "Seguridad",
                    }),
                    _jsx("a", {
                      className: "transition hover:text-indigo-500",
                      href: "#preguntas",
                      children: "Preguntas",
                    }),
                  ],
                }),
                _jsx("p", {
                  className: "text-xs text-slate-400",
                  children: `© ${new Date().getFullYear()} Banco Aurora. Todos los derechos reservados.`,
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(_jsx(HomeApp, {}));
>>>>>>> codex/create-homepage-for-banking-app-75qa5y
}
