// Menu Items Data
const menuItems = [
    { 
        id: 1, 
        name: 'Chicken Adobo', 
        price: 150, 
        category: 'main-dishes', 
        image: '../img/pancake.jpg',
        estimatedTime: 5
    },
    { 
        id: 2, 
        name: 'Beef Tapa Rice Bowl', 
        price: 200, 
        category: 'rice-bowls', 
        image: '../img/pancake.jpg',
        estimatedTime: 4
    },
    { 
        id: 3, 
        name: 'Spaghetti Bolognese', 
        price: 300, 
        category: 'pasta-noodles', 
        image: '../img/pancake.jpg',
        estimatedTime: 5
    },
    { 
        id: 4, 
        name: 'Grilled Chicken Sandwich', 
        price: 350, 
        category: 'sandwiches-wraps', 
        image: '../img/pancake.jpg',
        estimatedTime: 5
    },
    { 
        id: 5, 
        name: 'BBQ Pork Skewers', 
        price: 250, 
        category: 'grills-bbq', 
        image: '../img/pancake.jpg',
        estimatedTime: 5
    },
    { 
        id: 6, 
        name: 'Garlic Rice', 
        price: 50, 
        category: 'side-dishes', 
        image: '../img/pancake.jpg',
        estimatedTime: 5
    },
    { 
        id: 7, 
        name: 'Gravy Sauce', 
        price: 30, 
        category: 'sauces-dressings', 
        image: '../img/pancake.jpg',
        estimatedTime: 2
    },
    { 
        id: 8, 
        name: 'Chocolate Cake', 
        price: 80, 
        category: 'desserts-beverages', 
        image: '../img/pancake.jpg',
        estimatedTime: 0
    },
];

// Order management
let currentOrder = [];
let customerNumber = 1;
let selectedOrderType = null;

// Render menu items
function renderMenuItems(items = menuItems, category = 'all') {
    const menuContainer = document.getElementById('menu-items');
    menuContainer.innerHTML = '';

    const filteredItems = category === 'all' 
        ? items 
        : items.filter(item => item.category === category);

    filteredItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'col-md-4 menu-item';
        itemDiv.setAttribute('data-category', item.category);
        
        itemDiv.innerHTML = `
            <div class="card product-card">
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">₱${item.price.toFixed(2)}</p>
                    <button class="btn btn-add-to-order w-100 add-to-order-btn" data-id="${item.id}">
                        <i class="fas fa-plus me-2"></i>Add to Order
                    </button>
                </div>
            </div>
        `;
        
        menuContainer.appendChild(itemDiv);
    });
}

// Search functionality
function searchMenuItems(query) {
    const filteredItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
    );
    renderMenuItems(filteredItems);
}

// Add item to order
function addToOrder(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const existingItem = currentOrder.find(i => i.id === itemId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        currentOrder.push({ ...item, quantity: 1 });
    }

    updateOrderSummary();
}

// Update order summary
function updateOrderSummary() {
    const orderContainer = document.getElementById('order-list');
    const totalPriceElement = document.getElementById('total-price');
    const cartCountElement = document.getElementById('cart-count');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutButton = document.getElementById('checkout-order');

    // Clear previous order items
    orderContainer.innerHTML = '';
    orderContainer.appendChild(emptyCartMessage);

    let total = 0;
    let totalItems = 0;

    // Render order items
    currentOrder.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        totalItems += item.quantity;

        const orderItemElement = document.createElement('div');
        orderItemElement.className = 'order-item d-flex justify-content-between align-items-center p-3 border-bottom';
        orderItemElement.innerHTML = `
            <div class="item-details flex-grow-1">
                <h6 class="mb-1">${item.name}</h6>
                <div class="quantity-control d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary decrease-qty me-2" data-id="${item.id}">-</button>
                    <span class="quantity mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary increase-qty ms-2" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="item-price">
                <span class="text-success">₱${itemTotal.toFixed(2)}</span>
            </div>
        `;

        orderContainer.appendChild(orderItemElement);
    });

    // Toggle empty cart message and checkout button
    if (currentOrder.length === 0) {
        emptyCartMessage.style.display = 'block';
        checkoutButton.disabled = true;
    } else {
        emptyCartMessage.style.display = 'none';
        checkoutButton.disabled = false;
    }

    // Update total price
    totalPriceElement.textContent = total.toFixed(2);
    cartCountElement.textContent = `${totalItems} ${totalItems === 1 ? 'Item' : 'Items'}`;
    
    // Update payment total in modal
    document.getElementById('payment-total').textContent = total.toFixed(2);
    document.getElementById('cash-total').textContent = total.toFixed(2);
}

// Handle customer numbering
function updateCustomerNumber() {
    document.getElementById('customer-number').textContent = customerNumber;
}

// Handle next customer
function nextCustomer() {
    customerNumber = customerNumber >= 50 ? 1 : customerNumber + 1;
    updateCustomerNumber();
    currentOrder = [];
    selectedOrderType = null;
    
    // Reset radio buttons
    document.getElementById('dine-in').checked = false;
    document.getElementById('takeout').checked = false;
    
    updateOrderSummary();
}

// Calculate change
function calculateChange() {
    const total = parseFloat(document.getElementById('cash-total').textContent);
    const cashReceived = parseFloat(document.getElementById('cash-amount').value) || 0;
    const change = cashReceived - total;
    
    document.getElementById('change-amount').textContent = change >= 0 ? change.toFixed(2) : '0.00';
    
    // Enable/disable print receipt button based on valid payment
    document.getElementById('print-receipt').disabled = cashReceived < total;
}

// Validate order type selection
function validateOrderType() {
    const orderTypeSection = document.querySelector('.order-type-section');
    
    if (!selectedOrderType) {
        orderTypeSection.classList.add('order-type-error');
        setTimeout(() => {
            orderTypeSection.classList.remove('order-type-error');
        }, 1000);
        return false;
    }
    
    return true;
}

// Update the UI with selected order type
function updateOrderTypeDisplay() {
    const orderTypeIcon = document.getElementById('order-type-icon');
    const orderTypeText = document.getElementById('order-type-text');
    const completedOrderType = document.getElementById('completed-order-type');
    
    if (selectedOrderType === 'dine-in') {
        orderTypeIcon.className = 'fas fa-utensils me-1';
        orderTypeText.textContent = 'Dine In';
        completedOrderType.textContent = 'Dine In';
    } else if (selectedOrderType === 'takeout') {
        orderTypeIcon.className = 'fas fa-shopping-bag me-1';
        orderTypeText.textContent = 'Takeout';
        completedOrderType.textContent = 'Takeout';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            renderMenuItems(menuItems, category);
        });
    });

    // Search input event
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        searchMenuItems(this.value);
    });

    // Add to order event delegation
    document.addEventListener('click', function(event) {
        if (event.target.closest('.add-to-order-btn')) {
            const itemId = parseInt(event.target.closest('.add-to-order-btn').getAttribute('data-id'));
            addToOrder(itemId);
        }
    });

    // Increase quantity event delegation
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('increase-qty')) {
            const itemId = parseInt(event.target.getAttribute('data-id'));
            const item = currentOrder.find(i => i.id === itemId);
            item.quantity++;
            updateOrderSummary();
        }
    });

    // Decrease quantity event delegation
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('decrease-qty')) {
            const itemId = parseInt(event.target.getAttribute('data-id'));
            const itemIndex = currentOrder.findIndex(i => i.id === itemId);
            
            if (currentOrder[itemIndex].quantity > 1) {
                currentOrder[itemIndex].quantity--;
            } else {
                currentOrder.splice(itemIndex, 1);
            }
            
            updateOrderSummary();
        }
    });

    // Void all items
    document.getElementById('void-all').addEventListener('click', function() {
        if (currentOrder.length > 0) {
            const voidConfirmationModal = new bootstrap.Modal(document.getElementById('voidConfirmationModal'));
            voidConfirmationModal.show();
        }
    });

    // Confirm void all items
    document.getElementById('confirm-void').addEventListener('click', function() {
        currentOrder = [];
        updateOrderSummary();
        const voidConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('voidConfirmationModal'));
        voidConfirmationModal.hide();
    });

    // Order type selection
    document.getElementById('dine-in').addEventListener('change', function() {
        selectedOrderType = 'dine-in';
    });
    
    document.getElementById('takeout').addEventListener('change', function() {
        selectedOrderType = 'takeout';
    });

    // Checkout order
    document.getElementById('checkout-order').addEventListener('click', function() {
        if (currentOrder.length > 0) {
            if (validateOrderType()) {
                updateOrderTypeDisplay();
                const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
                paymentModal.show();
            }
        }
    });

    // Cash payment
    document.getElementById('cash-payment').addEventListener('click', function() {
        const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
        paymentModal.hide();
        
        const cashPaymentModal = new bootstrap.Modal(document.getElementById('cashPaymentModal'));
        cashPaymentModal.show();
        
        // Reset cash input
        document.getElementById('cash-amount').value = '';
        document.getElementById('change-amount').textContent = '0.00';
        document.getElementById('print-receipt').disabled = true;
    });
    
    // GCash payment (simplified for front-end only)
    document.getElementById('gcash-payment').addEventListener('click', function() {
        const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
        paymentModal.hide();
        
        // In the implementation, this should show a GCash payment interface
        // For front-end, we'll just complete the transaction
        completeTransaction();
    });
    
    // Calculate change when cash amount changes
    document.getElementById('cash-amount').addEventListener('input', calculateChange);
    
    // Print receipt and complete transaction
    document.getElementById('print-receipt').addEventListener('click', function() {
        const cashPaymentModal = bootstrap.Modal.getInstance(document.getElementById('cashPaymentModal'));
        cashPaymentModal.hide();
        
        // In the implementation, this should trigger receipt printing
        completeTransaction();
    });
    
    // Back to dashboard after transaction
    document.getElementById('back-to-dashboard').addEventListener('click', function() {
        const transactionCompleteModal = bootstrap.Modal.getInstance(document.getElementById('transactionCompleteModal'));
        transactionCompleteModal.hide();
        
        // Reset for next customer
        nextCustomer();
    });
}

// Complete transaction
function completeTransaction() {
    const transactionCompleteModal = new bootstrap.Modal(document.getElementById('transactionCompleteModal'));
    transactionCompleteModal.show();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderMenuItems();
    updateCustomerNumber();
    setupEventListeners();
});