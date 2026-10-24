/* ============================================================
 *  products.js — Render kartu produk & filter kategori
 *  Mendukung 4 varian reguler + 1 produk premium eksklusif
 *  Bergantung pada: data.js ($, rp, fp, PRODUCTS)
 *                   cart.js (cart, addToCart)
 * ============================================================ */

function buildCard(p, idx = 0) {
  const inCart = cart.find((i) => i.id === p.id);

  const badge = p.label
    ? `<span class="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[.72rem] font-bold text-white ${p.lc}">${p.label}</span>`
    : '';

  const oldP = p.oldPrice
    ? `<span class="line-through text-muted text-xs ml-1.5">${rp(p.oldPrice)}</span>`
    : '';

  return `
    <div class="product-card" style="animation-delay:${idx * 0.07}s" data-id="${p.id}">
      <div class="relative h-[175px] grid place-items-center text-[5.5rem] bg-gradient-to-br from-amber-50 to-amber-100">
        <span class="p-emoji">${p.emoji}</span>
        ${badge}
      </div>
      <div class="flex flex-col flex-1 p-5">
        <h3 class="text-brown-800 font-semibold text-sm mb-1.5 leading-snug">${p.name}</h3>
        <p class="text-muted text-xs mb-3 flex-1 line-clamp-2">${p.desc}</p>
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <span class="font-extrabold text-orange-600 text-base">${rp(p.price)}</span>${oldP}
            <span class="block text-[.7rem] text-muted mt-0.5">⭐${p.rating} · Terjual ${p.sold}</span>
          </div>
          <button class="add-to-cart-btn ${inCart ? 'added' : ''}"
                  data-id="${p.id}"
                  aria-label="Tambah ke keranjang">
            ${inCart ? '✓ Ditambahkan' : '+ Keranjang'}
          </button>
        </div>
      </div>
    </div>`;
}

function buildPremiumCard(p) {
  const inCart = cart.find((i) => i.id === p.id);
  const oldP = p.oldPrice
    ? `<span class="line-through text-muted text-sm ml-2">${rp(p.oldPrice)}</span>`
    : '';

  const featureList = (p.features || [
    'Kacang Grade A+ Pilihan Ukuran Jumbo',
    'Toples Eksklusif Kedap Udara & Pita Mewah',
    'Termasuk Kartu Ucapan & Box Eksklusif',
    'Garansi Renyah & Gurih 100%'
  ]).map((f) => `
    <li class="flex items-center gap-2 text-xs md:text-sm text-brown-800">
      <span class="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
      <span>${f}</span>
    </li>
  `).join('');

  return `
    <div class="relative bg-gradient-to-br from-amber-50 via-white to-orange-50/70 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-[0_12px_35px_rgba(234,88,12,0.12)] transition-all duration-300 hover:shadow-[0_16px_45px_rgba(234,88,12,0.18)]" data-id="${p.id}">
      <div class="absolute -top-3.5 left-6 sm:left-8 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-extrabold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-md flex items-center gap-1.5">
        <span>⭐</span> EDISI PREMIUM EKSKLUSIF
      </div>
      <div class="grid md:grid-cols-[1fr_1.3fr] gap-8 items-center mt-2">
        <div class="relative flex items-center justify-center p-8 bg-gradient-to-br from-amber-100/70 to-orange-100/60 rounded-2xl overflow-hidden group min-h-[220px]">
          <div class="text-[6.5rem] sm:text-[7.5rem] select-none transition-transform duration-500 group-hover:scale-110 drop-shadow-md">
            ${p.emoji}
          </div>
          <span class="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm border border-orange-100">
            ⭐ ${p.rating} · Terjual ${p.sold}
          </span>
          <span class="absolute top-3 right-3 bg-brown-800 text-amber-300 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm">
            Grade A+ Super
          </span>
        </div>
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-bold text-orange-600 tracking-wider uppercase">Signature Collection</span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-brown-800 mb-2 leading-tight">${p.name}</h3>
            <p class="text-muted text-sm mb-5 leading-relaxed">${p.desc}</p>
            <ul class="grid sm:grid-cols-2 gap-2.5 mb-6">
              ${featureList}
            </ul>
          </div>
          <div class="pt-4 border-t border-amber-200/70 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span class="text-xs text-muted block font-medium">Harga Spesial</span>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl sm:text-3xl font-black text-orange-600">${rp(p.price)}</span>
                ${oldP}
              </div>
            </div>
            <button class="add-to-cart-btn text-sm sm:text-base px-6 py-3 shadow-md hover:shadow-lg ${inCart ? 'added' : ''}"
                    data-id="${p.id}"
                    aria-label="Tambah ke keranjang">
              ${inCart ? '✓ Ditambahkan' : '🛒 + Tambah ke Keranjang'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderProducts(filter = 'semua') {
  const container = $('#productsGrid');
  if (!container) return;

  const premiumProduct = PRODUCTS.find((p) => p.category === 'premium');
  const regularProducts = PRODUCTS.filter((p) => p.category === 'reguler');

  let html = '';

  if (filter === 'semua') {
    if (premiumProduct) {
      html += `
        <div class="mb-12">
          ${buildPremiumCard(premiumProduct)}
        </div>
      `;
    }
    if (regularProducts.length) {
      html += `
        <div>
          <div class="flex items-center justify-between mb-6 pb-2 border-b border-amber-200/70">
            <div>
              <h3 class="text-xl font-extrabold text-brown-800 flex items-center gap-2">
                <span>🥜</span> Varian Rasa Reguler
              </h3>
              <p class="text-xs text-muted mt-0.5">Camilan renyah sehari-hari dalam kemasan zip-lock 250g</p>
            </div>
            <span class="text-xs font-semibold px-3 py-1 bg-amber-100 text-brown-700 rounded-full">
              4 Pilihan Rasa
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            ${regularProducts.map((p, i) => buildCard(p, i)).join('')}
          </div>
        </div>
      `;
    }
  } else if (filter === 'premium') {
    html = premiumProduct
      ? `<div class="max-w-4xl mx-auto">${buildPremiumCard(premiumProduct)}</div>`
      : `<p class="text-center text-muted py-12">Produk premium belum tersedia.</p>`;
  } else if (filter === 'reguler') {
    html = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${regularProducts.map((p, i) => buildCard(p, i)).join('')}
      </div>
    `;
  }

  container.innerHTML = html;

  // Pasang event listener ke setiap tombol "Tambah ke Keranjang"
  container.querySelectorAll('.add-to-cart-btn').forEach((btn) =>
    btn.addEventListener('click', () => addToCart(+btn.dataset.id, btn)),
  );
}
