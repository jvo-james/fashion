(() => {
  'use strict';

  const A = window.AURENZA;
  if (!A) throw new Error('AURENZA catalog failed to load.');

  const STORAGE = {
    cart: 'aurenza_cart_v1',
    wishlist: 'aurenza_wishlist_v1',
    announcement: 'aurenza_announcement_hidden_v1'
  };

  const ICONS = {
    menu: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18M3 17h18"/></svg>`,
    search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.7"/><path d="m16 16 5 5"/></svg>`,
    user: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 21c.7-4.4 3.2-6.6 7.5-6.6s6.8 2.2 7.5 6.6"/></svg>`,
    close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg>`,
    arrow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 6l6 6-6 6"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9 5 5 5-5"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.6 5.7c-1.9-2.1-5.1-2.2-7.1-.2L12 7l-1.5-1.5c-2-2-5.2-1.9-7.1.2-1.8 2-1.7 5 .3 6.9L12 21l8.3-8.4c2-1.9 2.1-4.9.3-6.9Z"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg>`,
    minus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16"/></svg>`,
    play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z"/></svg>`,
    pause: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>`,
    grid4: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/></svg>`,
    grid2: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h8v18H3zM13 3h8v18h-8z"/></svg>`,
    location: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-7.2 7-13a7 7 0 1 0-14 0c0 5.8 7 13 7 13Z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
    atelierBag: `<svg class="atelier-bag-icon" viewBox="0 0 28 28" aria-hidden="true"><path d="M7.5 10.5 4.8 24h18.4l-2.7-13.5Z"/><path d="M9.5 11V8.5a4.5 4.5 0 0 1 9 0V11"/><path d="m9.2 16.2 4.8-2.7 4.8 2.7-4.8 2.7-4.8-2.7Z"/></svg>`
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHTML = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));

  const storageGet = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const storageSet = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* Storage may be unavailable in hardened file previews. */ }
  };

  const parseJSON = (key, fallback) => {
    try {
      return JSON.parse(storageGet(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const state = {
    cart: parseJSON(STORAGE.cart, []),
    wishlist: parseJSON(STORAGE.wishlist, []),
    lastFocused: null,
    openLayer: null
  };

  const persist = () => {
    storageSet(STORAGE.cart, JSON.stringify(state.cart));
    storageSet(STORAGE.wishlist, JSON.stringify(state.wishlist));
  };

  const announce = (text) => {
    const region = $('#live-region');
    if (!region) return;
    region.textContent = '';
    requestAnimationFrame(() => { region.textContent = text; });
  };

  const cartQuantity = () => state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const setBodyLock = (locked) => {
    document.documentElement.classList.toggle('is-locked', locked);
    document.body.classList.toggle('is-locked', locked);
  };

  const focusable = (root) => $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', root)
    .filter((el) => !el.hasAttribute('hidden') && el.offsetParent !== null);

  const closeLayer = ({ restoreFocus = true } = {}) => {
    if (!state.openLayer) return;
    const layer = state.openLayer;
    layer.classList.remove('is-open');
    layer.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      layer.hidden = true;
      if (layer.dataset.ephemeral === 'true') layer.remove();
    }, 340);
    state.openLayer = null;
    setBodyLock(false);
    if (restoreFocus && state.lastFocused?.focus) state.lastFocused.focus({ preventScroll: true });
  };

  const openLayer = (layer, trigger = document.activeElement) => {
    if (state.openLayer && state.openLayer !== layer) closeLayer({ restoreFocus: false });
    state.lastFocused = trigger;
    state.openLayer = layer;
    layer.hidden = false;
    layer.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => layer.classList.add('is-open'));
    setBodyLock(true);
    setTimeout(() => focusable(layer)[0]?.focus({ preventScroll: true }), 30);
  };

  const layerShell = ({ id, title, content, type = 'drawer', side = 'right', extraClass = '' }) => `
    <section class="overlay-layer overlay-layer--${type} overlay-layer--${side} ${extraClass}" id="${id}" aria-hidden="true" hidden data-ephemeral="true">
      <button class="overlay-layer__backdrop" type="button" data-close-layer aria-label="Close ${escapeHTML(title)}"></button>
      <div class="overlay-layer__panel" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
        <header class="overlay-layer__header">
          <h2 id="${id}-title">${escapeHTML(title)}</h2>
          <button class="icon-button" type="button" data-close-layer aria-label="Close">${ICONS.close}</button>
        </header>
        <div class="overlay-layer__body">${content}</div>
      </div>
    </section>`;

  const showDrawer = ({ title, content, id = `drawer-${Date.now()}`, side = 'right', extraClass = '' }, trigger) => {
    const host = $('#global-overlays');
    host.insertAdjacentHTML('beforeend', layerShell({ id, title, content, side, extraClass }));
    const layer = $(`#${CSS.escape(id)}`);
    wireLayer(layer);
    openLayer(layer, trigger);
    return layer;
  };

  const showModal = ({ title, content, id = `modal-${Date.now()}`, extraClass = '' }, trigger) => {
    const host = $('#global-overlays');
    host.insertAdjacentHTML('beforeend', layerShell({ id, title, content, type: 'modal', side: 'center', extraClass }));
    const layer = $(`#${CSS.escape(id)}`);
    wireLayer(layer);
    openLayer(layer, trigger);
    return layer;
  };

  const wireLayer = (layer) => {
    layer.addEventListener('click', (event) => {
      if (event.target.closest('[data-close-layer]')) closeLayer();
    });
    layer.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeLayer();
      if (event.key !== 'Tab') return;
      const items = focusable(layer);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
  };

  const productCard = (product, options = {}) => {
    const wished = state.wishlist.includes(product.id);
    const density = options.compact ? ' product-card--compact' : '';
    return `
      <article class="product-card${density}" data-product-id="${product.id}">
        <div class="product-card__media">
          <a href="product.html?id=${product.id}" class="product-card__image-link" aria-label="${escapeHTML(product.name)}">
            <img class="product-card__image product-card__image--primary" src="${product.image}" alt="${escapeHTML(product.name)} in ${escapeHTML(product.color)}" loading="lazy" decoding="async" />
            <img class="product-card__image product-card__image--secondary" src="${product.image2}" alt="" loading="lazy" decoding="async" />
          </a>
          ${product.badge ? `<span class="product-card__badge">${escapeHTML(product.badge)}</span>` : ''}
          <button class="product-card__wish icon-button ${wished ? 'is-active' : ''}" type="button" data-wishlist="${product.id}" aria-pressed="${wished}" aria-label="${wished ? 'Remove from' : 'Add to'} wishlist">${ICONS.heart}</button>
          <button class="product-card__quick" type="button" data-quick-add="${product.id}" aria-label="Quick add ${escapeHTML(product.name)}">${ICONS.plus}<span>Quick add</span></button>
        </div>
        <div class="product-card__info">
          <a class="product-card__name" href="product.html?id=${product.id}">${escapeHTML(product.name)}</a>
          <p class="product-card__meta">${escapeHTML(product.color)} · ${escapeHTML(product.material)}</p>
          <div class="product-card__price-row">
            <span>${A.formatPrice(product.price)}</span>
            ${product.compareAt ? `<s>${A.formatPrice(product.compareAt)}</s>` : ''}
          </div>
        </div>
      </article>`;
  };

  const renderHeader = () => {
    const shell = $('#site-shell');
    const announcementHidden = storageGet(STORAGE.announcement) === '1';
    const categories = ['women', 'men', 'bags', 'shoes', 'accessories', 'jewelry', 'lifestyle', 'gifts'];
    const page = document.body.dataset.page;
    const activeCategory = new URLSearchParams(location.search).get('category');

    shell.innerHTML = `
      <header class="site-header ${announcementHidden ? 'site-header--no-announcement' : ''}">
        <div class="announcement" ${announcementHidden ? 'hidden' : ''}>
          <p>Complimentary worldwide delivery on orders over $750</p>
          <button class="icon-button" type="button" data-dismiss-announcement aria-label="Dismiss announcement">${ICONS.close}</button>
        </div>
        <div class="header-bar">
          <div class="header-bar__mobile-left">
            <button class="icon-button" type="button" data-open-mobile-nav aria-label="Open menu">${ICONS.menu}</button>
            <button class="icon-button" type="button" data-open-search aria-label="Search">${ICONS.search}</button>
          </div>
          <a href="index.html" class="brandmark" aria-label="AURENZA home">AURENZA</a>
          <nav class="desktop-nav" aria-label="Primary navigation">
            <a href="shop.html?category=women" class="nav-link ${activeCategory === 'women' ? 'is-active' : ''}" data-mega="women">Women</a>
            <a href="shop.html?category=men" class="nav-link ${activeCategory === 'men' ? 'is-active' : ''}" data-mega="men">Men</a>
            <a href="shop.html?category=bags" class="nav-link ${activeCategory === 'bags' ? 'is-active' : ''}" data-mega="bags">Bags</a>
            <a href="shop.html?category=shoes" class="nav-link ${activeCategory === 'shoes' ? 'is-active' : ''}" data-mega="shoes">Shoes</a>
            <a href="shop.html?category=accessories" class="nav-link ${activeCategory === 'accessories' ? 'is-active' : ''}" data-mega="accessories">Accessories</a>
            <a href="shop.html?category=lifestyle" class="nav-link ${activeCategory === 'lifestyle' ? 'is-active' : ''}" data-mega="lifestyle">Lifestyle</a>
          </nav>
          <div class="header-actions">
            <button type="button" class="header-text-action" data-open-search>Search</button>
            <button type="button" class="header-text-action" data-open-contact>Clienteling</button>
            <button type="button" class="icon-button header-user" aria-label="Account">${ICONS.user}</button>
            <button type="button" class="atelier-bag-button" data-open-cart aria-label="Open atelier bag, ${cartQuantity()} items">
              ${ICONS.atelierBag}<span class="bag-count" data-cart-count>${cartQuantity()}</span>
            </button>
          </div>
        </div>
        <div class="mega-menu" aria-hidden="true" data-mega-panel>
          <div class="mega-menu__inner" data-mega-content></div>
        </div>
      </header>
      <div class="header-spacer" aria-hidden="true"></div>
    `;

    shell.querySelector('[data-dismiss-announcement]')?.addEventListener('click', () => {
      storageSet(STORAGE.announcement, '1');
      $('.announcement')?.setAttribute('hidden', '');
      $('.site-header')?.classList.add('site-header--no-announcement');
      document.documentElement.style.setProperty('--announcement-height', '0px');
    });

    wireHeader();
    renderPersistentOverlays(categories);
    if (page === 'product') $('.site-header')?.classList.add('site-header--product');
  };

  const megaContent = (category) => {
    const config = A.categories[category] || A.categories.women;
    const products = A.productsFor(category);
    const imageProduct = products[11];
    const typeLinks = config.types.slice(0, 6).map((type) =>
      `<a href="shop.html?category=${category}&type=${encodeURIComponent(type)}">${escapeHTML(type)}</a>`
    ).join('');

    return `
      <div class="mega-menu__column">
        <p class="mega-menu__eyebrow">${escapeHTML(config.label)}</p>
        <a class="mega-menu__hero-link" href="shop.html?category=${category}">View the full collection ${ICONS.arrow}</a>
      </div>
      <div class="mega-menu__column">
        <p class="mega-menu__eyebrow">Shop by category</p>
        ${typeLinks}
      </div>
      <div class="mega-menu__column">
        <p class="mega-menu__eyebrow">House edits</p>
        <a href="shop.html?category=${category}&highlight=New%20In">New arrivals</a>
        <a href="shop.html?category=${category}&highlight=Runway%20Edition">Runway edition</a>
        <a href="shop.html?category=${category}&highlight=Online%20Exclusive">Online exclusives</a>
        <a href="shop.html?category=${category}&highlight=House%20Icon">House icons</a>
      </div>
      <a class="mega-menu__editorial" href="product.html?id=${imageProduct.id}">
        <img src="${imageProduct.image}" alt="${escapeHTML(imageProduct.name)}" />
        <span>THE NOCTURNE EDIT</span>
        <strong>Discover the campaign</strong>
      </a>`;
  };

  const wireHeader = () => {
    const header = $('.site-header');
    const megaPanel = $('[data-mega-panel]');
    const megaContentHost = $('[data-mega-content]');
    let leaveTimer;

    const openMega = (category) => {
      clearTimeout(leaveTimer);
      megaContentHost.innerHTML = megaContent(category);
      megaPanel.classList.add('is-open');
      megaPanel.setAttribute('aria-hidden', 'false');
      header.classList.add('has-mega-open');
    };
    const closeMega = () => {
      leaveTimer = setTimeout(() => {
        megaPanel.classList.remove('is-open');
        megaPanel.setAttribute('aria-hidden', 'true');
        header.classList.remove('has-mega-open');
      }, 90);
    };

    $$('[data-mega]').forEach((link) => {
      link.addEventListener('mouseenter', () => openMega(link.dataset.mega));
      link.addEventListener('focus', () => openMega(link.dataset.mega));
      link.addEventListener('mouseleave', closeMega);
    });
    megaPanel.addEventListener('mouseenter', () => clearTimeout(leaveTimer));
    megaPanel.addEventListener('mouseleave', closeMega);

    let lastScroll = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking || state.openLayer) return;
      ticking = true;
      requestAnimationFrame(() => {
        const current = window.scrollY;
        header.classList.toggle('is-condensed', current > 48);
        header.classList.toggle('is-hidden', current > lastScroll && current > 220);
        if (current < lastScroll - 10) header.classList.remove('is-hidden');
        lastScroll = current;
        ticking = false;
      });
    }, { passive: true });
  };

  const renderPersistentOverlays = (categories) => {
    const overlays = $('#global-overlays');
    overlays.innerHTML = `
      <section class="overlay-layer overlay-layer--drawer overlay-layer--left" id="mobile-nav" aria-hidden="true" hidden>
        <button class="overlay-layer__backdrop" type="button" data-close-layer aria-label="Close menu"></button>
        <div class="overlay-layer__panel mobile-nav-panel" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <header class="overlay-layer__header mobile-nav__header">
            <span class="brandmark brandmark--small">AURENZA</span>
            <button class="icon-button" type="button" data-close-layer aria-label="Close menu">${ICONS.close}</button>
          </header>
          <nav class="mobile-nav" aria-label="Mobile navigation">
            ${categories.map((category) => `<a href="shop.html?category=${category}"><span>${A.categories[category].label}</span>${ICONS.arrow}</a>`).join('')}
            <a href="shop.html?category=women&highlight=New%20In"><span>New Arrivals</span>${ICONS.arrow}</a>
            <a href="shop.html?category=gifts"><span>Gift Atelier</span>${ICONS.arrow}</a>
          </nav>
          <div class="mobile-nav__service">
            <button type="button" data-open-contact>Clienteling</button>
            <button type="button" data-open-region>Shipping to: Worldwide</button>
          </div>
        </div>
      </section>

      <section class="overlay-layer overlay-layer--modal overlay-layer--center search-layer" id="search-layer" aria-hidden="true" hidden>
        <button class="overlay-layer__backdrop" type="button" data-close-layer aria-label="Close search"></button>
        <div class="overlay-layer__panel search-panel" role="dialog" aria-modal="true" aria-labelledby="search-title">
          <header class="search-panel__header">
            <h2 id="search-title">Search the house</h2>
            <button class="icon-button" type="button" data-close-layer aria-label="Close search">${ICONS.close}</button>
          </header>
          <form class="search-form" role="search">
            ${ICONS.search}
            <input type="search" id="site-search" placeholder="Search products, categories, materials" autocomplete="off" aria-label="Search products" />
            <button type="reset" class="text-button">Clear</button>
          </form>
          <div class="search-suggestions">
            <p class="eyebrow">Suggested</p>
            <div class="search-suggestion-links">
              <a href="shop.html?category=women">Silk tailoring</a>
              <a href="shop.html?category=bags">Sculpted bags</a>
              <a href="shop.html?category=shoes">Evening shoes</a>
              <a href="shop.html?category=jewelry">Gold-tone jewelry</a>
            </div>
          </div>
          <div class="search-results" id="search-results" aria-live="polite"></div>
        </div>
      </section>

      <section class="overlay-layer overlay-layer--drawer overlay-layer--right cart-layer" id="cart-layer" aria-hidden="true" hidden>
        <button class="overlay-layer__backdrop" type="button" data-close-layer aria-label="Close atelier bag"></button>
        <div class="overlay-layer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <header class="overlay-layer__header">
            <h2 id="cart-title">Atelier Bag <span data-cart-heading-count>(${cartQuantity()})</span></h2>
            <button class="icon-button" type="button" data-close-layer aria-label="Close atelier bag">${ICONS.close}</button>
          </header>
          <div class="overlay-layer__body cart-content" data-cart-content></div>
        </div>
      </section>
    `;

    $$('#mobile-nav, #search-layer, #cart-layer').forEach(wireLayer);
    renderCart();
    wireGlobalActions();
  };

  const renderFooter = () => {
    const footer = $('#site-footer');
    footer.innerHTML = `
      <section class="newsletter-section" aria-labelledby="newsletter-title">
        <div>
          <p class="eyebrow">Private correspondence</p>
          <h2 id="newsletter-title">Enter the world of AURENZA</h2>
          <p>Receive first access to collections, atelier stories and private appointments.</p>
        </div>
        <form class="newsletter-inline" data-newsletter-inline>
          <label class="sr-only" for="newsletter-email">Email address</label>
          <input id="newsletter-email" type="email" placeholder="EMAIL ADDRESS" required />
          <button class="button button--black" type="submit">Continue ${ICONS.arrow}</button>
        </form>
      </section>
      <footer class="site-footer" id="site-footer-inner">
        <div class="footer-grid">
          ${footerColumn('Client Services', ['Contact the atelier', 'Delivery & returns', 'Track your order', 'Care guide', 'Book an appointment'])}
          ${footerColumn('The House', ['Our story', 'The atelier', 'Responsible sourcing', 'Careers', 'Journal'])}
          ${footerColumn('Legal', ['Terms & conditions', 'Privacy', 'Cookies', 'Accessibility', 'Corporate information'])}
          ${footerColumn('Discover', ['Boutique locator', 'Gift atelier', 'Private clients', 'Digital runway', 'Archive'])}
        </div>
        <div class="footer-bottom">
          <button class="footer-region" type="button" data-open-region>${ICONS.location}<span>Worldwide / English</span></button>
          <p>© 2026 AURENZA. Original portfolio prototype.</p>
          <p class="footer-signature">Designed for modern opulence.</p>
        </div>
      </footer>
    `;

    $$('.footer-group__toggle').forEach((button) => {
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        button.closest('.footer-group').classList.toggle('is-open', !expanded);
      });
    });

    $('[data-newsletter-inline]')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = $('#newsletter-email').value;
      showNewsletterModal(email, event.submitter);
    });
  };

  const footerColumn = (title, links) => `
    <section class="footer-group">
      <button class="footer-group__toggle" type="button" aria-expanded="false">
        <span>${escapeHTML(title)}</span>${ICONS.plus}
      </button>
      <h3>${escapeHTML(title)}</h3>
      <div class="footer-group__links">
        ${links.map((link) => `<a href="#">${escapeHTML(link)}</a>`).join('')}
      </div>
    </section>`;

  const showNewsletterModal = (email = '', trigger) => {
    const content = `
      <form class="expanded-form" data-newsletter-form>
        <p class="form-intro">Join our private client list for collection previews and house events.</p>
        <div class="field-grid">
          <label><span>First name</span><input name="firstName" required /></label>
          <label><span>Last name</span><input name="lastName" required /></label>
          <label class="field-grid__full"><span>Email</span><input name="email" type="email" value="${escapeHTML(email)}" required /></label>
          <label><span>Country</span><select name="country"><option>Ghana</option><option>United Kingdom</option><option>United States</option><option>France</option><option>Italy</option><option>Nigeria</option></select></label>
          <label><span>Phone (optional)</span><input name="phone" type="tel" /></label>
        </div>
        <label class="consent"><input type="checkbox" required /><span>I agree to receive AURENZA news and understand the privacy notice.</span></label>
        <button class="button button--black button--full" type="submit">Confirm membership</button>
      </form>`;
    const layer = showModal({ title: 'Private Correspondence', content, extraClass: 'newsletter-modal' }, trigger);
    $('[data-newsletter-form]', layer).addEventListener('submit', (event) => {
      event.preventDefault();
      closeLayer();
      toast('Welcome to the world of AURENZA.');
    });
  };

  const showContactDrawer = (trigger) => showDrawer({
    title: 'Clienteling',
    id: 'contact-drawer',
    content: `
      <div class="service-list">
        <section><p class="eyebrow">Private line</p><h3>Speak with an advisor</h3><p>Monday–Saturday, 09:00–20:00 GMT</p><a href="tel:+233302000000">+233 30 200 0000</a></section>
        <section><p class="eyebrow">Correspondence</p><h3>Email the atelier</h3><p>Our advisors reply within one business day.</p><a class="button button--outline" href="mailto:clienteling@example.com">Send email</a></section>
        <section><p class="eyebrow">Appointment</p><h3>Private styling</h3><p>Reserve a virtual or in-person styling appointment.</p><button class="button button--outline" type="button" data-book-appointment>Book now</button></section>
        <section><p class="eyebrow">Live concierge</p><h3>Available now</h3><button class="button button--black" type="button" data-live-chat>Begin live chat</button></section>
      </div>`
  }, trigger);

  const showRegionModal = (trigger) => {
    const regions = ['Ghana / English', 'Nigeria / English', 'South Africa / English', 'United Kingdom / English', 'United States / English', 'France / Français', 'Italy / Italiano', 'United Arab Emirates / English'];
    const layer = showModal({
      title: 'Select your region',
      id: 'region-modal',
      content: `
        <p class="form-intro">Prices are shown in USD for this prototype. Choose a destination to personalize delivery messaging.</p>
        <div class="region-list">${regions.map((region) => `<button type="button" data-region-choice>${escapeHTML(region)}${ICONS.arrow}</button>`).join('')}</div>`
    }, trigger);
    $$('[data-region-choice]', layer).forEach((button) => button.addEventListener('click', () => {
      closeLayer(); toast(`Region set to ${button.textContent.trim()}.`);
    }));
  };

  const renderCart = () => {
    const host = $('[data-cart-content]');
    if (!host) return;
    const total = state.cart.reduce((sum, item) => {
      const product = A.findProduct(item.productId);
      return sum + product.price * item.quantity;
    }, 0);

    if (!state.cart.length) {
      host.innerHTML = `
        <div class="empty-cart">
          <span class="empty-cart__icon">${ICONS.atelierBag}</span>
          <h3>Your atelier bag is empty</h3>
          <p>Begin with the new collection or explore a house icon.</p>
          <a class="button button--black" href="shop.html?category=women">Discover the collection</a>
        </div>`;
    } else {
      host.innerHTML = `
        <div class="cart-items">
          ${state.cart.map((item, index) => {
            const product = A.findProduct(item.productId);
            return `
              <article class="cart-item">
                <a href="product.html?id=${product.id}" class="cart-item__image"><img src="${product.image}" alt="${escapeHTML(product.name)}" /></a>
                <div class="cart-item__info">
                  <a href="product.html?id=${product.id}">${escapeHTML(product.name)}</a>
                  <p>${escapeHTML(product.color)}${item.size ? ` · Size ${escapeHTML(item.size)}` : ''}</p>
                  <strong>${A.formatPrice(product.price)}</strong>
                  <div class="quantity-control quantity-control--small">
                    <button type="button" data-cart-decrease="${index}" aria-label="Decrease quantity">${ICONS.minus}</button>
                    <span>${item.quantity}</span>
                    <button type="button" data-cart-increase="${index}" aria-label="Increase quantity">${ICONS.plus}</button>
                  </div>
                </div>
                <button class="cart-item__remove text-button" type="button" data-cart-remove="${index}">Remove</button>
              </article>`;
          }).join('')}
        </div>
        <div class="cart-summary">
          <div><span>Subtotal</span><strong>${A.formatPrice(total)}</strong></div>
          <p>Complimentary delivery and returns. Taxes calculated by destination.</p>
          <button class="button button--black button--full" type="button" data-checkout>Proceed to private checkout</button>
          <button class="button button--outline button--full" type="button" data-close-layer>Continue shopping</button>
        </div>`;
    }

    $$('[data-cart-count]').forEach((count) => { count.textContent = cartQuantity(); });
    $('[data-cart-heading-count]') && ($('[data-cart-heading-count]').textContent = `(${cartQuantity()})`);
    $('.atelier-bag-button')?.setAttribute('aria-label', `Open atelier bag, ${cartQuantity()} items`);

    $$('[data-cart-increase]').forEach((button) => button.addEventListener('click', () => {
      state.cart[Number(button.dataset.cartIncrease)].quantity += 1; persist(); renderCart();
    }));
    $$('[data-cart-decrease]').forEach((button) => button.addEventListener('click', () => {
      const index = Number(button.dataset.cartDecrease);
      state.cart[index].quantity -= 1;
      if (state.cart[index].quantity <= 0) state.cart.splice(index, 1);
      persist(); renderCart();
    }));
    $$('[data-cart-remove]').forEach((button) => button.addEventListener('click', () => {
      state.cart.splice(Number(button.dataset.cartRemove), 1); persist(); renderCart(); announce('Item removed from atelier bag.');
    }));
    $('[data-checkout]')?.addEventListener('click', () => toast('Checkout is intentionally simulated in this portfolio prototype.'));
  };

  const addToCart = (productId, { size = '', quantity = 1, open = true } = {}) => {
    const keyMatch = state.cart.find((item) => item.productId === productId && item.size === size);
    if (keyMatch) keyMatch.quantity += quantity;
    else state.cart.push({ productId, size, quantity });
    persist();
    renderCart();
    const product = A.findProduct(productId);
    announce(`${product.name} added to atelier bag.`);
    toast(`${product.name} added to your atelier bag.`);
    if (open) openLayer($('#cart-layer'), document.activeElement);
  };

  const toggleWishlist = (productId, button) => {
    const index = state.wishlist.indexOf(productId);
    const active = index === -1;
    if (active) state.wishlist.push(productId); else state.wishlist.splice(index, 1);
    persist();
    $$(`[data-wishlist="${CSS.escape(productId)}"]`).forEach((control) => {
      control.classList.toggle('is-active', active);
      control.setAttribute('aria-pressed', String(active));
      control.setAttribute('aria-label', `${active ? 'Remove from' : 'Add to'} wishlist`);
    });
    announce(`${A.findProduct(productId).name} ${active ? 'added to' : 'removed from'} wishlist.`);
    button?.blur();
  };

  const quickAdd = (productId, trigger) => {
    const product = A.findProduct(productId);
    const requiresSize = !product.sizes.includes('ONE SIZE');
    if (!requiresSize) {
      addToCart(productId); return;
    }
    const content = `
      <div class="quick-add">
        <img src="${product.image}" alt="${escapeHTML(product.name)}" />
        <div><p class="eyebrow">${escapeHTML(product.badge || product.categoryLabel)}</p><h3>${escapeHTML(product.name)}</h3><p>${A.formatPrice(product.price)}</p></div>
      </div>
      <form data-quick-add-form>
        <fieldset class="size-fieldset"><legend>Select size</legend><div class="size-grid">${product.sizes.map((size) => `<label><input type="radio" name="size" value="${size}" /><span>${size}</span></label>`).join('')}</div></fieldset>
        <p class="form-error" data-size-error hidden>Please select a size.</p>
        <button class="button button--black button--full" type="submit">Add to atelier bag</button>
      </form>`;
    const layer = showModal({ title: 'Quick Add', content, extraClass: 'quick-add-modal' }, trigger);
    $('[data-quick-add-form]', layer).addEventListener('submit', (event) => {
      event.preventDefault();
      const size = new FormData(event.currentTarget).get('size');
      if (!size) {
        $('[data-size-error]', layer).hidden = false;
        $('input[name="size"]', layer)?.focus(); return;
      }
      closeLayer({ restoreFocus: false });
      addToCart(productId, { size });
    });
  };

  const renderSearch = (query) => {
    const host = $('#search-results');
    const suggestions = $('.search-suggestions');
    const clean = query.trim().toLowerCase();
    if (!clean) {
      host.innerHTML = '';
      suggestions.hidden = false;
      return;
    }
    suggestions.hidden = true;
    const results = A.products.filter((product) =>
      [product.name, product.categoryLabel, product.type, product.color, product.material].join(' ').toLowerCase().includes(clean)
    ).slice(0, 8);
    host.innerHTML = results.length ? `
      <p class="eyebrow">${results.length} suggestions</p>
      <div class="search-result-grid">${results.map((product) => `
        <a href="product.html?id=${product.id}" class="search-result-item">
          <img src="${product.image}" alt="" />
          <span><strong>${escapeHTML(product.name)}</strong><small>${escapeHTML(product.categoryLabel)} · ${A.formatPrice(product.price)}</small></span>
        </a>`).join('')}</div>
      <a class="search-view-all" href="shop.html?search=${encodeURIComponent(clean)}">View all results ${ICONS.arrow}</a>` : `<p class="search-empty">No pieces found for “${escapeHTML(query)}”. Try a material, color or category.</p>`;
  };

  const toast = (message) => {
    $('.site-toast')?.remove();
    const toastEl = document.createElement('div');
    toastEl.className = 'site-toast';
    toastEl.setAttribute('role', 'status');
    toastEl.textContent = message;
    document.body.appendChild(toastEl);
    requestAnimationFrame(() => toastEl.classList.add('is-visible'));
    setTimeout(() => toastEl.classList.remove('is-visible'), 3200);
    setTimeout(() => toastEl.remove(), 3600);
  };

  const wireGlobalActions = () => {
    document.addEventListener('click', (event) => {
      const openSearch = event.target.closest('[data-open-search]');
      if (openSearch) {
        openLayer($('#search-layer'), openSearch);
        setTimeout(() => $('#site-search')?.focus(), 80);
        return;
      }
      const openCartButton = event.target.closest('[data-open-cart]');
      if (openCartButton) { renderCart(); openLayer($('#cart-layer'), openCartButton); return; }
      const openNav = event.target.closest('[data-open-mobile-nav]');
      if (openNav) { openLayer($('#mobile-nav'), openNav); return; }
      const contact = event.target.closest('[data-open-contact]');
      if (contact) { showContactDrawer(contact); return; }
      const region = event.target.closest('[data-open-region]');
      if (region) { showRegionModal(region); return; }
      const wish = event.target.closest('[data-wishlist]');
      if (wish) { event.preventDefault(); toggleWishlist(wish.dataset.wishlist, wish); return; }
      const quick = event.target.closest('[data-quick-add]');
      if (quick) { event.preventDefault(); quickAdd(quick.dataset.quickAdd, quick); }
    });

    $('#site-search')?.addEventListener('input', (event) => renderSearch(event.target.value));
    $('.search-form')?.addEventListener('reset', () => setTimeout(() => renderSearch(''), 0));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && state.openLayer) closeLayer();
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
    document.documentElement.style.setProperty('--announcement-height', storageGet(STORAGE.announcement) === '1' ? '0px' : '32px');
  });

  window.AURENZA_UI = {
    ICONS,
    state,
    $, $$,
    escapeHTML,
    productCard,
    showDrawer,
    showModal,
    closeLayer,
    addToCart,
    toggleWishlist,
    toast,
    announce,
    renderCart,
    formatPrice: A.formatPrice,
    storageGet,
    storageSet
  };
})();
