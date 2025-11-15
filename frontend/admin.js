// admin.js - Admin Dashboard JavaScript

const PEXELS_API_KEY = "zMdhk5QB6WkxyVU5p1mAzU9HTYHMHjJcu5piEs8OYwkwyKmNrUhSt0VC";

// Check if admin is authenticated
function checkAdminAuth() {
    if (!localStorage.getItem('adminToken')) {
        window.location.href = 'admin-login.html';
    }
}

console.log('admin.js loaded (v2)');

// Server availability flag
let serverAvailable = false;

async function checkServerAvailability() {
    try {
        const res = await fetch('/api/health', { cache: 'no-store' });
        if (res && res.ok) {
            serverAvailable = true;
            console.info('Backend API reachable');
        } else {
            serverAvailable = false;
        }
    } catch (err) {
        serverAvailable = false;
    }
}

// Load products from localStorage or use defaults
function getAdminProducts() {
    const stored = localStorage.getItem('adminProducts');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Detect old/legacy inventory (hoodies/jackets) and migrate to shoe defaults
            const legacyKeywords = ['hoodie', 'jacket', 'parka', 'bomber'];
            const looksLegacy = Array.isArray(parsed) && parsed.some(p => {
                const n = (p.name || '').toLowerCase();
                return legacyKeywords.some(k => n.includes(k));
            });
            if (looksLegacy) {
                console.warn('Legacy adminProducts detected, migrating to shoe defaults.');
                const defaults = getDefaultProducts();
                saveAdminProducts(defaults);
                return defaults;
            }
            return parsed;
        } catch (err) {
            console.error('Error parsing stored products:', err);
            return getDefaultProducts();
        }
    }
    return getDefaultProducts();
}

// Try to load products from backend API if available, otherwise fall back to localStorage defaults
async function loadProducts() {
    if (serverAvailable) {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                // mirror to localStorage for offline
                try { localStorage.setItem('adminProducts', JSON.stringify(data)); } catch (e) {}
                return data;
            }
        } catch (e) {
            console.warn('Failed to fetch products from API, falling back to localStorage', e);
            serverAvailable = false;
        }
    }
    return getAdminProducts();
}

// Default products
function getDefaultProducts() {
    return [
        { id: 1, name: "Classic White Sneakers", category: 'Sneakers', sizes: ['6','7','8','9','10'], price: 2499.00, desc: "Timeless white leather sneakers perfect for everyday wear.", stock: 45, image: "https://via.placeholder.com/400x280?text=White+Sneakers" },
        { id: 2, name: "Premium Running Shoes", category: 'Running', sizes: ['7','8','9','10','11'], price: 3999.00, desc: "Advanced cushioning technology for optimal running performance.", stock: 38, image: "https://via.placeholder.com/400x280?text=Running+Shoes" },
        { id: 3, name: "Casual Canvas Shoes", category: 'Casual', sizes: ['6','7','8','9','10'], price: 1899.00, desc: "Comfortable canvas design for relaxed, casual style.", stock: 52, image: "https://via.placeholder.com/400x280?text=Canvas+Shoes" },
        { id: 4, name: "Formal Leather Oxfords", category: 'Formal', sizes: ['7','8','9','10'], price: 4499.00, desc: "Elegant leather oxfords for professional and formal occasions.", stock: 28, image: "https://via.placeholder.com/400x280?text=Formal+Oxfords" },
        { id: 5, name: "Sport Basketball Shoes", category: 'Basketball', sizes: ['8','9','10','11','12'], price: 3599.00, desc: "High-performance basketball shoes with ankle support.", stock: 22, image: "https://via.placeholder.com/400x280?text=Basketball+Shoes" },
        { id: 6, name: "Lightweight Hiking Boots", category: 'Hiking', sizes: ['7','8','9','10','11'], price: 3899.00, desc: "Durable waterproof boots designed for mountain trails.", stock: 31, image: "https://via.placeholder.com/400x280?text=Hiking+Boots" },
        { id: 7, name: "Slip-On Loafers", category: 'Loafers', sizes: ['7','8','9','10'], price: 2799.00, desc: "Comfortable slip-on design with premium leather construction.", stock: 40, image: "https://via.placeholder.com/400x280?text=Loafers" },
        { id: 8, name: "Mesh Athletic Shoes", category: 'Training', sizes: ['6','7','8','9','10'], price: 2199.00, desc: "Breathable mesh upper for intense workouts and training.", stock: 48, image: "https://via.placeholder.com/400x280?text=Athletic+Shoes" },
        { id: 9, name: "Winter Snow Boots", category: 'Boots', sizes: ['7','8','9','10','11'], price: 4199.00, desc: "Insulated waterproof boots for cold weather conditions.", stock: 25, image: "https://via.placeholder.com/400x280?text=Snow+Boots" },
        { id: 10, name: "Casual Boat Shoes", category: 'Casual', sizes: ['6','7','8','9','10'], price: 2599.00, desc: "Classic boat shoes perfect for casual and semi-formal events.", stock: 33, image: "https://via.placeholder.com/400x280?text=Boat+Shoes" },
        { id: 11, name: "High-Top Basketball Shoes", category: 'Basketball', sizes: ['8','9','10','11'], price: 4099.00, desc: "Premium high-top design with superior ankle protection.", stock: 20, image: "https://via.placeholder.com/400x280?text=High+Top+Basketball" },
        { id: 12, name: "Fashion Sneaker Boots", category: 'Boots', sizes: ['6','7','8','9','10'], price: 3299.00, desc: "Trendy hybrid sneaker-boot style for street fashion.", stock: 29, image: "https://via.placeholder.com/400x280?text=Sneaker+Boots" },
        { id: 13, name: "Professional Work Shoes", category: 'Work', sizes: ['7','8','9','10'], price: 2899.00, desc: "Comfortable shoes designed for all-day professional wear.", stock: 36, image: "https://via.placeholder.com/400x280?text=Work+Shoes" },
        { id: 14, name: "Trail Running Shoes", category: 'Trail', sizes: ['7','8','9','10','11'], price: 3699.00, desc: "Aggressive tread pattern for off-road trail running.", stock: 24, image: "https://via.placeholder.com/400x280?text=Trail+Running" },
        { id: 15, name: "Elegant Dress Heels", category: 'Heels', sizes: ['5','6','7','8'], price: 3399.00, desc: "Sophisticated heels for evening wear and special occasions.", stock: 18, image: "https://via.placeholder.com/400x280?text=Dress+Heels" },
        { id: 16, name: "Casual Flip Flops", category: 'Sandals', sizes: ['7','8','9','10'], price: 899.00, desc: "Lightweight comfortable flip flops for summer relaxation.", stock: 62, image: "https://via.placeholder.com/400x280?text=Flip+Flops" },
        { id: 17, name: "Waterproof Hiking Shoes", category: 'Hiking', sizes: ['7','8','9','10','11'], price: 3799.00, desc: "Advanced waterproofing technology for wet terrain hiking.", stock: 27, image: "https://via.placeholder.com/400x280?text=Waterproof+Hiking" },
        { id: 18, name: "Fashion Sandals", category: 'Sandals', sizes: ['6','7','8','9','10'], price: 1699.00, desc: "Stylish sandals combining comfort with trendy design.", stock: 50, image: "https://via.placeholder.com/400x280?text=Fashion+Sandals" },
        { id: 19, name: "Cross-Training Shoes", category: 'Training', sizes: ['6','7','8','9','10'], price: 2999.00, desc: "Versatile shoes for gym workouts and cross-training activities.", stock: 41, image: "https://via.placeholder.com/400x280?text=Cross+Training" },
        { id: 20, name: "Premium Chelsea Boots", category: 'Boots', sizes: ['7','8','9','10'], price: 4599.00, desc: "Luxurious Chelsea boots with elastic sides and sleek design.", stock: 16, image: "https://via.placeholder.com/400x280?text=Chelsea+Boots" }
    ];
}

// Save products to localStorage
function saveAdminProducts(products) {
    try {
        localStorage.setItem('adminProducts', JSON.stringify(products));
        localStorage.setItem('adminProductsUpdated', JSON.stringify(products));
    } catch (err) {
        console.error('Error saving products:', err);
        showToast('Error saving products. Please try again.', 'error');
    }
}

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

// Fetch images from Pexels API
async function searchPexelsImages(query) {
    try {
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6`;
        const res = await fetch(url, {
            headers: { Authorization: PEXELS_API_KEY }
        });
        if (!res.ok) throw new Error(`Pexels API error: ${res.status}`);
        const data = await res.json();
        return data.photos || [];
    } catch (err) {
        console.error('Pexels search failed:', err);
        showToast('Failed to search images. Check your connection.', 'error');
        return [];
    }
}

// Render products in the table
async function renderProductsTable() {
    const products = await loadProducts();
    const tbody = document.getElementById('products-table-body');
    const countEl = document.getElementById('product-count');
    
    tbody.innerHTML = '';
    countEl.textContent = (products && products.length) ? products.length : 0;

    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center text-muted py-4">
                    <i class="fas fa-inbox"></i> No products yet. Add your first product!
                </td>
            </tr>
        `;
        return;
    }

    (products || []).forEach(prod => {
        const row = document.createElement('tr');
        const category = prod.category || 'Shoes';
        const sizes = Array.isArray(prod.sizes) ? prod.sizes.join(', ') : (prod.sizes || 'N/A');
        row.innerHTML = `
            <td>${prod.id}</td>
            <td>
                <img src="${prod.image}" alt="${prod.name}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" 
                     onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'">
            </td>
            <td><strong>${prod.name}</strong></td>
            <td>${category}</td>
            <td><small>${sizes}</small></td>
            <td><span class="badge bg-success">₱${(prod.price||0).toFixed(2)}</span></td>
            <td>
                <span class="badge ${prod.stock > 20 ? 'bg-info' : prod.stock > 0 ? 'bg-warning' : 'bg-danger'}">
                    ${prod.stock} units
                </span>
            </td>
            <td><small>${(prod.desc||'').substring(0, 40)}...</small></td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-edit" data-id="${prod.id}" title="Edit product">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-delete" data-id="${prod.id}" title="Delete product">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);

        const editBtn = row.querySelector('.btn-edit');
        const delBtn = row.querySelector('.btn-delete');
        if (editBtn) editBtn.addEventListener('click', () => loadProductForEdit(prod.id));
        if (delBtn) delBtn.addEventListener('click', () => deleteProduct(prod.id));
    });
    console.debug('renderProductsTable: rendered', (products||[]).length, 'rows. First item:', products && products[0] && products[0].name);
}

// Load product data into form for editing
function loadProductForEdit(productId) {
    const products = getAdminProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showToast('Product not found!', 'error');
        return;
    }

    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-desc').value = product.desc;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-image-url').value = product.image;
    
    const preview = document.getElementById('product-image-preview');
    preview.src = product.image;
    preview.style.display = 'block';
    document.getElementById('image-url-display').textContent = product.image.substring(0, 50) + '...';

    // If category/sizes inputs exist in the form, populate them
    if (document.getElementById('product-category')) {
        document.getElementById('product-category').value = product.category || 'Shoes';
    }
    if (document.getElementById('product-sizes')) {
        document.getElementById('product-sizes').value = Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || '');
    }

    document.getElementById('form-title').textContent = `✏️ Edit Product #${productId}`;
    document.getElementById('submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Product';
    document.getElementById('cancel-edit-btn').style.display = 'inline-block';
    
    document.getElementById('product-form').dataset.editingId = productId;
    
    document.querySelector('.product-form-container').scrollIntoView({ behavior: 'smooth' });
}

// Delete product with confirmation
function deleteProduct(productId) {
    const products = getAdminProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showToast('Product not found!', 'error');
        return;
    }

    if (confirm(`🗑️ Delete "${product.name}"? This cannot be undone.`)) {
            (async () => {
                // try server delete first
                try {
                    if (serverAvailable) {
                        const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
                        if (res.ok) {
                            showToast('Product deleted on server!', 'success');
                            await renderProductsTable();
                            return;
                        }
                    }
                } catch (e) {
                    console.warn('Server delete failed, falling back to local', e);
                    serverAvailable = false;
                }

                // Fallback to local delete
                const updatedProducts = products.filter(p => p.id !== productId);
                saveAdminProducts(updatedProducts);
                await renderProductsTable();
                showToast('Product deleted successfully!', 'success');
            })();
    }
}

// Reset form to add mode
function resetFormToAddMode() {
    document.getElementById('product-form').reset();
    document.getElementById('product-form').dataset.editingId = '';
    document.getElementById('form-title').textContent = '➕ Add New Product';
    document.getElementById('submit-btn').innerHTML = '<i class="fas fa-plus"></i> Add Product';
    document.getElementById('cancel-edit-btn').style.display = 'none';
    document.getElementById('product-image-preview').style.display = 'none';
    document.getElementById('image-url-display').textContent = 'None';
    document.getElementById('product-image-url').value = '';
}

// Validate form data
function validateProductForm(name, price, desc, stock) {
    if (!name || name.length < 3) {
        showToast('Product name must be at least 3 characters.', 'error');
        return false;
    }
    if (price <= 0) {
        showToast('Price must be greater than 0.', 'error');
        return false;
    }
    if (!desc || desc.length < 10) {
        showToast('Description must be at least 10 characters.', 'error');
        return false;
    }
    if (stock < 0) {
        showToast('Stock cannot be negative.', 'error');
        return false;
    }
    return true;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    renderProductsTable();

    // Product form submission
    document.getElementById('product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('product-name').value.trim();
        const price = parseFloat(document.getElementById('product-price').value);
        const desc = document.getElementById('product-desc').value.trim();
        const stock = parseInt(document.getElementById('product-stock').value);
        const imageUrl = document.getElementById('product-image-url').value || 'https://via.placeholder.com/400x280?text=No+Image';
        // Optional fields: category and sizes (comma-separated)
        const category = (document.getElementById('product-category') && document.getElementById('product-category').value.trim()) || 'Shoes';
        const sizesRaw = (document.getElementById('product-sizes') && document.getElementById('product-sizes').value.trim()) || '';
        const sizes = sizesRaw ? sizesRaw.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(window.DEFAULT_SIZES) ? window.DEFAULT_SIZES : []);
        const editingId = this.dataset.editingId;

        if (!validateProductForm(name, price, desc, stock)) return;

        let products = getAdminProducts();

            if (editingId) {
            // Update existing product
            const product = products.find(p => p.id === parseInt(editingId));
            if (product) {
                product.name = name;
                product.price = price;
                product.desc = desc;
                product.stock = stock;
                product.image = imageUrl;
                    product.category = category;
                    product.sizes = sizes;
                showToast('✅ Product updated successfully!', 'success');
            }
        } else {
            // Add new product
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, name, price, desc, stock, image: imageUrl, category, sizes });
            showToast('✅ Product added successfully!', 'success');
        }

        saveAdminProducts(products);
        renderProductsTable();
        resetFormToAddMode();
    });

    // Image search
    document.getElementById('search-image-btn').addEventListener('click', async function() {
        const query = document.getElementById('product-image-search').value.trim();
        if (!query) {
            showToast('Please enter a search term.', 'error');
            return;
        }

        const loading = document.getElementById('image-loading');
        const results = document.getElementById('image-results');
        
        loading.style.display = 'block';
        results.style.display = 'none';
        results.innerHTML = '';

        const images = await searchPexelsImages(query);
        loading.style.display = 'none';

        if (images.length === 0) {
            showToast('No images found. Try a different search term.', 'error');
            return;
        }

        results.style.display = 'block';
        results.innerHTML = '<h6 class="mb-3"><i class="fas fa-image"></i> Select an image:</h6>';
        
        images.forEach(photo => {
            const imgOption = document.createElement('div');
            imgOption.className = 'image-option';
            imgOption.innerHTML = `
                <img src="${photo.src.small}" alt="${photo.alt || 'Image'}" style="width: 100%; max-height: 100px; object-fit: cover; border-radius: 4px;">
                <small class="d-block mt-2 text-muted">© ${photo.photographer}</small>
            `;
            
            imgOption.addEventListener('click', function() {
                document.querySelectorAll('.image-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                const imageUrl = photo.src.medium || photo.src.large;
                document.getElementById('product-image-url').value = imageUrl;
                
                const preview = document.getElementById('product-image-preview');
                preview.src = imageUrl;
                preview.style.display = 'block';
                document.getElementById('image-url-display').textContent = imageUrl.substring(0, 50) + '...';
            });
            
            results.appendChild(imgOption);
        });
    });
    
    document.getElementById('product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        (async () => {
            const name = document.getElementById('product-name').value.trim();
            const price = parseFloat(document.getElementById('product-price').value);
            const desc = document.getElementById('product-desc').value.trim();
            const stock = parseInt(document.getElementById('product-stock').value);
            const imageUrl = document.getElementById('product-image-url').value || 'https://via.placeholder.com/400x280?text=No+Image';
            // Optional fields: category and sizes (comma-separated)
            const category = (document.getElementById('product-category') && document.getElementById('product-category').value.trim()) || 'Shoes';
            const sizesRaw = (document.getElementById('product-sizes') && document.getElementById('product-sizes').value.trim()) || '';
            const sizes = sizesRaw ? sizesRaw.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(window.DEFAULT_SIZES) ? window.DEFAULT_SIZES : []);
            const editingId = this.dataset.editingId;

            if (!validateProductForm(name, price, desc, stock)) return;

            // If server available, try to POST/PUT to server
            if (serverAvailable) {
                try {
                    if (editingId) {
                        const res = await fetch(`/api/products/${editingId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name, price, desc, stock, image: imageUrl, category, sizes })
                        });
                        if (res.ok) {
                            showToast('✅ Product updated on server!', 'success');
                            await renderProductsTable();
                            resetFormToAddMode();
                            return;
                        }
                    } else {
                        const res = await fetch('/api/products', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name, price, desc, stock, image: imageUrl, category, sizes })
                        });
                        if (res.ok) {
                            showToast('✅ Product added to server!', 'success');
                            await renderProductsTable();
                            resetFormToAddMode();
                            return;
                        }
                    }
                } catch (e) {
                    console.warn('Server create/update failed, falling back to localStorage', e);
                    serverAvailable = false;
                }
            }

            // Fallback to local behavior
            let products = getAdminProducts();
            if (editingId) {
                const product = products.find(p => p.id === parseInt(editingId));
                if (product) {
                    product.name = name;
                    product.price = price;
                    product.desc = desc;
                    product.stock = stock;
                    product.image = imageUrl;
                    product.category = category;
                    product.sizes = sizes;
                    showToast('✅ Product updated locally!', 'success');
                }
            } else {
                const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
                products.push({ id: newId, name, price, desc, stock, image: imageUrl, category, sizes });
                showToast('✅ Product added locally!', 'success');
            }

            saveAdminProducts(products);
            await renderProductsTable();
            resetFormToAddMode();
        })();
    });

    // Cancel edit button
    document.getElementById('cancel-edit-btn').addEventListener('click', resetFormToAddMode);

    // Reset button
    document.getElementById('reset-form-btn').addEventListener('click', resetFormToAddMode);

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('adminToken');
            window.location.href = 'admin-login.html';
        }
    });
});
