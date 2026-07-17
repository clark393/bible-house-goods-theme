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
  const purchaseOption = event.target.closest('[data-purchase-option]');
  if (purchaseOption) {
    const offer = purchaseOption.closest('[data-share-offer]');
    const quantity = offer.closest('form').querySelector('[name="quantity"]');
    const sharing = purchaseOption.value === 'share';
    quantity.value = sharing ? '2' : '1';
    offer.querySelector('[data-share-recipient]').hidden = !sharing;
    offer.querySelector('[data-share-recipient-input]').disabled = !sharing;
    offer.querySelector('[data-share-property]').disabled = !sharing;
    return;
  }
  const quantity = event.target.closest('.product-form [name="quantity"]');
  if (quantity) {
    const offer = quantity.closest('form').querySelector('[data-share-offer]');
    if (!offer) return;
    const sharing = Number(quantity.value) >= 2;
    offer.querySelector(`[data-purchase-option][value="${sharing ? 'share' : 'single'}"]`).checked = true;
    offer.querySelector('[data-share-recipient]').hidden = !sharing;
    offer.querySelector('[data-share-recipient-input]').disabled = !sharing;
    offer.querySelector('[data-share-property]').disabled = !sharing;
    return;
  }
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

const copyShareUrl = async (share) => {
  const status = share.querySelector('[data-share-status]');
  try {
    await navigator.clipboard.writeText(share.dataset.shareUrl);
    status.textContent = status.dataset.copied;
  } catch {
    const field = document.createElement('textarea');
    field.value = share.dataset.shareUrl;
    field.setAttribute('readonly', '');
    document.body.appendChild(field);
    field.select();
    document.execCommand('copy');
    field.remove();
    status.textContent = status.dataset.copied;
  }
};

document.querySelectorAll('[data-product-share]').forEach((share) => {
  share.querySelector('[data-copy-share]').addEventListener('click', () => copyShareUrl(share));
  share.querySelector('[data-native-share]').addEventListener('click', async () => {
    if (!navigator.share) {
      await copyShareUrl(share);
      return;
    }
    try {
      await navigator.share({ title: share.dataset.shareTitle, text: share.dataset.shareText, url: share.dataset.shareUrl });
    } catch (error) {
      if (error.name !== 'AbortError') await copyShareUrl(share);
    }
  });
});
