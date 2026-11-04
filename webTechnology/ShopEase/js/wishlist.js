"use strict";

const ICON_HEART =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5c0 6.1-8 11-8 11z"/></svg>';

let wishlist = loadWishlist();
const wishlistListeners = [];

function loadWishlist() {
  return store
    .get(KEYS.wishlist, [])
    .filter((productId) => findProduct(productId));
}

const isInWishlist = (productId) => wishlist.includes(productId);

const onWishlistChange = (callback) => wishlistListeners.push(callback);

function saveWishlist() {
  store.set(KEYS.wishlist, wishlist);
  renderWishlistCount();
  wishlistListeners.forEach((callback) => callback());
}

function toggleWishlist(product) {
  const added = !isInWishlist(product.id);
  wishlist = added
    ? [...wishlist, product.id]
    : wishlist.filter((productId) => productId !== product.id);
  saveWishlist();
  showToast(
    added
      ? `${product.name} added to wishlist`
      : `${product.name} removed from wishlist`,
  );
  return added;
}

function renderWishlistCount() {
  $("#wishlist-count").textContent = wishlist.length;
}

addEventListener("storage", (event) => {
  if (event.key !== KEYS.wishlist) return;
  wishlist = loadWishlist();
  renderWishlistCount();
  wishlistListeners.forEach((callback) => callback());
});

function initWishlistPage() {
  const render = () => {
    const saved = wishlist.map(findProduct);
    $("#wishlist-grid").replaceChildren(...saved.map(createProductCard));
    $("#wishlist-empty").hidden = saved.length > 0;
    $("#wishlist-summary").textContent = saved.length
      ? `${saved.length} saved ${saved.length === 1 ? "item" : "items"}`
      : "";
  };
  onWishlistChange(render);
  render();
}
