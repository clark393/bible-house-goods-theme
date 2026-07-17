document.documentElement.classList.remove('no-js');

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.hero__media video').forEach((video) => video.pause());
}

document.addEventListener('click', (event) => {
  const toggle = event.target.closest('[data-menu-toggle]');
  if (!toggle) return;
  const menu = document.getElementById(toggle.getAttribute('aria-controls'));
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  menu.hidden = open;
});

document.addEventListener('change', (event) => {
  const select = event.target.closest('[data-variant-select]');
  if (!select) return;
  const option = select.options[select.selectedIndex];
  const form = select.closest('form');
  form.querySelector('[name="id"]').value = option.value;
  const button = form.querySelector('[type="submit"]');
  button.disabled = option.dataset.available !== 'true';
  button.textContent = option.dataset.available === 'true' ? 'Add to cart' : 'Sold out';
  const price = document.querySelector('[data-product-price]');
  if (price) price.textContent = option.dataset.price;
});
document.querySelectorAll('[data-product-gallery]').forEach((gallery) => {
  const track = gallery.querySelector('[data-product-gallery-track]');
  const slides = Array.from(gallery.querySelectorAll('[data-product-gallery-slide]'));
  const current = gallery.querySelector('[data-gallery-current]');
  if (!track || slides.length < 2 || !current) return;

  const goTo = (index) => {
    slides[(index + slides.length) % slides.length].scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'start'
    });
  };
  const activeIndex = () => Math.round(track.scrollLeft / track.clientWidth);

  gallery.querySelector('[data-gallery-previous]').addEventListener('click', () => goTo(activeIndex() - 1));
  gallery.querySelector('[data-gallery-next]').addEventListener('click', () => goTo(activeIndex() + 1));
  track.addEventListener('scroll', () => {
    window.requestAnimationFrame(() => { current.textContent = String(activeIndex() + 1); });
  }, { passive: true });
});
