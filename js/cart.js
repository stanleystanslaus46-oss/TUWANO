/**
 * TUWANO JEWELLERIES — Cart & Wishlist State Engine
 * Robust localStorage persistence with WhatsApp conversion checkout.
 */

import { getProductById } from './products.js';
import { createCartWhatsAppUrl } from './whatsapp.js';
import { refreshLucideIcons } from './main.js';

const CART_STORAGE_KEY = 'tuwano_jewelleries_cart_v1';
const WISHLIST_STORAGE_KEY = 'tuwano_jewelleries_wishlist_v1';

class StoreState {
  constructor() {
    this.cart = this.load(CART_STORAGE_KEY, []);
    this.wishlist = this.load(WISHLIST_STORAGE_KEY, []);
    this.listeners = new Set();
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  // --- Cart Operations ---
  addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return;

    const existingIndex = this.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.images[0],
        priceLabel: product.priceLabel,
        quantity: Math.max(1, quantity)
      });
    }

    this.save(CART_STORAGE_KEY, this.cart);
    this.notify();
    return product;
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.save(CART_STORAGE_KEY, this.cart);
    this.notify();
  }

  updateQuantity(productId, newQty) {
    if (newQty <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const item = this.cart.find(i => i.id === productId);
    if (item) {
      item.quantity = newQty;
      this.save(CART_STORAGE_KEY, this.cart);
      this.notify();
    }
  }

  clearCart() {
    this.cart = [];
    this.save(CART_STORAGE_KEY, this.cart);
    this.notify();
  }

  getCartCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // --- Wishlist Operations ---
  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    let added = false;
    if (index > -1) {
      this.wishlist.splice(index, 1);
      added = false;
    } else {
      this.wishlist.push(productId);
      added = true;
    }
    this.save(WISHLIST_STORAGE_KEY, this.wishlist);
    this.notify();
    return added;
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  getWishlistCount() {
    return this.wishlist.length;
  }
}

export const store = new StoreState();

/**
 * Initializes and updates Cart Drawer UI
 */
export function initCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  const closeBtn = document.getElementById('cart-close-btn');
  const cartBadges = document.querySelectorAll('.cart-count-badge');
  const cartItemsContainer = document.getElementById('cart-drawer-items');
  const cartEmptyState = document.getElementById('cart-empty-state');
  const cartFooter = document.getElementById('cart-drawer-footer');
  const cartWaBtn = document.getElementById('cart-whatsapp-checkout-btn');
  const storeSelector = document.getElementById('cart-store-select');

  function render() {
    const count = store.getCartCount();
    cartBadges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });

    if (!cartItemsContainer) return;

    if (store.cart.length === 0) {
      cartItemsContainer.innerHTML = '';
      if (cartEmptyState) cartEmptyState.style.display = 'flex';
      if (cartFooter) cartFooter.style.display = 'none';
      return;
    }

    if (cartEmptyState) cartEmptyState.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';

    cartItemsContainer.innerHTML = store.cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" class="cart-item-img" loading="lazy" />` : `<span class="cart-item-img cart-item-img--placeholder" aria-hidden="true"><i data-lucide="image-off"></i></span>`}
        <div class="cart-item-details">
          <span class="cart-item-cat">${item.category}</span>
          <a href="/product.html?id=${item.id}" class="cart-item-title">${item.name}</a>
          <span class="cart-item-price">${item.priceLabel}</span>
          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button type="button" class="qty-btn minus" data-id="${item.id}" aria-label="Decrease quantity">
                <i data-lucide="minus"></i>
              </button>
              <span class="qty-value">${item.quantity}</span>
              <button type="button" class="qty-btn plus" data-id="${item.id}" aria-label="Increase quantity">
                <i data-lucide="plus"></i>
              </button>
            </div>
            <button type="button" class="cart-item-remove" data-id="${item.id}">Remove</button>
          </div>
        </div>
      </div>
    `).join('');

    refreshLucideIcons();

    // Update WhatsApp link
    if (cartWaBtn) {
      const selectedStore = storeSelector ? storeSelector.value : 'primary';
      cartWaBtn.href = createCartWhatsAppUrl(store.cart, selectedStore);
    }
  }

  // Event delegations inside drawer
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
      const plusBtn = e.target.closest('.qty-btn.plus');
      const minusBtn = e.target.closest('.qty-btn.minus');
      const removeBtn = e.target.closest('.cart-item-remove');

      if (plusBtn) {
        const id = plusBtn.dataset.id;
        const item = store.cart.find(i => i.id === id);
        if (item) store.updateQuantity(id, item.quantity + 1);
      } else if (minusBtn) {
        const id = minusBtn.dataset.id;
        const item = store.cart.find(i => i.id === id);
        if (item) store.updateQuantity(id, item.quantity - 1);
      } else if (removeBtn) {
        const id = removeBtn.dataset.id;
        store.removeFromCart(id);
      }
    });
  }

  if (storeSelector && cartWaBtn) {
    storeSelector.addEventListener('change', () => {
      cartWaBtn.href = createCartWhatsAppUrl(store.cart, storeSelector.value);
    });
  }

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.add('is-open');
      overlay.classList.add('is-visible');
      document.body.classList.add('lock-scroll');
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      document.body.classList.remove('lock-scroll');
    }
  }

  document.querySelectorAll('.open-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  store.subscribe(render);
  render();

  return { openDrawer, closeDrawer };
}
