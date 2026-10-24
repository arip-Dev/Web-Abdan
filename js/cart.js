/* ============================================================
 *  cart.js — State & logika keranjang belanja
 *  Bergantung pada: data.js ($, rp, fp, FREE_SHIP, SHIP_COST, KEY)
 *                   toast.js (showToast)
 *                   products.js (renderProducts)
 * ============================================================ */

// ── State Keranjang ──────────────────────────────────────────
/** Muat keranjang dari localStorage; validasi setiap item. */
let cart = (() => {
  try {
    return (JSON.parse(localStorage.getItem(KEY)) || [])
      .filter((i) => fp(i.id) && i.qty > 0);
  } catch {
    return [];
  }
})();

// ── Persistensi ─────────────────────────────────────────────
/** Simpan keranjang ke localStorage. */
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* quota exceed */ }
}

// ── Kalkulasi ────────────────────────────────────────────────
/**
 * Hitung total keranjang.
 * @returns {{ qty: number, sub: number, ship: number, grand: number }}
 */
function totals() {
  const qty  = cart.reduce((s, i) => s + i.qty, 0);
  const sub  = cart.reduce((s, i) => s + fp(i.id).price * i.qty, 0);
  const ship = (sub === 0 || sub >= FREE_SHIP) ? 0 : SHIP_COST;
  return { qty, sub, ship, grand: sub + ship };
}

// ── Mutasi Keranjang ─────────────────────────────────────────
/**
 * Tambah produk ke keranjang.
 * @param {number} id  - ID produk
 * @param {HTMLElement|null} btn - Tombol yang diklik (untuk feedback visual)
 */
function addToCart(id, btn) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.qty = Math.min(item.qty + 1, 99);
  } else {
    cart.push({ id, qty: 1 });
  }
  save();
  updateCartUI();
  renderProducts($('.filter-btn.active')?.dataset.filter || 'semua');
  if (btn) {
    btn.textContent = '✓ Ditambahkan';
    btn.classList.add('added');
  }
  showToast(`🥜 ${fp(id).name} ditambahkan!`, 'success');
}

/**
 * Hapus produk dari keranjang.
 * @param {number} id - ID produk
 */
function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  save();
  updateCartUI();
  renderProducts($('.filter-btn.active')?.dataset.filter || 'semua');
}

/**
 * Ubah jumlah produk di keranjang.
 * @param {number} id    - ID produk
 * @param {number} delta - Perubahan qty (+1 atau -1)
 */
function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, Math.min(item.qty + delta, 99));
  save();
  updateCartUI();
}

// ── Render UI ────────────────────────────────────────────────
/** Perbarui semua elemen UI yang berkaitan dengan keranjang. */
function updateCartUI() {
  const { qty, sub, ship, grand } = totals();

  $('#cartCount').textContent  = qty;
  $('#totalQty').textContent   = qty;
  $('#subtotal').textContent   = rp(sub);
  $('#grandTotal').textContent = rp(grand);

  // Ongkos kirim — tampilkan "GRATIS" jika gratis
  $('#shipping').innerHTML = ship === 0
    ? '<span class="text-green-600 font-semibold">GRATIS</span>'
    : rp(ship);

  // Tampil/sembunyikan footer cart
  $('#cartFooter').style.display = qty === 0 ? 'none' : 'block';

  // Banner free-shipping progress
  const note = $('#freeShipNote');
  if (sub > 0 && sub < FREE_SHIP) {
    note.innerHTML = `🚚 Tambah <strong>${rp(FREE_SHIP - sub)}</strong> lagi untuk gratis ongkir!`;
  } else if (sub >= FREE_SHIP) {
    note.innerHTML = `🎉 Selamat! Kamu mendapat <strong class="text-green-600">gratis ongkir</strong>!`;
  } else {
    note.innerHTML = '';
  }

  renderCartItems();
}

/** Render daftar item di dalam sidebar keranjang. */
function renderCartItems() {
  const el = $('#cartItems');

  if (!cart.length) {
    el.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full py-16 text-muted">
        <div class="text-6xl mb-5">🛒</div>
        <p class="font-semibold text-brown-600 mb-1">Keranjang masih kosong</p>
        <p class="text-sm text-center">Yuk mulai belanja kacang asin favoritmu!</p>
      </div>`;
    return;
  }

  el.innerHTML = cart.map((item) => {
    const p = fp(item.id);
    return `
      <div class="flex gap-3.5 py-4 border-b border-amber-50 last:border-0 animate-slide-in">
        <div class="w-[60px] h-[60px] rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 grid place-items-center text-3xl flex-shrink-0">
          ${p.emoji}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm text-brown-800 truncate">${p.name}</p>
          <p class="text-orange-600 font-bold text-sm">${rp(p.price)}</p>
          <div class="flex items-center gap-2 mt-2">
            <button onclick="changeQty(${p.id}, -1)"
                    class="w-7 h-7 rounded-full bg-amber-50 text-brown-600 font-bold transition-all duration-200 hover:bg-orange-600 hover:text-white">−</button>
            <span class="min-w-[24px] text-center font-bold text-sm">${item.qty}</span>
            <button onclick="changeQty(${p.id}, 1)"
                    class="w-7 h-7 rounded-full bg-amber-50 text-brown-600 font-bold transition-all duration-200 hover:bg-orange-600 hover:text-white">+</button>
          </div>
        </div>
        <div class="flex flex-col items-end justify-between flex-shrink-0">
          <p class="text-sm font-extrabold text-brown-800">${rp(p.price * item.qty)}</p>
          <button onclick="removeFromCart(${p.id})"
                  class="text-muted hover:text-red-500 transition-colors text-xs">Hapus</button>
        </div>
      </div>`;
  }).join('');
}

// ── Sidebar Cart (Buka / Tutup) ──────────────────────────────
/** Buka sidebar keranjang. */
function openCart() {
  $('#cartSidebar').classList.remove('translate-x-full');
  $('#overlay').classList.remove('opacity-0', 'invisible');
  document.body.classList.add('no-scroll');
}

/** Tutup sidebar keranjang. */
function closeCart() {
  $('#cartSidebar').classList.add('translate-x-full');
  // Sembunyikan overlay hanya jika modal juga tidak sedang terbuka
  if ($('#checkoutModal').classList.contains('invisible')) {
    $('#overlay').classList.add('opacity-0', 'invisible');
    document.body.classList.remove('no-scroll');
  }
}
