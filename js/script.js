// Initialize storage if not exists
if (!localStorage.getItem('favorites')) localStorage.setItem('favorites', JSON.stringify([]));
if (!localStorage.getItem('cart')) localStorage.setItem('cart', JSON.stringify([]));
if (!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify([]));
if (!localStorage.getItem('currentUser')) localStorage.setItem('currentUser', JSON.stringify(null));

// Authentication functions
function registerUser(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Validate email not already registered
    if (users.some(user => user.email === email)) {
        return { success: false, message: 'Email already registered' };
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password, // Note: In production, you should hash passwords!
        joinDate: new Date().toISOString(),
        profilePic: 'images/profile-placeholder.jpg'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, user: newUser };
}

function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(user => user.email === email);
    
    if (!user) return { success: false, message: 'User not found' };
    if (user.password !== password) return { success: false, message: 'Incorrect password' };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
}

function logoutUser() {
    localStorage.setItem('currentUser', JSON.stringify(null));
    window.location.href = 'index.html';
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Check authentication on page load
function checkAuth() {
    const currentUser = getCurrentUser();
    const accountLink = document.querySelector('a[href="account.html"]');
    const loginLink = document.querySelector('a[href="login.html"]');
    
    if (currentUser) {
        if (accountLink) accountLink.style.display = 'inline-block';
        if (loginLink) loginLink.style.display = 'none';
    } else {
        if (accountLink) accountLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'inline-block';
    }
}

// Initialize cart variable
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const dresses = [
    // Casual Wear (8 items)
    {id: 1, name: "CDR LOW RISE RUCHED MINI SKORT", price: 39.99, category: "casual", image: "https://img1.shopcider.com/product/1692767121000-p2mHxb.jpg?x-oss-process=image/resize,w_350,m_lfit/quality,Q_80/interlace,1", rating: 4.5, bestSeller: true},
    {id: 2, name: "PLEATED BANDEAU MINI DRESS", price: 49.99, category: "casual", image: "https://img1.shopcider.com/product/1743426961000-jw428y.jpg", rating: 4.7},
    {id: 3, name: "KNIT ROUND NECKLINE CARDIGAN", price: 59.99, category: "casual", image: "https://img1.shopcider.com/product/1729959929000-TbKGy6.jpg", rating: 4.3},
    {id: 4, name: "HALTER NECKLINE RUCHED CAMI TOP", price: 39.99, category: "casual", image: "https://img1.shopcider.com/product/1733823134000-mKQmXQ.jpg", rating: 4.6},
    {id: 5, name: "FAUX LEATHER ASYMMETRICAL HEM TOP", price: 69.99, category: "casual", image: "https://img1.shopcider.com/product/1742813003000-yCrwh5.jpg", rating: 4.4},
    {id: 6, name: "SATIN SWEETHEART MINI DRESS", price: 54.99, category: "casual", image: "https://img1.shopcider.com/product/1737370102000-dZc7wG.jpg", rating: 4.2},
    {id: 7, name: "LACE V-NECK MIDI DRESS", price: 89.99, category: "casual", image: "https://img1.shopcider.com/product/1737101567000-fRArXG.jpg", rating: 4.8, bestSeller: false},
    {id: 8, name: "KNIT COLLAR STRIPE TOP", price: 44.99, category: "casual", image: "https://img1.shopcider.com/product/1741167537000-28KNaW.jpg", rating: 4.1},

    // Formal Attire (4 items)
    {id: 9, name: "STRIPED BLAZER WITH BELT", price: 129.99, category: "formal", image: "https://img1.shopcider.com/product/1671603397000-x3niWw.jpg", rating: 4.9, bestSeller: true},
    {id: 10, name: "COLLAR BUTTON BLAZER", price: 119.99, category: "formal", image: "https://img1.shopcider.com/product/1696746183000-btMthp.jpg", rating: 4.7},
    {id: 11, name: "CHIFFON BELL SLEEVE BLOUSE", price: 79.99, category: "formal", image: "https://img1.shopcider.com/product/1725536378000-5rdAh6.jpg?x-oss-process=image/resize,w_350,m_lfit/quality,Q_80/interlace,1", rating: 4.6},
    {id: 12, name: "V-NECK BUTTON TANK TOP SET", price: 89.99, category: "formal", image: "https://img1.shopcider.com/product/1732614977000-54Q3CK.jpg", rating: 4.5},

    // Party Wear (4 items)
    {id: 13, name: "SEQUIN MINI DRESS", price: 89.99, category: "party", image: "https://img1.shopcider.com/product/1723720568000-7XA3Nb.jpg?x-oss-process=image/resize,w_700,m_lfit/quality,Q_40/format,webp", rating: 4.8, bestSeller: true},
    {id: 14, name: "VELVET BODYCON DRESS", price: 79.99, category: "party", image: "https://img1.shopcider.com/product/1725886916000-zEmCYa.jpg?x-oss-process=image/resize,w_700,m_lfit/quality,Q_40/format,webp", rating: 4.6},
    {id: 15, name: "OFF-SHOULDER GOWN", price: 149.99, category: "party", image: "https://img1.shopcider.com/product/1731392209000-fciMYa.jpg?x-oss-process=image/resize,w_700,m_lfit/quality,Q_40/format,webp", rating: 4.9},
    {id: 16, name: "METALLIC JUMPSUIT", price: 99.99, category: "party", image: "https://img1.shopcider.com/product/1692760523000-jxr4tH.jpg?x-oss-process=image/resize,w_700,m_lfit/quality,Q_40/format,webp", rating: 4.7},

    // Summer Collection (4 items)
    {id: 17, name: "FLORAL SUNDRESS", price: 49.99, category: "summer", image: "https://img1.shopcider.com/product/1705305277000-k8fHXj.jpg?x-oss-process=image/resize,w_350,m_lfit/quality,Q_80/interlace,1", rating: 4.7, bestSeller: true},
    {id: 18, name: "LINEN SHORTS SET", price: 59.99, category: "summer", image: "https://img1.shopcider.com/product/1741838848000-k6ntJb.jpg?x-oss-process=image/resize,w_350,m_lfit/quality,Q_80/interlace,1", rating: 4.5},
    {id: 19, name: "TIE-FRONT BLOUSE", price: 39.99, category: "summer", image: "https://img1.shopcider.com/product/1722917093000-BepG87.jpg?x-oss-process=image/resize,w_350,m_lfit/quality,Q_80/interlace,1", rating: 4.3},
    {id: 20, name: "CROCHET COVER-UP", price: 34.99, category: "summer", image: "https://img1.shopcider.com/product/1740982209000-4smfw2.jpg?x-oss-process=image/resize,w_350,m_lfit/quality,Q_80/interlace,1", rating: 4.6}
];

// [Rest of the original functionality remains unchanged...]
// DOM Elements
const collectionProductsEl = document.getElementById('collectionProducts');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const sortBy = document.getElementById('sortBy');

// Load all products with filtering
function loadCollectionProducts() {
    let filtered = [...dresses];
    
    // Apply category filter
    if (categoryFilter && categoryFilter.value !== 'all') {
        filtered = filtered.filter(d => d.category === categoryFilter.value);
    }
    
    // Apply price filter
    if (priceFilter && priceFilter.value !== 'all') {
        const [min, max] = priceFilter.value.split('-').map(Number);
        filtered = filtered.filter(d => {
            if (max) return d.price >= min && d.price <= max;
            return d.price >= min;
        });
    }
    
    // Apply sorting
    if (sortBy) {
        switch(sortBy.value) {
            case 'price-low': 
                filtered.sort((a, b) => a.price - b.price); 
                break;
            case 'price-high': 
                filtered.sort((a, b) => b.price - a.price); 
                break;
            case 'newest': 
                filtered.sort((a, b) => b.id - a.id); 
                break;
            default:
                // Default sorting (featured)
                filtered.sort((a, b) => (b.bestSeller - a.bestSeller) || (b.rating - a.rating));
        }
    }
    
    renderProducts(filtered);
}

// Render products to the collection grid
function renderProducts(products) {
    if (!collectionProductsEl) return;
    
    // Clear existing products
    collectionProductsEl.innerHTML = '';
    
    if (products.length === 0) {
        collectionProductsEl.innerHTML = '<p class="no-results">No dresses match your filters</p>';
        return;
    }
    
    // Create product cards for each dress
    products.forEach(dress => {
        const favorites = JSON.parse(localStorage.getItem('favorites'));
        const isFavorite = favorites.includes(dress.id);
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="favorite-heart ${isFavorite ? 'active' : ''}">
                <i class="fas fa-heart"></i>
            </div>
            ${dress.bestSeller ? '<div class="best-seller">Bestseller</div>' : ''}
            <img src="${dress.image}" alt="${dress.name}" loading="lazy">
            <div class="product-info">
                <h3>${dress.name}</h3>
                <div class="price">$${dress.price.toFixed(2)}</div>
                <div class="rating">
                    ${'★'.repeat(Math.round(dress.rating))}${'☆'.repeat(5 - Math.round(dress.rating))}
                    <span>(${dress.rating.toFixed(1)})</span>
                </div>
                <button class="add-to-cart" data-id="${dress.id}">
                    <i class="fas fa-shopping-cart"></i>
                    ${JSON.parse(localStorage.getItem('cart') || '[]').some(item => item.id === dress.id) ? 'Added' : 'Add to Cart'}
                </button>
            </div>
        `;
        
        // Add favorite click handler
        const heart = productCard.querySelector('.favorite-heart');
        heart.addEventListener('click', (e) => {
            e.stopPropagation();
            let favorites = JSON.parse(localStorage.getItem('favorites'));
            const index = favorites.indexOf(dress.id);
            
            if (index >= 0) {
                favorites.splice(index, 1);
                heart.classList.remove('active');
            } else {
                favorites.push(dress.id);
                heart.classList.add('active');
            }
            
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
        
        // Add click handler for the add-to-cart button
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingIndex = currentCart.findIndex(item => item.id === dress.id);
            
            if (existingIndex >= 0) {
                currentCart.splice(existingIndex, 1);
                addToCartBtn.textContent = 'Add to Cart';
            } else {
                addToCart(dress);
                addToCartBtn.textContent = 'Added to Cart';
            }
            
            localStorage.setItem('cart', JSON.stringify(currentCart));
            updateCartCount();
        });

        collectionProductsEl.appendChild(productCard);
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show added notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${product.name} added to cart!</span>
    `;
    document.body.appendChild(notification);
    
    // Animate cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('animate');
        setTimeout(() => {
            cartIcon.classList.remove('animate');
        }, 1000);
    }
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Update cart count in header
function updateCartCount() {
    const cartCountEls = document.querySelectorAll('#cart-count');
    if (cartCountEls.length > 0) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEls.forEach(el => {
            el.textContent = totalItems;
            if (totalItems > 0) {
                el.classList.add('has-items');
            } else {
                el.classList.remove('has-items');
            }
        });
    }
}

// Initialize filters
function setupEventListeners() {
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            loadCollectionProducts();
            // Update URL for sharing filtered view
            const url = new URL(window.location.href);
            url.searchParams.set('category', categoryFilter.value);
            window.history.pushState({}, '', url);
        });
    }

    if (priceFilter) {
        priceFilter.addEventListener('change', () => {
            loadCollectionProducts();
            // Update URL for sharing filtered view
            const url = new URL(window.location.href);
            url.searchParams.set('price', priceFilter.value);
            window.history.pushState({}, '', url);
        });
    }

    if (sortBy) {
        sortBy.addEventListener('change', loadCollectionProducts);
    }

    if (searchInput) {
        searchInput.addEventListener('input', searchDresses);
    }

    // Load filters from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('category') && categoryFilter) {
        categoryFilter.value = urlParams.get('category');
    }
    if (urlParams.has('price') && priceFilter) {
        priceFilter.value = urlParams.get('price');
    }
}

// Initialize cart count display
function initCartCount() {
    updateCartCount();
}

// Display cart items in account page
function displayCartItems() {
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="no-items">Your cart is empty</div>';
        return;
    }
    
    cartContainer.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="price">$${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-from-cart" data-id="${item.id}">Remove</button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    // Add total section
    const totalSection = document.createElement('div');
    totalSection.className = 'cart-total';
    totalSection.innerHTML = `
        <div class="total-row">
            <strong>Subtotal:</strong>
            <span>$${total.toFixed(2)}</span>
        </div>
        <div class="total-row">
            <strong>Shipping:</strong>
            <span>Free</span>
        </div>
        <div class="total-row grand-total">
            <strong>Total:</strong>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
    cartContainer.appendChild(totalSection);
    
    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            let cart = JSON.parse(localStorage.getItem('cart'));
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
            updateCartCount();
        });
    });
    
    // Add event listeners for quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            let cart = JSON.parse(localStorage.getItem('cart'));
            const item = cart.find(item => item.id === productId);
            
            if (this.classList.contains('minus')) {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart = cart.filter(item => item.id !== productId);
                }
            } else if (this.classList.contains('plus')) {
                item.quantity++;
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
            updateCartCount();
        });
    });
}

// Display favorites in account page
function displayFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    if (!favoritesContainer) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<div class="no-items">You haven\'t added any favorites yet</div>';
        return;
    }
    
    favoritesContainer.innerHTML = '';
    
    favorites.forEach(favId => {
        const dress = dresses.find(d => d.id === favId);
        if (dress) {
            const favItem = document.createElement('div');
            favItem.className = 'favorite-item';
            favItem.innerHTML = `
                <img src="${dress.image}" alt="${dress.name}">
                <div class="favorite-info">
                    <h4>${dress.name}</h4>
                    <div class="price">$${dress.price.toFixed(2)}</div>
                    <button class="remove-from-favorites" data-id="${dress.id}">Remove</button>
                </div>
            `;
            favoritesContainer.appendChild(favItem);
        }
    });
    
    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-from-favorites').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            let favorites = JSON.parse(localStorage.getItem('favorites'));
            favorites = favorites.filter(id => id !== productId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            displayFavorites();
        });
    });
}

// Render featured products
function renderFeaturedProducts(products) {
    const featuredProductsEl = document.getElementById('featuredProducts');
    if (!featuredProductsEl) return;
    
    featuredProductsEl.innerHTML = '';
    
    products.forEach(dress => {
        const favorites = JSON.parse(localStorage.getItem('favorites'));
        const isFavorite = favorites.includes(dress.id);
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const inCart = cart.some(item => item.id === dress.id);
        
        const productCard = document.createElement('div');
        productCard.className = 'featured-product-card';
        productCard.innerHTML = `
            <div class="favorite-heart ${isFavorite ? 'active' : ''}">
                <i class="fas fa-heart"></i>
            </div>
            ${dress.bestSeller ? '<div class="best-seller">Bestseller</div>' : ''}
            <img src="${dress.image}" alt="${dress.name}" loading="lazy">
            <div class="featured-product-info">
                <h3>${dress.name}</h3>
                <div class="price">$${dress.price.toFixed(2)}</div>
                <div class="rating">
                    ${'★'.repeat(Math.round(dress.rating))}${'☆'.repeat(5 - Math.round(dress.rating))}
                    <span>(${dress.rating.toFixed(1)})</span>
                </div>
                <button class="add-to-cart" data-id="${dress.id}">
                    ${inCart ? 'Added to Cart' : 'Add to Cart'}
                </button>
            </div>
        `;
        
        // Add favorite click handler
        const heart = productCard.querySelector('.favorite-heart');
        heart.addEventListener('click', (e) => {
            e.stopPropagation();
            let favorites = JSON.parse(localStorage.getItem('favorites'));
            const index = favorites.indexOf(dress.id);
            
            if (index >= 0) {
                favorites.splice(index, 1);
                heart.classList.remove('active');
            } else {
                favorites.push(dress.id);
                heart.classList.add('active');
            }
            
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
        
        // Add cart click handler
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(dress);
            addToCartBtn.textContent = 'Added to Cart';
        });

        featuredProductsEl.appendChild(productCard);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initCartCount();
    updateCartCount();
    
    if (collectionProductsEl) {
        loadCollectionProducts();
        setupEventListeners();
    }
    
// Load bestsellers in featured section
const featuredProductsEl = document.getElementById('featuredProducts');
if (featuredProductsEl) {
    // Filter and display bestseller dresses
    const bestsellers = dresses.filter(dress => dress.bestSeller);
    renderFeaturedProducts(bestsellers);
        
    // Add event delegation for featured section add-to-cart buttons
    featuredProductsEl.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(e.target.dataset.id);
                let cart = JSON.parse(localStorage.getItem('cart'));
                const product = dresses.find(d => d.id === productId);
                
                const existingIndex = cart.findIndex(item => item.id === productId);
                
                if (existingIndex >= 0) {
                    cart.splice(existingIndex, 1);
                    e.target.textContent = 'Add to Cart';
                } else {
                    cart.push({
                        ...product,
                        quantity: 1,
                        price: product.price
                    });
                    e.target.textContent = 'Added to Cart';
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
            }
        });
    }
    
    // Initialize account page displays
    if (window.location.pathname.includes('account.html')) {
        displayCartItems();
        displayFavorites();
    }
    document.addEventListener('DOMContentLoaded', () => {
        const collectionContainer = document.getElementById('collectionProducts');
        if (collectionContainer) {
            collectionContainer.innerHTML = ''; // clear existing
    
            dresses.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
    
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="favorite-heart"><i class="fas fa-heart"></i></div>
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        <div class="price">$${product.price.toFixed(2)}</div>
                        <div class="rating">
                            ${'★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating))}
                            <span>(${Math.floor(product.rating * 6)} reviews)</span>
                        </div>
                        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                `;
    
                collectionContainer.appendChild(card);
            });
    
            // Add-to-cart logic
            document.querySelectorAll('.add-to-cart').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.getAttribute('data-id'));
                    const product = dresses.find(p => p.id === id);
                    if (!product) return;
    
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    cart.push(product);
                    localStorage.setItem('cart', JSON.stringify(cart));
    
                    btn.classList.add('in-cart');
                    btn.textContent = 'Added';
                    document.getElementById('cart-count').textContent = cart.length;
                });
            });
        }
    });
    
});
