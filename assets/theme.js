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
