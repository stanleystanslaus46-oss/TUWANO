/**
 * TUWANO JEWELLERIES — Global Site Controller
 * Orchestrates navigation, drawers, sticky headers, wishlist modal, quick view, and micro-interactions.
 */

import { initCartDrawer, store } from './cart.js';
import { initSearchModal } from './search.js';
import { getProductById } from './products.js';
import { createCartWhatsAppUrl, createProductWhatsAppUrl } from './whatsapp.js';

const TUWANO_ICON_SVGS = {
  search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
  heart: '<path d="M20.8 8.6c0 5.5-8.8 10.4-8.8 10.4S3.2 14.1 3.2 8.6A4.6 4.6 0 0 1 12 6.3a4.6 4.6 0 0 1 8.8 2.3Z"></path>',
  'shopping-bag': '<path d="M6 8h12l1 13H5L6 8Z"></path><path d="M9 8a3 3 0 0 1 6 0"></path>',
  menu: '<path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path>',
  x: '<path d="M6 6l12 12"></path><path d="M18 6 6 18"></path>',
  house: '<path d="m3 10 9-7 9 7v10H3V10Z"></path><path d="M9 21v-6h6v6"></path>',
  'grid-2x2': '<rect x="4" y="4" width="6" height="6" rx="1"></rect><rect x="14" y="4" width="6" height="6" rx="1"></rect><rect x="4" y="14" width="6" height="6" rx="1"></rect><rect x="14" y="14" width="6" height="6" rx="1"></rect>',
  'arrow-left': '<path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path>'
};


const TUWANO_ICON_SVGS_EXTRA = {
  coins: '<circle cx="9" cy="9" r="5"></circle><circle cx="15" cy="15" r="5"></circle><path d="M9 6v6M6 9h6"></path>',
  gem: '<path d="m6 3 12 0 3 5-9 13L3 8 6 3Z"></path><path d="m3 8 18 0"></path><path d="m9 3 3 5 3-5"></path>',
  'circle-dot': '<circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="2"></circle>',
  link: '<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"></path><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"></path>',
  watch: '<rect x="7" y="6" width="10" height="12" rx="3"></rect><path d="M9 2h6v4H9zM9 18h6v4H9z"></path>',
  sparkles: '<path d="m12 3 1.2 5.8L19 10l-5.8 1.2L12 17l-1.2-5.8L5 10l5.8-1.2L12 3Z"></path><path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z"></path>',
  info: '<circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path>',
  'map-pin': '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9Z"></path>',
  'arrow-right': '<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path>'
};

function renderFallbackLucideIcons() {
  document.querySelectorAll('[data-lucide]').forEach((node) => {
    const name = node.getAttribute('data-lucide');
    const paths = TUWANO_ICON_SVGS[name] || TUWANO_ICON_SVGS_EXTRA[name];
    if (!paths || node.tagName.toLowerCase() === 'svg') return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.6');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('class', 'lucide lucide-' + name);
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = paths;
    node.replaceWith(svg);
  });
}

export function refreshLucideIcons() {
  if (typeof window === 'undefined') return;

  const render = () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({
        attrs: { 'stroke-width': 1.6 },
      });
    }
  };

  if (window.lucide) {
    render();
    return;
  }

  const loadLocalLucide = () => {
    if (window.lucide) {
      render();
      return;
    }

    const existingScript = document.querySelector('script[data-tuwano-lucide]');
    if (existingScript) return;

    const script = document.createElement('script');
    script.dataset.tuwanoLucide = 'true';
    script.src = new URL('js/vendor/lucide.min.js', document.baseURI).href;
    script.addEventListener('load', render, { once: true });
    script.addEventListener('error', () => {
      console.warn('TUWANO: Lucide icon library could not be loaded.');
    }, { once: true });
    document.head.appendChild(script);
  };

  const existingScript = document.querySelector('script[src*="lucide.min.js"]');
  if (existingScript) {
    existingScript.addEventListener('load', render, { once: true });
    existingScript.addEventListener('error', loadLocalLucide, { once: true });
    window.setTimeout(() => {
      if (window.lucide) render();
      else loadLocalLucide();
    }, 300);
    return;
  }

  loadLocalLucide();
  window.setTimeout(renderFallbackLucideIcons, 700);
}

function initApp() {
  refreshLucideIcons();
  window.setTimeout(renderFallbackLucideIcons, 900);
  initAroStyleHeroSlider();
  initStickyHeader();
  initMobileNav();
  initLuxuryChrome();
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
      toggleBtn.setAttribute('aria-label', 'Close navigation menu');
    }
  }

  function closeNav() {
    if (drawer && overlay) {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      document.body.classList.remove('lock-scroll');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Open navigation menu');
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', () => {
    if (drawer && drawer.classList.contains('is-open')) {
      closeNav();
    } else {
      openNav();
    }
  });
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

  if (closeBtn) {
    closeBtn.innerHTML = '<i data-lucide="arrow-left"></i>';
    closeBtn.setAttribute('aria-label', 'Back from saved pieces');
  }

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
        ${product.images[0] ? `<img src="${product.images[0]}" alt="${product.name}" class="wishlist-item-img" loading="lazy" />` : `<span class="wishlist-item-img wishlist-item-img--placeholder" aria-hidden="true"><i data-lucide="image-off"></i></span>`}
        <div class="wishlist-item-details">
          <span class="wishlist-item-cat">${product.category} · ${product.collection}</span>
          <a href="product.html?id=${product.id}" class="wishlist-item-title">${product.name}</a>
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
  refreshLucideIcons();
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
        ${product.images[0] ? `<img src="${product.images[0]}" alt="${product.name}" id="qv-main-img" class="qv-main-image" />` : `<div class="qv-image-placeholder" role="img" aria-label="Product photography not currently available"><i data-lucide="image-off"></i><span>Product photography coming soon</span></div>`}
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
            <img src="https://cdn.simpleicons.org/whatsapp/25D366" class="social-brand-icon" alt="" aria-hidden="true" />
            Enquire on WhatsApp
          </a>

          <div class="qv-secondary-actions">
            <button type="button" class="btn btn-secondary btn-block qv-add-bag" data-id="${product.id}">
              Add to Selection Bag
            </button>
            <a href="product.html?id=${product.id}" class="qv-view-full">
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


function initLuxuryChrome() {
  const header = document.querySelector('.site-header');
  // Keep the standard solid header on the homepage; the hero remains full-bleed below it.
  document.querySelector('.tuwano-announcement')?.remove();

  // GitHub Pages hosts this site at /TUWANO/. Normalize root-relative
  // internal links so navigation also works correctly on the deployed site.
  const basePath = '/TUWANO';
  document.querySelectorAll('a[href^="/"]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('//') || href.startsWith('/TUWANO/')) return;
    link.setAttribute('href', href === '/' ? basePath + '/' : basePath + href);
  });

  if (document.querySelector('.mobile-bottom-nav')) return;
  const nav = document.createElement('nav');
  nav.className = 'mobile-bottom-nav';
  nav.setAttribute('aria-label','Mobile quick navigation');
  nav.innerHTML = `<a href="./" data-mobile-nav="home"><i data-lucide="house"></i><span>Home</span></a><a href="shop.html" data-mobile-nav="shop"><i data-lucide="grid-2x2"></i><span>Shop</span></a><button type="button" data-mobile-nav="search"><i data-lucide="search"></i><span>Search</span></button><button type="button" data-mobile-nav="wishlist"><i data-lucide="heart"></i><span>Saved</span><span class="mobile-nav-badge wishlist-count-badge"></span></button><button type="button" data-mobile-nav="bag"><i data-lucide="shopping-bag"></i><span>Bag</span><span class="mobile-nav-badge cart-count-badge"></span></button>`;
  document.body.appendChild(nav);
  nav.querySelector('[data-mobile-nav="search"]')?.addEventListener('click',()=>document.querySelector('.open-search-btn')?.click());
  nav.querySelector('[data-mobile-nav="wishlist"]')?.addEventListener('click',()=>document.querySelector('.open-wishlist-btn')?.click());
  nav.querySelector('[data-mobile-nav="bag"]')?.addEventListener('click',()=>document.querySelector('.open-cart-btn')?.click());
  const path=window.location.pathname.toLowerCase();
  const active=path.endsWith('shop.html')||path.endsWith('gold.html')||path.endsWith('silver.html')||path.endsWith('rings.html')||path.endsWith('necklaces.html')||path.endsWith('bracelets.html')||path.endsWith('earrings.html')||path.endsWith('product.html')?'shop':'home';
  nav.querySelector(`[data-mobile-nav="${active}"]`)?.classList.add('is-active');
  refreshLucideIcons();
}

function initAroStyleHeroSlider() {
  const slider = document.querySelector('[data-hero-slider]');
  if (!slider || slider.dataset.ready === 'true') return;
  slider.dataset.ready = 'true';
  const slides = [...slider.querySelectorAll('[data-slide]')];
  const dots = [...slider.querySelectorAll('[data-slide-dot]')];
  if (slides.length < 2) return;
  let index = 0;
  let timer;

  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  };
  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => show(index + 1), 5500);
  };
  slider.querySelector('.hero-slider-prev')?.addEventListener('click', () => { show(index - 1); restart(); });
  slider.querySelector('.hero-slider-next')?.addEventListener('click', () => { show(index + 1); restart(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); restart(); }));
  slider.addEventListener('mouseenter', () => window.clearInterval(timer));
  slider.addEventListener('mouseleave', restart);
  slider.addEventListener('touchstart', () => window.clearInterval(timer), { passive: true });
  slider.addEventListener('touchend', restart, { passive: true });
  restart();
}
