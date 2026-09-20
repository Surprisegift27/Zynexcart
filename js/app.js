/* =========================================
   ZYNEXCART — MAIN APP
   Dynamic Cart System
   ========================================= */


/* =========================================
   CART STORAGE KEY
   ========================================= */

const CART_STORAGE_KEY = "zynexcart_cart";


/* =========================================
   APP INITIALIZATION
   ========================================= */

function initializeZynexCart() {

  updateCartHeader();

  setupSearch();

}


/*
 * Important:
 * app.js index.html mein dynamically load hota hai.
 * Isliye sirf DOMContentLoaded par depend nahi karna.
 */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initializeZynexCart,
    { once: true }
  );

} else {

  initializeZynexCart();

}


/* =========================================
   GET CART
   ========================================= */

function getCart() {

  try {

    const storedCart =
      localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart =
      JSON.parse(storedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.filter(item => {

      return (
        item &&
        item.id !== undefined &&
        Number(item.quantity) > 0
      );

    });

  } catch (error) {

    console.error(
      "ZynexCart: Unable to read cart.",
      error
    );

    return [];

  }

}


/* =========================================
   SAVE CART
   ========================================= */

function saveCart(cart) {

  try {

    const validCart =
      Array.isArray(cart)
        ? cart.filter(item => {

            return (
              item &&
              item.id !== undefined &&
              Number(item.quantity) > 0
            );

          })
        : [];


    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(validCart)
    );


    updateCartHeader();


    document.dispatchEvent(
      new CustomEvent(
        "zynexcart:cartUpdated"
      )
    );


  } catch (error) {

    console.error(
      "ZynexCart: Unable to save cart.",
      error
    );

  }

}


/* =========================================
   TOTAL ITEM QUANTITY
   ========================================= */

function getCartItemCount() {

  const cart = getCart();

  return cart.reduce(
    (total, item) => {

      return total +
        Number(item.quantity || 0);

    },
    0
  );

}


/* =========================================
   TOTAL CART AMOUNT
   ========================================= */

function getCartTotal() {

  const cart = getCart();

  return cart.reduce(
    (total, item) => {

      return total +
        (
          Number(item.price || 0) *
          Number(item.quantity || 0)
        );

    },
    0
  );

}


/* =========================================
   FORMAT PRICE
   ========================================= */

function formatPrice(price) {

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }
  ).format(Number(price) || 0);

}


/* =========================================
   UPDATE CART HEADER
   ========================================= */

function updateCartHeader() {

  const itemCount =
    getCartItemCount();

  const totalAmount =
    getCartTotal();


  /* CART COUNT */

  const cartCountElements =
    document.querySelectorAll("#cartCount");

  cartCountElements.forEach(element => {

    element.textContent =
      itemCount;

  });


  /* CART ITEMS TEXT */

  const cartItemsText =
    document.querySelectorAll(
      "#cartItemsText"
    );

  cartItemsText.forEach(element => {

    element.textContent =
      `${itemCount} ${
        itemCount === 1
          ? "item"
          : "items"
      }`;

  });


  /* CART TOTAL */

  const cartTotalElements =
    document.querySelectorAll(
      "#cartTotal"
    );

  cartTotalElements.forEach(element => {

    element.textContent =
      formatPrice(totalAmount);

  });


  /* CART SUMMARY */

  const cartSummaryElements =
    document.querySelectorAll(
      "#cartSummary"
    );

  cartSummaryElements.forEach(element => {

    element.textContent =
      `${itemCount} ${
        itemCount === 1
          ? "item"
          : "items"
      } • ${formatPrice(totalAmount)}`;

  });


}


/* =========================================
   SEARCH
   ========================================= */

function setupSearch() {

  const searchForm =
    document.querySelector("#searchForm");

  const searchInput =
    document.querySelector("#searchInput");


  if (!searchForm || !searchInput) {
    return;
  }


  /*
   * Prevent duplicate search listeners.
   */

  if (
    searchForm.dataset.searchReady === "true"
  ) {
    return;
  }


  searchForm.dataset.searchReady = "true";


  searchForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const searchTerm =
        searchInput.value.trim();


      if (!searchTerm) {
        return;
      }


      window.location.href =
        `products.html?search=${encodeURIComponent(
          searchTerm
        )}`;

    }
  );

}


/* =========================================
   ADD TO CART
   ========================================= */

function addToCart(product) {

  if (
    !product ||
    product.id === undefined
  ) {

    console.error(
      "ZynexCart: Invalid product.",
      product
    );

    return;

  }


  const cart =
    getCart();


  const existingProduct =
    cart.find(
      item =>
        String(item.id) ===
        String(product.id)
    );


  /* EXISTING PRODUCT */

  if (existingProduct) {

    existingProduct.quantity =
      Number(existingProduct.quantity || 0) + 1;

  }


  /* NEW PRODUCT */

  else {

    cart.push({

      id: product.id,

      name: product.name || "",

      price:
        Number(product.price || 0),

      mrp:
        Number(product.mrp || 0),

      unit:
        product.unit || "",

      image:
        product.image || "",

      category:
        product.category || "",

      quantity: 1

    });

  }


  saveCart(cart);

}


/* =========================================
   REMOVE FROM CART
   ========================================= */

function removeFromCart(productId) {

  const cart =
    getCart();


  const updatedCart =
    cart.filter(
      item =>
        String(item.id) !==
        String(productId)
    );


  saveCart(updatedCart);

}


/* =========================================
   CHANGE CART QUANTITY
   ========================================= */

function changeCartQuantity(
  productId,
  change
) {

  const cart =
    getCart();


  const product =
    cart.find(
      item =>
        String(item.id) ===
        String(productId)
    );


  if (!product) {
    return;
  }


  product.quantity =
    Number(product.quantity || 0) +
    Number(change || 0);


  if (product.quantity <= 0) {

    removeFromCart(productId);

    return;

  }


  saveCart(cart);

}


/* =========================================
   SET EXACT QUANTITY
   ========================================= */

function setCartQuantity(
  productId,
  quantity
) {

  const cart =
    getCart();


  const product =
    cart.find(
      item =>
        String(item.id) ===
        String(productId)
    );


  if (!product) {
    return;
  }


  const newQuantity =
    Number(quantity);


  if (
    !Number.isFinite(newQuantity) ||
    newQuantity <= 0
  ) {

    removeFromCart(productId);

    return;

  }


  product.quantity =
    newQuantity;


  saveCart(cart);

}


/* =========================================
   CLEAR ENTIRE CART
   ========================================= */

function clearCart() {

  localStorage.removeItem(
    CART_STORAGE_KEY
  );


  updateCartHeader();


  document.dispatchEvent(
    new CustomEvent(
      "zynexcart:cartUpdated"
    )
  );

}


/* =========================================
   LOCALSTORAGE SYNC
   ========================================= */

window.addEventListener(
  "storage",
  event => {

    if (
      event.key === CART_STORAGE_KEY
    ) {

      updateCartHeader();

    }

  }
);


/* =========================================
   CART UPDATE EVENT
   ========================================= */

document.addEventListener(
  "zynexcart:cartUpdated",
  () => {

    updateCartHeader();

  }
);


/* =========================================
   GLOBAL FUNCTIONS
   ========================================= */

window.getCart =
  getCart;

window.saveCart =
  saveCart;

window.addToCart =
  addToCart;

window.removeFromCart =
  removeFromCart;

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
