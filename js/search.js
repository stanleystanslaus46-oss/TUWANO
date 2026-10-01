/**
 * TUWANO JEWELLERIES — Client-Side Search Engine
 * Instant indexing across names, categories, collections, and tags.
 */

import { searchProducts, PRODUCTS } from './products.js';

export function initSearchModal() {
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear-btn');
  const closeBtn = document.getElementById('search-close-btn');
  const resultsContainer = document.getElementById('search-results-list');
  const resultsSummary = document.getElementById('search-results-count');
  const emptyState = document.getElementById('search-empty-state');
  const popularContainer = document.getElementById('search-popular-tags');

  function openSearch() {
    if (!overlay) return;
    overlay.classList.add('is-open');
    document.body.classList.add('lock-scroll');
    setTimeout(() => {
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
    renderInitial();
  }

  function closeSearch() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.classList.remove('lock-scroll');
  }

  function renderInitial() {
    if (resultsSummary) resultsSummary.textContent = "Suggestions";
    if (emptyState) emptyState.style.display = 'none';
    if (resultsContainer) {
      // Show featured items initially
      const featured = PRODUCTS.filter(p => p.featured).slice(0, 4);
      resultsContainer.innerHTML = featured.map(product => renderResultItem(product)).join('');
    }
  }

  function renderResultItem(product) {
    return `
      <a href="/product.html?id=${product.id}" class="search-result-item">
        <img src="${product.images[0]}" alt="${product.name}" class="search-result-thumb" loading="lazy" />
        <div class="search-result-info">
          <span class="search-result-cat">${product.category} · ${product.collection}</span>
          <h4 class="search-result-title">${product.name}</h4>
          <span class="search-result-price">${product.priceLabel}</span>
        </div>
        <svg class="search-result-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    `;
  }

  function handleSearch(query) {
    const q = (query || '').trim();
    if (!q) {
      if (clearBtn) clearBtn.style.display = 'none';
      renderInitial();
      return;
    }

    if (clearBtn) clearBtn.style.display = 'block';

    const matches = searchProducts(q);

    if (resultsSummary) {
      resultsSummary.textContent = `${matches.length} result${matches.length === 1 ? '' : 's'} for "${q}"`;
    }

    if (matches.length === 0) {
      if (resultsContainer) resultsContainer.innerHTML = '';
      if (emptyState) {
        emptyState.style.display = 'block';
        emptyState.innerHTML = `
          <div class="search-no-results">
            <p>No jewellery found matching "<strong>${escapeHtml(q)}</strong>".</p>
            <span class="search-hint">Try searching for "Gold", "Silver", "Rings", "Chains", or "Earrings".</span>
          </div>
        `;
      }
    } else {
      if (emptyState) emptyState.style.display = 'none';
      if (resultsContainer) {
        resultsContainer.innerHTML = matches.map(p => renderResultItem(p)).join('');
      }
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Bind Openers
  document.querySelectorAll('.open-search-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (input) {
        input.value = '';
        input.focus();
        handleSearch('');
      }
    });
  }

  if (input) {
    input.addEventListener('input', (e) => {
      handleSearch(e.target.value);
    });
  }

  // Click on popular tag badges
  if (popularContainer) {
    popularContainer.addEventListener('click', (e) => {
      const tag = e.target.closest('.search-tag-chip');
      if (tag && input) {
        const text = tag.dataset.query || tag.textContent.trim();
        input.value = text;
        handleSearch(text);
      }
    });
  }

  // Keyboard escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('is-open')) {
      closeSearch();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeSearch();
    });
  }

  return { openSearch, closeSearch };
}
