/* =========================================
   ZYNEXCART — MAIN APP
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  setupSearch();
});


/* =========================================
   CART COUNT
   ========================================= */

function getCart() {
  try {
    const cart = localStorage.getItem("zynexcart_cart");

    if (!cart) {
      return [];
    }

    return JSON.parse(cart);

  } catch (error) {
    console.error("Unable to read cart:", error);
    return [];
  }
}


function updateCartCount() {
  const cart = getCart();

  const count = cart.reduce((total, item) => {
    return total + Number(item.quantity || 0);
  }, 0);

  const cartCountElements =
    document.querySelectorAll("#cartCount");

  cartCountElements.forEach((element) => {
    element.textContent = count;
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


  searchForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const searchTerm =
      searchInput.value.trim();


    if (!searchTerm) {
      return;
    }


    window.location.href =
      `products.html?search=${encodeURIComponent(searchTerm)}`;

  });

}


/* =========================================
   ADD TO CART
   ========================================= */

function addToCart(product) {

  const cart = getCart();

  const existingProduct =
    cart.find(item => item.id === product.id);


  if (existingProduct) {

    existingProduct.quantity += 1;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });

  }


  localStorage.setItem(
    "zynexcart_cart",
    JSON.stringify(cart)
  );


  updateCartCount();

}


/* =========================================
   REMOVE FROM CART
   ========================================= */

function removeFromCart(productId) {

  const cart = getCart();

  const updatedCart =
    cart.filter(item => item.id !== productId);


  localStorage.setItem(
    "zynexcart_cart",
    JSON.stringify(updatedCart)
  );


  updateCartCount();

}


/* =========================================
   CHANGE CART QUANTITY
   ========================================= */

function changeCartQuantity(productId, change) {

  const cart = getCart();

  const product =
    cart.find(item => item.id === productId);


  if (!product) {
    return;
  }


  product.quantity += change;


  if (product.quantity <= 0) {

    const updatedCart =
      cart.filter(item => item.id !== productId);

    localStorage.setItem(
      "zynexcart_cart",
      JSON.stringify(updatedCart)
    );

  } else {

    localStorage.setItem(
      "zynexcart_cart",
      JSON.stringify(cart)
    );

  }


  updateCartCount();

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
  ).format(price);

}
