// DOM Elements
const basketContainer = document.getElementById("basketContainer");
const emptyBasket = document.getElementById("emptyBasket");
const cartCount = document.getElementById("cartCount");

// Load basket from localStorage
let basket = JSON.parse(localStorage.getItem("basket")) || [];

// Update cart count (total quantity)
function updateCartCount() {
    const totalItems = basket.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = totalItems;
}

// Check if basket is empty
function checkEmptyBasket() {
    if (basket.length === 0) {
        emptyBasket.classList.remove("d-none");
        basketContainer.innerHTML = "";
    } else {
        emptyBasket.classList.add("d-none");
    }
}

// Render basket items
function renderBasket() {
    basketContainer.innerHTML = "";

    basket.forEach(item => {
        const qty = item.quantity || 1;
        basketContainer.innerHTML += `
        <div class="col-md-4 mb-4">
            <div class="card shadow-sm h-100 basket-item">
                <img src="${item.image}" class="card-img-top" style="height:200px; object-fit:cover;" />
                <div class="card-body">
                    <h5>${item.title.slice(0, 15)}...</h5>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <p>Quantity: 
                        <button class="btn btn-sm btn-outline-secondary decrease-qty" data-id="${item.id}">-</button>
                        <span class="qty">${qty}</span>
                        <button class="btn btn-sm btn-outline-secondary increase-qty" data-id="${item.id}">+</button>
                    </p>
                    <p>Total: $<span class="item-total">${(item.price * qty).toFixed(2)}</span></p>
                    <button class="action-btn trash remove-basket-btn" data-id="${item.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
    });

    attachQuantityEvents();
    attachRemoveBasketEvents();
    checkEmptyBasket();
    updateCartCount();
    calculateTotals();
}

// Attach remove button events
function attachRemoveBasketEvents() {
    const removeButtons = document.querySelectorAll(".remove-basket-btn");

    removeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            basket = basket.filter(item => item.id != id);
            localStorage.setItem("basket", JSON.stringify(basket));
            renderBasket();
        });
    });
}

// Attach quantity buttons (+ / -)
function attachQuantityEvents() {
    document.querySelectorAll(".increase-qty").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const item = basket.find(i => i.id == id);
            item.quantity = (item.quantity || 1) + 1;
            localStorage.setItem("basket", JSON.stringify(basket));
            renderBasket();
        });
    });

    document.querySelectorAll(".decrease-qty").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const item = basket.find(i => i.id == id);
            item.quantity = (item.quantity || 1) - 1;

            if (item.quantity < 1) {
                basket = basket.filter(i => i.id != id);
            }

            localStorage.setItem("basket", JSON.stringify(basket));
            renderBasket();
        });
    });
}

// Calculate totals
function calculateTotals() {
    let subtotal = basket.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    let tax = subtotal * 0.10; // 10% tax
    let total = subtotal + tax;

    document.getElementById("subtotalPrice").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("taxAmount").textContent = `$${tax.toFixed(2)}`;
    document.getElementById("totalPrice").textContent = `$${total.toFixed(2)}`;

    const summary = document.getElementById("cartSummary");
    summary.classList.toggle("d-none", basket.length === 0);
}

// INITIALIZE
renderBasket();
updateCartCount();
