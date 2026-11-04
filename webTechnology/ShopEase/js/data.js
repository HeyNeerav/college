"use strict";

const CATEGORIES = ["Electronics", "Clothing", "Accessories"];

const PRODUCTS = [
  {
    id: 1,
    name: "Wireless Earbuds",
    price: 1999,
    category: "Electronics",
    description: "Bluetooth 5.3 earbuds with 24-hour battery life.",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 3499,
    category: "Electronics",
    description: "Tracks steps, sleep and heart rate.",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 1499,
    category: "Electronics",
    description: "Portable, water-resistant speaker with deep bass.",
  },
  {
    id: 4,
    name: "Power Bank 10000mAh",
    price: 899,
    category: "Electronics",
    description: "Slim power bank with fast charging.",
  },
  {
    id: 5,
    name: "Cotton T-Shirt",
    price: 499,
    category: "Clothing",
    description: "Soft, breathable cotton for everyday wear.",
  },
  {
    id: 6,
    name: "Denim Jacket",
    price: 1799,
    category: "Clothing",
    description: "Classic fit jacket in washed blue denim.",
  },
  {
    id: 7,
    name: "Running Shoes",
    price: 2299,
    category: "Clothing",
    description: "Lightweight shoes with cushioned soles.",
  },
  {
    id: 8,
    name: "Canvas Backpack",
    price: 1199,
    category: "Accessories",
    description: "Roomy backpack with a padded laptop pocket.",
  },
  {
    id: 9,
    name: "Sunglasses",
    price: 699,
    category: "Accessories",
    description: "UV-protected lenses with a lightweight frame.",
  },
  {
    id: 10,
    name: "Leather Wallet",
    price: 599,
    category: "Accessories",
    description: "Slim wallet with six card slots.",
  },
];

const FEATURED_COUNT = 4;
const MAX_QUANTITY = 10;
const SHIPPING_FEE = 99;
const FREE_SHIPPING_OVER = 2000;

const SPECIFICATIONS = {
  Electronics: [
    ["Warranty", "1 year"],
    ["Connectivity", "Bluetooth 5.3"],
    ["Charging", "USB-C"],
    ["In the box", "Device, cable, manual"],
  ],
  Clothing: [
    ["Material", "Cotton blend"],
    ["Fit", "Regular"],
    ["Care", "Machine wash cold"],
    ["Sizes", "S, M, L, XL"],
  ],
  Accessories: [
    ["Material", "Canvas or leather"],
    ["Size", "Standard"],
    ["Care", "Wipe clean"],
    ["Warranty", "6 months"],
  ],
};

const PRODUCT_VIEWS = [
  { label: "Front", transform: "none" },
  { label: "Side", transform: "scaleX(-1)" },
  { label: "In use", transform: "rotate(-14deg) scale(0.85)" },
  { label: "Packaging", transform: "scale(0.55)" },
];

const SAMPLE_REVIEWS = [
  {
    authorName: "Rohan S.",
    rating: 5,
    text: "Great value for the price. Arrived quickly and works as described.",
    createdAt: "2026-09-12",
  },
  {
    authorName: "Meera K.",
    rating: 4,
    text: "Good quality overall. Packaging could be better, but I would buy again.",
    createdAt: "2026-09-28",
  },
];

const KEYS = {
  cart: "shopease:cart",
  theme: "shopease:theme",
  mode: "shopease:mode",
  users: "shopease:users",
  session: "shopease:session",
  reviews: "shopease:reviews",
  orders: "shopease:orders",
  wishlist: "shopease:wishlist",
};

const PROMO_BANNERS = [
  {
    eyebrow: "Sound and power",
    title: "Music that goes where you go",
    text: "Earbuds, speakers and power banks for the daily commute.",
    cta: "Shop electronics",
    href: "products.html?category=Electronics",
    art: [1, 3, 4],
    tint: 1,
  },
  {
    eyebrow: "New season",
    title: "Layer up, step out",
    text: "Soft tees, a good denim jacket and shoes that keep up.",
    cta: "Shop clothing",
    href: "products.html?category=Clothing",
    art: [5, 6, 7],
    tint: 2,
  },
  {
    eyebrow: "Free delivery over ₹2,000",
    title: "Carry-alls and little extras",
    text: "Bags, shades and a wallet that fits your pocket.",
    cta: "Shop accessories",
    href: "products.html?category=Accessories",
    art: [8, 9, 10],
    tint: 3,
  },
];

const MODES = [
  { id: "normal", label: "Normal" },
  { id: "bubblegum", label: "Bubblegum" },
  { id: "notebook", label: "Notebook" },
  { id: "cafe", label: "Café" },
  { id: "seaside", label: "Seaside" },
];
const DEFAULT_MODE = "normal";

const ART = {
  1: `<rect class="c1" x="18" y="46" width="64" height="40" rx="20"/><path d="M18 64h64"/><circle class="lt" cx="50" cy="64" r="4"/>
      <ellipse class="lt" cx="34" cy="26" rx="10" ry="12"/><path class="lt" d="M40 34v14"/><ellipse class="lt" cx="66" cy="26" rx="10" ry="12"/><path class="lt" d="M60 34v14"/>`,
  2: `<path class="c2" d="M36 6h28l3 24H33z"/><path class="c2" d="M33 70h34l-3 24H36z"/>
      <rect class="lt" x="26" y="26" width="48" height="48" rx="14"/><rect class="c3" x="33" y="33" width="34" height="34" rx="9"/>
      <path d="M50 41v10l7 5"/><path d="M74 44h4M74 56h4"/>`,
  3: `<path d="M34 24c0-12 32-12 32 0" fill="none"/><rect class="c3" x="12" y="26" width="76" height="50" rx="22"/>
      <g class="ink nostroke"><circle cx="32" cy="42" r="2.6"/><circle cx="42" cy="42" r="2.6"/><circle cx="32" cy="52" r="2.6"/><circle cx="42" cy="52" r="2.6"/><circle cx="32" cy="62" r="2.6"/><circle cx="42" cy="62" r="2.6"/></g>
      <circle class="c1" cx="68" cy="51" r="14"/><circle class="lt" cx="68" cy="51" r="5"/>`,
  4: `<rect class="c2" x="28" y="10" width="44" height="80" rx="12"/><rect class="lt" x="36" y="18" width="28" height="14" rx="5"/>
      <path class="c1" d="M53 40 40 62h9l-3 16 15-24h-9z"/>`,
  5: `<path class="c1" d="M34 14 12 28l9 18 13-6v46h32V40l13 6 9-18-22-14c-3 9-9 13-16 13s-13-4-16-13z"/><path class="thin" d="M34 14c3 9 9 13 16 13s13-4 16-13"/><rect class="lt thin" x="54" y="50" width="10" height="11" rx="2"/>`,
  6: `<path class="c3" d="M34 14 10 28l5 50 14-3 3-30v42h36V43l3 30 14 3 5-50-24-14-16 12z"/><path d="M50 26v62"/><path class="thin" d="M34 14l16 14 16-14"/>
      <rect class="lt thin" x="36" y="52" width="11" height="12" rx="2"/><rect class="lt thin" x="53" y="52" width="11" height="12" rx="2"/><circle class="c2 thin" cx="50" cy="42" r="2.4"/><circle class="c2 thin" cx="50" cy="56" r="2.4"/><circle class="c2 thin" cx="50" cy="70" r="2.4"/>`,
  7: `<path class="c1" d="M8 70c0-12 6-16 16-18l9-16 11 5c5 9 16 14 30 16 11 2 17 6 17 13v6H8z"/><path class="lt" d="M6 70h90v10a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z"/>
      <path class="thin" d="M36 42l5 6M44 46l5 6M52 50l5 6"/><path class="c2 thin" d="M62 58h24"/>`,
  8: `<path d="M38 28c0-18 24-18 24 0" fill="none"/><rect class="c3" x="22" y="24" width="56" height="66" rx="20"/><rect class="c1" x="30" y="56" width="40" height="28" rx="9"/><path d="M30 66h40"/><path class="thin" d="M44 74h12"/><path d="M22 52c-8 0-8 18 0 18M78 52c8 0 8 18 0 18" fill="none"/>`,
  9: `<rect class="ink" x="8" y="36" width="36" height="28" rx="13"/><rect class="ink" x="56" y="36" width="36" height="28" rx="13"/><path d="M44 44q6-6 12 0" fill="none"/><path d="M8 42 2 36M92 42l6-6" fill="none"/>
      <path d="M16 45l8-4M64 45l8-4" style="stroke: var(--art-light); stroke-width: 3"/>`,
  10: `<rect class="c2" x="12" y="26" width="76" height="52" rx="12"/><path d="M12 42h76" /><rect class="c1" x="62" y="48" width="30" height="18" rx="9"/><circle class="lt" cx="72" cy="57" r="3.2"/><path class="thin" d="M20 70h36" stroke-dasharray="3 4"/>`,
};

const productArt = (product) =>
  `<svg class="art" viewBox="0 0 100 100" aria-hidden="true" focusable="false">${ART[product.id] ?? ""}</svg>`;
