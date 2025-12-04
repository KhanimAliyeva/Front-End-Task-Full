const wishlistContainer = document.getElementById("wishlistContainer");
const emptyWishlist = document.getElementById("emptyWishlist");
const wishCount = document.getElementById("wishCount");

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function updateWishCount() {
    wishCount.textContent = wishlist.length;
}

function checkEmptyMessage() {
    if (wishlist.length === 0) {
        emptyWishlist.classList.remove("d-none");
        wishlistContainer.innerHTML = "";
    } else {
        emptyWishlist.classList.add("d-none");
    }
}

function renderWishlist() {
    wishlistContainer.innerHTML = "";

    wishlist.forEach((item) => {
        const card = `
        <div class="col-md-3 mb-4">
            <div class="card shadow-sm h-100">

                <img src="${item.image}" class="card-img-top" style="height:200px; object-fit:cover;" />

                <div class="card-body">
                    <h5>${item.title.slice(0, 15)}...</h5>
                    <p>$${item.price}</p>

                    <button 
                        class="btn btn-danger btn-sm btn-block remove-btn"
                        data-id="${item.id}"
                    >
                        <i class="fa-solid fa-trash"></i> Remove
                    </button>
                </div>

            </div>
        </div>
        `;
        wishlistContainer.innerHTML += card;
    });

    attachRemoveEvents();
    checkEmptyMessage();
    updateWishCount();
}

function attachRemoveEvents() {
    const removeButtons = document.querySelectorAll(".remove-btn");

    removeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            removeFromWishlist(id);
        });
    });
}

function removeFromWishlist(id) {
    wishlist = wishlist.filter((item) => item.id != id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlist();
}

renderWishlist();
updateWishCount();
