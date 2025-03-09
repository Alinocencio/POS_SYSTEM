// Admin Credentials (retrieved from localStorage or use defaults)
let adminCredentials = JSON.parse(localStorage.getItem('adminCredentials')) || {
    username: "admin",
    password: "admin123"
};

// Save admin credentials to localStorage
function saveAdminCredentials() {
    localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
}

// Initialize with default credentials if not already set
if (!localStorage.getItem('adminCredentials')) {
    saveAdminCredentials();
}

// Menu Items Data
let menuItems = [
    { id: 1, name: 'Chicken Adobo', price: 150, category: 'main-dishes', image: 'img/pancake.jpg' },
    { id: 2, name: 'Beef Tapa Rice Bowl', price: 200, category: 'rice-bowls', image: 'img/pancake.jpg' },
    { id: 3, name: 'Spaghetti Bolognese', price: 300, category: 'pasta-noodles', image: 'img/pancake.jpg' },
    { id: 4, name: 'Grilled Chicken Sandwich', price: 350, category: 'sandwiches-wraps', image: 'img/pancake.jpg' },
    { id: 5, name: 'BBQ Pork Skewers', price: 250, category: 'grills-bbq', image: 'img/pancake.jpg' },
    { id: 6, name: 'Garlic Rice', price: 50, category: 'side-dishes', image: 'img/pancake.jpg' },
    { id: 7, name: 'Gravy Sauce', price: 30, category: 'sauces-dressings', image: 'img/pancake.jpg' },
    { id: 8, name: 'Chocolate Cake', price: 80, category: 'desserts-beverages', image: 'img/pancake.jpg' },
];

// DOM Elements
const menuList = document.getElementById('menu-list');
const addMenuItemBtn = document.getElementById('add-menu-item');
const menuItemModal = new bootstrap.Modal(document.getElementById('menuItemModal'));
const saveMenuItemBtn = document.getElementById('save-menu-item');
const adminCredentialsForm = document.getElementById('admin-credentials-form');
const navLinks = document.querySelectorAll('.nav-link[data-section]');
const dropdownItems = document.querySelectorAll('.dropdown-item[data-section]');

// Render Menu Items in Table
function renderMenuItems() {
    menuList.innerHTML = '';
    menuItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${formatCategoryName(item.category)}</td>
            <td>₱${item.price.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-item" data-id="${item.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        menuList.appendChild(row);
    });
}

// Format category name for display
function formatCategoryName(category) {
    const categoryMap = {
        'main-dishes': 'Main Dishes',
        'rice-bowls': 'Rice Bowls',
        'pasta-noodles': 'Pasta & Noodles',
        'sandwiches-wraps': 'Sandwiches & Wraps',
        'grills-bbq': 'Grills & BBQ',
        'side-dishes': 'Side Dishes & Add-ons',
        'sauces-dressings': 'Sauces & Dressings',
        'desserts-beverages': 'Desserts & Beverages'
    };
    
    return categoryMap[category] || category;
}

// Setup Navigation
function setupNavigation() {
    // Handle main nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            dropdownItems.forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.section-content').forEach(section => {
                section.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                document.getElementById(sectionId).classList.add('active');
            }
        });
    });
    
    // Handle dropdown items
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            dropdownItems.forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.section-content').forEach(section => {
                section.classList.remove('active');
            });
            
            // Add active class to clicked dropdown item
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                document.getElementById(sectionId).classList.add('active');
            }
        });
    });
}

// Setup Admin Credentials Form
function setupAdminCredentialsForm() {
    adminCredentialsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newUsername = document.getElementById('new-username').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validate current password
        if (currentPassword !== adminCredentials.password) {
            alert('Current password is incorrect');
            return;
        }
        
        // Validate password confirmation
        if (newPassword !== confirmPassword) {
            alert('New password and confirmation do not match');
            return;
        }
        
        // Update credentials
        adminCredentials.username = newUsername;
        adminCredentials.password = newPassword;
        
        // Save to localStorage
        saveAdminCredentials();
        
        alert('Admin credentials updated successfully');
        
        // Clear form
        document.getElementById('current-password').value = '';
        document.getElementById('new-username').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    });
}

// Setup Logout Button
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            // You could add additional logout logic here if needed
            // For example, clearing session data
            console.log('Logging out...');
            // The actual navigation is handled by the href attribute
        });
    }
}

// Setup Event Listeners
function setupMenuEventListeners() {
    // Add New Menu Item
    addMenuItemBtn.addEventListener('click', () => {
        document.getElementById('item-id').value = '';
        document.getElementById('item-name').value = '';
        document.getElementById('item-category').value = 'main-dishes';
        document.getElementById('item-price').value = '';
        document.getElementById('item-image').value = '';
        menuItemModal.show();
    });

    // Save Menu Item
    saveMenuItemBtn.addEventListener('click', () => {
        const id = document.getElementById('item-id').value;
        const name = document.getElementById('item-name').value;
        const category = document.getElementById('item-category').value;
        const price = parseFloat(document.getElementById('item-price').value);

        if (id) {
            // Edit existing item
            const index = menuItems.findIndex(item => item.id === parseInt(id));
            menuItems[index] = { 
                id: parseInt(id), 
                name, 
                category, 
                price, 
                image: menuItems[index].image 
            };
        } else {
            // Add new item
            const newId = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1;
            menuItems.push({ 
                id: newId, 
                name, 
                category, 
                price, 
                image: 'img/pancake.jpg' 
            });
        }

        renderMenuItems();
        menuItemModal.hide();
    });

    // Edit Item
    menuList.addEventListener('click', (event) => {
        const editBtn = event.target.closest('.edit-item');
        if (editBtn) {
            const itemId = parseInt(editBtn.getAttribute('data-id'));
            const item = menuItems.find(i => i.id === itemId);

            document.getElementById('item-id').value = item.id;
            document.getElementById('item-name').value = item.name;
            document.getElementById('item-category').value = item.category;
            document.getElementById('item-price').value = item.price;
            
            menuItemModal.show();
        }
    });

    // Delete Item
    menuList.addEventListener('click', (event) => {
        const deleteBtn = event.target.closest('.delete-item');
        if (deleteBtn) {
            const itemId = parseInt(deleteBtn.getAttribute('data-id'));
            menuItems = menuItems.filter(item => item.id !== itemId);
            renderMenuItems();
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderMenuItems();
    setupMenuEventListeners();
    setupAdminCredentialsForm();
    setupLogoutButton();
    setupNavigation();
    
    // Set initial active section
    document.getElementById('menu-management-section').classList.add('active');
});

// Export admin credentials for use in login.js
window.getAdminCredentials = function() {
    return adminCredentials;
};