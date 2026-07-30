(() => {
  'use strict';

  const A = window.AURENZA;
  const UI = window.AURENZA_UI;
  const params = new URLSearchParams(location.search);
  const validCategories = Object.keys(A.categories);
  const initialCategory = validCategories.includes(params.get('category')) ? params.get('category') : 'men';

  const state = {
    category: initialCategory,
    visible: 24,
    sort: params.get('sort') || 'new',
    density: UI.storageGet('aurenza_grid_density') || 'standard',
    search: params.get('search') || '',
    filters: {
      type: new Set(params.get('type') ? [params.get('type')] : []),
      color: new Set(),
      fit: new Set(),
      highlight: new Set(params.get('highlight') ? [params.get('highlight')] : [])
    }
  };

  const sortLabels = {
    new: 'New arrivals',
    recommended: 'Recommended',
    priceAsc: 'Price: low to high',
    priceDesc: 'Price: high to low',
    name: 'Name: A–Z'
  };

  const getBaseProducts = () => {
    const search = state.search.trim().toLowerCase();
    const source = search ? A.products : A.productsFor(state.category);
    if (!search) return source;
    return source.filter((product) =>
      [product.name, product.categoryLabel, product.type, product.color, product.material, product.badge]
        .join(' ').toLowerCase().includes(search)
    );
  };

  const getProducts = () => {
    let products = getBaseProducts().filter((product) => {
      const { type, color, fit, highlight } = state.filters;
      return (!type.size || type.has(product.type)) &&
        (!color.size || color.has(product.color)) &&
        (!fit.size || fit.has(product.fit)) &&
        (!highlight.size || highlight.has(product.badge));
    });

    products = [...products].sort((a, b) => {
      if (state.sort === 'priceAsc') return a.price - b.price;
      if (state.sort === 'priceDesc') return b.price - a.price;
      if (state.sort === 'name') return a.name.localeCompare(b.name);
      if (state.sort === 'recommended') return Number(b.editorial) - Number(a.editorial) || b.rating - a.rating;
      return b.createdRank - a.createdRank;
    });
    return products;
  };

  const renderShop = () => {
    const config = A.categories[state.category];
    const main = document.querySelector('#main');
    document.title = `${state.search ? `Search: ${state.search}` : config.label} — AURENZA`;

    main.innerHTML = `
      <section class="plp-intro">
        <p class="eyebrow">AURENZA / Collection</p>
        <h1>${state.search ? `Search: “${UI.escapeHTML(state.search)}”` : UI.escapeHTML(config.label)}</h1>
        <p>${state.search ? 'Pieces from across the house selected by your search.' : collectionCopy(state.category)}</p>
      </section>

      <nav class="category-navigation" aria-label="${UI.escapeHTML(config.label)} product categories">
        <a class="${state.filters.type.size === 0 ? 'is-active' : ''}" href="shop.html?category=${state.category}" aria-current="${state.filters.type.size === 0 ? 'page' : 'false'}">View all</a>
        ${config.types.map((type) => `<button type="button" class="${state.filters.type.has(type) ? 'is-active' : ''}" data-category-type="${UI.escapeHTML(type)}">${UI.escapeHTML(type)}</button>`).join('')}
      </nav>

      <section class="plp-catalog" aria-labelledby="catalog-heading">
        <h2 class="sr-only" id="catalog-heading">Product catalog</h2>
        <div class="product-toolbar" data-product-toolbar>
          <p><span data-result-count>0</span> products</p>
          <div class="product-toolbar__actions">
            <button type="button" data-open-filters>Filters <span data-filter-count></span>${UI.ICONS.plus}</button>
            <button type="button" data-open-sort>Sort: <span data-sort-label>${sortLabels[state.sort]}</span>${UI.ICONS.chevron}</button>
            <div class="density-control" aria-label="Grid density">
              <button type="button" data-density="standard" class="${state.density === 'standard' ? 'is-active' : ''}" aria-label="Standard grid">${UI.ICONS.grid4}</button>
              <button type="button" data-density="editorial" class="${state.density === 'editorial' ? 'is-active' : ''}" aria-label="Large grid">${UI.ICONS.grid2}</button>
            </div>
          </div>
        </div>
        <div class="active-filters" data-active-filters hidden></div>
        <div class="product-grid product-grid--${state.density}" data-product-grid></div>
        <div class="load-more" data-load-more-wrap>
          <p><span data-visible-count>0</span> / <span data-total-count>0</span></p>
          <div class="load-more__line"><span data-progress-line></span></div>
          <button class="button button--outline" type="button" data-load-more>Show 24 more</button>
        </div>
      </section>
    `;

    wireShop();
    updateCatalog();
  };

  const collectionCopy = (category) => ({
    women: 'Silk, structure and luminous detail composed for a fearless modern wardrobe.',
    men: 'Precise tailoring, tactile knitwear and after-dark essentials for a new formality.',
    bags: 'Sculptural objects built around signature hardware and exacting leatherwork.',
    shoes: 'Decisive proportions and exceptional finishes from daylight to midnight.',
    accessories: 'The final gesture: house emblems, polished metal and purposeful design.',
    jewelry: 'Architectural adornment in gold-tone, crystal, enamel and sculpted forms.',
    lifestyle: 'A complete interior world shaped by pattern, ceremony and material richness.',
    gifts: 'Curated objects of affection, celebration and enduring house character.'
  }[category]);

  const updateCatalog = () => {
    const products = getProducts();
    const visible = products.slice(0, state.visible);
    const grid = document.querySelector('[data-product-grid]');
    const activeCount = Object.values(state.filters).reduce((sum, set) => sum + set.size, 0);

    grid.className = `product-grid product-grid--${state.density}`;
    grid.innerHTML = visible.length
      ? visible.map((product) => UI.productCard(product)).join('')
      : `<div class="empty-results"><h3>No pieces found</h3><p>Remove one or more filters to continue exploring.</p><button class="button button--black" type="button" data-clear-filters>Clear all filters</button></div>`;

    document.querySelector('[data-result-count]').textContent = products.length.toLocaleString();
    document.querySelector('[data-visible-count]').textContent = Math.min(visible.length, products.length).toLocaleString();
    document.querySelector('[data-total-count]').textContent = products.length.toLocaleString();
    document.querySelector('[data-filter-count]').textContent = activeCount ? `(${activeCount})` : '';
    document.querySelector('[data-sort-label]').textContent = sortLabels[state.sort];

    const progress = products.length ? Math.min(100, (visible.length / products.length) * 100) : 0;
    document.querySelector('[data-progress-line]').style.width = `${progress}%`;
    const loadWrap = document.querySelector('[data-load-more-wrap]');
    loadWrap.hidden = products.length === 0;
    const loadButton = document.querySelector('[data-load-more]');
    loadButton.hidden = visible.length >= products.length;

    renderActiveFilters();
    UI.announce(`${products.length} products shown.`);
  };

  const renderActiveFilters = () => {
    const host = document.querySelector('[data-active-filters]');
    const chips = [];
    Object.entries(state.filters).forEach(([group, values]) => {
      values.forEach((value) => chips.push(`<button type="button" data-remove-filter-group="${group}" data-remove-filter-value="${UI.escapeHTML(value)}">${UI.escapeHTML(value)} ${UI.ICONS.close}</button>`));
    });
    host.hidden = chips.length === 0;
    host.innerHTML = chips.length ? `${chips.join('')}<button class="active-filters__clear" type="button" data-clear-filters>Clear all</button>` : '';
  };

  const clearFilters = () => {
    Object.values(state.filters).forEach((set) => set.clear());
    state.visible = 24;
    updateCatalog();
  };

  const openFilters = (trigger) => {
    const products = getBaseProducts();
    const options = {
      color: [...new Set(products.map((p) => p.color))],
      type: [...new Set(products.map((p) => p.type))],
      fit: [...new Set(products.map((p) => p.fit))],
      highlight: [...new Set(products.map((p) => p.badge).filter(Boolean))]
    };
    const pending = Object.fromEntries(Object.entries(state.filters).map(([key, set]) => [key, new Set(set)]));

    const content = `
      <form class="filter-form" data-filter-form>
        ${filterGroup('type', 'Category', options.type, pending.type, products)}
        ${filterGroup('color', 'Color', options.color, pending.color, products, true)}
        ${filterGroup('fit', 'Fit', options.fit, pending.fit, products)}
        ${filterGroup('highlight', 'Highlights', options.highlight, pending.highlight, products)}
        <div class="filter-form__footer">
          <button class="text-button" type="button" data-reset-pending>Reset</button>
          <button class="button button--black" type="submit">Apply filters</button>
        </div>
      </form>`;

    const layer = UI.showDrawer({ title: 'Filters', content, id: 'filters-drawer', extraClass: 'filter-drawer' }, trigger);
    const form = layer.querySelector('[data-filter-form]');

    layer.querySelectorAll('.filter-accordion__toggle').forEach((button) => {
      button.addEventListener('click', () => {
        const section = button.closest('.filter-accordion');
        const open = section.classList.toggle('is-open');
        button.setAttribute('aria-expanded', String(open));
      });
    });

    form.addEventListener('change', (event) => {
      const input = event.target;
      if (!input.matches('input[type="checkbox"]')) return;
      const set = pending[input.dataset.group];
      input.checked ? set.add(input.value) : set.delete(input.value);
    });

    layer.querySelector('[data-reset-pending]').addEventListener('click', () => {
      Object.values(pending).forEach((set) => set.clear());
      form.querySelectorAll('input[type="checkbox"]').forEach((input) => { input.checked = false; });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      Object.entries(pending).forEach(([group, set]) => { state.filters[group] = new Set(set); });
      state.visible = 24;
      UI.closeLayer();
      updateCatalog();
      document.querySelector('[data-product-toolbar]').scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  };

  const filterGroup = (group, label, values, selected, products, swatches = false) => `
    <section class="filter-accordion is-open">
      <button class="filter-accordion__toggle" type="button" aria-expanded="true"><span>${label}</span>${UI.ICONS.plus}</button>
      <div class="filter-accordion__content">
        ${values.map((value) => {
          const count = products.filter((product) => product[group === 'highlight' ? 'badge' : group] === value).length;
          const color = A.colors.find((item) => item.name === value);
          return `<label class="filter-option">
            <input type="checkbox" data-group="${group}" value="${UI.escapeHTML(value)}" ${selected.has(value) ? 'checked' : ''} />
            <span class="filter-option__box"></span>
            ${swatches && color ? `<i style="--swatch:${color.hex}"></i>` : ''}
            <span>${UI.escapeHTML(value)}</span><small>${count}</small>
          </label>`;
        }).join('')}
      </div>
    </section>`;

  const openSort = (trigger) => {
    const content = `
      <form class="sort-form" data-sort-form>
        ${Object.entries(sortLabels).map(([value, label]) => `<label><input type="radio" name="sort" value="${value}" ${state.sort === value ? 'checked' : ''} /><span>${label}</span></label>`).join('')}
        <button class="button button--black button--full" type="submit">Apply sort</button>
      </form>`;
    const layer = UI.showModal({ title: 'Sort products', content, id: 'sort-modal', extraClass: 'sort-modal' }, trigger);
    layer.querySelector('[data-sort-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      state.sort = new FormData(event.currentTarget).get('sort');
      state.visible = 24;
      UI.closeLayer();
      updateCatalog();
    });
  };

  const wireShop = () => {
    document.querySelectorAll('[data-category-type]').forEach((button) => {
      button.addEventListener('click', () => {
        const type = button.dataset.categoryType;
        if (state.filters.type.has(type)) state.filters.type.delete(type);
        else {
          state.filters.type.clear();
          state.filters.type.add(type);
        }
        state.visible = 24;
        document.querySelectorAll('[data-category-type]').forEach((item) => item.classList.toggle('is-active', state.filters.type.has(item.dataset.categoryType)));
        document.querySelector('.category-navigation a').classList.toggle('is-active', state.filters.type.size === 0);
        updateCatalog();
      });
    });

    document.querySelector('[data-open-filters]').addEventListener('click', (event) => openFilters(event.currentTarget));
    document.querySelector('[data-open-sort]').addEventListener('click', (event) => openSort(event.currentTarget));
    document.querySelector('[data-load-more]').addEventListener('click', () => {
      state.visible += 24;
      updateCatalog();
      const cards = document.querySelectorAll('.product-card');
      cards[Math.max(0, state.visible - 24)]?.querySelector('a')?.focus({ preventScroll: true });
    });

    document.querySelectorAll('[data-density]').forEach((button) => button.addEventListener('click', () => {
      state.density = button.dataset.density;
      UI.storageSet('aurenza_grid_density', state.density);
      document.querySelectorAll('[data-density]').forEach((item) => item.classList.toggle('is-active', item.dataset.density === state.density));
      updateCatalog();
    }));

    document.querySelector('[data-active-filters]').addEventListener('click', (event) => {
      const remove = event.target.closest('[data-remove-filter-value]');
      if (remove) {
        state.filters[remove.dataset.removeFilterGroup].delete(remove.dataset.removeFilterValue);
        state.visible = 24;
        updateCatalog();
        return;
      }
      if (event.target.closest('[data-clear-filters]')) clearFilters();
    });

    document.querySelector('[data-product-grid]').addEventListener('click', (event) => {
      if (event.target.closest('[data-clear-filters]')) clearFilters();
    });
  };

  document.addEventListener('DOMContentLoaded', renderShop);
})();
