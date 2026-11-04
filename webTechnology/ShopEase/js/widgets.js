"use strict";

const ICON_PREV =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
const ICON_NEXT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
const ICON_PAUSE =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
const ICON_PLAY =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>';
const ICON_ARROW_UP =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';

const prefersReducedMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

function renderSlide(banner, index) {
  return `
    <article class="slider__slide" style="--tile: var(--tint-${banner.tint})" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${PROMO_BANNERS.length}">
      <div class="slider__copy">
        <p class="slider__eyebrow">${banner.eyebrow}</p>
        <h2>${banner.title}</h2>
        <p>${banner.text}</p>
        <a class="button" href="${banner.href}">${banner.cta}</a>
      </div>
      <div class="slider__art" aria-hidden="true">${banner.art.map((id) => productArt(findProduct(id))).join("")}</div>
    </article>`;
}

function initPromoSlider() {
  const AUTOPLAY_MS = 5000;
  const SWIPE_DISTANCE = 50;

  const slider = $("#promo-slider");
  slider.setAttribute("role", "region");
  slider.setAttribute("aria-roledescription", "carousel");
  slider.setAttribute("aria-label", "Promotions");
  slider.innerHTML = `
    <div class="slider__viewport">
      <div class="slider__track">${PROMO_BANNERS.map(renderSlide).join("")}</div>
    </div>
    <div class="slider__controls">
      <button class="icon-button" type="button" data-slide="prev" aria-label="Previous slide">${ICON_PREV}</button>
      <div class="slider__dots">
        ${PROMO_BANNERS.map((banner, index) => `<button class="slider__dot" type="button" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>`).join("")}
      </div>
      <button class="icon-button" type="button" data-slide="next" aria-label="Next slide">${ICON_NEXT}</button>
      <button class="icon-button" type="button" id="slider-toggle"></button>
    </div>`;

  const track = $(".slider__track", slider);
  const slides = $$(".slider__slide", slider);
  const dots = $$(".slider__dot", slider);
  const toggle = $("#slider-toggle");

  let current = 0;
  let timer;
  let pausedByUser = prefersReducedMotion();
  let pausedByInteraction = false;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.translate = `${-100 * current}% 0`;
    slides.forEach((slide, position) => (slide.inert = position !== current));
    dots.forEach((dot, position) =>
      dot.setAttribute("aria-current", String(position === current)),
    );
  }

  function restartTimer() {
    clearInterval(timer);
    if (!pausedByUser && !pausedByInteraction)
      timer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
  }

  function syncToggle() {
    toggle.innerHTML = pausedByUser ? ICON_PLAY : ICON_PAUSE;
    toggle.setAttribute(
      "aria-label",
      pausedByUser ? "Start slideshow" : "Pause slideshow",
    );
  }

  function move(index) {
    goTo(index);
    restartTimer();
  }

  slider.addEventListener("click", (event) => {
    const control = event.target.closest(
      "[data-slide], [data-index], #slider-toggle",
    );
    if (!control) return;
    if (control === toggle) {
      pausedByUser = !pausedByUser;
      syncToggle();
      restartTimer();
    } else if (control.dataset.slide) {
      move(current + (control.dataset.slide === "next" ? 1 : -1));
    } else {
      move(Number(control.dataset.index));
    }
  });

  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") move(current + 1);
    if (event.key === "ArrowLeft") move(current - 1);
  });

  slider.addEventListener(
    "pointerenter",
    () => ((pausedByInteraction = true), restartTimer()),
  );
  slider.addEventListener(
    "pointerleave",
    () => ((pausedByInteraction = false), restartTimer()),
  );
  slider.addEventListener(
    "focusin",
    () => ((pausedByInteraction = true), restartTimer()),
  );
  slider.addEventListener(
    "focusout",
    () => ((pausedByInteraction = false), restartTimer()),
  );

  let swipeStartX = 0;
  slider.addEventListener(
    "pointerdown",
    (event) => (swipeStartX = event.clientX),
  );
  slider.addEventListener("pointerup", (event) => {
    const distance = event.clientX - swipeStartX;
    if (event.pointerType === "touch" && Math.abs(distance) > SWIPE_DISTANCE)
      move(current + (distance < 0 ? 1 : -1));
  });

  goTo(0);
  syncToggle();
  restartTimer();
}

function initBackToTop() {
  const SHOW_AFTER_PIXELS = 400;

  document.body.insertAdjacentHTML(
    "beforeend",
    `<button class="back-to-top" id="back-to-top" type="button" aria-label="Back to top" hidden>${ICON_ARROW_UP}</button>`,
  );
  const button = $("#back-to-top");

  const updateVisibility = () => {
    button.hidden = scrollY < SHOW_AFTER_PIXELS;
  };
  addEventListener("scroll", updateVisibility, { passive: true });
  button.addEventListener("click", () =>
    scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" }),
  );
  updateVisibility();
}
