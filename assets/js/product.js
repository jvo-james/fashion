(() => {
  'use strict';

  const A = window.AURENZA;
  const UI = window.AURENZA_UI;
  const params = new URLSearchParams(location.search);
  const product = A.findProduct(params.get('id'));
  const requiresSize = !product.sizes.includes('ONE SIZE');
  const state = { size: requiresSize ? '' : 'ONE SIZE', quantity: 1, galleryIndex: 0 };

  const renderProduct = () => {
    document.title = `${product.name} — AURENZA`;
    const main = document.querySelector('#main');
    const family = A.productsFor(product.category).filter((item) => item.type === product.type && item.id !== product.id).slice(0, 4);
    const matching = A.productsFor(product.category === 'men' ? 'accessories' : product.category === 'women' ? 'shoes' : 'jewelry').slice(8, 12);

    main.innerHTML = `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="index.html">Home</a><span>/</span>
        <a href="shop.html?category=${product.category}">${UI.escapeHTML(product.categoryLabel)}</a><span>/</span>
        <a href="shop.html?category=${product.category}&type=${encodeURIComponent(product.type)}">${UI.escapeHTML(product.type)}</a><span>/</span>
        <span aria-current="page">${UI.escapeHTML(product.name)}</span>
      </nav>

      <section class="product-experience">
        <div class="product-gallery" aria-label="Product images">
          ${product.images.map((image, index) => `
            <button class="product-gallery__item" type="button" data-gallery-image="${index}" aria-label="Open image ${index + 1} of ${product.images.length}">
              <img src="${image}" alt="${UI.escapeHTML(product.name)}, ${galleryAlt(index)}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />
              <span class="product-gallery__zoom">${UI.ICONS.plus}</span>
            </button>`).join('')}
          <div class="mobile-gallery-pagination" aria-hidden="true"><span data-mobile-gallery-index>1</span> / ${product.images.length}</div>
        </div>

        <aside class="purchase-panel" aria-labelledby="product-title">
          <div class="purchase-panel__topline">
            <p class="product-status">${UI.escapeHTML(product.badge || 'House Collection')}</p>
            <button class="icon-button product-wishlist ${UI.state.wishlist.includes(product.id) ? 'is-active' : ''}" type="button" data-wishlist="${product.id}" aria-pressed="${UI.state.wishlist.includes(product.id)}" aria-label="Add to wishlist">${UI.ICONS.heart}</button>
          </div>
          <h1 id="product-title">${UI.escapeHTML(product.name)}</h1>
          <p class="product-style">Style ${UI.escapeHTML(product.style)}</p>
          <div class="product-price"><strong>${A.formatPrice(product.price)}</strong>${product.compareAt ? `<s>${A.formatPrice(product.compareAt)}</s>` : ''}</div>
          <p class="tax-note">Taxes and duties included for prototype checkout.</p>

          <section class="purchase-group color-group" aria-labelledby="color-heading">
            <div class="purchase-group__heading"><h2 id="color-heading">Color: ${UI.escapeHTML(product.color)}</h2></div>
            <div class="color-swatches" role="radiogroup" aria-label="Color">
              <a class="color-swatch is-selected" href="product.html?id=${product.id}" role="radio" aria-checked="true" title="${UI.escapeHTML(product.color)}"><img src="${product.image}" alt="${UI.escapeHTML(product.color)}" /></a>
              ${family.slice(0, 3).map((item) => `<a class="color-swatch" href="product.html?id=${item.id}" role="radio" aria-checked="false" title="${UI.escapeHTML(item.color)}"><img src="${item.image}" alt="${UI.escapeHTML(item.color)}" /></a>`).join('')}
            </div>
          </section>

          ${requiresSize ? `
            <fieldset class="purchase-group size-fieldset product-size-fieldset">
              <div class="purchase-group__heading"><legend>Select size</legend><button class="text-link-inline" type="button" data-size-guide>Size guide</button></div>
              <div class="size-grid">${product.sizes.map((size, index) => `<label class="${index === product.sizes.length - 1 && product.stock < 8 ? 'is-unavailable' : ''}"><input type="radio" name="product-size" value="${size}" ${index === product.sizes.length - 1 && product.stock < 8 ? 'disabled' : ''} /><span>${size}</span></label>`).join('')}</div>
              <p class="form-error" data-product-size-error hidden>Please select a size.</p>
            </fieldset>` : ''}

          <div class="stock-row"><span class="stock-dot"></span><span>${product.stock < 6 ? 'Low availability' : 'Available for immediate dispatch'}</span></div>

          <div class="purchase-actions">
            <div class="quantity-control" aria-label="Quantity">
              <button type="button" data-qty-minus aria-label="Decrease quantity">${UI.ICONS.minus}</button>
              <output data-quantity>1</output>
              <button type="button" data-qty-plus aria-label="Increase quantity">${UI.ICONS.plus}</button>
            </div>
            <button class="button button--black add-to-bag" type="button" data-add-product>Add to atelier bag</button>
          </div>

          <button class="matching-link" type="button" data-scroll-matching>View matching styles ${UI.ICONS.arrow}</button>

          <div class="service-rows">
            <button type="button" data-product-details><span>Product details</span>${UI.ICONS.plus}</button>
            <button type="button" data-shipping><span>Packaging, shipping & returns</span>${UI.ICONS.plus}</button>
            <button type="button" data-open-contact><span>Contact clienteling</span>${UI.ICONS.plus}</button>
            <button type="button" data-boutique><span>Find in boutique</span>${UI.ICONS.plus}</button>
          </div>
        </aside>
      </section>

      <section class="product-story">
        <div class="product-story__copy">
          <p class="eyebrow">The atelier note</p>
          <h2>Precision with presence</h2>
          <p>${UI.escapeHTML(product.description)}</p>
          <ul>${product.details.slice(0, 4).map((detail) => `<li>${UI.escapeHTML(detail)}</li>`).join('')}</ul>
        </div>
        <div class="product-story__image"><img src="${product.image2}" alt="Detail view of ${UI.escapeHTML(product.name)}" loading="lazy" decoding="async" /></div>
      </section>

      <section class="shop-look" id="shop-the-look" aria-labelledby="shop-look-title">
        <header class="section-heading"><div><p class="eyebrow">Curated pairing</p><h2 id="shop-look-title">Complete the Look</h2></div><a class="text-link" href="shop.html?category=${matching[0].category}">View all ${UI.ICONS.arrow}</a></header>
        <div class="shop-look__rail">${matching.map((item) => UI.productCard(item)).join('')}</div>
      </section>

      <div class="mobile-purchase-bar" data-mobile-purchase-bar>
        <div><span>${UI.escapeHTML(product.name)}</span><strong>${A.formatPrice(product.price)}</strong></div>
        <button class="button button--black" type="button" data-mobile-add>Add to bag</button>
      </div>
    `;

    wireProduct();
  };

  const galleryAlt = (index) => ['front view', 'alternate styling', 'detail view', 'atelier detail'][index] || `view ${index + 1}`;

  const addProduct = (trigger) => {
    if (requiresSize && !state.size) {
      const error = document.querySelector('[data-product-size-error]');
      error.hidden = false;
      document.querySelector('input[name="product-size"]')?.focus();
      UI.announce('Please select a size.');
      document.querySelector('.product-size-fieldset')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    trigger.disabled = true;
    const original = trigger.textContent;
    trigger.textContent = 'Adding…';
    setTimeout(() => {
      UI.addToCart(product.id, { size: state.size, quantity: state.quantity });
      trigger.disabled = false;
      trigger.textContent = original;
    }, 360);
  };

  const openProductDetails = (trigger) => {
    const content = `
      <div class="drawer-tabs" role="tablist"><button class="is-active" type="button" data-details-tab="details">Product details</button><button type="button" data-details-tab="care">Care</button></div>
      <div data-details-panel="details">
        <p class="drawer-lead">${UI.escapeHTML(product.description)}</p>
        <ul class="detail-list">${product.details.map((detail) => `<li>${UI.escapeHTML(detail)}</li>`).join('')}</ul>
        <dl class="product-specs"><div><dt>Material</dt><dd>${UI.escapeHTML(product.material)}</dd></div><div><dt>Fit</dt><dd>${UI.escapeHTML(product.fit)}</dd></div><div><dt>Color</dt><dd>${UI.escapeHTML(product.color)}</dd></div><div><dt>Item</dt><dd>${UI.escapeHTML(product.style)}</dd></div></dl>
      </div>
      <div data-details-panel="care" hidden>
        <p class="drawer-lead">Preserve the shape, finish and signature hardware by following specialist care.</p>
        <ul class="detail-list"><li>Store away from direct light and humidity</li><li>Use a professional luxury-garment cleaner</li><li>Protect hardware from perfume and cosmetic contact</li><li>Keep in the provided AURENZA dust cover</li></ul>
      </div>`;
    const layer = UI.showDrawer({ title: 'Product Information', content, id: 'product-details-drawer' }, trigger);
    layer.querySelectorAll('[data-details-tab]').forEach((button) => button.addEventListener('click', () => {
      layer.querySelectorAll('[data-details-tab]').forEach((tab) => tab.classList.toggle('is-active', tab === button));
      layer.querySelectorAll('[data-details-panel]').forEach((panel) => { panel.hidden = panel.dataset.detailsPanel !== button.dataset.detailsTab; });
    }));
  };

  const openShipping = (trigger) => UI.showDrawer({
    title: 'Packaging, Shipping & Returns', id: 'shipping-drawer', content: `
      <div class="packaging-image"><img src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=1200&q=86" alt="AURENZA signature packaging" /></div>
      <div class="service-copy"><p class="eyebrow">Signature packaging</p><h3>Made for the ritual of receiving</h3><p>Every order is wrapped in patterned tissue and presented in a matte black FSC-certified box with a hand-finished ribbon.</p></div>
      <div class="service-copy"><p class="eyebrow">Complimentary express shipping</p><h3>Worldwide delivery</h3><p>Prototype orders include complimentary express delivery and tracking. Delivery timing depends on destination.</p></div>
      <div class="service-copy"><p class="eyebrow">Returns</p><h3>30-day return window</h3><p>Unworn pieces may be returned with original tags and packaging within 30 days.</p></div>`
  }, trigger);

  const openBoutique = (trigger) => {
    const content = `
      <div class="boutique-product"><img src="${product.image}" alt="${UI.escapeHTML(product.name)}" /><div><strong>${UI.escapeHTML(product.name)}</strong><span>${UI.escapeHTML(product.style)}</span><span>${UI.escapeHTML(product.color)}</span></div></div>
      <form class="boutique-form" data-boutique-form>
        ${requiresSize ? `<label><span>Size</span><select required><option value="">Select size</option>${product.sizes.map((size) => `<option>${size}</option>`).join('')}</select></label>` : ''}
        <label><span>Country</span><select><option>Ghana</option><option>Nigeria</option><option>United Kingdom</option><option>United States</option><option>France</option><option>Italy</option></select></label>
        <label><span>City or postcode</span><input required placeholder="Accra, London, 10001…" /></label>
        <button class="button button--outline button--full" type="button" data-find-location>${UI.ICONS.location} Find my location</button>
        <button class="button button--black button--full" type="submit">Search boutiques</button>
      </form>
      <div class="boutique-results" data-boutique-results hidden></div>`;
    const layer = UI.showDrawer({ title: 'Find in Boutique', content, id: 'boutique-drawer', extraClass: 'boutique-drawer' }, trigger);
    layer.querySelector('[data-find-location]').addEventListener('click', (event) => {
      event.currentTarget.textContent = 'Location request simulated';
      UI.toast('Browser location would be requested here.');
    });
    layer.querySelector('[data-boutique-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const results = layer.querySelector('[data-boutique-results]');
      results.hidden = false;
      results.innerHTML = `<p class="eyebrow">Nearest private appointment</p><article><h3>AURENZA Accra — The Gallery</h3><p>8 Independence Avenue · By appointment</p><span>Availability changes frequently and is confirmed by an advisor.</span><button class="button button--outline" type="button">Request appointment</button></article>`;
    });
  };

  const openSizeGuide = (trigger) => UI.showModal({
    title: 'Size Guide', id: 'size-guide-modal', content: `
      <p class="form-intro">AURENZA uses Italian sizing. Measurements are approximate garment-body equivalents.</p>
      <div class="size-table-wrap"><table class="size-table"><thead><tr><th>IT</th><th>UK</th><th>US</th><th>Chest / Bust</th></tr></thead><tbody>${product.sizes.map((size, index) => `<tr><td>${size}</td><td>${Math.max(4, Number(size) - 32 || index + 6)}</td><td>${Math.max(0, Number(size) - 36 || index + 2)}</td><td>${84 + index * 4} cm</td></tr>`).join('')}</tbody></table></div>`
  }, trigger);

  const openGallery = (startIndex, trigger) => {
    let index = startIndex;
    const content = `
      <div class="media-viewer" data-media-viewer>
        <div class="media-viewer__stage"><img data-viewer-image src="${product.images[index]}" alt="${UI.escapeHTML(product.name)}, ${galleryAlt(index)}" /></div>
        <div class="media-viewer__controls">
          <button class="icon-button" type="button" data-viewer-prev aria-label="Previous image">${UI.ICONS.arrow}</button>
          <span><b data-viewer-index>${index + 1}</b> / ${product.images.length}</span>
          <button class="icon-button" type="button" data-viewer-next aria-label="Next image">${UI.ICONS.arrow}</button>
        </div>
        <div class="media-viewer__thumbs">${product.images.map((image, thumbIndex) => `<button type="button" data-viewer-thumb="${thumbIndex}" class="${thumbIndex === index ? 'is-active' : ''}"><img src="${image}" alt="View ${thumbIndex + 1}" /></button>`).join('')}</div>
      </div>`;
    const layer = UI.showModal({ title: product.name, content, id: 'media-viewer-modal', extraClass: 'media-viewer-modal' }, trigger);
    const update = (next) => {
      index = (next + product.images.length) % product.images.length;
      const image = layer.querySelector('[data-viewer-image]');
      image.classList.add('is-changing');
      setTimeout(() => { image.src = product.images[index]; image.alt = `${product.name}, ${galleryAlt(index)}`; image.classList.remove('is-changing'); }, 120);
      layer.querySelector('[data-viewer-index]').textContent = index + 1;
      layer.querySelectorAll('[data-viewer-thumb]').forEach((button) => button.classList.toggle('is-active', Number(button.dataset.viewerThumb) === index));
    };
    layer.querySelector('[data-viewer-prev]').addEventListener('click', () => update(index - 1));
    layer.querySelector('[data-viewer-next]').addEventListener('click', () => update(index + 1));
    layer.querySelectorAll('[data-viewer-thumb]').forEach((button) => button.addEventListener('click', () => update(Number(button.dataset.viewerThumb))));
    layer.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') update(index - 1);
      if (event.key === 'ArrowRight') update(index + 1);
    });
  };

  const wireProduct = () => {
    document.querySelectorAll('[data-gallery-image]').forEach((button) => button.addEventListener('click', () => openGallery(Number(button.dataset.galleryImage), button)));

    document.querySelectorAll('input[name="product-size"]').forEach((input) => input.addEventListener('change', () => {
      state.size = input.value;
      document.querySelector('[data-product-size-error]').hidden = true;
    }));

    document.querySelector('[data-qty-minus]').addEventListener('click', () => {
      state.quantity = Math.max(1, state.quantity - 1);
      document.querySelector('[data-quantity]').textContent = state.quantity;
    });
    document.querySelector('[data-qty-plus]').addEventListener('click', () => {
      state.quantity = Math.min(product.stock, state.quantity + 1);
      document.querySelector('[data-quantity]').textContent = state.quantity;
    });

    document.querySelector('[data-add-product]').addEventListener('click', (event) => addProduct(event.currentTarget));
    document.querySelector('[data-mobile-add]').addEventListener('click', () => {
      if (requiresSize && !state.size) {
        document.querySelector('.product-size-fieldset').scrollIntoView({ behavior: 'smooth', block: 'center' });
        UI.toast('Select a size to continue.');
      } else addProduct(document.querySelector('[data-add-product]'));
    });

    document.querySelector('[data-product-details]').addEventListener('click', (event) => openProductDetails(event.currentTarget));
    document.querySelector('[data-shipping]').addEventListener('click', (event) => openShipping(event.currentTarget));
    document.querySelector('[data-boutique]').addEventListener('click', (event) => openBoutique(event.currentTarget));
    document.querySelector('[data-size-guide]')?.addEventListener('click', (event) => openSizeGuide(event.currentTarget));
    document.querySelector('[data-scroll-matching]').addEventListener('click', () => document.querySelector('#shop-the-look').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));

    const gallery = document.querySelector('.product-gallery');
    gallery.addEventListener('scroll', () => {
      if (window.innerWidth >= 768) return;
      const index = Math.round(gallery.scrollLeft / gallery.clientWidth);
      document.querySelector('[data-mobile-gallery-index]').textContent = index + 1;
    }, { passive: true });
  };

  document.addEventListener('DOMContentLoaded', renderProduct);
})();
