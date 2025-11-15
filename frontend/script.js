// script.js

const PEXELS_API_KEY = "zMdhk5QB6WkxyVU5p1mAzU9HTYHMHjJcu5piEs8OYwkwyKmNrUhSt0VC";
const CURRENCY = '₱';

// Load products from admin updates or use defaults
let productList = (() => {
    const adminUpdated = localStorage.getItem('adminProductsUpdated');
    if (adminUpdated) {
        try {
            return JSON.parse(adminUpdated);
        } catch (err) {
            console.error('Error parsing admin products:', err);
            return getDefaultProducts();
        }
    }
    return getDefaultProducts();
})();

function getDefaultProducts() {
    return [
        { id: 1, name: "Classic White Sneakers", price: 2499.00, desc: "Timeless white leather sneakers perfect for everyday wear.", stock: 45, image: "https://via.placeholder.com/400x280?text=White+Sneakers" },
        { id: 2, name: "Premium Running Shoes", price: 3999.00, desc: "Advanced cushioning technology for optimal running performance.", stock: 38, image: "https://via.placeholder.com/400x280?text=Running+Shoes" },
        { id: 3, name: "Casual Canvas Shoes", price: 1899.00, desc: "Comfortable canvas design for relaxed, casual style.", stock: 52, image: "https://via.placeholder.com/400x280?text=Canvas+Shoes" },
        { id: 4, name: "Formal Leather Oxfords", price: 4499.00, desc: "Elegant leather oxfords for professional and formal occasions.", stock: 28, image: "https://via.placeholder.com/400x280?text=Formal+Oxfords" },
        { id: 5, name: "Sport Basketball Shoes", price: 3599.00, desc: "High-performance basketball shoes with ankle support.", stock: 22, image: "https://via.placeholder.com/400x280?text=Basketball+Shoes" },
        { id: 6, name: "Lightweight Hiking Boots", price: 3899.00, desc: "Durable waterproof boots designed for mountain trails.", stock: 31, image: "https://via.placeholder.com/400x280?text=Hiking+Boots" },
        { id: 7, name: "Slip-On Loafers", price: 2799.00, desc: "Comfortable slip-on design with premium leather construction.", stock: 40, image: "https://via.placeholder.com/400x280?text=Loafers" },
        { id: 8, name: "Mesh Athletic Shoes", price: 2199.00, desc: "Breathable mesh upper for intense workouts and training.", stock: 48, image: "https://via.placeholder.com/400x280?text=Athletic+Shoes" },
        { id: 9, name: "Winter Snow Boots", price: 4199.00, desc: "Insulated waterproof boots for cold weather conditions.", stock: 25, image: "https://via.placeholder.com/400x280?text=Snow+Boots" },
        { id: 10, name: "Casual Boat Shoes", price: 2599.00, desc: "Classic boat shoes perfect for casual and semi-formal events.", stock: 33, image: "https://via.placeholder.com/400x280?text=Boat+Shoes" },
        { id: 11, name: "High-Top Basketball Shoes", price: 4099.00, desc: "Premium high-top design with superior ankle protection.", stock: 20, image: "https://via.placeholder.com/400x280?text=High+Top+Basketball" },
        { id: 12, name: "Fashion Sneaker Boots", price: 3299.00, desc: "Trendy hybrid sneaker-boot style for street fashion.", stock: 29, image: "https://via.placeholder.com/400x280?text=Sneaker+Boots" },
        { id: 13, name: "Professional Work Shoes", price: 2899.00, desc: "Comfortable shoes designed for all-day professional wear.", stock: 36, image: "https://via.placeholder.com/400x280?text=Work+Shoes" },
        { id: 14, name: "Trail Running Shoes", price: 3699.00, desc: "Aggressive tread pattern for off-road trail running.", stock: 24, image: "https://via.placeholder.com/400x280?text=Trail+Running" },
        { id: 15, name: "Elegant Dress Heels", price: 3399.00, desc: "Sophisticated heels for evening wear and special occasions.", stock: 18, image: "https://via.placeholder.com/400x280?text=Dress+Heels" },
        { id: 16, name: "Casual Flip Flops", price: 899.00, desc: "Lightweight comfortable flip flops for summer relaxation.", stock: 62, image: "https://via.placeholder.com/400x280?text=Flip+Flops" },
        { id: 17, name: "Waterproof Hiking Shoes", price: 3799.00, desc: "Advanced waterproofing technology for wet terrain hiking.", stock: 27, image: "https://via.placeholder.com/400x280?text=Waterproof+Hiking" },
        { id: 18, name: "Fashion Sandals", price: 1699.00, desc: "Stylish sandals combining comfort with trendy design.", stock: 50, image: "https://via.placeholder.com/400x280?text=Fashion+Sandals" },
        { id: 19, name: "Cross-Training Shoes", price: 2999.00, desc: "Versatile shoes for gym workouts and cross-training activities.", stock: 41, image: "https://via.placeholder.com/400x280?text=Cross+Training" },
        { id: 20, name: "Premium Chelsea Boots", price: 4599.00, desc: "Luxurious Chelsea boots with elastic sides and sleek design.", stock: 16, image: "https://via.placeholder.com/400x280?text=Chelsea+Boots" }
    ];
}

// Format currency with Philippine Peso
const formatCurrency = (value) => {
    try {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
    } catch (e) {
        return `${CURRENCY}${value.toFixed(2)}`;
    }
};

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} position-fixed`;
    toast.style.cssText = 'bottom: 20px; right: 20px; z-index: 9999; min-width: 300px; animation: slideInRight 0.3s ease;';
    toast.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// Fetch product image from Pexels with fallback
async function fetchProductImage(query, fallback) {
    try {
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`;
        const res = await fetch(url, {
            headers: { Authorization: PEXELS_API_KEY }
        });
        if (!res.ok) throw new Error(`Pexels ${res.status}`);
        const data = await res.json();
        if (data?.photos?.length > 0) {
            return data.photos[0].src.medium || data.photos[0].src.large;
        }
    } catch (err) {
        console.warn('Pexels fetch failed for', query);
    }
    return fallback || `https://via.placeholder.com/400x280?text=${encodeURIComponent(query)}`;
}

// --- DOM Elements ---
const productListEl = document.getElementById('product-list');
const cartListEl = document.getElementById('cart-list');
const cartCountEl = document.getElementById('cart-count');
const totalEl = document.getElementById('total');
const checkoutForm = document.getElementById('checkout-form');
const confirmCheckoutBtn = document.getElementById('confirm-checkout');

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// --- Cart Functions ---
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

async function renderProducts() {
    if (!productListEl) return;
    productListEl.innerHTML = '';

    for (const prod of productList) {
        const col = document.createElement('div');
        col.className = 'col';

        const fallbackUrl = prod.image;
        let imageUrl = await fetchProductImage(prod.name, fallbackUrl);

        const stockStatus = prod.stock > 20 ? 'plenty' : prod.stock > 0 ? 'low' : 'out';
        const stockBadgeColor = stockStatus === 'plenty' ? 'bg-info' : stockStatus === 'low' ? 'bg-warning' : 'bg-danger';
        const stockText = prod.stock > 0 ? `${prod.stock} in stock` : 'Out of Stock';

        col.innerHTML = `
            <div class="product-card">
                <img src="${imageUrl}" alt="${prod.name}" class="product-image" loading="lazy" onerror="this.src='${fallbackUrl}'">
                <div class="product-body">
                    <h5 class="product-name">${prod.name}</h5>
                    <p class="product-desc">${prod.desc}</p>
                    <div class="product-stock ${stockStatus}">
                        <span class="badge ${stockBadgeColor}">${stockText}</span>
                    </div>
                    <p class="product-price">${formatCurrency(prod.price)}</p>
                    <button class="btn btn-add-cart" data-id="${prod.id}" ${prod.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        productListEl.appendChild(col);
    }

    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            addToCart(id);
            showToast('Item added to cart!', 'success');
        });
    });
}

function addToCart(id) {
    const prod = productList.find(p => p.id === id);
    if (!prod || prod.stock === 0) {
        showToast('This item is out of stock', 'error');
        return;
    }

    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += 1;
    } else {
        cart.push({ id: prod.id, name: prod.name, price: prod.price, qty: 1 });
    }

    saveCart();
    renderCart();
}

function updateCart(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(id);
            return;
        }
        saveCart();
        renderCart();
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
    showToast('Item removed from cart', 'success');
}

function renderCart() {
    if (!cartListEl) return;
    cartListEl.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartListEl.innerHTML = '<div class="empty-cart"><i class="fas fa-inbox"></i><p>Your cart is empty</p></div>';
        if (document.getElementById('checkout-container')) {
            document.getElementById('checkout-container').style.display = 'none';
        }
    } else {
        if (document.getElementById('checkout-container')) {
            document.getElementById('checkout-container').style.display = 'block';
        }

        cart.forEach(item => {
            total += item.price * item.qty;
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <span style="flex: 1;">${item.name} <strong>(x${item.qty})</strong></span>
                <div class="d-flex gap-2 align-items-center">
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-secondary btn-update-cart" data-action="decrease" data-id="${item.id}">−</button>
                        <button type="button" class="btn btn-outline-secondary disabled">${item.qty}</button>
                        <button type="button" class="btn btn-outline-secondary btn-update-cart" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                    <span class="fw-bold" style="min-width: 100px; text-align: right;">${formatCurrency(item.price * item.qty)}</span>
                    <button type="button" class="btn btn-danger btn-sm btn-remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartListEl.appendChild(li);
        });
    }

    totalEl.innerText = formatCurrency(total);
    cartCountEl.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
    if (document.getElementById('cart-total-items')) {
        document.getElementById('cart-total-items').innerText = cart.length;
    }

    document.querySelectorAll('.btn-update-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const delta = e.currentTarget.dataset.action === 'increase' ? 1 : -1;
            updateCart(id, delta);
        });
    });

    document.querySelectorAll('.btn-remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            removeFromCart(id);
        });
    });
}

// --- Checkout Logic ---
if (confirmCheckoutBtn) {
    confirmCheckoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('customer-name')?.value.trim();
        const email = document.getElementById('customer-email')?.value.trim();
        const address = document.getElementById('customer-address')?.value.trim();

        if (!name || !email || !address) {
            showToast('Please fill out all checkout fields', 'error');
            return;
        }

        if (cart.length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const order = { customer: { name, email, address }, items: cart, total };

        try {
            confirmCheckoutBtn.disabled = true;
            const res = await fetch('http://localhost:3000/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });

            if (res.ok) {
                const data = await res.json();
                showToast(`Order placed! ID: ${data.orderId}`, 'success');
                cart = [];
                saveCart();
                renderCart();
                checkoutForm.reset();
                confirmCheckoutBtn.disabled = false;
                return;
            }
        } catch (err) {
            console.warn('Backend failed, using mock order');
        }

        // Fallback: Client-side mock order
        try {
            const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
            const mockId = `ORD-${Date.now().toString().slice(-8)}`;
            mockOrders.push({ orderId: mockId, ...order, createdAt: new Date().toISOString() });
            localStorage.setItem('mockOrders', JSON.stringify(mockOrders));

            showToast(`Order saved locally! ID: ${mockId}`, 'success');
            cart = [];
            saveCart();
            renderCart();
            checkoutForm.reset();
        } catch (err) {
            showToast('Error placing order', 'error');
        }
        confirmCheckoutBtn.disabled = false;
    });
}

// --- Contact Form Logic ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('contact-name')?.value.trim();
        const email = document.getElementById('contact-email')?.value.trim();
        const subject = document.getElementById('contact-subject')?.value.trim();
        const message = document.getElementById('contact-message')?.value.trim();
        const statusEl = document.getElementById('contact-status');

        if (!name || !email || !subject || !message) {
            showToast('Please fill all fields', 'error');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            });

            if (res.ok) {
                showToast('Message sent successfully!', 'success');
                contactForm.reset();
                return;
            }
        } catch (err) {
            console.warn('Contact endpoint failed');
        }

        // Fallback: Save locally
        const mockContacts = JSON.parse(localStorage.getItem('mockContacts') || '[]');
        mockContacts.push({ name, email, subject, message, createdAt: new Date().toISOString() });
        localStorage.setItem('mockContacts', JSON.stringify(mockContacts));
        showToast('Message saved locally', 'success');
        contactForm.reset();
    });
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Clear old admin products from cache to load fresh shoe products
    localStorage.removeItem('adminProductsUpdated');
    renderProducts();
    renderCart();
});