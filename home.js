(() => {
  'use strict';

  const A = window.THE_SET;
  const UI = window.THE_SET_UI;

  const heroSlides = [
    { eyebrow: 'new stuff', title: 'NIGHT', subtitle: 'Black pieces for late dinners and loud music.', image: 'images/h4.webp', position: 'center 34%' },
    { eyebrow: 'drop 02', title: 'DAY', subtitle: 'Easy clothes. Good fabric. Wear them a lot.', image: 'images/h1.webp', position: 'center 28%' },
    { eyebrow: 'weekend', title: 'OFF DUTY', subtitle: 'Soft layers, big bags and shoes that do the job.', image: 'images/h3.webp', position: 'center 38%' }
  ];

  const campaignImage = (url, alt) => `<img src="${url}" alt="${UI.escapeHTML(alt)}" loading="lazy" decoding="async" />`;

  const renderHome = () => {
    const main = document.querySelector('#main');
    const womenProducts = A.productsFor('women').slice(0, 10);
    const menProducts = A.productsFor('men').slice(0, 10);

    main.innerHTML = `
      <section class="hero" aria-label="The Set summer campaign">
        <div class="hero__slides" data-hero-slides>
          ${heroSlides.map((slide, index) => `
            <div class="hero__slide ${index === 0 ? 'is-active' : ''}" data-hero-slide="${index}" style="--hero-position:${slide.position}">
              <img src="${slide.image}" alt="${UI.escapeHTML(slide.title)} campaign photo" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} />
              <div class="hero__veil"></div>
              <div class="hero__content">
                <p>${UI.escapeHTML(slide.eyebrow)}</p>
                <h1>${UI.escapeHTML(slide.title)}</h1>
                <span>${UI.escapeHTML(slide.subtitle)}</span>
                <div class="hero__actions">
                  <a class="button button--light" href="shop.html?category=women">Shop women</a>
                  <a class="button button--ghost-light" href="shop.html?category=men">Shop men</a>
                </div>
              </div>
            </div>`).join('')}
        </div>
        <div class="hero__controls">
          <div class="hero__progress" aria-hidden="true">
            ${heroSlides.map((_, index) => `<button type="button" class="${index === 0 ? 'is-active' : ''}" data-hero-goto="${index}" tabindex="-1"><span></span></button>`).join('')}
          </div>
          <button class="hero__pause icon-button icon-button--light" type="button" data-hero-pause aria-label="Pause campaign slideshow">${UI.ICONS.pause}</button>
        </div>
        <a class="hero__scroll" href="#discovery" aria-label="Scroll to product discovery"><span></span>See</a>
      </section>

      <section class="discovery-section" id="discovery" aria-labelledby="discovery-title">
        <header class="section-heading section-heading--center">
          <p class="eyebrow">New stuff</p>
          <h2 id="discovery-title">The New stuff</h2>
          <div class="gender-tabs" role="tablist" aria-label="Product collection">
            <button role="tab" aria-selected="true" data-product-tab="women">Women</button>
            <button role="tab" aria-selected="false" data-product-tab="men">Men</button>
          </div>
        </header>
        <div class="product-rail-wrap">
          <button class="rail-arrow rail-arrow--previous" type="button" data-rail-prev aria-label="Previous products">${UI.ICONS.arrow}</button>
          <div class="product-rail" data-product-rail data-women-products='${encodeURIComponent(JSON.stringify(womenProducts.map(p => p.id)))}' data-men-products='${encodeURIComponent(JSON.stringify(menProducts.map(p => p.id)))}'>
            ${womenProducts.map((product) => UI.productCard(product, { compact: true })).join('')}
          </div>
          <button class="rail-arrow rail-arrow--next" type="button" data-rail-next aria-label="Next products">${UI.ICONS.arrow}</button>
        </div>
        <div class="section-cta"><a class="text-link" href="shop.html?category=women">See everything ${UI.ICONS.arrow}</a></div>
      </section>

      <section class="feature-banner feature-banner--women" aria-labelledby="women-campaign-title">
        <a href="shop.html?category=women" class="feature-banner__media">
          ${campaignImage('images/w1.jpg', 'The Set women’s photo')}
        </a>
        <div class="feature-banner__copy feature-banner__copy--left">
          <p class="eyebrow">late nights</p>
          <h2 id="women-campaign-title">Women’s Collection</h2>
          <p>Silk, jackets and dresses for when it gets dark.</p>
          <a class="text-link text-link--light" href="shop.html?category=women">See women ${UI.ICONS.arrow}</a>
        </div>
      </section>

      <section class="manifesto-section" aria-label="The Set note">
        <p class="eyebrow">How we think about clothes</p>
        <blockquote>“Good clothes. No big speech.”</blockquote>
        <a class="text-link" href="shop.html?category=accessories">Explore favorites ${UI.ICONS.arrow}</a>
      </section>

      <section class="feature-banner feature-banner--men" aria-labelledby="men-campaign-title">
        <a href="shop.html?category=men" class="feature-banner__media">
          ${campaignImage('images/m1.webp', 'The Set men’s photo')}
        </a>
        <div class="feature-banner__copy feature-banner__copy--right">
          <p class="eyebrow">for men</p>
          <h2 id="men-campaign-title">Men’s Collection</h2>
          <p>Good shirts, good jackets and a few things for going out. Easy.</p>
          <a class="text-link text-link--light" href="shop.html?category=men">See men ${UI.ICONS.arrow}</a>
        </div>
      </section>

      <section class="category-feature" aria-labelledby="category-title">
        <header class="section-heading">
          <div><p class="eyebrow">More stuff</p><h2 id="category-title">A few more things</h2></div>
          <a class="text-link" href="shop.html?category=women">See it all ${UI.ICONS.arrow}</a>
        </header>
        <div class="category-feature__grid">
          ${categoryCard('bags', 'Bags we like', 'Good size. Easy to carry. No fuss.', 'images/b1.jpg', 'category-card--large')}
          ${categoryCard('shoes', 'Shoes', 'Some for work. Some for nights out.', 'images/s1.jpg')}
          ${categoryCard('jewelry', 'Jewelry', 'Small things that make an outfit better.', 'images/j1.jpg')}
          ${categoryCard('lifestyle', 'Home stuff', 'Cups, blankets and little things for the place.', 'images/l1.jpg', 'category-card--large')}
        </div>
      </section>

      <section class="journal-strip" aria-labelledby="journal-title">
        <div class="journal-strip__image">${campaignImage('images/journal.jpg', 'The Set clothing rail')}</div>
        <div class="journal-strip__content">
          <p class="eyebrow">notes / 04</p>
          <h2 id="journal-title">Things we keep reaching for</h2>
          <p>A few pieces we keep wearing, a coffee nearby and whatever else is going on that week.</p>
          <a class="text-link" href="#">Read the notes ${UI.ICONS.arrow}</a>
        </div>
      </section>
    `;

    wireHome();
  };

  const categoryCard = (category, title, copy, image, className = '') => `
    <a class="category-card ${className}" href="shop.html?category=${category}">
      <div class="category-card__image"><img src="${image}" alt="${UI.escapeHTML(title)}" loading="lazy" decoding="async" /></div>
      <div class="category-card__copy"><p>${UI.escapeHTML(title)}</p><span>${UI.escapeHTML(copy)}</span><strong>See ${UI.ICONS.arrow}</strong></div>
    </a>`;

  const wireHome = () => {
    const slides = [...document.querySelectorAll('[data-hero-slide]')];
    const progress = [...document.querySelectorAll('[data-hero-goto]')];
    const pauseButton = document.querySelector('[data-hero-pause]');
    let current = 0;
    let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer;

    const showSlide = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === current));
      progress.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === current));
    };

    const start = () => {
      clearInterval(timer);
      if (paused) return;
      timer = setInterval(() => showSlide(current + 1), 6500);
    };

    progress.forEach((button) => button.addEventListener('click', () => { showSlide(Number(button.dataset.heroGoto)); start(); }));
    pauseButton.addEventListener('click', () => {
      paused = !paused;
      pauseButton.innerHTML = paused ? UI.ICONS.play : UI.ICONS.pause;
      pauseButton.setAttribute('aria-label', paused ? 'Play campaign slideshow' : 'Pause campaign slideshow');
      start();
    });
    start();

    const rail = document.querySelector('[data-product-rail]');
    const tabs = [...document.querySelectorAll('[data-product-tab]')];
    const updateRail = (gender) => {
      const ids = JSON.parse(decodeURIComponent(rail.dataset[`${gender}Products`]));
      rail.classList.add('is-changing');
      setTimeout(() => {
        rail.innerHTML = ids.map((id) => UI.productCard(A.findProduct(id), { compact: true })).join('');
        rail.scrollTo({ left: 0, behavior: 'auto' });
        rail.classList.remove('is-changing');
      }, 170);
      tabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.productTab === gender)));
      const cta = document.querySelector('.section-cta a');
      cta.href = `shop.html?category=${gender}`;
    };
    tabs.forEach((tab) => tab.addEventListener('click', () => updateRail(tab.dataset.productTab)));

    const scrollRail = (direction) => rail.scrollBy({ left: rail.clientWidth * 0.82 * direction, behavior: 'smooth' });
    document.querySelector('[data-rail-prev]').addEventListener('click', () => scrollRail(-1));
    document.querySelector('[data-rail-next]').addEventListener('click', () => scrollRail(1));
  };

  document.addEventListener('DOMContentLoaded', renderHome);
})();
