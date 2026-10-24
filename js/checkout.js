/* ============================================================
 *  checkout.js - Modal checkout, validasi form, & submit -> WhatsApp
 *  Bergantung pada: data.js ($, rp, fp, WA_NUMBER)
 *                   cart.js (cart, totals, save, updateCartUI, closeCart)
 *                   toast.js (showToast)
 *                   products.js (renderProducts)
 * ============================================================ */

function openModal() {
  const { sub, ship, grand } = totals();
  const modal = $('#checkoutModal');
  const inner = modal.querySelector('.bg-white');

  const items = cart.map((i) => {
    const p = fp(i.id);
    return (
      '<div class="flex justify-between py-1.5 border-b border-amber-50 last:border-0">' +
        '<span class="flex items-center gap-1.5">' +
          '<span>' + p.emoji + '</span>' +
          '<span class="text-brown-800">' + p.name + '</span>' +
          '<span class="text-muted text-xs">x' + i.qty + '</span>' +
        '</span>' +
        '<span class="font-semibold text-orange-600">' + rp(p.price * i.qty) + '</span>' +
      '</div>'
    );
  }).join('');

  const shipHtml = ship === 0
    ? '<b class="text-green-600">GRATIS \U0001F389</b>'
    : rp(ship);

  $('#orderSummary').innerHTML =
    '<div class="font-bold text-brown-800 mb-3">\U0001F4CB Ringkasan Pesanan</div>' +
    items +
    '<div class="border-t border-amber-200 mt-3 pt-2 flex justify-between text-xs text-muted">' +
      '<span>Ongkos Kirim</span><span>' + shipHtml + '</span>' +
    '</div>' +
    '<div class="flex justify-between font-extrabold text-orange-600 text-base mt-1">' +
      '<span>Total</span><span>' + rp(grand) + '</span>' +
    '</div>';

  modal.classList.remove('opacity-0', 'invisible');
  requestAnimationFrame(() => inner.classList.remove('scale-90', 'translate-y-8'));
  document.body.classList.add('no-scroll');
  $('#overlay').classList.remove('opacity-0', 'invisible');
}

function closeModal() {
  const modal = $('#checkoutModal');
  const inner = modal.querySelector('.bg-white');
  inner.classList.add('scale-90', 'translate-y-8');
  modal.classList.add('opacity-0', 'invisible');
  document.body.classList.remove('no-scroll');
  if ($('#cartSidebar').classList.contains('translate-x-full')) {
    $('#overlay').classList.add('opacity-0', 'invisible');
  }
}

// ── Validasi Form ──────────────────────────────────────────────────
function validate() {
  let ok = true;

  const setErr = (fg, show) => {
    const el  = document.getElementById(fg);
    const inp = el.querySelector('.form-input');
    const msg = el.querySelector('.err-msg');
    inp?.classList.toggle('invalid', show);
    if (msg) msg.classList.toggle('hidden', !show);
    if (show) ok = false;
  };

  const name  = $('#custName').value.trim();
  const email = $('#custEmail').value.trim();
  const addr  = $('#custAddress').value.trim();
  const pay   = document.querySelector('input[name="payment"]:checked');

  setErr('fg-custName',    name.length < 3);
  setErr('fg-custEmail',   email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  setErr('fg-custAddress', addr.length < 10);
  setErr('fg-payment',     !pay);

  return ok;
}

// ── Susun Pesan WhatsApp ───────────────────────────────────────────
function buildWhatsAppURL() {
  const { sub, ship, grand } = totals();

  const name  = $('#custName').value.trim();
  const email = $('#custEmail').value.trim();
  const addr  = $('#custAddress').value.trim();
  const pay   = document.querySelector('input[name="payment"]:checked')?.value || '-';
  const note  = $('#custNote').value.trim();

  const itemLines = cart.map((i) => {
    const p = fp(i.id);
    return '  • ' + p.emoji + ' ' + p.name + ' x' + i.qty + ' → ' + rp(p.price * i.qty);
  }).join('\n');

  const shipText  = ship === 0 ? 'GRATIS 🎉' : rp(ship);
  const emailLine = email ? '\n📧 Email       : ' + email : '';
  const noteLine  = note  ? '\n📝 Catatan    : ' + note  : '';

  const msg =
    '🥜 *PESANAN BARU — Kacang Gurih Nusantara*' +
    '\n' +
    '\n📋 *Detail Pesanan:*' +
    '\n' + itemLines +
    '\n' +
    '\n💰 Subtotal   : ' + rp(sub) +
    '\n🚚 Ongkir     : ' + shipText +
    '\n💵 *TOTAL     : ' + rp(grand) + '*' +
    '\n' +
    '\n👤 *Data Pemesan:*' +
    '\n🧍 Nama       : ' + name +
    emailLine +
    '\n📍 Alamat     : ' + addr +
    '\n' +
    '\n💳 Pembayaran : ' + pay +
    noteLine +
    '\n' +
    '\n_Mohon konfirmasi pesanan ini. Terima kasih! 🙏_';

  return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
}

// ── Submit Pesanan -> WhatsApp ─────────────────────────────────────
function initCheckoutForm() {
  $('#checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Periksa kembali isian formulir.', 'error');
      return;
    }

    const waURL = buildWhatsAppURL();

    const btn = $('#submitOrder');
    btn.innerHTML = '<span>⏳</span> Membuka WhatsApp...';
    btn.disabled  = true;
    btn.classList.add('opacity-70', 'cursor-not-allowed');

    window.open(waURL, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      closeModal();
      cart = [];
      save();
      updateCartUI();
      $('#checkoutForm').reset();
      document.querySelectorAll('.form-input.invalid').forEach((el) => el.classList.remove('invalid'));
      document.querySelectorAll('.err-msg').forEach((el) => el.classList.add('hidden'));

      btn.innerHTML = '<span>💬</span> Pesan via WhatsApp';
      btn.disabled  = false;
      btn.classList.remove('opacity-70', 'cursor-not-allowed');

      showToast('🎉 Pesanan dikirim ke WhatsApp! Selesaikan di sana ya 🙏', 'success', 5000);

      renderProducts('semua');
      document.querySelector('.filter-btn.active')?.classList.remove('active');
      document.querySelector('.filter-btn')?.classList.add('active');
    }, 600);
  });
}
