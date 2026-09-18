/* =========================================
   ZYNEXCART — MAIN APP
   Dynamic Cart System
   ========================================= */


/* =========================================
   CART STORAGE KEY
   ========================================= */

const CART_STORAGE_KEY = "zynexcart_cart";


/* =========================================
   PAGE INITIALIZATION
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  updateCartHeader();

  setupSearch();

});


/* =========================================
   GET CART
   ========================================= */

function getCart() {

  try {

    const cart =
      localStorage.getItem(CART_STORAGE_KEY);

    if (!cart) {
      return [];
    }

    const parsedCart = JSON.parse(cart);

    return Array.isArray(parsedCart)
      ? parsedCart
      : [];

  } catch (error) {

    console.error(
      "Unable to read cart:",
      error
    );

    return [];
  }
}


/* =========================================
   SAVE CART
   ========================================= */

function saveCart(cart) {

  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify(cart)
  );

  updateCartHeader();

  /*
     Tell other cart components
     that cart has changed.
  */

  document.dispatchEvent(
    new CustomEvent("zynexcart:cartUpdated")
  );
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


  /* -----------------------------------------
     CART COUNT
     ----------------------------------------- */

  const cartCountElements =
    document.querySelectorAll("#cartCount");

  cartCountElements.forEach((element) => {

    element.textContent = itemCount;

  });


  /* -----------------------------------------
     CART ITEMS TEXT
     Example: 1 item / 2 items
     ----------------------------------------- */

  const cartItemsText =
    document.querySelectorAll(
      "#cartItemsText"
    );

  cartItemsText.forEach((element) => {

    element.textContent =
      `${itemCount} ${
        itemCount === 1
          ? "item"
          : "items"
      }`;

  });


  /* -----------------------------------------
     CART TOTAL
     Example: ₹120
     ----------------------------------------- */

  const cartTotalElements =
    document.querySelectorAll(
      "#cartTotal"
    );

  cartTotalElements.forEach((element) => {

    element.textContent =
      formatPrice(totalAmount);

  });


  /* -----------------------------------------
     COMBINED CART SUMMARY
     Example:
     2 items • ₹240
     ----------------------------------------- */

  const cartSummaryElements =
    document.querySelectorAll(
      "#cartSummary"
    );

  cartSummaryElements.forEach((element) => {

    element.textContent =
      `${itemCount} ${
        itemCount === 1
          ? "item"
          : "items"
      } • ${formatPrice(totalAmount)}`;

  });


  /* -----------------------------------------
     EMPTY CART DISPLAY
     ----------------------------------------- */

  if (itemCount === 0) {

    cartItemsText.forEach((element) => {

      element.textContent = "0 items";

    });


    cartTotalElements.forEach((element) => {

      element.textContent = "₹0";

    });


    cartSummaryElements.forEach((element) => {

      element.textContent =
        "0 items • ₹0";

    });

  }

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


  searchForm.addEventListener(
    "submit",
    (event) => {

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

  if (!product || product.id === undefined) {

    console.error(
      "Invalid product:",
      product
    );

    return;
  }


  const cart = getCart();


  const existingProduct =
    cart.find(
      item =>
        String(item.id) ===
        String(product.id)
    );


  /* -----------------------------------------
     PRODUCT ALREADY EXISTS
     → Increase quantity
     ----------------------------------------- */

  if (existingProduct) {

    existingProduct.quantity =
      Number(existingProduct.quantity || 0) + 1;

  }


  /* -----------------------------------------
     NEW PRODUCT
     → Add quantity 1
     ----------------------------------------- */

  else {

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


/* =========================================
   REMOVE FROM CART
   ========================================= */

function removeFromCart(productId) {

  const cart = getCart();


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

  const cart = getCart();


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


  /* -----------------------------------------
     Quantity 0 or below
     → Remove product
     ----------------------------------------- */

  if (product.quantity <= 0) {

    const updatedCart =
      cart.filter(
        item =>
          String(item.id) !==
          String(productId)
      );


    saveCart(updatedCart);

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

  const cart = getCart();


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


  if (newQuantity <= 0) {

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
   REFRESH CART WHEN LOCALSTORAGE CHANGES
   ========================================= */

window.addEventListener(
  "storage",
  (event) => {

    if (
      event.key === CART_STORAGE_KEY
    ) {

      updateCartHeader();

    }

  }
);


/* =========================================
   UPDATE HEADER AFTER CART CHANGE
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
