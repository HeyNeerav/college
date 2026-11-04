"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const priceFormat = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const formatPrice = (amount) => priceFormat.format(amount);
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium" });

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return String(text).replace(/[&<>"']/g, (character) => map[character]);
}

const findProduct = (id) =>
  PRODUCTS.find((product) => product.id === Number(id));
const productUrl = (id) => `product.html?id=${id}`;

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      return;
    }
  },
};

const ICON_SUN =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const ICON_MOON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
const ICON_PALETTE =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 1.6-2-.5-1.2.2-2.5 1.6-2.5H17a4 4 0 0 0 4-4C21 6.9 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.1"/><circle cx="10.5" cy="7.2" r="1.1"/><circle cx="15" cy="7.8" r="1.1"/></svg>';

const APPEARANCES = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "Auto" },
];

const theme = {
  mode: DEFAULT_MODE,
  appearance: "system",
};

const prefersDark = matchMedia("(prefers-color-scheme: dark)");
const isDark = () =>
  theme.appearance === "dark" ||
  (theme.appearance === "system" && prefersDark.matches);

function applyTheme() {
  document.documentElement.dataset.mode = theme.mode;
  document.documentElement.dataset.appearance = theme.appearance;
}

function setTheme(changes) {
  Object.assign(theme, changes);
  applyTheme();
  store.set(KEYS.theme, theme.appearance);
  store.set(KEYS.mode, theme.mode);
  syncThemeControls();
}

function syncThemeControls() {
  const quickToggle = $("#theme-toggle");
  quickToggle.innerHTML = isDark() ? ICON_SUN : ICON_MOON;
  quickToggle.setAttribute("aria-pressed", String(isDark()));
  quickToggle.setAttribute(
    "aria-label",
    isDark() ? "Switch to light colours" : "Switch to dark colours",
  );

  const panel = $("#theme-panel");
  if (!panel) return;
  panel.elements.mode.value = theme.mode;
  panel.elements.appearance.value = theme.appearance;
}

function buildThemePanel() {
  const panel = document.createElement("form");
  panel.className = "theme-panel";
  panel.id = "theme-panel";
  panel.hidden = true;
  panel.setAttribute("aria-label", "Theme");
  panel.innerHTML = `
    <fieldset>
      <legend>Look</legend>
      <div class="mode-list">
        ${MODES.map(
          (mode) => `
          <label class="mode-option" data-mode="${mode.id}">
            <input type="radio" name="mode" value="${mode.id}">
            <span class="mode-option__card">${mode.label}<span class="mode-option__dots" aria-hidden="true"><i></i><i></i><i></i></span></span>
          </label>`,
        ).join("")}
      </div>
    </fieldset>
    <fieldset>
      <legend>Colours</legend>
      <div class="appearance-list">
        ${APPEARANCES.map(
          (choice) => `
          <label class="appearance-option">
            <input type="radio" name="appearance" value="${choice.id}">
            <span>${choice.label}</span>
          </label>`,
        ).join("")}
      </div>
    </fieldset>`;
  $(".site-header__tools").append(panel);
  return panel;
}

function initTheme() {
  const savedMode = store.get(KEYS.mode, DEFAULT_MODE);
  const savedAppearance = store.get(KEYS.theme, "system");
  theme.mode = MODES.some((mode) => mode.id === savedMode)
    ? savedMode
    : DEFAULT_MODE;
  theme.appearance = APPEARANCES.some((choice) => choice.id === savedAppearance)
    ? savedAppearance
    : "system";
  applyTheme();

  const panel = buildThemePanel();
  const menuButton = $("#theme-menu-toggle");
  menuButton.innerHTML = ICON_PALETTE;

  const closePanel = (returnFocus = false) => {
    panel.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    if (returnFocus) menuButton.focus();
  };

  menuButton.addEventListener("click", () => {
    const opening = panel.hidden;
    panel.hidden = !opening;
    menuButton.setAttribute("aria-expanded", String(opening));
  });
  document.addEventListener("click", (event) => {
    if (
      !panel.hidden &&
      !panel.contains(event.target) &&
      !menuButton.contains(event.target)
    )
      closePanel();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) closePanel(true);
  });

  panel.addEventListener("change", () =>
    setTheme({
      mode: panel.elements.mode.value,
      appearance: panel.elements.appearance.value,
    }),
  );
  panel.addEventListener("submit", (event) => event.preventDefault());

  $("#theme-toggle").addEventListener("click", () =>
    setTheme({ appearance: isDark() ? "light" : "dark" }),
  );
  prefersDark.addEventListener("change", syncThemeControls);

  syncThemeControls();
}

let toastTimer;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2000);
}

const rule = {
  required: (message) => (value) => (value ? "" : message),
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? ""
      : "Enter a valid email, like name@example.com.",
  minLength: (length, message) => (value) =>
    value.length >= length ? "" : message,
  pattern: (regex, message) => (value) => (regex.test(value) ? "" : message),
  optional: (check) => (value, form) =>
    value === "" ? "" : check(value, form),
  sameAs: (otherField, message) => (value, form) =>
    value === form.elements[otherField].value ? "" : message,
};

const PHONE_RULE = rule.pattern(
  /^[0-9+\-\s]{10,15}$/,
  "Enter 10 to 15 digits.",
);
const PIN_RULE = rule.pattern(/^\d{6}$/, "Enter a 6-digit PIN code.");

function showFieldError(form, name, field, message) {
  const errorElement = $(`[data-error-for="${name}"]`, form);
  errorElement.textContent = message;
  errorElement.id ||= `${name}-error`;
  field.setAttribute("aria-invalid", String(Boolean(message)));
  field.setAttribute("aria-describedby", errorElement.id);
}

function validateForm(form, fields) {
  const values = {};
  let ok = true;

  for (const [name, rules] of Object.entries(fields)) {
    const field = form.elements[name];
    const anchor = field instanceof RadioNodeList ? field[0] : field;
    if (anchor.closest("[hidden]")) continue;

    values[name] =
      anchor.type === "password" ? field.value : field.value.trim();
    let message = "";
    for (const check of rules) {
      message = check(values[name], form);
      if (message) break;
    }
    showFieldError(form, name, anchor, message);
    if (message) ok = false;
  }
  return { ok, values };
}

function setFormStatus(form, message, tone) {
  const status = $("[data-form-status]", form);
  status.textContent = message;
  status.className = tone ? `form-status form-status--${tone}` : "form-status";
}

function clearFormErrors(form) {
  $$("[data-error-for]", form).forEach((element) => (element.textContent = ""));
  $$("[aria-invalid]", form).forEach((field) =>
    field.removeAttribute("aria-invalid"),
  );
  if ($("[data-form-status]", form)) setFormStatus(form, "");
}

const toHex = (bytes) =>
  [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

async function hashPassword(password, salt) {
  if (!crypto.subtle) return btoa(salt + password);
  return toHex(
    await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(salt + password),
    ),
  );
}

const readUsers = () => store.get(KEYS.users, []);
const normalizeEmail = (email) => email.trim().toLowerCase();
const findUser = (email) =>
  readUsers().find((user) => user.email === normalizeEmail(email));

function currentUser() {
  const email = store.get(KEYS.session, null);
  return email ? (findUser(email) ?? null) : null;
}

async function registerUser({ fullName, email, password }) {
  if (findUser(email))
    return {
      error: "An account with this email already exists. Log in instead.",
    };

  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const user = {
    fullName,
    email: normalizeEmail(email),
    salt,
    passwordHash: await hashPassword(password, salt),
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    state: "",
  };
  store.set(KEYS.users, [...readUsers(), user]);
  store.set(KEYS.session, user.email);
  return { user };
}

async function signIn({ email, password }) {
  const user = findUser(email);
  if (
    !user ||
    (await hashPassword(password, user.salt)) !== user.passwordHash
  ) {
    return { error: "Email or password is incorrect." };
  }
  store.set(KEYS.session, user.email);
  return { user };
}

function updateUserProfile(changes) {
  const user = currentUser();
  const updated = { ...user, ...changes };
  store.set(
    KEYS.users,
    readUsers().map((item) => (item.email === user.email ? updated : item)),
  );
  return updated;
}

function readOrders(email) {
  return store
    .get(KEYS.orders, [])
    .filter((order) => order.accountEmail === email)
    .reverse();
}

function showAccountInHeader() {
  const user = currentUser();
  const link = $("#account-link");
  link.textContent = user ? user.fullName.split(" ")[0] : "Log in";
}

function safeReturnTarget(fallback) {
  const target = new URLSearchParams(location.search).get("next");
  return target && /^[\w-]+\.html(\?[\w=&%-]*)?$/.test(target)
    ? target
    : fallback;
}

function initCategoryDropdown() {
  const dropdown = $(".site-nav__dropdown");
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) dropdown.open = false;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") dropdown.open = false;
  });
}
