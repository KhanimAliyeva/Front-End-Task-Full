const productsContainer = document.getElementById("productsContainer");
const spinner = document.getElementById("loadingSpinner");
const alertBox = document.getElementById("errorAlert");

let currentPage = 1;
const itemsPerPage = 8;

let allProducts = [];
let filteredProducts = [];

// =========================
// Scroll to products section
// =========================
window.goToProducts = function () {
  const productsSection = document.getElementById("productsSection");
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: "smooth" });
  }
};

// =========================
// Spinner + Error
// =========================
function showSpinner(show) {
  spinner.classList.toggle("d-none", !show);
}

function showError(message) {
  alertBox.textContent = message;
  alertBox.classList.remove("d-none");
}

// =========================
// Fetch Products (FakeStore)
// =========================
async function loadProducts() {
  try {
    const res = await axios.get("https://fakestoreapi.com/products");
    allProducts = res.data;
    filteredProducts = allProducts;

    renderProducts(filteredProducts, productsContainer);
  } catch (error) {
    showError("Failed to load products!");
  } finally {
    showSpinner(false);
  }
}

// =========================
// Render Product Cards
// =========================
function renderProducts(list, container) {
  container.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = list.slice(start, end);

  paginatedItems.forEach((item) => {
    container.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="card shadow-sm h-100 product-card">
          <img src="${item.image}" class="card-img-top" style="height:200px; object-fit:cover;" />
          <div class="card-body">
            <h5>${item.title.slice(0, 15)}...</h5>
            <p>$${item.price}</p>

            <div class="product-actions d-flex justify-content-between">
              <button class="btn btn-outline-primary btn-details" onclick="goToDetails(${item.id})">Details</button>

              <button class="action-btn wish"><i class="fa-regular fa-heart"></i></button>
              <button class="action-btn cart"><i class="fa-solid fa-basket-shopping"></i></button>
              <button class="action-btn trash delete-index-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  renderPagination(list.length);

  attachWishlistEvents();
  highlightWishlistedItems();

  attachBasketEvents();
  highlightBasketItems();  // FIXED

  attachDeleteEvents();
}

// =========================
// Pagination UI
// =========================
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationDiv = document.getElementById("pagination");

  paginationDiv.innerHTML = `
    <button class="btn btn-outline-primary mx-1" 
      ${currentPage === 1 ? "disabled" : ""} 
      onclick="changePage(${currentPage - 1})">Prev</button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    paginationDiv.innerHTML += `
      <button class="btn ${i === currentPage ? "btn-primary" : "btn-outline-primary"} mx-1"
        onclick="changePage(${i})">${i}</button>
    `;
  }

  paginationDiv.innerHTML += `
    <button class="btn btn-outline-primary mx-1"
      ${currentPage === totalPages ? "disabled" : ""} 
      onclick="changePage(${currentPage + 1})">Next</button>
  `;
}

window.changePage = function (page) {
  currentPage = page;
  renderProducts(filteredProducts, productsContainer);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// =========================
// Wishlist
// =========================
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function updateWishCount() {
  document.getElementById("wishCount").textContent = wishlist.length;
}

updateWishCount();

function addToWishlist(product) {
  const exists = wishlist.some((item) => item.id === product.id);

  if (!exists) {
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishCount();
  }
}

function attachWishlistEvents() {
  const btns = document.querySelectorAll(".action-btn.wish");

  btns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const productIndex = (currentPage - 1) * itemsPerPage + index;
      const product = filteredProducts[productIndex];

      addToWishlist(product);

      btn.style.background = "#e03131";
      btn.style.color = "#fff";
    });
  });
}

function highlightWishlistedItems() {
  const btns = document.querySelectorAll(".action-btn.wish");

  btns.forEach((btn, index) => {
    const productIndex = (currentPage - 1) * itemsPerPage + index;
    const product = filteredProducts[productIndex];

    if (wishlist.some((w) => w.id === product.id)) {
      btn.style.background = "#e03131";
      btn.style.color = "#fff";
    }
  });
}

// =========================
// Basket
// =========================
let basket = JSON.parse(localStorage.getItem("basket")) || [];

function updateCartCount() {
  document.getElementById("cartCount").textContent = basket.length;
}

updateCartCount();

function addToBasket(product) {
  const existing = basket.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    product.quantity = 1;
    basket.push(product);
  }

  localStorage.setItem("basket", JSON.stringify(basket));

  updateCartCount();        // FIXED
}

function attachBasketEvents() {
  const btns = document.querySelectorAll(".action-btn.cart");

  btns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const productIndex = (currentPage - 1) * itemsPerPage + index;
      const product = filteredProducts[productIndex];

      addToBasket(product);

      btn.style.background = "#2f9e44";
      btn.style.color = "#fff";
    });
  });
}

function highlightBasketItems() {
  const btns = document.querySelectorAll(".action-btn.cart");

  btns.forEach((btn, index) => {
    const productIndex = (currentPage - 1) * itemsPerPage + index;
    const product = filteredProducts[productIndex];

    if (basket.some((b) => b.id === product.id)) {
      btn.style.background = "#2f9e44";
      btn.style.color = "#fff";
    }
  });
}

// =========================
// Delete Button
// =========================
function attachDeleteEvents() {
  const deleteBtns = document.querySelectorAll(".delete-index-btn");

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".col-md-3").remove();
    });
  });
}

// =========================
// Go To Details
// =========================
window.goToDetails = function (id) {
  window.location.href = `product-details.html?id=${id}`;
};

// =========================
// Search
// =========================
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const query = document.getElementById("searchInput").value.toLowerCase();

  filteredProducts = allProducts.filter((p) =>
    p.title.toLowerCase().includes(query)
  );

  currentPage = 1;
  renderProducts(filteredProducts, productsContainer);
});

// =========================
// Hero “Shop Now” button
// =========================
document.getElementById("shopBtn")?.addEventListener("click", () => {
  document.getElementById("productsSection").scrollIntoView({
    behavior: "smooth",
  });
});

// =========================
// INIT APP
// =========================
document.addEventListener("DOMContentLoaded", () => {
  showSpinner(true);
  loadProducts();
});
