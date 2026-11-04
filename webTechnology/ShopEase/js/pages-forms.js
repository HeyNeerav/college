"use strict";

function initContactPage() {
  const form = $("#contact-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const { ok } = validateForm(form, {
      fullName: [rule.required("Enter your full name.")],
      email: [rule.required("Enter your email address."), rule.email],
      phone: [rule.required("Enter your phone number."), PHONE_RULE],
      subject: [rule.required("Enter a subject.")],
      message: [rule.minLength(10, "Write at least 10 characters.")],
    });
    if (!ok) {
      setFormStatus(form, "Please fix the errors above.", "error");
      return;
    }
    form.reset();
    setFormStatus(form, "Thanks! Your message has been sent.", "success");
  });

  form.addEventListener("reset", () => clearFormErrors(form));
}

function initAccountPage() {
  const authSection = $("#auth-section");
  const profileSection = $("#profile-section");
  const loginForm = $("#login-form");
  const signupForm = $("#signup-form");
  const tabs = $$("[data-tab]");

  const showTab = (name) => {
    const isLogin = name === "login";
    loginForm.hidden = !isLogin;
    signupForm.hidden = isLogin;
    tabs.forEach((tab) =>
      tab.setAttribute("aria-selected", String(tab.dataset.tab === name)),
    );
    $("#auth-title").textContent = isLogin
      ? "Welcome back"
      : "Create your account";
    $("#auth-intro").textContent = isLogin
      ? "Log in to review products and view your orders."
      : "It takes a minute. This is a demo, so your data stays in your browser.";
  };

  const renderProfile = (user) => {
    $("#profile-avatar").textContent = user.fullName[0].toUpperCase();
    $("#profile-name").textContent = user.fullName;
    $("#profile-email").textContent = user.email;
  };

  const showProfile = (user) => {
    authSection.hidden = true;
    profileSection.hidden = false;
    showAccountInHeader();
    renderProfile(user);

    const orders = readOrders(user.email);
    $("#order-history").innerHTML = orders.length
      ? orders
          .map(
            (order) => `
          <article class="order-item">
            <strong>#${escapeHtml(order.id)}</strong>
            <small>${formatDate(order.placedAt)} · ${formatPrice(order.total)}</small>
            <span>${order.items.map((item) => `${escapeHtml(item.name)} × ${item.quantity}`).join(", ")}</span>
          </article>`,
          )
          .join("")
      : '<p class="empty-state">No orders yet. Your purchases will appear here.</p>';

    const form = $("#profile-form");
    for (const name of [
      "fullName",
      "phone",
      "address",
      "city",
      "postalCode",
      "state",
    ]) {
      form.elements[name].value = user[name] ?? "";
    }
  };

  const finishSignIn = (user) => {
    const target = safeReturnTarget(null);
    if (target) location.assign(target);
    else showProfile(user);
  };

  tabs.forEach((tab) =>
    tab.addEventListener("click", () => showTab(tab.dataset.tab)),
  );

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const { ok, values } = validateForm(loginForm, {
      email: [rule.required("Enter your email address."), rule.email],
      password: [rule.required("Enter your password.")],
    });
    if (!ok) return;
    const { user, error } = await signIn(values);
    if (error) setFormStatus(loginForm, error, "error");
    else finishSignIn(user);
  });

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const { ok, values } = validateForm(signupForm, {
      fullName: [rule.required("Enter your full name.")],
      email: [rule.required("Enter your email address."), rule.email],
      password: [rule.minLength(6, "Use at least 6 characters.")],
      confirmPassword: [rule.sameAs("password", "Passwords do not match.")],
    });
    if (!ok) return;
    const { user, error } = await registerUser(values);
    if (error) setFormStatus(signupForm, error, "error");
    else finishSignIn(user);
  });

  const profileForm = $("#profile-form");
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const { ok, values } = validateForm(profileForm, {
      fullName: [rule.required("Enter your full name.")],
      postalCode: [rule.optional(PIN_RULE)],
    });
    if (!ok) return;
    renderProfile(updateUserProfile(values));
    showAccountInHeader();
    setFormStatus(profileForm, "Details saved.", "success");
  });

  $("#sign-out").addEventListener("click", () => {
    store.remove(KEYS.session);
    location.assign("index.html");
  });

  const user = currentUser();
  if (user) {
    showProfile(user);
  } else {
    showTab(
      new URLSearchParams(location.search).get("tab") === "signup"
        ? "signup"
        : "login",
    );
  }
}

function launchConfetti(canvas) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const context = canvas.getContext("2d");

  const swatch = document.createElement("span");
  document.body.append(swatch);
  const colors = [
    "--art-1",
    "--art-2",
    "--art-3",
    "--color-primary",
    "--color-accent",
  ].map((name) => {
    swatch.style.color = `var(${name})`;
    return getComputedStyle(swatch).color;
  });
  swatch.remove();
  const random = (min, max) => min + Math.random() * (max - min);
  const fit = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  };
  fit();
  addEventListener("resize", fit);

  const pieces = Array.from({ length: 160 }, () => ({
    x: random(0, canvas.width),
    y: -random(0, canvas.height),
    width: random(6, 12),
    height: random(8, 16),
    speedX: random(-1, 1),
    speedY: random(2, 5),
    angle: random(0, Math.PI * 2),
    spin: random(-0.1, 0.1),
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
  const startedAt = performance.now();

  const drawFrame = (now) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const piece of pieces) {
      piece.x += piece.speedX;
      piece.y += piece.speedY;
      piece.angle += piece.spin;
      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.angle);
      context.fillStyle = piece.color;
      context.fillRect(
        -piece.width / 2,
        -piece.height / 2,
        piece.width,
        piece.height,
      );
      context.restore();
    }
    if (now - startedAt < 6000) {
      requestAnimationFrame(drawFrame);
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
      removeEventListener("resize", fit);
    }
  };
  requestAnimationFrame(drawFrame);
}

function initCheckoutPage() {
  if (cartCount() === 0) {
    location.replace("products.html");
    return;
  }

  const billingForm = $("#billing-form");
  const paymentForm = $("#payment-form");
  let billing = null;

  function showStep(step) {
    $$("[data-step]").forEach(
      (section) => (section.hidden = section.dataset.step !== step),
    );
    $("#checkout-layout").hidden = step === "done";
    $$("[data-step-label]").forEach((item) => {
      if (item.dataset.stepLabel === step)
        item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
    scrollTo({ top: 0 });
  }

  const user = currentUser();
  if (user) {
    for (const name of [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "postalCode",
      "state",
    ]) {
      billingForm.elements[name].value = user[name] ?? "";
    }
  }

  billingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const { ok, values } = validateForm(billingForm, {
      fullName: [rule.required("Enter your full name.")],
      email: [rule.required("Enter your email address."), rule.email],
      phone: [rule.required("Enter your phone number."), PHONE_RULE],
      address: [rule.required("Enter your street address.")],
      city: [rule.required("Enter your city.")],
      postalCode: [PIN_RULE],
      state: [rule.required("Enter your state.")],
    });
    if (!ok) return;
    billing = values;
    showStep("payment");
  });

  $("#back-to-billing").addEventListener("click", () => showStep("billing"));

  paymentForm.addEventListener("change", () => {
    const method = paymentForm.elements.paymentMethod.value;
    $$("[data-payment-panel]").forEach(
      (panel) => (panel.hidden = panel.dataset.paymentPanel !== method),
    );
  });

  paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const { ok } = validateForm(paymentForm, {
      cardName: [rule.required("Enter the name on the card.")],
      cardNumber: [
        (value) =>
          /^\d{16}$/.test(value.replaceAll(" ", ""))
            ? ""
            : "Enter a 16-digit card number.",
      ],
      cardExpiry: [
        rule.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use the format MM/YY."),
      ],
      cardCvv: [rule.pattern(/^\d{3}$/, "Enter a 3-digit CVV.")],
      upiId: [rule.pattern(/^[\w.-]+@\w+$/, "Enter a UPI ID, like name@bank.")],
    });
    if (!ok) return;

    const order = {
      id: `SE${(crypto.getRandomValues(new Uint32Array(1))[0] % 900000) + 100000}`,
      accountEmail: user?.email ?? null,
      paymentMethod: paymentForm.elements.paymentMethod.value,
      placedAt: new Date().toISOString(),
      items: cartLines().map(({ product, quantity }) => ({
        name: product.name,
        quantity,
      })),
      total: cartTotals().total,
    };
    store.set(KEYS.orders, [...store.get(KEYS.orders, []), order]);
    clearCart();

    const delivery = new Date(Date.now() + 5 * 86_400_000);
    $("#customer-name").textContent = billing.fullName.split(" ")[0];
    $("#customer-email").textContent = billing.email;
    $("#order-id").textContent = `#${order.id}`;
    $("#order-total").textContent = formatPrice(order.total);
    $("#delivery-date").textContent = delivery.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
    });
    showStep("done");
    launchConfetti($("#confetti"));
  });
}

const PAGE_INITIALIZERS = {
  home: initHomePage,
  products: initProductsPage,
  product: initProductPage,
  contact: initContactPage,
  account: initAccountPage,
  checkout: initCheckoutPage,
  wishlist: initWishlistPage,
};

initTheme();
mountSharedUi();
initCategoryDropdown();
showAccountInHeader();
renderCart();
renderWishlistCount();
initBackToTop();
PAGE_INITIALIZERS[document.body.dataset.page]?.();
