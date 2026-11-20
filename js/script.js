// Products
class Product {
    constructor(id, name, price, category, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.image = image;
        this.isFavorite = false;
        this.isInCart = false;
        this.quantity = 1;
    }
}

const products = [
    new Product(1, 'نيسان ماجنيت', 890000, 'cars', 'images/a2e960ba-6d68-4a28-8984-69d03d38fb63.webp'),
    new Product(2, 'kymco EXCITING 400 2026', 400000, 'Motorcycles', 'images/Motorcycles1f6df2812-ad54-41a8-a9a0-ffdbec5c4b08.webp'),
    new Product(3, 'سوزوكي ألتو', 550000, 'cars', 'images/379e6c9a-26e5-4e27-ac21-c5eb7cbe02db.webp'),
    new Product(4, 'هيونداي فينيو', 899000, 'cars', 'images/848e4761-a61f-46d2-ba83-4f1461080a1f.webp'),
    new Product(5, 'زونتس M15 2026 ', 110000, 'Motorcycles', 'images/Motorcycles2fa2c8733-9823-43a9-8afb-9aaf1ea1481e.webp'),
    new Product(6, 'Qj SVT 650 2026 ', 380000, 'Motorcycles', 'images/Motorcycles3dcf74946-4408-4e1c-84c4-c013907cc8b2.webp'),
    
];

function formatPrice(price) {
    return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(price);
}

function renderProducts(productList) {
    console.log('Rendering products:', productList);

    const productsRow = document.getElementById('products-row');
    productsRow.innerHTML = '';

    productList.forEach(product => {
        const productCard =
            `<div class="w-full md:w-4/12 px-2 mb-6">
                 <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
                     <img src="${product.image}" class="w-full h-48 object-cover" alt="${product.name}">
                     <div class="p-4 flex flex-col flex-grow">
                         <h5 class="text-lg font-bold text-gray-800 mb-1">${product.name}</h5>
                         <p class="text-gray-600 mb-1">Price: ${formatPrice(product.price)} ج.م</p>
                         <p class="text-gray-600 mb-4">Category: ${product.category}</p>
                          <div class="flex items-center justify-between mt-auto">
                             <i class="fas fa-heart text-2xl cursor-pointer text-gray-300 hover:text-red-500 transition ${product.isFavorite ? 'text-red-500 active' : ''}" onclick="toggleFavorite(${product.id})"></i>
                             <button class="px-4 py-2 text-sm font-medium rounded transition ${product.isInCart ? 'bg-red-50 text-red-600 border border-red-600 hover:bg-red-600 hover:text-white active' : 'bg-blue-600 text-white hover:bg-blue-700'}" onclick="toggleCart(${product.id})">
                                 ${product.isInCart ? 'Remove from Cart' : 'Add to Cart'}
                             </button>
                         </div>
                     </div>
                 </div>
            </div>`;
        productsRow.insertAdjacentHTML('beforeend', productCard);
    });
}

function searchProducts() {
    const searchType = document.getElementById('searchType').value;
    const searchText = document.getElementById('searchBox').value.toLowerCase();

    const filteredProducts = products.filter(product => {
        if (searchType === 'name') {
            return product.name.toLowerCase().includes(searchText);
        } else if (searchType === 'category') {
            return product.category.toLowerCase().includes(searchText);
        }
        return false;
    });

    renderProducts(filteredProducts);
}

function redirectTo(url) {
    window.location.href = url;
}

// Authentication
let loggedIn = false;

function register() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const password = document.getElementById('password').value;
    if (!firstName || !lastName || !email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    emailInput.value = email;
    if (!emailInput.checkValidity()) {
        alert('Please enter a valid email address.');
        emailInput.focus();
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (Object.prototype.hasOwnProperty.call(users, email)) {
        alert('An account with this email already exists.');
        return;
    }

    users[email] = { password, firstName, lastName };
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created successfully!');
    window.location.href = 'login.html';
}

function login() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const password = document.getElementById('password').value;
    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    emailInput.value = email;
    if (!emailInput.checkValidity()) {
        alert('Please enter a valid email address.');
        emailInput.focus();
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (!Object.prototype.hasOwnProperty.call(users, email)) {
        alert('No account found. Please register first.');
        window.location.href = 'register.html';
        return;
    }

    const user = users[email];
    if (user.password === password) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        loggedIn = true;
        localStorage.setItem('loggedIn', loggedIn);
        window.location.href = 'loggedin.html';
    } else {
        alert('Invalid email or password.');
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedIn');
    loggedIn = false;
    localStorage.removeItem('cart');
    localStorage.removeItem('favorites');
    window.location.href = 'index.html';
}

// Cart Management
function toggleCart(productId) {
    const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));
    console.log('Toggle Cart Clicked. Logged in:', isLoggedIn);

    if (!isLoggedIn) {
        console.log('Redirecting to login.html');
        redirectTo('login.html');
        return;
    }
    const product = products.find(p => p.id === productId);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (product.isInCart) {
        product.isInCart = false;
        product.quantity = 0;
        const index = cart.findIndex(p => p.id === productId);
        if (index > -1) cart.splice(index, 1);
    } else {
        product.isInCart = true;
        product.quantity = 1;
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: product.quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    saveCartAndFavorites();
    updateCartDropdown();
    updateCartCount();
    renderProducts(products);
}

function toggleFavorite(productId) {
    const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));
    console.log('Toggle Favorite Clicked. Logged in:', isLoggedIn);

    if (!isLoggedIn) {
        console.log('Redirecting to login.html');
        redirectTo('login.html');
        return;
    }

    const product = products.find(p => p.id === productId);

    if (product.isFavorite) {
        removeFavorite(productId);
    } else {
        product.isFavorite = true;
        saveCartAndFavorites();
        const productCardHeart = document.querySelector(`.fa-heart[onclick="toggleFavorite(${productId})"]`);
        if (productCardHeart) {
            productCardHeart.classList.add('text-red-500', 'active');
        }
    }

    renderProducts(products);
    if (window.location.href.includes('cart.html')) {
        renderFavoriteItems();
    }
}

function toggleCartDropdown() {
    const cartDropdown = document.getElementById('cartDropdown').nextElementSibling;
    cartDropdown.classList.toggle('hidden');
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (!cartCountElement) {
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = cartCount;
}

function updateCartDropdown() {
    const cartDropdownItems = document.getElementById('cartDropdownItems');
    if (!cartDropdownItems) {
        return;
    }

    const cartItems = products.filter(product => product.isInCart);
    cartDropdownItems.innerHTML = '';

    if (cartItems.length === 0) {
        cartDropdownItems.innerHTML = '<p class="text-center text-gray-500">Your cart is empty.</p>';
    } else {
        cartItems.forEach(item => {
            const cartItem = `
                <div class="flex items-center justify-between mb-2 p-2 border-b border-gray-100">  
                    <div class="flex items-center space-x-2">
                        <h6 class="text-sm font-medium text-gray-800 mb-0">${item.name}</h6>
                        <p class="text-xs text-gray-500 mb-0">Price: <span id="itemPrice${item.id}">${formatPrice(item.price * item.quantity)}</span> ج.م</p>      
                    </div>
                    <div class="flex items-center space-x-1">
                        <button class="px-2 py-0.5 text-xs border border-gray-300 rounded hover:bg-gray-100" onclick="decreaseQuantity(${item.id})">-</button>
                        <span id="itemQuantity${item.id}" class="text-xs mx-1">${item.quantity}</span>
                        <button class="px-2 py-0.5 text-xs border border-gray-300 rounded hover:bg-gray-100" onclick="increaseQuantity(${item.id})">+</button>
                    </div>
                </div>`;
            cartDropdownItems.insertAdjacentHTML('beforeend', cartItem);
        });
    }
    updateCartCount();
}

function increaseQuantity(productId) {
    const product = products.find(p => p.id === productId);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    product.quantity++;
    const cartItem = cart.find(p => p.id === productId);
    if (cartItem) {
        cartItem.quantity = product.quantity;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById(`itemQuantity${productId}`).textContent = product.quantity;
    document.getElementById(`itemPrice${productId}`).textContent = formatPrice(product.price * product.quantity);
    updateCartDropdown();
    renderCartItems();
}

function decreaseQuantity(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    if (product && product.isInCart) {
        product.quantity--;
        if (product.quantity <= 0) {
            product.isInCart = false;
            const index = cart.findIndex(p => p.id === productId);
            if (index > -1) {
                cart.splice(index, 1);
            }
            const productCardButton = document.querySelector(`button[onclick="toggleCart(${productId})"]`);
            if (productCardButton) {
                productCardButton.textContent = 'Add to Cart';
                productCardButton.className = 'px-4 py-2 text-sm font-medium rounded transition bg-blue-600 text-white hover:bg-blue-700';
            }
            const cartItemCard = document.querySelector(`#cart-items [data-product-id="${productId}"]`);
            if (cartItemCard) {
                cartItemCard.remove();
            }
        } else {
            const cartItem = cart.find(p => p.id === productId);
            if (cartItem) {
                cartItem.quantity = product.quantity;
            }
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        const qtyEl = document.getElementById(`itemQuantity${productId}`);
        const priceEl = document.getElementById(`itemPrice${productId}`);
        if (qtyEl) qtyEl.textContent = product.quantity;
        if (priceEl) priceEl.textContent = formatPrice(product.price * product.quantity);
        updateCartDropdown();
        renderCartItems();
        updateTotalPrice();
    }
}

function saveCartAndFavorites() {
    const cart = products.filter(product => product.isInCart);
    const favorites = products.filter(product => product.isFavorite);
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function loadCartAndFavorites() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    products.forEach(product => {
        const cartProduct = cart.find(p => p.id === product.id);
        const favoriteProduct = favorites.find(p => p.id === product.id);
        if (cartProduct) {
            product.isInCart = true;
            product.quantity = cartProduct.quantity;
        } else {
            product.isInCart = false;
            product.quantity = 0;
        }
        product.isFavorite = !!favoriteProduct;
    });
}

// Cart and Favorites Rendering
function renderCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center text-gray-500 w-full py-4">Your cart is empty.</p>';
        updateTotalPrice();
        return;
    }
    const cartItemsHtml = cartItems.map(item => `
        <div class="w-full md:w-6/12 px-2 mb-4" data-product-id="${item.id}">
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center p-4 sm:flex-row">
                <img src="${item.image}" class="w-full h-48 object-cover rounded sm:h-24 sm:w-24" alt="${item.name}">
                <div class="mt-4 w-full min-w-0 flex-grow sm:mt-0 sm:ml-4">
                    <h5 class="text-lg font-bold text-gray-800">${item.name}</h5>
                    <p class="text-sm text-gray-600">Category: ${item.category}</p>
                    <p class="text-sm font-semibold text-gray-700 mb-2">Price: <span id="itemPrice${item.id}">${formatPrice(item.price * item.quantity)}</span> ج.م</p>
                    <div class="flex flex-wrap items-center gap-2">
                        <button class="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100" onclick="decreaseQuantity(${item.id})">-</button>
                        <span id="itemQuantity${item.id}" class="mx-2 text-sm font-medium">${item.quantity}</span>
                        <button class="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100" onclick="increaseQuantity(${item.id})">+</button>
                        <button class="ml-auto px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    cartItemsContainer.innerHTML = cartItemsHtml;

    updateTotalPrice();
}

function renderFavoriteItems() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteItemsContainer = document.getElementById('favorite-items');
    favoriteItemsContainer.innerHTML = '';
    if (favorites.length === 0) {
        favoriteItemsContainer.innerHTML = '<p class="text-center text-gray-500 w-full">You have no favorite items.</p>';
        return;
    }
    const favoriteItemsHtml = favorites.map(item => `
        <div class="w-full md:w-4/12 px-2 mb-4" data-product-id="${item.id}">
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden p-4 flex flex-col items-center">
                <img src="${item.image}" class="w-full h-48 object-cover rounded mb-3" alt="${item.name}">
                <div class="w-full text-center">
                    <h5 class="text-lg font-bold text-gray-800 mb-1">${item.name}</h5>
                    <p class="text-sm text-gray-600 mb-3">Category: ${item.category}</p>
                    <i class="fas fa-heart text-2xl cursor-pointer text-red-500 active" onclick="toggleFavorite(${item.id})"></i>
                </div>
            </div>
        </div>
    `).join('');
    favoriteItemsContainer.innerHTML = favoriteItemsHtml;
}

function updateTotalPrice() {
    const totalPrice = products
        .filter(product => product.isInCart)
        .reduce((total, product) => total + product.price * product.quantity, 0);
    const totalPriceEl = document.getElementById('totalPrice');
    if (totalPriceEl) {
        totalPriceEl.textContent = formatPrice(totalPrice);
    }
}

function removeFromCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.isInCart = false;
        product.quantity = 0;
        saveCartAndFavorites();
        renderCartItems();
        updateCartDropdown();
        updateTotalPrice();
        const cardEl = document.querySelector(`#cart-items [data-product-id="${productId}"]`);
        if (cardEl) {
            cardEl.remove();
        }
    }
}

function removeFavorite(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const product = products.find(p => p.id === productId);

    if (product && product.isFavorite) {
        product.isFavorite = false;
        const index = favorites.findIndex(p => p.id === productId);
        if (index > -1) {
            favorites.splice(index, 1);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        const productCardHeart = document.querySelector(`.fa-heart[onclick="toggleFavorite(${productId})"]`);
        if (productCardHeart) {
            productCardHeart.classList.remove('text-red-500', 'active');
        }
        const favoriteItemCard = document.querySelector(`#favorite-items [data-product-id="${productId}"]`);
        if (favoriteItemCard) {
            favoriteItemCard.remove();
        }
        renderFavoriteItems();
    }
}

// Page Initialization
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));
    if (loggedInUser && isLoggedIn) {
        loggedIn = true;
        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) {
            usernameDisplay.textContent = `Hello, ${loggedInUser.firstName}`;
        }
    } else {
        loggedIn = false;
    }

    console.log('DOM fully loaded and parsed');
    loadCartAndFavorites();
    if (document.getElementById('products-row')) {
        renderProducts(products);
    }
    updateCartDropdown();
    updateCartCount();
    if (window.location.href.includes('cart.html')) {
        renderCartItems();
        renderFavoriteItems();
    }

    const cartIcon = document.querySelector('.fas.fa-shopping-cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCartDropdown);
    }
});


