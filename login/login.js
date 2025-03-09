document.addEventListener('DOMContentLoaded', function() {
    // Get admin credentials from localStorage or use defaults
    const getAdminCredentials = function() {
        return JSON.parse(localStorage.getItem('adminCredentials')) || {
            username: "admin",
            password: "admin123"
        };
    };

    // Login Type Selection
    const adminBtn = document.getElementById('admin-btn');
    const cashierBtn = document.getElementById('cashier-btn');
    let currentLoginType = 'admin';

    adminBtn.addEventListener('click', function() {
        setActiveLoginType('admin');
    });

    cashierBtn.addEventListener('click', function() {
        setActiveLoginType('cashier');
    });

    function setActiveLoginType(type) {
        currentLoginType = type;
        
        if (type === 'admin') {
            adminBtn.classList.add('active');
            cashierBtn.classList.remove('active');
        } else {
            adminBtn.classList.remove('active');
            cashierBtn.classList.add('active');
        }

        // Optional: Clear form fields when switching between login types
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }

    // Password Toggle Visibility
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        const eyeIcon = togglePassword.querySelector('i');
        if (type === 'password') {
            eyeIcon.classList.remove('bi-eye-slash');
            eyeIcon.classList.add('bi-eye');
        } else {
            eyeIcon.classList.remove('bi-eye');
            eyeIcon.classList.add('bi-eye-slash');
        }
    });

    // Form Submission
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        console.log(`Login attempt as ${currentLoginType}`);
        
        // Check credentials based on login type
        if (currentLoginType === 'admin') {
            // Get the latest admin credentials
            const adminCredentials = getAdminCredentials();
            
            // Check against admin credentials
            if (username === adminCredentials.username && 
                password === adminCredentials.password) {
                alert("Admin login successful!");
                window.location.href = '../admin/admin.html';
            } else {
                alert("Invalid admin credentials. Please try again.");
            }
        } else {
            // For cashier, we don't have default credentials, so show a message
            alert("Cashier login functionality would require server-side authentication.");
            // In a real application, you would send the login request to a server
        }
    });
});