"use strict";

function initHomePage() {
  $$("[data-shelf]").forEach((shelf) => {
    shelf.innerHTML = shelf.dataset.shelf
      .split(",")
      .map((id) => productArt(findProduct(id)))
      .join("");
  });

  $$("[data-category-art]").forEach((tile) => {
    tile.insertAdjacentHTML(
      "beforeend",
      productArt(findProduct(tile.dataset.categoryArt)),
    );
  });
  $("#featured-grid").replaceChildren(
    ...PRODUCTS.slice(0, FEATURED_COUNT).map(createProductCard),
  );
  initPromoSlider();
  $("#shop-now").addEventListener("click", () => {
    $("#featured-products").scrollIntoView({ behavior: "smooth" });
  });
}

function initProductsPage() {
  const ALL = "All";
  const PRICE_STEP = 100;
  const PRICE_CEILING =
    Math.ceil(
      Math.max(...PRODUCTS.map((product) => product.price)) / PRICE_STEP,
    ) * PRICE_STEP;
  const DEFAULTS = {
    query: "",
    category: ALL,
    maxPrice: PRICE_CEILING,
    sort: "featured",
  };
  const collator = new Intl.Collator("en");
  const sorters = {
    featured: () => 0,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    name: (a, b) => collator.compare(a.name, b.name),
  };

  const form = $("#filters-body");
  const panel = $("#filters");
  const toggle = $("#filters-toggle");

  const countIn = (category) =>
    category === ALL
      ? PRODUCTS.length
      : PRODUCTS.filter((product) => product.category === category).length;

  $("#category-options").innerHTML = [ALL, ...CATEGORIES]
    .map(
      (category) => `
      <label class="filter-option">
        <input type="radio" name="category" value="${category}">
        <span>${category}</span>
        <span class="filter-option__count">${countIn(category)}</span>
      </label>`,
    )
    .join("");
  form.elements.maxPrice.max = PRICE_CEILING;
  form.elements.maxPrice.step = PRICE_STEP;

  function filtersFromUrl() {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const sort = params.get("sort");
    return {
      query: params.get("query") ?? DEFAULTS.query,
      category: CATEGORIES.includes(category) ? category : DEFAULTS.category,
      maxPrice: Number(params.get("maxPrice")) || DEFAULTS.maxPrice,
      sort: Object.hasOwn(sorters, sort) ? sort : DEFAULTS.sort,
    };
  }

  const filtersFromForm = () => ({
    query: form.elements.query.value.trim(),
    category: form.elements.category.value,
    maxPrice: Number(form.elements.maxPrice.value),
    sort: form.elements.sort.value,
  });

  function fillForm(filters) {
    form.elements.query.value = filters.query;
    form.elements.category.value = filters.category;
    form.elements.maxPrice.value = filters.maxPrice;
    form.elements.sort.value = filters.sort;
  }

  function saveFiltersToUrl(filters) {
    const params = new URLSearchParams();
    for (const [name, value] of Object.entries(filters)) {
      if (value !== DEFAULTS[name]) params.set(name, value);
    }
    const text = params.toString();
    try {
      history.replaceState(null, "", text ? `?${text}` : location.pathname);
    } catch {
      return;
    }
  }

  function show(filters) {
    const visible = PRODUCTS.filter(
      (product) =>
        (filters.category === ALL || product.category === filters.category) &&
        product.name.toLowerCase().includes(filters.query.toLowerCase()) &&
        product.price <= filters.maxPrice,
    ).sort(sorters[filters.sort]);

    $("#product-grid").replaceChildren(...visible.map(createProductCard));
    $("#results-count").textContent =
      `Showing ${visible.length} of ${PRODUCTS.length} products`;
    $("#empty-state").hidden = visible.length > 0;
    $("#price-label").textContent =
      filters.maxPrice >= PRICE_CEILING
        ? "Any price"
        : `Up to ${formatPrice(filters.maxPrice)}`;
    saveFiltersToUrl(filters);
  }

  const start = filtersFromUrl();
  fillForm(start);
  show(start);

  form.addEventListener("input", () => show(filtersFromForm()));
  $("#clear-filters").addEventListener("click", () => {
    fillForm(DEFAULTS);
    show(DEFAULTS);
  });
  toggle.addEventListener("click", () => {
    toggle.setAttribute(
      "aria-expanded",
      String(panel.classList.toggle("is-open")),
    );
  });
}

const stars = (rating) =>
  `<span class="rating-stars" role="img" aria-label="${rating} out of 5 stars">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</span>`;

function getReviews(productId) {
  const saved = store.get(KEYS.reviews, {})[productId] ?? [];
  return [...saved.reverse(), ...SAMPLE_REVIEWS];
}

function addReview(productId, review) {
  const all = store.get(KEYS.reviews, {});
  all[productId] = [
    ...(all[productId] ?? []),
    { ...review, createdAt: new Date().toISOString() },
  ];
  store.set(KEYS.reviews, all);
}

function initProductPage() {
  const container = $("#product-detail");
  const product = findProduct(new URLSearchParams(location.search).get("id"));

  if (!product) {
    container.innerHTML =
      '<h1>Product not found</h1><p>We could not find that product. <a href="products.html">Browse all products</a>.</p>';
    return;
  }

  document.title = `${product.name} | ShopEase`;
  const specs = [
    ...SPECIFICATIONS[product.category],
    ["Category", product.category],
  ];

  container.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="index.html">Home</a> / <a href="products.html">Products</a> / <span aria-current="page">${product.name}</span>
    </nav>

    <div class="product-detail">
      <div class="gallery">
        <div class="gallery__stage" data-category="${product.category}">
          <span class="gallery__image" id="gallery-image" aria-hidden="true">${productArt(product)}</span>
          <span class="gallery__caption" id="gallery-caption">${PRODUCT_VIEWS[0].label}</span>
        </div>
        <div class="gallery__thumbnails">
          ${PRODUCT_VIEWS.map(
            (view, index) => `
            <button class="gallery__thumbnail" type="button" data-view="${index}" aria-pressed="${index === 0}" aria-label="${view.label} view">
              <span style="--view-transform: ${view.transform}">${productArt(product)}</span>
            </button>`,
          ).join("")}
        </div>
      </div>

      <div class="product-info">
        <h1>${product.name}</h1>
        <p class="product-info__rating" id="rating-summary"></p>
        <p class="price">${formatPrice(product.price)}</p>
        <p>${product.description}</p>
        <ul class="product-info__notes">
          <li>Free delivery on orders over ₹2,000</li>
          <li>7-day easy returns</li>
          <li>Cash on delivery available</li>
        </ul>
        <div class="purchase-row">
          <div class="stepper stepper--large">
            <button class="stepper__button" type="button" data-action="decrease" aria-label="Decrease quantity">−</button>
            <span class="stepper__value" id="quantity-value">1</span>
            <button class="stepper__button" type="button" data-action="increase" aria-label="Increase quantity">+</button>
          </div>
          <button class="button button--outline" id="add-to-cart" type="button">Add to cart</button>
          <button class="button" id="buy-now" type="button">Buy now</button>
          <button class="button button--outline wishlist-toggle" id="wishlist-toggle" type="button">${ICON_HEART}<span></span></button>
        </div>
        <h2>Specifications</h2>
        <table class="specifications">
          ${specs.map(([name, value]) => `<tr><th scope="row">${name}</th><td>${value}</td></tr>`).join("")}
        </table>
      </div>
    </div>

    <section aria-labelledby="reviews-title">
      <h2 id="reviews-title">Customer reviews</h2>
      <div class="reviews__layout">
        <div id="review-list"></div>
        <div class="panel" id="review-panel"></div>
      </div>
    </section>

    <section aria-labelledby="related-title">
      <h2 class="section__title" id="related-title">You may also like</h2>
      <div class="product-grid" id="related-products"></div>
    </section>`;

  const thumbnails = $$(".gallery__thumbnail");
  $(".gallery__thumbnails").addEventListener("click", (event) => {
    const thumbnail = event.target.closest(".gallery__thumbnail");
    if (!thumbnail) return;
    const view = PRODUCT_VIEWS[Number(thumbnail.dataset.view)];
    $("#gallery-image").style.setProperty("--view-transform", view.transform);
    $("#gallery-caption").textContent = view.label;
    thumbnails.forEach((other) =>
      other.setAttribute("aria-pressed", String(other === thumbnail)),
    );
  });

  let quantity = 1;
  $(".purchase-row .stepper").addEventListener("click", (event) => {
    const change = { increase: 1, decrease: -1 }[event.target.dataset.action];
    if (!change) return;
    quantity = Math.min(Math.max(quantity + change, 1), MAX_QUANTITY);
    $("#quantity-value").textContent = quantity;
  });
  $("#add-to-cart").addEventListener("click", () =>
    addProductToCart(product, quantity),
  );
  $("#buy-now").addEventListener("click", () => {
    addToCart(product.id, quantity);
    location.assign("checkout.html");
  });

  const wishlistButton = $("#wishlist-toggle");
  const syncWishlistButton = () => {
    const saved = isInWishlist(product.id);
    wishlistButton.setAttribute("aria-pressed", String(saved));
    $("span", wishlistButton).textContent = saved
      ? "Saved to wishlist"
      : "Add to wishlist";
  };
  wishlistButton.addEventListener("click", () => {
    toggleWishlist(product);
    syncWishlistButton();
  });
  syncWishlistButton();

  const showReviews = () => {
    const reviews = getReviews(product.id);
    const average =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    $("#rating-summary").innerHTML =
      `${stars(Math.round(average))} ${average.toFixed(1)} (${reviews.length} reviews)`;
    $("#review-list").innerHTML = reviews
      .map(
        (review) => `
      <article class="review">
        ${stars(review.rating)} <strong>${escapeHtml(review.authorName)}</strong>
        <time datetime="${escapeHtml(review.createdAt)}">${formatDate(review.createdAt)}</time>
        <p>${escapeHtml(review.text)}</p>
      </article>`,
      )
      .join("");
  };
  showReviews();

  const user = currentUser();
  const panel = $("#review-panel");
  if (!user) {
    panel.innerHTML = `
      <h2>Add a review</h2>
      <p>Please log in to share your experience with this product.</p>
      <a class="button" href="account.html?next=${encodeURIComponent(productUrl(product.id))}">Log in to review</a>`;
  } else {
    panel.innerHTML = `
      <h2>Add a review</h2>
      <form id="review-form" novalidate>
        <fieldset class="field">
          <legend>Your rating</legend>
          <div class="star-input">
            ${[5, 4, 3, 2, 1].map((value) => `<input type="radio" name="rating" id="rating-${value}" value="${value}"><label for="rating-${value}" title="${value} stars">★</label>`).join("")}
          </div>
          <p class="field__error" data-error-for="rating"></p>
        </fieldset>
        <label class="field">Your review
          <textarea name="comment" rows="4" placeholder="What did you like or dislike?"></textarea>
          <span class="field__error" data-error-for="comment"></span>
        </label>
        <button class="button" type="submit">Submit review</button>
      </form>`;

    const form = $("#review-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const { ok, values } = validateForm(form, {
        rating: [rule.required("Choose a star rating.")],
        comment: [rule.minLength(10, "Write at least 10 characters.")],
      });
      if (!ok) return;
      addReview(product.id, {
        authorName: user.fullName,
        rating: Number(values.rating),
        text: values.comment,
      });
      form.reset();
      clearFormErrors(form);
      showReviews();
      showToast("Review posted");
    });
  }

  const related = PRODUCTS.filter(
    (item) => item.category === product.category && item.id !== product.id,
  ).slice(0, 4);
  $("#related-products").replaceChildren(...related.map(createProductCard));
}
