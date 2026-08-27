// ============================================
// PRODUCT DATA
// ============================================
// This array contains all the products available in the store
// Each product has: id, name, description, price, and image URL
const products = [
    {
        id: 1,
        name: "Classic T-Shirt",
        description: "Comfortable cotton t-shirt",
        price: 29.99,
        image: "https://via.placeholder.com/250x250?text=T-Shirt"
    },
    {
        id: 2,
        name: "Denim Jeans",
        description: "Premium denim jeans",
        price: 79.99,
        image: "https://via.placeholder.com/250x250?text=Jeans"
    },
    {
        id: 3,
        name: "Summer Dress",
        description: "Light and airy summer dress",
        price: 59.99,
        image: "https://via.placeholder.com/250x250?text=Dress"
    },
    {
        id: 4,
        name: "Leather Jacket",
        description: "Stylish leather jacket",
        price: 199.99,
        image: "https://via.placeholder.com/250x250?text=Jacket"
    },
    {
        id: 5,
        name: "Sneakers",
        description: "Comfortable athletic sneakers",
        price: 89.99,
        image: "https://via.placeholder.com/250x250?text=Sneakers"
    },
    {
        id: 6,
        name: "Wool Sweater",
        description: "Warm and cozy wool sweater",
        price: 69.99,
        image: "https://via.placeholder.com/250x250?text=Sweater"
    }
];

// ============================================
// SHOPPING CART MANAGEMENT
// ============================================
// This array will store items that users add to cart
// Each item includes product info + quantity
let cart = [];

// ============================================
// PAGE INITIALIZATION
// ============================================
// Run this when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    setupEventListeners();
    loadCartFromStorage(); // Load saved cart from browser storage
});

// ============================================
// DISPLAY PRODUCTS ON PAGE
// ============================================
function displayProducts() {
    const productsContainer = document.getElementById('productsContainer');
    // Clear any existing content
    productsContainer.innerHTML = '';

    // Loop through each product and create a card for it
    products.forEach(product => {
        // Create the HTML structure for a product card
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        // Add this card to the products container
        productsContainer.appendChild(productCard);
    });
}

// ============================================
// ADD PRODUCT TO CART
// ============================================
function addToCart(productId) {
    // Find the product in our products array
    const product = products.find(p => p.id === productId);

    // Check if this product is already in the cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // If it exists, increase the quantity by 1
        existingItem.quantity += 1;
    } else {
        // If it doesn't exist, add it with quantity 1
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Save cart to browser storage and update the display
    saveCartToStorage();
    updateCartCount();
    
    // Show a quick visual feedback
    alert(`${product.name} added to cart!`);
}

// ============================================
// UPDATE CART COUNT IN NAVBAR
// ============================================
function updateCartCount() {
    // Calculate total items in cart (sum of all quantities)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    // Update the cart button display
    document.getElementById('cartCount').textContent = totalItems;
}

// ============================================
// DISPLAY CART ITEMS
// ============================================
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (cart.length === 0) {
        // Show message if cart is empty
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        return;
    }

    // Loop through each item in the cart
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div>$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    // Update the total price display
    updateTotalPrice();
}

// ============================================
// UPDATE ITEM QUANTITY
// ============================================
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        // Remove item if quantity becomes 0 or less
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCartToStorage();
            displayCartItems(); // Refresh the cart display
            updateCartCount();
        }
    }
}

// ============================================
// REMOVE ITEM FROM CART
// ============================================
function removeFromCart(productId) {
    // Filter out the item to remove
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    displayCartItems(); // Refresh the cart display
    updateCartCount();
}

// ============================================
// CALCULATE AND DISPLAY TOTAL PRICE
// ============================================
function updateTotalPrice() {
    // Calculate total by multiplying each item's price by its quantity and summing
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalPrice').textContent = total.toFixed(2);
    document.getElementById('orderTotal').textContent = total.toFixed(2);
}

// ============================================
// SAVE CART TO BROWSER STORAGE
// ============================================
// This saves the cart so items remain even after page refresh
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ============================================
// LOAD CART FROM BROWSER STORAGE
// ============================================
// This retrieves the saved cart from previous sessions
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// ============================================
// MODAL MANAGEMENT
// ============================================
// Get modal elements
const cartModal = document.getElementById('cartModal');
const checkoutModal = document.getElementById('checkoutModal');
const successModal = document.getElementById('successModal');
const cartBtn = document.getElementById('cartBtn');
const closeButtons = document.querySelectorAll('.close-btn');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutForm = document.getElementById('checkoutForm');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');

// ============================================
// SETUP EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Open cart when clicking cart button
    cartBtn.addEventListener('click', () => {
        displayCartItems();
        cartModal.style.display = 'block';
    });

    // Close modals when clicking X button
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    // Close modals when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.style.display = 'none';
        if (e.target === checkoutModal) checkoutModal.style.display = 'none';
        if (e.target === successModal) successModal.style.display = 'none';
    });

    // Open checkout form when clicking checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'block';
    });

    // Handle form submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload
        placeOrder();
    });

    // Continue shopping button
    continueShoppingBtn.addEventListener('click', () => {
        successModal.style.display = 'none';
        cart = []; // Clear the cart
        saveCartToStorage();
        updateCartCount();
        checkoutForm.reset(); // Reset the form
    });
}

// ============================================
// PLACE ORDER
// ============================================
function placeOrder() {
    // Get form values
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    // Basic validation - check if all fields are filled
    if (!fullName || !email || !phone || !address || !city || !state || !zip || 
        !cardName || !cardNumber || !expiry || !cvv) {
        alert('Please fill in all fields');
        return;
    }

    // Validate card number is 16 digits
    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
        alert('Please enter a valid 16-digit card number');
        return;
    }

    // Validate CVV is 3 digits
    if (cvv.length !== 3 || isNaN(cvv)) {
        alert('Please enter a valid 3-digit CVV');
        return;
    }

    // Generate a random order number
    const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Log order details (in real app, this would be sent to a server)
    console.log('Order Details:', {
        orderNumber,
        customer: fullName,
        email,
        phone,
        shippingAddress: `${address}, ${city}, ${state} ${zip}`,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });

    // Close checkout modal
    checkoutModal.style.display = 'none';

    // Show success message
    document.getElementById('orderNumber').textContent = orderNumber;
    successModal.style.display = 'block';
}

// Initialize cart count on page load
updateCartCount();