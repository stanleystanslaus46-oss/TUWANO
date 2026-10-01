/**
 * TUWANO JEWELLERIES — Catalogue Filter, Sort & Quick View Engine
 */

import { PRODUCTS } from './products.js';
import { store } from './cart.js';
import { createProductWhatsAppUrl } from './whatsapp.js';

export function initShopPage(defaultCategory = null) {
  const grid = document.getElementById('shop-product-grid');
  const countEl = document.getElementById('shop-product-count');
  const sortSelect = document.getElementById('shop-sort-select');
  const filterButtons = document.querySelectorAll('.shop-filter-btn');
  const activeFilterLabel = document.getElementById('shop-active-filter-label');

  // Read URL query params: ?category=gold or ?sort=name-asc
  const urlParams = new URLSearchParams(window.location.search);
  let activeFilter = urlParams.get('category') || defaultCategory || 'all';
  let activeSort = urlParams.get('sort') || 'featured';

  // Mark active filter button
  filterButtons.forEach(btn => {
    const filterKey = btn.dataset.filter;
    if (filterKey) {
      if (filterKey === activeFilter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }

      if (btn.tagName === 'BUTTON') {
        btn.addEventListener('click', () => {
          filterButtons.forEach(b => {
            if (b.tagName === 'BUTTON') b.classList.remove('active');
          });
          btn.classList.add('active');
          activeFilter = filterKey;
          
          // Update URL without reload
          const newUrl = new URL(window.location);
          if (activeFilter === 'all') {
            newUrl.searchParams.delete('category');
          } else {
            newUrl.searchParams.set('category', activeFilter);
          }
          window.history.replaceState({}, '', newUrl);

          render();
        });
      }
    }
  });

  if (sortSelect) {
    sortSelect.value = activeSort;
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      render();
    });
  }

  function getFilteredAndSorted() {
    let list = [...PRODUCTS];

    if (activeFilter !== 'all') {
      const f = activeFilter.toLowerCase();
      list = list.filter(p => 
        p.category.toLowerCase() === f ||
        p.collection.toLowerCase() === f ||
        p.tags.some(t => t.toLowerCase() === f)
      );
    }

    // Sort
    switch (activeSort) {
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return list;
  }

  function render() {
    if (!grid) return;

    const items = getFilteredAndSorted();

    if (countEl) {
      countEl.textContent = `${items.length} Piece${items.length === 1 ? '' : 's'}`;
    }

    if (activeFilterLabel) {
      activeFilterLabel.textContent = activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1);
    }

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="shop-empty">
          <p>No jewellery found under this category.</p>
          <button type="button" class="btn btn-secondary reset-filter-btn" style="margin-top: 1rem;">View All Jewellery</button>
        </div>
      `;
      const resetBtn = grid.querySelector('.reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          activeFilter = 'all';
          filterButtons.forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
          render();
        });
      }
      return;
    }

    grid.innerHTML = items.map(product => {
      const inWishlist = store.isInWishlist(product.id);
      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-card-media">
            <a href="/product.html?id=${product.id}" class="product-card-link" aria-label="${product.name}">
              <img src="${product.images[0]}" alt="${product.name}" class="product-card-img primary" loading="lazy" />
              ${product.images[1] ? `<img src="${product.images[1]}" alt="${product.name} detail" class="product-card-img secondary" loading="lazy" />` : ''}
            </a>
            
            <button type="button" class="wishlist-btn ${inWishlist ? 'active' : ''}" data-id="${product.id}" aria-label="${inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.6">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>

            <button type="button" class="quick-view-btn" data-id="${product.id}">
              Quick View
            </button>
          </div>

          <div class="product-card-body">
            <div class="product-card-meta">
              <span class="product-card-category">${product.category} · ${product.collection}</span>
              ${product.featured ? '<span class="product-card-tag">Signature</span>' : ''}
            </div>
            
            <h3 class="product-card-title">
              <a href="/product.html?id=${product.id}">${product.name}</a>
            </h3>

            <div class="product-card-footer">
              <span class="product-card-price">${product.priceLabel}</span>
              <a href="${createProductWhatsAppUrl(product, 'primary')}" target="_blank" rel="noopener noreferrer" class="product-card-wa-link" title="Enquire on WhatsApp">
                <span class="wa-text">Enquire</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  render();
}
