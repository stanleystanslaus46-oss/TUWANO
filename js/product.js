/**
 * TUWANO JEWELLERIES — Product Detail Page (PDP) Controller
 */

import { PRODUCTS, getProductById } from './products.js';
import { store } from './cart.js';
import { createProductWhatsAppUrl, WHATSAPP_NUMBERS } from './whatsapp.js';

export function initProductPage() {
  const container = document.getElementById('product-detail-view');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'tj-gold-001';
  let product = getProductById(productId);

  // Fallback if ID is invalid
  if (!product) {
    product = PRODUCTS[0];
  }

  // Update Page Title and OpenGraph dynamically
  document.title = `${product.name} | Tuwano Jewelleries`;

  // Render Breadcrumb
  const breadcrumbEl = document.getElementById('product-breadcrumbs');
  if (breadcrumbEl) {
    breadcrumbEl.innerHTML = `
      <a href="/">Home</a>
      <span class="sep">/</span>
      <a href="/shop.html">Shop</a>
      <span class="sep">/</span>
      <a href="/shop.html?category=${product.category.toLowerCase()}">${product.category}</a>
      <span class="sep">/</span>
      <span class="current">${product.name}</span>
    `;
  }

  let selectedStore = 'primary';
  const inWishlist = store.isInWishlist(product.id);

  container.innerHTML = `
    <div class="pdp-layout">
      <!-- Gallery Column (Sticky on Desktop) -->
      <div class="pdp-gallery">
        <div class="pdp-main-image-wrap">
          <img src="${product.images[0]}" alt="${product.name}" id="pdp-main-img" class="pdp-main-image" />
          <button type="button" class="pdp-zoom-indicator" aria-label="Click to examine full image">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </button>
        </div>

        ${product.images.length > 1 ? `
          <div class="pdp-thumbnails" role="tablist" aria-label="Product thumbnails">
            ${product.images.map((img, idx) => `
              <button type="button" class="pdp-thumb-btn ${idx === 0 ? 'active' : ''}" data-src="${img}" role="tab" aria-selected="${idx === 0}" aria-label="View view ${idx + 1}">
                <img src="${img}" alt="${product.name} angle ${idx + 1}" loading="lazy" />
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Purchase & Information Column -->
      <div class="pdp-info">
        <div class="pdp-header">
          <div class="pdp-kicker">
            <span>${product.category} Jewellery</span>
            <span class="dot">·</span>
            <span>${product.collection}</span>
            <span class="dot">·</span>
            <span class="ref-code">Ref: ${product.id}</span>
          </div>

          <h1 class="pdp-title">${product.name}</h1>
          <div class="pdp-price-row">
            <span class="pdp-price">${product.priceLabel}</span>
            <span class="pdp-availability-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              ${product.availability}
            </span>
          </div>
        </div>

        <div class="pdp-description">
          <p>${product.description}</p>
        </div>

        <!-- Store Consultation Selector -->
        <div class="pdp-store-selection">
          <label for="pdp-store-select" class="pdp-store-label">Consulting Boutique:</label>
          <div class="pdp-select-wrapper">
            <select id="pdp-store-select" class="pdp-select">
              <option value="madukani" ${selectedStore === 'madukani' ? 'selected' : ''}>Madukani Store (09:00 AM – 06:00 PM · 0679 323 647)</option>
              <option value="mori" ${selectedStore === 'mori' ? 'selected' : ''}>Mori Store (09:00 AM – 07:30 PM · 0652 562 875)</option>
            </select>
          </div>
        </div>

        <!-- Conversion Actions -->
        <div class="pdp-actions">
          <a href="${createProductWhatsAppUrl(product, 'madukani')}" id="pdp-wa-cta" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block btn-lg pdp-whatsapp-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            Enquire on WhatsApp
          </a>

          <div class="pdp-action-group">
            <button type="button" id="pdp-add-bag-btn" class="btn btn-secondary btn-block">
              Add to Selection Bag
            </button>
            <button type="button" id="pdp-wishlist-toggle" class="btn btn-icon ${inWishlist ? 'active' : ''}" aria-label="Save to Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Trust Badges & Boutique Guarantees -->
        <div class="pdp-trust-grid">
          <div class="pdp-trust-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <div>
              <strong>In-Store Viewing</strong>
              <span>Available daily at Madukani & Mori</span>
            </div>
          </div>
          <div class="pdp-trust-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <div>
              <strong>Hand-Selected Quality</strong>
              <span>Meticulously inspected fine precious metals</span>
            </div>
          </div>
        </div>

        <!-- Accordion Specifications -->
        <div class="pdp-accordion">
          <details class="pdp-accordion-item" open>
            <summary class="pdp-accordion-header">
              <span>Craftsmanship & Specifications</span>
              <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="pdp-accordion-content">
              <ul class="pdp-spec-list">
                ${product.details.map(d => `<li>${d}</li>`).join('')}
              </ul>
            </div>
          </details>

          <details class="pdp-accordion-item">
            <summary class="pdp-accordion-header">
              <span>Boutique Locations & Consultation</span>
              <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="pdp-accordion-content">
              <p>Experience this piece in person at our physical stores:</p>
              <div class="store-mini-card">
                <strong>Madukani Store</strong>
                <p>09:00 AM – 06:00 PM · Direct Tel: <a href="tel:0679323647">0679 323 647</a></p>
              </div>
              <div class="store-mini-card">
                <strong>Mori Store</strong>
                <p>09:00 AM – 07:30 PM · Direct Tel: <a href="tel:0652562875">0652 562 875</a></p>
              </div>
            </div>
          </details>

          <details class="pdp-accordion-item">
            <summary class="pdp-accordion-header">
              <span>Care & Longevity</span>
              <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="pdp-accordion-content">
              <p>Store individual pieces in soft lined compartments to prevent friction. Clean with a dry microfiber cloth and avoid direct contact with perfumes or abrasive chemicals. Complimentary ultrasonic cleaning available for clients at both Tuwano stores.</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  `;

  // Gallery Thumbnails Event
  const thumbs = container.querySelectorAll('.pdp-thumb-btn');
  const mainImg = container.querySelector('#pdp-main-img');
  thumbs.forEach(tb => {
    tb.addEventListener('click', () => {
      thumbs.forEach(b => b.classList.remove('active'));
      tb.classList.add('active');
      if (mainImg) mainImg.src = tb.dataset.src;
    });
  });

  // Store Select WhatsApp Updater
  const storeSelect = container.querySelector('#pdp-store-select');
  const waCta = container.querySelector('#pdp-wa-cta');
  if (storeSelect && waCta) {
    storeSelect.addEventListener('change', () => {
      waCta.href = createProductWhatsAppUrl(product, storeSelect.value);
    });
  }

  // Add to Bag Button
  const addBagBtn = container.querySelector('#pdp-add-bag-btn');
  if (addBagBtn) {
    addBagBtn.addEventListener('click', () => {
      store.addToCart(product.id, 1);
      addBagBtn.textContent = 'Added to Bag ✓';
      setTimeout(() => {
        addBagBtn.textContent = 'Add to Selection Bag';
      }, 1500);
    });
  }

  // Wishlist Toggle Button
  const wishBtn = container.querySelector('#pdp-wishlist-toggle');
  if (wishBtn) {
    wishBtn.addEventListener('click', () => {
      const added = store.toggleWishlist(product.id);
      wishBtn.classList.toggle('active', added);
      const icon = wishBtn.querySelector('svg');
      if (icon) icon.setAttribute('fill', added ? 'currentColor' : 'none');
    });
  }

  // Related Products Grid
  const relatedContainer = document.getElementById('related-products-grid');
  if (relatedContainer) {
    const related = PRODUCTS.filter(p => p.id !== product.id && (p.category === product.category || p.collection === product.collection)).slice(0, 4);
    if (related.length > 0) {
      relatedContainer.innerHTML = related.map(rel => `
        <article class="product-card" data-id="${rel.id}">
          <div class="product-card-media">
            <a href="/product.html?id=${rel.id}" class="product-card-link" aria-label="${rel.name}">
              <img src="${rel.images[0]}" alt="${rel.name}" class="product-card-img" loading="lazy" />
            </a>
          </div>
          <div class="product-card-body">
            <div class="product-card-meta">
              <span class="product-card-category">${rel.category} · ${rel.collection}</span>
            </div>
            <h3 class="product-card-title">
              <a href="/product.html?id=${rel.id}">${rel.name}</a>
            </h3>
            <div class="product-card-footer">
              <span class="product-card-price">${rel.priceLabel}</span>
            </div>
          </div>
        </article>
      `).join('');
    }
  }
}
