"use strict";

let cart = loadCart();

function loadCart() {
  return store.get(KEYS.cart, []).filter((line) => findProduct(line.productId));
}

function saveCart() {
  store.set(KEYS.cart, cart);
  renderCart();
}

const cartCount = () => cart.reduce((count, line) => count + line.quantity, 0);

function cartLines() {
  return cart.map((line) => ({
    product: findProduct(line.productId),
    quantity: line.quantity,
  }));
}

function cartTotals() {
  const subtotal = cartLines().reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0,
  );
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  return { subtotal, shipping, total: subtotal + shipping };
}

function addToCart(productId, quantity = 1) {
  const line = cart.find((item) => item.productId === productId);
  if (line) line.quantity = Math.min(line.quantity + quantity, MAX_QUANTITY);
  else cart.push({ productId, quantity: Math.min(quantity, MAX_QUANTITY) });
  saveCart();
}

function addProductToCart(product, quantity = 1) {
  addToCart(product.id, quantity);
  showToast(`${product.name} added to cart`);
}

function changeQuantity(productId, change) {
  const line = cart.find((item) => item.productId === productId);
  if (!line) return;
  line.quantity = Math.min(line.quantity + change, MAX_QUANTITY);
  cart = cart.filter((item) => item.quantity > 0);
  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  saveCart();
}

function clearCart() {
  cart = [];
  saveCart();
}

function renderCartLine({ product, quantity }) {
  return `
    <article class="cart-line" data-product-id="${product.id}">
      <span class="cart-line__icon" data-category="${product.category}" aria-hidden="true">${productArt(product)}</span>
      <div class="cart-line__info">
        <h3 class="cart-line__name">${product.name}</h3>
        <p class="cart-line__unit-price">${formatPrice(product.price)} each</p>
      </div>
      <button class="cart-line__remove" type="button" data-action="remove" aria-label="Remove ${product.name}">✕</button>
      <div class="stepper">
        <button class="stepper__button" type="button" data-action="decrease" aria-label="Decrease quantity">−</button>
        <span class="stepper__value">${quantity}</span>
        <button class="stepper__button" type="button" data-action="increase" aria-label="Increase quantity">+</button>
      </div>
      <span class="cart-line__total">${formatPrice(product.price * quantity)}</span>
    </article>`;
}

function renderOrderSummary() {
  const container = $("#order-summary");
  if (!container) return;
  const line = (label, amount, modifier = "") =>
    `<div class="summary-line ${modifier}"><span>${label}</span><span>${amount}</span></div>`;
  const { shipping, total } = cartTotals();
  container.innerHTML =
    cartLines()
      .map(({ product, quantity }) =>
        line(
          `${product.name} × ${quantity}`,
          formatPrice(product.price * quantity),
        ),
      )
      .join("") +
    line("Shipping", shipping ? formatPrice(shipping) : "Free") +
    line("Total", formatPrice(total), "summary-line--total");
}

function renderCart() {
  $("#cart-count").textContent = cartCount();

  const lines = cartLines();
  $("#cart-lines").innerHTML = lines.length
    ? lines.map(renderCartLine).join("")
    : '<p class="empty-state">Your cart is empty. Have a look around and add something you like.</p>';
  $("#cart-subtotal").textContent = formatPrice(cartTotals().subtotal);
  $("#checkout-link").setAttribute("aria-disabled", String(lines.length === 0));

  renderOrderSummary();
}

function mountSharedUi() {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <dialog class="drawer" id="cart-drawer" aria-labelledby="cart-title">
      <div class="drawer__content">
        <header class="drawer__header">
          <h2 id="cart-title">Your cart</h2>
          <button class="icon-button" id="cart-close" type="button" aria-label="Close cart">✕</button>
        </header>
        <div class="drawer__body" id="cart-lines"></div>
        <footer class="drawer__footer">
          <p class="drawer__subtotal"><span>Subtotal</span><strong id="cart-subtotal"></strong></p>
          <a class="button" id="checkout-link" href="checkout.html">Checkout</a>
        </footer>
      </div>
    </dialog>

    <dialog class="modal" id="product-modal" aria-labelledby="product-modal-title">
      <div class="modal__content">
        <button class="button button--outline button--small modal__close" id="product-modal-close" type="button">Close</button>
        <div id="product-modal-body"></div>
      </div>
    </dialog>

    <div class="toast" id="toast" role="status" aria-live="polite"></div>`,
  );

  const drawer = $("#cart-drawer");
  const modal = $("#product-modal");

  [drawer, modal].forEach((dialog) =>
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    }),
  );

  $("#cart-toggle").addEventListener("click", () => drawer.showModal());
  $("#cart-close").addEventListener("click", () => drawer.close());
  $("#product-modal-close").addEventListener("click", () => modal.close());

  $("#cart-lines").addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    const line = event.target.closest("[data-product-id]");
    if (!action || !line) return;
    const id = Number(line.dataset.productId);
    if (action === "increase") changeQuantity(id, 1);
    if (action === "decrease") changeQuantity(id, -1);
    if (action === "remove") removeFromCart(id);
  });

  addEventListener("storage", (event) => {
    if (event.key !== KEYS.cart) return;
    cart = loadCart();
    renderCart();
  });
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.category = product.category;
  card.innerHTML = `
    <div class="product-card__media">
      <a class="product-card__image" href="${productUrl(product.id)}" aria-hidden="true" tabindex="-1">${productArt(product)}</a>
      <p class="price-tag">${formatPrice(product.price)}</p>
      <button class="wishlist-button" type="button" data-action="wishlist" aria-pressed="${isInWishlist(product.id)}" aria-label="Save ${product.name} to wishlist">${ICON_HEART}</button>
    </div>
    <div class="product-card__body">
      <h3 class="product-card__title"><a href="${productUrl(product.id)}">${product.name}</a></h3>
      <p class="product-card__description">${product.description}</p>
      <div class="product-card__actions">
        <button class="button button--outline button--small" type="button" data-action="details">View details</button>
        <button class="button button--small" type="button" data-action="add">Add to cart</button>
      </div>
    </div>`;

  card.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "details") openProductModal(product);
    if (action === "add") addProductToCart(product);
    if (action === "wishlist") {
      const button = event.target.closest("[data-action]");
      button.setAttribute("aria-pressed", String(toggleWishlist(product)));
    }
  });
  return card;
}

function openProductModal(product) {
  $("#product-modal-body").innerHTML = `
    <div class="modal__image" data-category="${product.category}" aria-hidden="true">${productArt(product)}</div>
    <h2 id="product-modal-title">${product.name}</h2>
    <p class="price">${formatPrice(product.price)}</p>
    <p>${product.description}</p>
    <a class="button" href="${productUrl(product.id)}">See full page</a>`;
  $("#product-modal").showModal();
}
