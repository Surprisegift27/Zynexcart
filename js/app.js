/* =====================================================
   ZYNEXCART — GLOBAL CART SYSTEM
   Dynamic Cart + LocalStorage
   ===================================================== */

const CART_STORAGE_KEY = "zynexcart_cart";


/* =====================================================
   GET CART
   ===================================================== */

function getCart() {
  try {
    const cart = JSON.parse(
      localStorage.getItem(CART_STORAGE_KEY)
    );

    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    console.error("Cart read error:", error);
    return [];
  }
}


/* =====================================================
   SAVE CART
   ===================================================== */

function saveCart(cart) {
  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify(cart)
  );

  updateCartHeader();

  document.dispatchEvent(
    new CustomEvent("zynexcart:cartUpdated", {
      detail: cart
    })
  );
}


/* =====================================================
   CART TOTAL ITEMS
   ===================================================== */

function getCartItemCount() {
  const cart = getCart();

  return cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );
}


/* =====================================================
   CART TOTAL AMOUNT
   ===================================================== */

function getCartTotal() {
  const cart = getCart();

  return cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
      Number(item.quantity || 0),
    0
  );
}


/* =====================================================
   FORMAT PRICE
   ===================================================== */

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(price) || 0);
}


/* =====================================================
   UPDATE HEADER CART
   ===================================================== */

function updateCartHeader() {
  const itemCount = getCartItemCount();
  const totalAmount = getCartTotal();

  /*
     Main cart count
  */

  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent = itemCount;
  }


  /*
     Optional detailed cart count
     Example:
     1 item
     2 items
  */

  const cartItemsText =
    document.getElementById("cartItemsText");

  if (cartItemsText) {
    cartItemsText.textContent =
      `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
  }


  /*
     Optional cart total
     Example:
     ₹120
  */

  const cartTotal =
    document.getElementById("cartTotal");

  if (cartTotal) {
    cartTotal.textContent =
      formatPrice(totalAmount);
  }


  /*
     Optional combined cart information
  */

  const cartSummary =
    document.getElementById("cartSummary");

  if (cartSummary) {
    cartSummary.textContent =
      `${itemCount} ${itemCount === 1 ? "item" : "items"} • ${formatPrice(totalAmount)}`;
  }


  /*
     Empty cart state
  */

  if (itemCount === 0) {

    if (cartItemsText) {
      cartItemsText.textContent = "0 items";
    }

    if (cartTotal) {
      cartTotal.textContent = "₹0";
    }

    if (cartSummary) {
      cartSummary.textContent = "0 items • ₹0";
    }
  }
}


/* =====================================================
   ADD TO CART
   ===================================================== */

function addToCart(product) {

  if (!product || product.id === undefined) {
    console.error("Invalid product:", product);
    return;
  }

  const cart = getCart();

  const productId = String(product.id);

  const existingItem = cart.find(
    item => String(item.id) === productId
  );


  /*
     Same product already exists
     → Increase quantity
  */

  if (existingItem) {

    existingItem.quantity =
      Number(existingItem.quantity || 0) + 1;

  } else {

    /*
       New product
       → Add with quantity 1
    */

    cart.push({
      id: product.id,
      name: product.name || "",
      price: Number(product.price || 0),
      mrp: Number(product.mrp || 0),
      unit: product.unit || "",
      image: product.image || "",
      category: product.category || "",
      quantity: 1
    });
  }


  saveCart(cart);
}


/* =====================================================
   REMOVE FROM CART
   ===================================================== */

function removeFromCart(productId) {

  let cart = getCart();

  cart = cart.filter(
    item => String(item.id) !== String(productId)
  );

  saveCart(cart);
}


/* =====================================================
   CHANGE QUANTITY
   ===================================================== */

function changeCartQuantity(productId, change) {

  const cart = getCart();

  const item = cart.find(
    product =>
      String(product.id) === String(productId)
  );

  if (!item) {
    return;
  }


  item.quantity =
    Number(item.quantity || 0) + Number(change);


  /*
     Quantity 0 or less
     → Automatically remove product
  */

  if (item.quantity <= 0) {

    const updatedCart = cart.filter(
      product =>
        String(product.id) !== String(productId)
    );

    saveCart(updatedCart);

    return;
  }


  saveCart(cart);
}


/* =====================================================
   SET EXACT QUANTITY
   ===================================================== */

function setCartQuantity(productId, quantity) {

  const cart = getCart();

  const item = cart.find(
    product =>
      String(product.id) === String(productId)
  );

  if (!item) {
    return;
  }


  const newQuantity = Number(quantity);


  if (newQuantity <= 0) {

    removeFromCart(productId);

    return;
  }


  item.quantity = newQuantity;

  saveCart(cart);
}


/* =====================================================
   CLEAR CART
   ===================================================== */

function clearCart() {

  localStorage.removeItem(
    CART_STORAGE_KEY
  );

  updateCartHeader();

  document.dispatchEvent(
    new CustomEvent("zynexcart:cartUpdated", {
      detail: []
    })
  );
}


/* =====================================================
   SEARCH
   ===================================================== */

function setupSearch() {

  const searchForm =
    document.getElementById("searchForm");

  const searchInput =
    document.getElementById("searchInput");


  if (!searchForm || !searchInput) {
    return;
  }


  searchForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();

      const query =
        searchInput.value.trim();


      if (!query) {
        return;
      }


      window.location.href =
        `products.html?search=${encodeURIComponent(query)}`;
    }
  );
}


/* =====================================================
   INITIALIZE
   ===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    updateCartHeader();

    setupSearch();
  }
);


/* =====================================================
   UPDATE WHEN CART CHANGES
   ===================================================== */

document.addEventListener(
  "zynexcart:cartUpdated",
  function () {

    updateCartHeader();
  }
);


/* =====================================================
   MULTI-TAB SUPPORT
   ===================================================== */

window.addEventListener(
  "storage",
  function (event) {

    if (event.key === CART_STORAGE_KEY) {
      updateCartHeader();
    }
  }
);


/* =====================================================
   GLOBAL FUNCTIONS
   ===================================================== */

window.getCart = getCart;
window.saveCart = saveCart;

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

window.changeCartQuantity =
  changeCartQuantity;

window.setCartQuantity =
  setCartQuantity;

window.clearCart =
  clearCart;

window.getCartItemCount =
  getCartItemCount;

window.getCartTotal =
  getCartTotal;

window.formatPrice =
  formatPrice;

window.updateCartHeader =
  updateCartHeader;
