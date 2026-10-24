/* ============================================================
 *  data.js — Daftar produk & konfigurasi global
 *  Berisi: PRODUCTS array, konstanta ongkir, helper functions
 * ============================================================ */

// ── Konfigurasi ─────────────────────────────────────────────
const FREE_SHIP = 100000; // minimal belanja untuk gratis ongkir
const SHIP_COST = 15000; // biaya ongkos kirim default
const KEY = "kacangGurihCart"; // key localStorage
const WA_NUMBER = "6285183371170"; // nomor WhatsApp toko (62 = kode negara Indonesia)

// ── Helper Functions ─────────────────────────────────────────
/** Shortcut querySelector */
const $ = (s) => document.querySelector(s);

/** Format angka ke Rupiah: 18000 → "Rp18.000" */
const rp = (n) => "Rp" + n.toLocaleString("id-ID");

/** Cari produk berdasarkan id */
const fp = (id) => PRODUCTS.find((p) => p.id === id);

// ── Data Produk ──────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: "Kacang Asin Original 250g",
    category: "reguler",
    price: 18000,
    oldPrice: 22000,
    emoji: "🥜",
    label: "Best Seller",
    lc: "bg-brown-600",
    rating: 4.9,
    sold: "2.1rb",
    desc: "Kacang sangrai klasik asin gurih dengan garam laut alami.",
  },
  {
    id: 2,
    name: "Kacang Pedas Daun Jeruk 250g",
    category: "reguler",
    price: 22000,
    oldPrice: null,
    emoji: "🌶️",
    label: "Favorit",
    lc: "bg-orange-600",
    rating: 4.9,
    sold: "1.8rb",
    desc: "Sensasi pedas cabai asli berpadu harumnya daun jeruk segar.",
  },
  {
    id: 3,
    name: "Kacang Bawang Gurih 250g",
    category: "reguler",
    price: 24000,
    oldPrice: null,
    emoji: "🧄",
    label: "Renyah",
    lc: "bg-green-600",
    rating: 4.8,
    sold: "1.2rb",
    desc: "Kacang kulit ari berpadu taburan irisan bawang putih renyah.",
  },
  {
    id: 4,
    name: "Kacang Balado Pedas Manis 250g",
    category: "reguler",
    price: 21000,
    oldPrice: null,
    emoji: "🔥",
    label: "Gurih",
    lc: "bg-amber-600",
    rating: 4.7,
    sold: "960",
    desc: "Bumbu balado khas rempah Nusantara dengan rasa pedas manis.",
  },
  {
    id: 5,
    name: "Paket Hampers Kacang Premium Exclusive",
    category: "premium",
    isPremium: true,
    price: 95000,
    oldPrice: 120000,
    emoji: "👑",
    label: "Koleksi Premium",
    lc: "bg-gradient-to-r from-amber-500 to-orange-600",
    rating: 5.0,
    sold: "450+",
    desc: "Varian tertinggi kualitas super. Perpaduan toples eksklusif kedap udara berisi kacang sangrai pilihan grade A+ dengan bumbu rahasia istimewa. Sempurna untuk hidangan tamu kehormatan & bingkisan hampers.",
    features: [
      "Kacang Grade A+ Pilihan Ukuran Jumbo",
      "Toples Eksklusif Kedap Udara & Pita Mewah",
      "Termasuk Kartu Ucapan & Box Eksklusif",
      "Garansi Renyah & Gurih 100%"
    ]
  },
];
