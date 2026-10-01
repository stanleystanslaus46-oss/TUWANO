/**
 * TUWANO JEWELLERIES — Global Site Controller
 * Orchestrates navigation, drawers, sticky headers, wishlist modal, quick view, and micro-interactions.
 */

import { initCartDrawer, store } from './cart.js';
import { initSearchModal } from './search.js';
import { getProductById } from './products.js';
import { createCartWhatsAppUrl, createProductWhatsAppUrl } from './whatsapp.js';

export function refreshLucideIcons() {
  if (typeof window !== 'undefined' && window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons({
      attrs: {
        'stroke-width': 1.6,
      }
    });
  }
}

function initApp() {
  refreshLucideIcons();
  initStickyHeader();
  initMobileNav();
  initCartDrawer();
  initSearchModal();
  initWishlistDrawer();
  initGlobalQuickView();
  initGlobalWishlist();
  initScrollAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/**
 * Refined Sticky Header Scroll Behavior
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > 60) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

/**
 * Mobile Drawer Navigation
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');

  function openNav() {
    if (drawer && overlay) {
      drawer.classList.add('is-open');
      overlay.classList.add('is-visible');
      document.body.classList.add('lock-scroll');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    }
  }

  function closeNav() {
    if (drawer && overlay) {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      document.body.classList.remove('lock-scroll');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);
  if (overlay) overlay.addEventListener('click', closeNav);

  if (drawer) {
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      closeNav();
    }
  });
}

/**
 * Wishlist Drawer
 */
function initWishlistDrawer() {
  const drawer = document.getElementById('wishlist-drawer');
  const overlay = document.getElementById('wishlist-overlay');
  const closeBtn = document.getElementById('wishlist-close-btn');
  const wishlistBadges = document.querySelectorAll('.wishlist-count-badge');
  const itemsContainer = document.getElementById('wishlist-drawer-items');
  const emptyState = document.getElementById('wishlist-empty-state');
  const footer = document.getElementById('wishlist-drawer-footer');
  const enquiryBtn = document.getElementById('wishlist-whatsapp-btn');

  function render() {
    const count = store.getWishlistCount();
    wishlistBadges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });

    if (!itemsContainer) return;

    if (store.wishlist.length === 0) {
      itemsContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      if (footer) footer.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (footer) footer.style.display = 'block';

    const products = store.wishlist.map(id => getProductById(id)).filter(Boolean);

    itemsContainer.innerHTML = products.map(product => `
      <div class="wishlist-item" data-id="${product.id}">
        <img src="${product.images[0]}" alt="${product.name}" class="wishlist-item-img" loading="lazy" />
        <div class="wishlist-item-details">
          <span class="wishlist-item-cat">${product.category} · ${product.collection}</span>
          <a href="/product.html?id=${product.id}" class="wishlist-item-title">${product.name}</a>
          <span class="wishlist-item-price">${product.priceLabel}</span>
          <div class="wishlist-item-controls">
            <button type="button" class="btn btn-sm btn-secondary wishlist-move-bag" data-id="${product.id}">
              Add to Bag
            </button>
            <button type="button" class="wishlist-item-remove" data-id="${product.id}">
              Remove
            </button>
          </div>
        </div>
      </div>
    `).join('');

    if (enquiryBtn) {
      const itemsForEnquiry = products.map(p => ({ name: p.name, quantity: 1 }));
      enquiryBtn.href = createCartWhatsAppUrl(itemsForEnquiry, 'primary');
    }
  }

  if (itemsContainer) {
    itemsContainer.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.wishlist-item-remove');
      const moveBagBtn = e.target.closest('.wishlist-move-bag');

      if (removeBtn) {
        const id = removeBtn.dataset.id;
        store.toggleWishlist(id);
      } else if (moveBagBtn) {
        const id = moveBagBtn.dataset.id;
        store.addToCart(id, 1);
        moveBagBtn.textContent = 'In Bag ✓';
        setTimeout(() => {
          moveBagBtn.textContent = 'Add to Bag';
        }, 1200);
      }
    });
  }

  function openWishlist() {
    if (drawer && overlay) {
      drawer.classList.add('is-open');
      overlay.classList.add('is-visible');
      document.body.classList.add('lock-scroll');
    }
  }

  function closeWishlist() {
    if (drawer && overlay) {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      document.body.classList.remove('lock-scroll');
    }
  }

  document.querySelectorAll('.open-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openWishlist();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeWishlist);
  if (overlay) overlay.addEventListener('click', closeWishlist);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      closeWishlist();
    }
  });

  store.subscribe(render);
  render();
}

/**
 * Global Wishlist Click Delegation & Icon Syncing
 */
function initGlobalWishlist() {
  document.addEventListener('click', (e) => {
    const wishBtn = e.target.closest('.wishlist-btn');
    if (!wishBtn) return;
    e.preventDefault();
    const id = wishBtn.dataset.id;
    if (!id) return;
    const added = store.toggleWishlist(id);
    wishBtn.classList.toggle('active', added);
    const icon = wishBtn.querySelector('svg');
    if (icon) icon.setAttribute('fill', added ? 'currentColor' : 'none');
  });

  // Re-sync all wishlist icons on store update
  store.subscribe(() => {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const id = btn.dataset.id;
      if (id) {
        const inWishlist = store.isInWishlist(id);
        btn.classList.toggle('active', inWishlist);
        const icon = btn.querySelector('svg');
        if (icon) icon.setAttribute('fill', inWishlist ? 'currentColor' : 'none');
      }
    });
  });
}

/**
 * Global Quick View Dialog Handler
 */
export function openGlobalQuickView(productId) {
  const modal = document.getElementById('quick-view-modal');
  const overlay = document.getElementById('quick-view-overlay');
  const content = document.getElementById('quick-view-content');
  if (!modal || !content) return;

  const product = getProductById(productId);
  if (!product) return;

  const waUrl = createProductWhatsAppUrl(product, 'primary');

  content.innerHTML = `
    <div class="qv-grid">
      <div class="qv-gallery">
        <img src="${product.images[0]}" alt="${product.name}" id="qv-main-img" class="qv-main-image" />
        ${product.images.length > 1 ? `
          <div class="qv-thumbs">
            ${product.images.map((img, idx) => `
              <button type="button" class="qv-thumb-btn ${idx === 0 ? 'active' : ''}" data-src="${img}">
                <img src="${img}" alt="Thumbnail ${idx + 1}" />
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="qv-info">
        <div class="qv-header">
          <span class="qv-category">${product.category} · ${product.collection}</span>
          <h2 class="qv-title">${product.name}</h2>
          <div class="qv-price-badge">${product.priceLabel}</div>
          <p class="qv-availability">
            <i data-lucide="check" style="width: 14px; height: 14px; stroke-width: 2.2;"></i>
            ${product.availability}
          </p>
        </div>

        <p class="qv-description">${product.description}</p>

        <ul class="qv-details-list">
          ${product.details.map(d => `<li>${d}</li>`).join('')}
        </ul>

        <div class="qv-actions">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block qv-wa-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            Enquire on WhatsApp
          </a>

          <div class="qv-secondary-actions">
            <button type="button" class="btn btn-secondary btn-block qv-add-bag" data-id="${product.id}">
              Add to Selection Bag
            </button>
            <a href="/product.html?id=${product.id}" class="qv-view-full">
              View Full Product Details →
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Thumbnail switcher
  content.querySelectorAll('.qv-thumb-btn').forEach(tb => {
    tb.addEventListener('click', () => {
      content.querySelectorAll('.qv-thumb-btn').forEach(b => b.classList.remove('active'));
      tb.classList.add('active');
      const mainImg = content.querySelector('#qv-main-img');
      if (mainImg) mainImg.src = tb.dataset.src;
    });
  });

  // Add to bag
  const addBagBtn = content.querySelector('.qv-add-bag');
  if (addBagBtn) {
    addBagBtn.addEventListener('click', () => {
      store.addToCart(product.id, 1);
      addBagBtn.textContent = "Added to Bag ✓";
      setTimeout(() => {
        addBagBtn.textContent = "Add to Selection Bag";
      }, 1500);
    });
  }

  modal.classList.add('is-open');
  if (overlay) overlay.classList.add('is-visible');
  document.body.classList.add('lock-scroll');
  refreshLucideIcons();
}

function initGlobalQuickView() {
  const modal = document.getElementById('quick-view-modal');
  const overlay = document.getElementById('quick-view-overlay');
  const closeBtn = document.getElementById('quick-view-close');

  function close() {
    if (modal) modal.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.classList.remove('lock-scroll');
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      close();
    }
  });

  document.addEventListener('click', (e) => {
    const qvBtn = e.target.closest('.quick-view-btn');
    if (qvBtn) {
      e.preventDefault();
      const id = qvBtn.dataset.id;
      if (id) openGlobalQuickView(id);
    }
  });
}

/**
 * Scroll Reveal Animations using IntersectionObserver
 */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}
