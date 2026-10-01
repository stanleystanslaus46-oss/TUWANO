/**
 * TUWANO JEWELLERIES — Product Detail Page (PDP) Controller
 */

import { PRODUCTS, getProductById } from './products.js';
import { store } from './cart.js';
import { createProductWhatsAppUrl, WHATSAPP_NUMBERS } from './whatsapp.js';
import { refreshLucideIcons } from './main.js';

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
            <i data-lucide="zoom-in"></i>
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
              <i data-lucide="check" style="width: 13px; height: 13px; stroke-width: 2.2;"></i>
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
            <img src="https://cdn.simpleicons.org/whatsapp/25D366" class="social-brand-icon" alt="" aria-hidden="true" />
            Enquire on WhatsApp
          </a>

          <div class="pdp-action-group">
            <button type="button" id="pdp-add-bag-btn" class="btn btn-secondary btn-block">
              Add to Selection Bag
            </button>
            <button type="button" id="pdp-wishlist-toggle" class="btn btn-icon ${inWishlist ? 'active' : ''}" aria-label="Save to Wishlist">
              <i data-lucide="heart"></i>
            </button>
          </div>
        </div>

        <!-- Boutique Services -->
        <div class="pdp-trust-grid">
          <div class="pdp-trust-item">
            <i data-lucide="clock"></i>
            <div>
              <strong>In-Store Viewing</strong>
              <span>Available daily at Madukani & Mori</span>
            </div>
          </div>
          <div class="pdp-trust-item">
            <i data-lucide="sparkles"></i>
            <div>
              <strong>Authentic Metals</strong>
              <span>Selected fine gold and sterling silver</span>
            </div>
          </div>
        </div>

        <!-- Accordion Specifications -->
        <div class="pdp-accordion">
          <details class="pdp-accordion-item" open>
            <summary class="pdp-accordion-header">
              <span>Craftsmanship & Specifications</span>
              <i data-lucide="chevron-down" class="chevron"></i>
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
              <i data-lucide="chevron-down" class="chevron"></i>
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
              <i data-lucide="chevron-down" class="chevron"></i>
            </summary>
            <div class="pdp-accordion-content">
              <p>Store individual pieces in soft lined compartments to prevent friction. Clean with a dry microfiber cloth and avoid direct contact with perfumes or abrasive chemicals. Visit our Madukani or Mori stores for personalized jewellery care guidance.</p>
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

  refreshLucideIcons();
}
