// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close Menu' : 'Open Menu';
  });
}

// Painting carousel
async function initCarousel() {
  const el = document.querySelector('#painting-carousel');
  if (!el) return;
  const src = el.getAttribute('data-source');
  const list = el.querySelector('.slides');
  const caption = document.querySelector('#painting-caption');

  try {
    const res = await fetch(src);
    const items = await res.json();

    items.forEach((it, i) => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = it.src;
      img.alt = it.alt || it.title || '';
      li.appendChild(img);
      list.appendChild(li);
    });

    let idx = 0;
    function render() {
      list.style.transform = `translateX(-${idx * 100}%)`;
      caption.textContent = items[idx]?.title || '';
    }
    render();

    const prev = el.querySelector('.prev');
    const next = el.querySelector('.next');
    prev.addEventListener('click', () => { idx = (idx - 1 + items.length) % items.length; render(); });
    next.addEventListener('click', () => { idx = (idx + 1) % items.length; render(); });

    // Swipe
    let startX = null;
    list.addEventListener('pointerdown', e => startX = e.clientX);
    list.addEventListener('pointerup', e => {
      if (startX == null) return;
      const dx = e.clientX - startX;
      if (dx > 40) prev.click();
      if (dx < -40) next.click();
      startX = null;
    });

    // Keyboard
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prev.click();
      if (e.key === 'ArrowRight') next.click();
    });
  } catch (e) {
    console.error('Failed to load carousel', e);
  }
}

// Photo grid
async function initPhotoGrid() {
  const grid = document.querySelector('#photo-grid');
  if (!grid) return;
  const nav = document.querySelector('#series-nav');
  const src = grid.getAttribute('data-source');
  try {
    const res = await fetch(src);
    const data = await res.json();

    const seriesNames = Object.keys(data);
    function renderSeries(filter) {
      grid.innerHTML = '';
      const items = seriesNames.flatMap(name => {
        if (filter && name !== filter) return [];
        return data[name].map(img => ({...img, series: name}));
      });
      for (const it of items) {
        const card = document.createElement('article');
        card.className = 'card';
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.src = it.src;
        img.alt = it.alt || '';
        const body = document.createElement('div');
        body.className = 'card-body';
        body.textContent = `${it.title || ''}${it.year ? `, ${it.year}` : ''}`.trim();
        card.appendChild(img);
        card.appendChild(body);
        grid.appendChild(card);
      }
      for (const a of nav.querySelectorAll('a')) {
        a.classList.toggle('active', a.dataset.series === filter);
      }
    }

    // Build nav
    nav.innerHTML = '';
    const all = document.createElement('a');
    all.href = '#';
    all.textContent = 'all';
    all.addEventListener('click', e => { e.preventDefault(); renderSeries(); });
    nav.appendChild(all);
    seriesNames.forEach(name => {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = name;
      a.dataset.series = name;
      a.addEventListener('click', e => { e.preventDefault(); renderSeries(name); });
      nav.appendChild(a);
    });

    renderSeries();
  } catch (e) {
    console.error('Failed to load photo series', e);
  }
}

initCarousel();
initPhotoGrid();


// Stacked painting page
async function initStackedGallery() {
  const section = document.querySelector('.stacked-gallery');
  if (!section) return;
  const src = section.getAttribute('data-source');
  try {
    const res = await fetch(src);
    const items = await res.json();
    items.forEach((it) => {
      const fig = document.createElement('figure');
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = it.src;
      img.alt = it.alt || it.title || '';
      const cap = document.createElement('figcaption');
      cap.textContent = it.title || '';
      fig.appendChild(img);
      if (cap.textContent) fig.appendChild(cap);
      section.appendChild(fig);

      // Lightbox on click
      img.addEventListener('click', () => openLightbox(img.src, img.alt));
      img.style.cursor = 'zoom-in';
    });

    ensureLightbox();
  } catch (e) {
    console.error('Failed to load paintings', e);
  }
}

function ensureLightbox() {
  if (document.querySelector('.lightbox-backdrop')) return;
  const back = document.createElement('div');
  back.className = 'lightbox-backdrop';
  const img = document.createElement('img');
  img.className = 'lightbox-img';
  const close = document.createElement('button');
  close.className = 'lightbox-close';
  close.textContent = 'Close';
  close.addEventListener('click', () => back.classList.remove('open'));
  back.addEventListener('click', (e) => { if (e.target === back) back.classList.remove('open'); });
  back.appendChild(img);
  document.body.appendChild(back);
  document.body.appendChild(close);
  window._lightbox = { back, img, close };
}
function openLightbox(src, alt) {
  if (!window._lightbox) ensureLightbox();
  const { back, img } = window._lightbox;
  img.src = src; img.alt = alt || '';
  back.classList.add('open');
}

initStackedGallery();
