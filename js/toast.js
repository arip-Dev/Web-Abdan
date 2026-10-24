/* ============================================================
 *  toast.js — Notifikasi toast pop-up
 *  Bergantung pada: data.js ($)
 * ============================================================ */

let _toastId = 0;

/**
 * Tampilkan notifikasi toast.
 * @param {string} msg   - Pesan yang ditampilkan
 * @param {'success'|'error'|'info'} type - Jenis toast (warna)
 * @param {number} dur   - Durasi tampil dalam ms (default 3200)
 */
function showToast(msg, type = 'info', dur = 3200) {
  const id  = ++_toastId;
  const col = type === 'success' ? '#22c55e'
            : type === 'error'   ? '#ef4444'
            : '#f59e0b';

  const wrap = document.getElementById('toastContainer');
  const el   = document.createElement('div');

  el.id        = 'toast-' + id;
  el.style.pointerEvents = 'all';
  el.className = 'relative flex items-start gap-3 px-5 py-4 rounded-2xl text-white text-sm font-semibold shadow-2xl max-w-xs w-full animate-toast-in overflow-hidden';
  el.style.background = col;
  el.innerHTML = `
    <span class="text-base mt-0.5">ℹ️</span>
    <p class="flex-1">${msg}</p>
    <button onclick="document.getElementById('toast-${id}').remove()"
            class="w-6 h-6 flex-shrink-0 opacity-70 hover:opacity-100">✕</button>
    <div class="absolute bottom-0 left-0 h-1 bg-white/40 bar-shrink"
         style="animation-duration:${dur}ms"></div>`;

  wrap.appendChild(el);

  setTimeout(() => {
    el.classList.replace('animate-toast-in', 'animate-toast-out');
    setTimeout(() => el.remove(), 400);
  }, dur);
}
