'use strict';

// ============================================================
// CONSTANTS
// ============================================================
const TRAKTEER_URL  = 'https://trakteer.id/Han_azaki/tip';
const CART_KEY      = 'antisuki_cart';

const MENU_ITEMS = [
    {
        id: 1,
        name: 'Alpukat Kocok Mantap',
        desc: 'Minuman alpukat segar dikocok hingga super creamy, manis alami, dan menyegarkan. Cocok buat cuaca panas!',
        price: 18000,
        emoji: '🥑',
        bg: 'bg-yellow'
    },
    {
        id: 2,
        name: 'Bubur Muwani Blubuk Blubuk',
        desc: 'Bubur hangat dengan kuah kental yang menggoda. Tekstur lembut, rasa kaya rempah pilihan. Blubuk blubuk!',
        price: 22000,
        emoji: '🍲',
        bg: 'bg-red'
    },
    {
        id: 3,
        name: 'Jus Kebal Sagne',
        desc: 'Jus spesial campuran buah-buahan pilihan yang bikin imunitas kebal. Segar, sehat, dan menyehatkan!',
        price: 15000,
        emoji: '🥤',
        bg: 'bg-yellow'
    },
    {
        id: 4,
        name: 'Puding Coklat Pak Hambali',
        desc: 'Puding coklat legit resep rahasia Pak Hambali. Lembut, manis, dan dijamin bikin ketagihan!',
        price: 12000,
        emoji: '🍮',
        bg: 'bg-red'
    }
];

// ============================================================
// CART — localStorage
// ============================================================
function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch { return {}; }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function cartTotalItems() {
    return Object.values(getCart()).reduce((s, i) => s + i.qty, 0);
}

function cartSubtotal() {
    return Object.values(getCart()).reduce((s, i) => s + i.price * i.qty, 0);
}

// ============================================================
// UTILS
// ============================================================
function formatRp(n) {
    return 'Rp ' + n.toLocaleString('id-ID');
}

function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
        el.classList.add('out');
        el.addEventListener('animationend', () => el.remove(), { once: true });
    }, 3000);
}

// ============================================================
// NAV BADGE — shows cart count on all pages
// ============================================================
function updateNavBadge() {
    const badge = document.getElementById('nav-badge');
    if (!badge) return;
    const count = cartTotalItems();
    badge.textContent = count > 0 ? count : '';
}

// ============================================================
// NAVBAR: scroll effect + hamburger
// ============================================================
function initNavbar() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
        document.addEventListener('click', e => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('open');
                navMenu.classList.remove('open');
            }
        });
    }
}

// ============================================================
// SCROLL ANIMATIONS (generic .animate-on-scroll)
// ============================================================
function initScrollAnimations() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => obs.observe(el));
}

// Observe menu cards after they're rendered
function observeCards() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('.menu-card').forEach(c => obs.observe(c));
}

// ============================================================
// STAT COUNTER ANIMATION (index.html)
// ============================================================
function initCounters() {
    function animateNum(el, target, duration) {
        const start = performance.now();
        const tick = now => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(ease * target);
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNum(entry.target, +entry.target.dataset.target, 1200);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.stat-num[data-target]').forEach(el => obs.observe(el));
}

// ============================================================
// HERO TITLE character animation stagger (index.html)
// ============================================================
function initHeroChars() {
    document.querySelectorAll('.title-char').forEach((c, i) => {
        c.style.animationDelay = `${0.55 + i * 0.07}s`;

        c.addEventListener('mouseenter', () => {
            c.style.animation = 'charBounce .45s ease';
            c.addEventListener('animationend', () => { c.style.animation = ''; }, { once: true });
        });
    });
}

// ============================================================
// SECTION TITLE hover glow
// ============================================================
function initTitleGlow() {
    document.querySelectorAll('.section-title, .page-hero-title').forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.filter = 'drop-shadow(0 0 18px rgba(204,0,0,.32))';
        });
        el.addEventListener('mouseleave', () => {
            el.style.filter = '';
        });
    });
}

// ============================================================
// PAGE: index.html  —  HOME
// ============================================================
function initHomePage() {
    initHeroChars();
    initCounters();
}

// ============================================================
// PAGE: menu.html  —  MENU
// ============================================================
function addToCart(id) {
    const item = MENU_ITEMS.find(m => m.id === id);
    if (!item) return;

    const cart = getCart();
    if (cart[id]) {
        cart[id].qty++;
    } else {
        cart[id] = { ...item, qty: 1 };
    }
    saveCart(cart);
    updateNavBadge();
    updateFloatCart();
    showToast(`✅ ${item.name} ditambahkan!`);

    // button feedback
    const btn = document.getElementById(`btn-add-${id}`);
    if (btn) {
        btn.textContent = '✓ Ditambahkan';
        btn.classList.add('added');
        setTimeout(() => {
            btn.textContent = '+ Tambah';
            btn.classList.remove('added');
        }, 1600);
    }
}

function updateFloatCart() {
    const fc    = document.getElementById('float-cart');
    const badge = document.getElementById('float-badge');
    if (!fc) return;
    const count = cartTotalItems();
    if (count > 0) {
        fc.style.display = 'flex';
        if (badge) badge.textContent = count;
    } else {
        fc.style.display = 'none';
    }
}

function renderMenuGrid() {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    grid.innerHTML = '';
    MENU_ITEMS.forEach((item, idx) => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.style.transitionDelay = `${idx * 0.12}s`;
        card.innerHTML = `
            <div class="card-visual ${item.bg}">
                <span class="card-emoji">${item.emoji}</span>
            </div>
            <div class="card-body">
                <h3 class="card-name">${item.name}</h3>
                <p class="card-desc">${item.desc}</p>
                <div class="card-footer">
                    <span class="card-price">${formatRp(item.price)}</span>
                    <button class="btn-add" id="btn-add-${item.id}" onclick="addToCart(${item.id})">
                        + Tambah
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    observeCards();
}

function initMenuPage() {
    renderMenuGrid();
    updateFloatCart();
}

// ============================================================
// PAGE: payment.html  —  PAYMENT
// ============================================================
function changeQty(id, delta) {
    const cart = getCart();
    if (!cart[id]) return;
    cart[id].qty += delta;
    if (cart[id].qty <= 0) delete cart[id];
    saveCart(cart);
    updateNavBadge();
    renderCartUI();
}

function clearCart() {
    saveCart({});
    updateNavBadge();
    renderCartUI();
    showToast('🗑 Keranjang dikosongkan');
}

function renderCartUI() {
    const cart      = getCart();
    const emptyEl   = document.getElementById('cart-empty');
    const itemsEl   = document.getElementById('cart-items');
    const summaryEl = document.getElementById('cart-summary');
    const actionsEl = document.getElementById('cart-actions');
    const badgeEl   = document.getElementById('cart-badge');

    if (!emptyEl || !itemsEl) return;

    const entries = Object.values(cart);
    const count   = entries.reduce((s, i) => s + i.qty, 0);

    if (badgeEl) badgeEl.textContent = count;

    if (entries.length === 0) {
        emptyEl.style.display  = '';
        itemsEl.innerHTML      = '';
        if (summaryEl) summaryEl.style.display = 'none';
        if (actionsEl) actionsEl.style.display = 'none';
        return;
    }

    emptyEl.style.display = 'none';
    if (summaryEl) summaryEl.style.display = '';
    if (actionsEl) actionsEl.style.display = 'flex';

    itemsEl.innerHTML = entries.map(item => `
        <div class="cart-item">
            <div class="ci-emoji">${item.emoji}</div>
            <div class="ci-info">
                <div class="ci-name">${item.name}</div>
                <div class="ci-price">${formatRp(item.price * item.qty)}</div>
            </div>
            <div class="ci-qty">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)" aria-label="Kurangi">−</button>
                <span class="qty-num">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)" aria-label="Tambah">+</button>
            </div>
        </div>
    `).join('');

    const sub = cartSubtotal();
    const tax = Math.round(sub * 0.1);

    const subtotalEl = document.getElementById('subtotal-val');
    const taxEl      = document.getElementById('tax-val');
    const totalEl    = document.getElementById('total-val');
    if (subtotalEl) subtotalEl.textContent = formatRp(sub);
    if (taxEl)      taxEl.textContent      = formatRp(tax);
    if (totalEl)    totalEl.textContent    = formatRp(sub + tax);
}

function initPaymentPage() {
    renderCartUI();

    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) clearBtn.addEventListener('click', clearCart);

    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        const cart = getCart();
        if (Object.keys(cart).length === 0) {
            showToast('❌ Keranjang masih kosong! Pilih menu dulu.');
            return;
        }

        const name = document.getElementById('cust-name').value.trim();
        if (!name) {
            showToast('❌ Masukkan nama pemesan terlebih dahulu!');
            document.getElementById('cust-name').focus();
            return;
        }

        showToast('🎁 Menuju halaman pembayaran Trakteer...');
        setTimeout(() => window.open(TRAKTEER_URL, '_blank'), 900);
    });
}

// ============================================================
// INJECT KEYFRAMES
// ============================================================
const extraStyles = document.createElement('style');
extraStyles.textContent = `
@keyframes charBounce {
    0%  { transform: translateY(0) scale(1); }
    30% { transform: translateY(-14px) scale(1.2); }
    60% { transform: translateY(4px) scale(.95); }
    100%{ transform: translateY(0) scale(1); }
}`;
document.head.appendChild(extraStyles);

// ============================================================
// PARALLAX — food silhouettes move at different scroll speeds
// ============================================================
function initParallax() {
    const sils = document.querySelectorAll('.sil[data-speed]');
    if (!sils.length) return;

    let ticking = false;

    function tick() {
        const sy = window.scrollY;
        sils.forEach(sil => {
            const speed   = parseFloat(sil.dataset.speed)   || 0.15;
            const initRot = parseFloat(sil.dataset.rot)     || 0;
            // Move up more slowly than page scroll → appears far in background
            const ty  = -(sy * speed);
            // Subtle rotation as you scroll
            const rot = initRot + sy * speed * 0.012;
            sil.style.transform = `translateY(${ty.toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`;
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(tick); ticking = true; }
    }, { passive: true });

    tick(); // set initial position on load
}

// ============================================================
// BOOT — detect page and run correct init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Common for all pages
    initNavbar();
    initScrollAnimations();
    initTitleGlow();
    updateNavBadge();
    initParallax();

    // Page-specific
    const body = document.body;
    if (body.classList.contains('page-home'))    initHomePage();
    if (body.classList.contains('page-menu'))    initMenuPage();
    if (body.classList.contains('page-payment')) initPaymentPage();
});
