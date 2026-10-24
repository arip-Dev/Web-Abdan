/* ============================================================
 *  ui.js — Inisialisasi semua event listener UI
 *  Bergantung pada: data.js ($)
 *                   cart.js (openCart, closeCart, updateCartUI, cart, save)
 *                   checkout.js (openModal, closeModal, initCheckoutForm)
 *                   products.js (renderProducts)
 *                   toast.js (showToast)
 * ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Footer: tahun otomatis ─────────────────────────────────
  $('#year').textContent = new Date().getFullYear();

  // ── Inisialisasi awal ──────────────────────────────────────
  renderProducts('semua');
  updateCartUI();
  initCheckoutForm();

  // ── Filter Produk ──────────────────────────────────────────
  document.getElementById('filterBar').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.filter);
  });

  // ── Navbar: efek scroll (transparan → solid) ───────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.replace('bg-cream-blur', 'bg-cream-solid');
      navbar.classList.add('shadow-sm');
    } else {
      navbar.classList.replace('bg-cream-solid', 'bg-cream-blur');
      navbar.classList.remove('shadow-sm');
    }
  }, { passive: true });

  // ── Mobile Menu ────────────────────────────────────────────
  const toggle   = document.getElementById('menuToggle');
  const menu     = document.getElementById('mobileMenu');
  let   menuOpen = false;

  toggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menu.style.maxHeight = menuOpen ? menu.scrollHeight + 'px' : '0';
    toggle.textContent   = menuOpen ? '✕' : '☰';
  });

  // ── Smooth Scroll ke Anchor ────────────────────────────────
  /**
   * Scroll ke elemen dengan id tertentu, dengan offset dinamis sebesar
   * tinggi navbar yang dibaca saat klik terjadi.
   * @param {string} id - ID elemen target (tanpa '#')
   */
  function scrollToTarget(id) {
    const target = document.getElementById(id);
    if (!target) return;
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const navH = document.getElementById('navbar').getBoundingClientRect().height;
    const gap  = -10;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - gap;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  // Intercept semua klik <a href="#..."> di seluruh halaman
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    if (!id || !document.getElementById(id)) return;

    e.preventDefault();
    scrollToTarget(id);

    // Tutup menu mobile jika sedang terbuka
    if (menuOpen) {
      menuOpen             = false;
      menu.style.maxHeight = '0';
      toggle.textContent   = '☰';
    }

    // Perbarui URL hash tanpa memicu scroll bawaan browser
    history.pushState(null, '', '#' + id);
  });

  // Handle hash di URL saat halaman pertama kali dimuat
  if (window.location.hash) {
    setTimeout(() => scrollToTarget(window.location.hash.slice(1)), 120);
  }

  // ── Keranjang Belanja ──────────────────────────────────────
  document.getElementById('cartBtn')
    .addEventListener('click', openCart);

  document.getElementById('closeCart')
    .addEventListener('click', closeCart);

  document.getElementById('checkoutBtn')
    .addEventListener('click', () => { closeCart(); openModal(); });

  document.getElementById('clearCart')
    .addEventListener('click', () => {
      if (!cart.length) return;
      cart = [];
      save();
      updateCartUI();
      showToast('🗑️ Keranjang dikosongkan.', 'info');
    });

  // ── Modal Checkout ─────────────────────────────────────────
  document.getElementById('closeModal')
    .addEventListener('click', closeModal);

  document.getElementById('overlay')
    .addEventListener('click', () => { closeCart(); closeModal(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeCart(); closeModal(); }
  });

  // ── Tombol Back to Top ─────────────────────────────────────
  const btt = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btt.classList.remove('opacity-0', 'invisible', 'translate-y-5');
    } else {
      btt.classList.add('opacity-0', 'invisible', 'translate-y-5');
    }
  }, { passive: true });

  btt.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' }),
  );

});
