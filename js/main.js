// ==========================================
// KACANG ASIN MBAH GURIH - MAIN JAVASCRIPT
// ==========================================

const WA_NUMBER = "6285183371170";

// Data Produk (4 Ukuran Kemasan)
const products = [
    {
        id: 1,
        name: 'Kacang Asin Kemasan 100g',
        price: 12000,
        desc: 'Cocok untuk nyemil sendiri sekali habis.',
        img: 'Kacang 100gr.jpeg'
    },
    {
        id: 2,
        name: 'Kacang Asin Kemasan 250g',
        price: 25000,
        desc: 'Pas untuk menemani waktu nonton film.',
        img: 'Kacang 250gr.jpeg'
    },
    {
        id: 3,
        name: 'Kacang Asin Kemasan 500g',
        price: 48000,
        desc: 'Pilihan hemat untuk keluarga.',
        img: 'Kacang 500gr.jpeg'
    },
    {
        id: 4,
        name: 'Kacang Asin Kemasan 1Kg',
        price: 90000,
        desc: 'Kemasan pouch besar paling hemat untuk keluarga.',
        img: 'Kacang 1kg Pouch.jpeg'
    }
];

let cart = [];

// Format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

// Render Products
const productGrid = document.getElementById('product-grid');

function renderProducts() {
    if (!productGrid) return;
    productGrid.innerHTML = products.map(p => `
        <div class="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col">
            <div class="relative overflow-hidden bg-stone-100">
                <img src="${p.img}" alt="${p.name}" class="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500">
            </div>
            <div class="p-5 flex flex-col flex-1">
                <h3 class="text-lg font-bold text-stone-800 mb-1 leading-snug">${p.name}</h3>
                <p class="text-sm text-stone-500 mb-4 h-10 leading-relaxed">${p.desc}</p>
                <div class="flex justify-between items-center mt-auto pt-2 border-t border-stone-100">
                    <span class="text-primary font-bold text-lg">${formatRupiah(p.price)}</span>
                    <button onclick="addToCart(${p.id})" class="w-10 h-10 rounded-full bg-secondary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors shadow-sm" aria-label="Tambah ${p.name}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showToast(`Berhasil menambahkan ${product.name} ke keranjang!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function changeQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}


function updateCartUI() {
    const cartCountLabel = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const btnCheckout = document.getElementById('btn-checkout');

    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountLabel) {
        if (totalItems > 0) {
            cartCountLabel.textContent = totalItems;
            cartCountLabel.classList.remove('hidden');
        } else {
            cartCountLabel.classList.add('hidden');
        }
    }

    // Update Items List
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center text-stone-400 mt-10">
                    <i class="fas fa-shopping-basket text-5xl mb-4 text-stone-200"></i>
                    <p class="font-medium text-stone-500">Keranjang Anda masih kosong.</p>
                    <p class="text-xs text-stone-400 mt-1">Silakan pilih produk favorit Anda terlebih dahulu.</p>
                </div>
            `;
            if (btnCheckout) btnCheckout.disabled = true;
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="flex items-center gap-4 py-4 border-b border-stone-100">
                    <img src="${item.img}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover shadow-sm shrink-0">
                    <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-bold text-stone-800 line-clamp-1">${item.name}</h4>
                        <p class="text-primary font-semibold text-sm mt-0.5">${formatRupiah(item.price)}</p>
                        <div class="flex items-center mt-2 border border-stone-200 rounded-lg w-min">
                            <button onclick="changeQuantity(${item.id}, -1)" class="px-2.5 py-1 text-stone-500 hover:text-primary hover:bg-stone-50 rounded-l-lg text-sm font-semibold" aria-label="Kurang satu">-</button>
                            <span class="px-3 py-1 text-xs font-semibold text-stone-800">${item.quantity}</span>
                            <button onclick="changeQuantity(${item.id}, 1)" class="px-2.5 py-1 text-stone-500 hover:text-primary hover:bg-stone-50 rounded-r-lg text-sm font-semibold" aria-label="Tambah satu">+</button>
                        </div>
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="text-stone-400 hover:text-red-500 p-2 transition-colors" aria-label="Hapus produk">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `).join('');
            if (btnCheckout) btnCheckout.disabled = false;
        }
    }

    // Update Total
    if (cartTotalEl) {
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalEl.textContent = formatRupiah(totalPrice);
    }
}

// UI Toggles
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
let cartOpen = false;

function toggleCart() {
    cartOpen = !cartOpen;
    if (cartOpen) {
        cartOverlay.classList.remove('hidden');
        setTimeout(() => {
            cartOverlay.classList.remove('opacity-0');
            cartSidebar.classList.remove('translate-x-full');
        }, 10);
    } else {
        cartOverlay.classList.add('opacity-0');
        cartSidebar.classList.add('translate-x-full');
        setTimeout(() => {
            cartOverlay.classList.add('hidden');
        }, 300);
    }
}

const checkoutModal = document.getElementById('checkout-modal');
function openCheckout() {
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const checkoutTotal = document.getElementById('checkout-total');
    if (checkoutTotal) checkoutTotal.textContent = formatRupiah(totalPrice);
    
    toggleCart();
    checkoutModal.classList.remove('hidden');
}

function closeCheckout() {
    checkoutModal.classList.add('hidden');
}

// Mobile Menu Toggle
let mobileMenuOpen = false;
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('menuIcon');
    if (!menu) return;
    mobileMenuOpen = !mobileMenuOpen;
    if (mobileMenuOpen) {
        menu.classList.remove('hidden');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    } else {
        menu.classList.add('hidden');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}


// Process Order -> Direct to WhatsApp
function processOrder(e) {
    e.preventDefault();

    const name = document.getElementById('custName').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const noteEl = document.getElementById('custNote');
    const note = noteEl ? noteEl.value.trim() : '';
    const pay = document.getElementById('payMethod').value;
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (!name || !address) {
        showToast('Mohon lengkapi nama dan alamat pengiriman.', 'error');
        return;
    }

    const itemLines = cart.map(item => `  • ${item.name} x${item.quantity} = ${formatRupiah(item.price * item.quantity)}`).join('\n');
    const noteLine = note ? `\n📝 Catatan    : ${note}` : '';

    const waMessage = 
`🥜 *PESANAN BARU — Kacang Gurih Nusantara*

📋 *Detail Pesanan:*
${itemLines}

💵 *Total Tagihan : ${formatRupiah(totalPrice)}*

👤 *Data Pengiriman:*
🧍 Nama       : ${name}
📍 Alamat     : ${address}
💳 Pembayaran : ${pay}${noteLine}

_Mohon konfirmasi pesanan ini. Terima kasih!_ 🙏`;

    const waURL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;

    const submitBtn = document.getElementById('submitOrderBtn');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i><span>Membuka WhatsApp...</span>';
        submitBtn.disabled = true;
    }

    window.open(waURL, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
        closeCheckout();
        cart = [];
        updateCartUI();
        const form = document.getElementById('checkout-form');
        if (form) form.reset();

        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fab fa-whatsapp text-lg mr-2"></i><span>Pesan via WhatsApp</span>';
            submitBtn.disabled = false;
        }

        showToast('Pesanan berhasil dibuat! Selesaikan konfirmasi di WhatsApp.', 'success', 5000);
    }, 600);
}

// Custom Toast Notification System
function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    
    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

    toast.className = `flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white ${bgColor} toast-enter mb-2 pointer-events-auto max-w-sm`;
    toast.innerHTML = `
        <i class="fas ${icon} text-lg shrink-0"></i>
        <span class="font-medium text-sm leading-snug">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-exit');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    if (window.scrollY > 20) {
        nav.classList.add('shadow-md');
        nav.classList.remove('shadow-sm');
    } else {
        nav.classList.add('shadow-sm');
        nav.classList.remove('shadow-md');
    }
});

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});
