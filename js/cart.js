document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});

function renderCart() {
  const cartContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty 🛒</h2>
        <p>Add some products to continue shopping.</p>
        <a href="products.html" class="btn-primary">Continue Shopping</a>
      </div>
    `;

    if (cartTotal) {
      cartTotal.textContent = formatPrice(0);
    }

    return;
  }

  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item">

      <img
        src="${item.image}"
        alt="${item.name}"
        class="cart-item-image"
      >

      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>${item.unit}</p>

        <div class="cart-item-price">
          ${formatPrice(item.price)}
        </div>

        <div class="quantity-controls">
          <button
            class="quantity-btn"
            onclick="changeCartQuantity(${item.id}, -1)"
          >
            −
          </button>

          <span>${item.quantity}</span>

          <button
            class="quantity-btn"
            onclick="changeCartQuantity(${item.id}, 1)"
          >
            +
          </button>
        </div>

        <button
          class="remove-btn"
          onclick="removeItem(${item.id})"
        >
          Remove
        </button>
      </div>

      <div class="cart-item-total">
        ${formatPrice(item.price * item.quantity)}
      </div>

    </div>
  `).join("");

  const total = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  if (cartTotal) {
    cartTotal.textContent = formatPrice(total);
  }
}

function removeItem(productId) {
  removeFromCart(productId);
  renderCart();
}

function changeCartQuantity(productId, change) {
  changeCartQuantityInStorage(productId, change);
  renderCart();
}
function changeCartQuantity(productId, change) {
  let cart = getCart();

  const item = cart.find(product => product.id === productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== productId);
  }

  localStorage.setItem("zynexcart_cart", JSON.stringify(cart));

  updateCartCount();
  renderCart();
}