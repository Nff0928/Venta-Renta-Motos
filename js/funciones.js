
// Product Data
const products = [
    {
        id: 1,
        name: "Yamaha R1",
        category: "sport",
        price: 18500,
        rentalPrice: 50,
        description: "Deportiva de alto rendimiento con motor de 1000cc",
        specs: ["1000cc", "200hp", "199kg", "6vel"],
        image: "🏍️"
    },
    {
        id: 2,
        name: "Kawasaki Z900",
        category: "naked",
        price: 12500,
        rentalPrice: 45,
        description: "Naked bike potente y versátil para ciudad y carretera",
        specs: ["900cc", "125hp", "210kg", "6vel"],
        image: "🏍️"
    },
    {
        id: 3,
        name: "Honda CB650R",
        category: "naked",
        price: 9800,
        rentalPrice: 40,
        description: "Equilibrio perfecto entre deportividad y confort",
        specs: ["650cc", "95hp", "200kg", "6vel"],
        image: "🏍️"
    },
    {
        id: 4,
        name: "Ducati Monster",
        category: "naked",
        price: 14200,
        rentalPrice: 55,
        description: "Icónica naked italiana con carácter único",
        specs: ["937cc", "111hp", "188kg", "6vel"],
        image: "🏍️"
    },
    {
        id: 5,
        name: "Harley Street 750",
        category: "cruiser",
        price: 7500,
        rentalPrice: 35,
        description: "Cruiser americana con estilo clásico",
        specs: ["750cc", "53hp", "233kg", "6vel"],
        image: "🏍️"
    },
    {
        id: 6,
        name: "BMW R1250GS",
        category: "touring",
        price: 22000,
        rentalPrice: 65,
        description: "Adventure touring para cualquier terreno",
        specs: ["1250cc", "136hp", "249kg", "6vel"],
        image: "🏍️"
    },
    {
        id: 7,
        name: "Ninja 400",
        category: "sport",
        price: 6200,
        rentalPrice: 30,
        description: "Deportiva de entrada perfecta para principiantes",
        specs: ["400cc", "45hp", "168kg", "6vel"],
        image: "🏍️"
    },
    {
        id: 8,
        name: "Indian Scout",
        category: "cruiser",
        price: 13800,
        rentalPrice: 50,
        description: "Cruiser americana con herencia histórica",
        specs: ["1133cc", "100hp", "255kg", "6vel"],
        image: "🏍️"
    }
];

// App State
let cart = [];
let currentFilter = 'all';

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setTodayDate();
    bindEvents();
});

// Render Products
function renderProducts(filter = 'all') {
    const productGrid = document.getElementById('productGrid');
    const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-specs">
                    ${product.specs.map(spec => `<span class="spec">${spec}</span>`).join('')}
                </div>
                <div class="product-price">$${product.price.toLocaleString()}</div>
                <div class="rental-price">Alquiler: $${product.rentalPrice}/día</div>
                <div class="product-actions">
                    <button class="btn btn-small" onclick="addToCart(${product.id})">
                        🛒 Comprar
                    </button>
                    <button class="btn btn-small btn-outline" onclick="rentMoto(${product.id})">
                        📅 Alquilar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Products
function filterProducts(category) {
    currentFilter = category;
    renderProducts(category);
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId && item.type === 'purchase');
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1,
                type: 'purchase'
            });
        }
        
        updateCartCount();
        showNotification(`${product.name} agregado al carrito`, 'success');
    }
}

// Rent Moto
function rentMoto(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('rentalMoto').value = product.name.toLowerCase().replace(/\s+/g, '-');
        document.getElementById('alquilar').scrollIntoView({ behavior: 'smooth' });
        showNotification(`${product.name} seleccionado para alquiler`, 'info');
    }
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Open Cart
function openCart() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #7f8c8d;">Tu carrito está vacío</p>';
        cartTotal.textContent = 'Total: $0';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <p>Cantidad: ${item.quantity}</p>
                </div>
                <div>
                    <p>$${(item.price * item.quantity).toLocaleString()}</p>
                    <button onclick="removeFromCart(${item.id})" style="background: #e74c3c; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 3px; cursor: pointer;">
                        Eliminar
                    </button>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `Total: $${total.toLocaleString()}`;
    }
    
    modal.style.display = 'block';
}

// Close Cart
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    openCart(); // Refresh cart display
    showNotification('Producto eliminado del carrito', 'info');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart = [];
    updateCartCount();
    closeCart();
    showNotification(`Compra realizada por $${total.toLocaleString()}. ¡Gracias por tu compra!`, 'success');
}

// Set Today Date
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('rentalStart').value = today;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('rentalEnd').value = tomorrow.toISOString().split('T')[0];
}

// Bind Events
function bindEvents() {
    // Rental Form
    document.getElementById('rentalForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const rentalData = {
            moto: formData.get('rentalMoto') || document.getElementById('rentalMoto').value,
            startDate: formData.get('rentalStart') || document.getElementById('rentalStart').value,
            endDate: formData.get('rentalEnd') || document.getElementById('rentalEnd').value,
            customerName: formData.get('customerName') || document.getElementById('customerName').value,
            customerPhone: formData.get('customerPhone') || document.getElementById('customerPhone').value,
            customerEmail: formData.get('customerEmail') || document.getElementById('customerEmail').value,
            licenseNumber: formData.get('licenseNumber') || document.getElementById('licenseNumber').value
        };
        
        // Calculate rental days
        const startDate = new Date(rentalData.startDate);
        const endDate = new Date(rentalData.endDate);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        if (days <= 0) {
            showNotification('La fecha de fin debe ser posterior a la fecha de inicio', 'error');
            return;
        }
        
        showNotification(`Solicitud de alquiler enviada para ${days} días. Te contactaremos pronto.`, 'success');
        e.target.reset();
        setTodayDate();
    });

    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('cartModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Show Notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Smooth Scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
