/**
 * TUWANO JEWELLERIES — Global Site Controller
 * Orchestrates navigation, drawers, sticky headers, wishlist modal, and micro-interactions.
 */

import { initCartDrawer, store } from './cart.js';
import { initSearchModal } from './search.js';
import { getProductById } from './products.js';
import { createCartWhatsAppUrl } from './whatsapp.js';

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initCartDrawer();
  initSearchModal();
  initWishlistDrawer();
  initScrollAnimations();
});

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

  // Close nav when clicking links inside drawer
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
