// Retrieve cart array from LocalStorage
function getCart() {
    return JSON.parse(localStorage.getItem("azjewell_cart")) || [];
}

// Save cart array to LocalStorage
function saveCart(cart) {
    localStorage.setItem("azjewell_cart", JSON.stringify(cart));
}

// Add item to cart with visual badge animation
function addToCart(productName, price, imageSrc) {
    let cart = getCart();
    
    const newItem = {
        id: Date.now() + Math.random(),
        name: productName,
        price: price,
        image: imageSrc
    };
    
    cart.push(newItem);
    saveCart(cart);
    updateCartCount();
    
    // Quick scale animation on the badge counter
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) {
        cartCountEl.style.transition = "transform 0.2s ease";
        cartCountEl.style.transform = "scale(1.5)";
        cartCountEl.style.display = "inline-block";
        setTimeout(() => {
            cartCountEl.style.transform = "scale(1)";
        }, 200);
    }

    alert(`Added "${productName}" (${price}) to your shopping bag.`);
}

// Remove single item by ID
function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    
    saveCart(cart);
    updateCartCount();
    renderCartPage();
}

// Update cart counter badge
function updateCartCount() {
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) {
        cartCountEl.innerText = getCart().length;
    }
}

// SVG Fallback Image Generator for missing local files
function getFallbackSvg() {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="%23d4af37" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
}

// Render Products dynamically based on category
function renderCategoryProducts() {
    const mainPage = document.querySelector("main.category-page");
    if (!mainPage) return;

    const currentCategory = mainPage.getAttribute("data-category");
    const gridContainer = mainPage.querySelector(".product-grid");

    if (!currentCategory || !gridContainer || typeof PRODUCTS === "undefined") return;

    const filteredProducts = PRODUCTS.filter(item => item.category === currentCategory);

    gridContainer.innerHTML = "";

    filteredProducts.forEach(item => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='${getFallbackSvg()}'">
            <h3>${item.name}</h3>
            <p class="product-price">${item.price}</p>
            <button class="buy-btn">Add to Bag</button>
        `;

        card.querySelector(".buy-btn").addEventListener("click", () => {
            addToCart(item.name, item.price, item.image);
        });

        gridContainer.appendChild(card);
    });
}

// Render Cart Items and calculate total
function renderCartPage() {
    const container = document.getElementById("cart-container");
    const summaryContainer = document.getElementById("cart-summary");
    const footer = document.getElementById("cart-footer");
    
    if (!container) return; 

    const cart = getCart();
    container.innerHTML = "";
    if (summaryContainer) summaryContainer.innerHTML = "";
    if (footer) footer.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `<p class="empty-cart-msg">Your shopping bag is currently empty.</p>`;
        return;
    }

    let totalPrice = 0;

    const darkTrashIcon = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
    `;

    cart.forEach(item => {
        // Calculate price total
        const numericPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0;
        totalPrice += numericPrice;

        const itemRow = document.createElement("div");
        itemRow.className = "cart-item";
        
        itemRow.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='${getFallbackSvg()}'">
                <div>
                    <span class="cart-item-name">${item.name}</span>
                    <div class="cart-item-price">${item.price || ''}</div>
                </div>
            </div>
            <div class="cart-actions">
                <button class="icon-btn delete-btn" title="Remove Item">${darkTrashIcon}</button>
            </div>
        `;

        itemRow.querySelector(".delete-btn").addEventListener("click", () => removeFromCart(item.id));

        container.appendChild(itemRow);
    });

    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <div class="total-row">
                <span>Total Amount:</span>
                <span class="total-price">$${totalPrice.toLocaleString()}</span>
            </div>
        `;
    }

    if (footer) {
        footer.innerHTML = `<button id="buy-all-btn" class="buy-all-btn">Proceed to Secure Checkout ($${totalPrice.toLocaleString()})</button>`;
        document.getElementById("buy-all-btn").addEventListener("click", () => {
            alert(`Thank you for choosing Nectar.\nTotal Order: $${totalPrice.toLocaleString()}\nThis is a demonstration store; online orders will open soon.`);
        });
    }
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    renderCategoryProducts();
    renderCartPage();
});
