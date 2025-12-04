const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// DOM
const loader = document.getElementById("detailsLoader");
const content = document.getElementById("detailsContent");
const img = document.getElementById("detailsImage");
const title = document.getElementById("detailsTitle");
const price = document.getElementById("detailsPrice");
const desc = document.getElementById("detailsDesc");

const addWishBtn = document.getElementById("addWishBtn");
const addCartBtn = document.getElementById("addCartBtn");

const decreaseBtn = document.querySelector(".decrease-qty");
const increaseBtn = document.querySelector(".increase-qty");
const qtySpan = document.querySelector(".qty");

// DATA
let productQuantity = 1;
let currentProduct = null;

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let basket = JSON.parse(localStorage.getItem("basket")) || [];


// COUNTERS (fixed to show TOTAL QUANTITY)
function updateWishCount() {
    document.getElementById("wishCount").textContent = wishlist.length;
}

function updateCartCount() {
    const totalQuantity = basket.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.getElementById("cartCount").textContent = totalQuantity;
}

function updateCounters() {
    updateWishCount();
    updateCartCount();
}

updateCounters();


// LOAD PRODUCT DETAILS
async function loadDetails() {
    try {
        const res = await axios.get("./db.json");
        const product = res.data.find((p) => p.id == productId);

        if (!product) throw new Error("Product not found");

        currentProduct = product;

        // Fill UI
        img.src = product.image;
        title.textContent = product.title;
        price.textContent = `$${product.price.toFixed(2)}`;
        desc.textContent = product.description ?? "No description available.";

        loader.classList.add("d-none");
        content.classList.remove("d-none");

        // Highlight wishlist state
        if (wishlist.some((item) => item.id == product.id)) {
            addWishBtn.style.background = "#e03131";
            addWishBtn.style.color = "#fff";
        }

        // Load quantity from basket
        const existing = basket.find((b) => b.id == product.id);

        if (existing) {
            productQuantity = existing.quantity;
            qtySpan.textContent = productQuantity;

            addCartBtn.style.background = "#2f9e44";
            addCartBtn.style.color = "#fff";
        }

        // ADD TO WISHLIST
        addWishBtn.addEventListener("click", () => {
            if (!wishlist.some((item) => item.id == product.id)) {
                wishlist.push(product);
                localStorage.setItem("wishlist", JSON.stringify(wishlist));

                addWishBtn.style.background = "#e03131";
                addWishBtn.style.color = "#fff";

                updateWishCount();
            }
        });

    } catch (err) {
        console.error("Details failed:", err);
    }
}


// QUANTITY BUTTONS
decreaseBtn.addEventListener("click", () => {
    if (productQuantity > 1) {
        productQuantity--;
        qtySpan.textContent = productQuantity;
    }
});

increaseBtn.addEventListener("click", () => {
    productQuantity++;
    qtySpan.textContent = productQuantity;
});


// ADD TO BASKET (Final Correct Version)
addCartBtn.addEventListener("click", () => {
    if (!currentProduct) return;

    // Always reload latest basket state
    basket = JSON.parse(localStorage.getItem("basket")) || [];

    let existing = basket.find(item => item.id === currentProduct.id);

    if (existing) {
        existing.quantity += productQuantity;   // quantity increases properly
    } else {
        basket.push({ ...currentProduct, quantity: productQuantity });
    }

    localStorage.setItem("basket", JSON.stringify(basket));

    updateCartCount();

    addCartBtn.style.background = "#2f9e44";
    addCartBtn.style.color = "#fff";

    Swal.fire({
        icon: "success",
        title: "Added to Basket",
        text: `${productQuantity} item(s) added to your basket!`,
        timer: 2000,
        showConfirmButton: false
    });
});


// INIT
loadDetails();
