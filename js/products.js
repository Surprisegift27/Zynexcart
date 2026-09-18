/* =========================================
   ZYNEXCART — PRODUCTS
   ========================================= */

const products = [
  {
    id: 1,
    name: "Fresh Milk",
    category: "grocery",
    unit: "1 L",
    price: 68,
    mrp: 75,
    discount: 9,
    image: "assets/products/milk.jpg"
  },
  {
    id: 2,
    name: "Brown Bread",
    category: "grocery",
    unit: "400 g",
    price: 45,
    mrp: 50,
    discount: 10,
    image: "assets/products/bread.jpg"
  },
  {
    id: 3,
    name: "Potato Chips",
    category: "snacks",
    unit: "100 g",
    price: 35,
    mrp: 40,
    discount: 13,
    image: "assets/products/chips.jpg"
  },
  {
    id: 4,
    name: "Bath Soap",
    category: "personal-care",
    unit: "100 g",
    price: 42,
    mrp: 50,
    discount: 16,
    image: "assets/products/soap.jpg"
  },
  {
    id: 5,
    name: "Shampoo",
    category: "personal-care",
    unit: "180 ml",
    price: 149,
    mrp: 175,
    discount: 15,
    image: "assets/products/shampoo.jpg"
  },
  {
    id: 6,
    name: "Orange Juice",
    category: "beverages",
    unit: "1 L",
    price: 110,
    mrp: 125,
    discount: 12,
    image: "assets/products/juice.jpg"
  },
  {
    id: 7,
    name: "Face Wash",
    category: "beauty",
    unit: "100 ml",
    price: 129,
    mrp: 150,
    discount: 14,
    image: "assets/products/face-wash.jpg"
  },
  {
    id: 8,
    name: "Dishwash Liquid",
    category: "household",
    unit: "500 ml",
    price: 99,
    mrp: 115,
    discount: 14,
    image: "assets/products/dishwash.jpg"
  }
];


/* =========================================
   FORMAT CATEGORY
   ========================================= */

function formatCategory(category) {

  return category
    .replace("-", " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());

}


/* =========================================
   GET PRODUCT QUANTITY
   ========================================= */

function getProductQuantity(productId) {

  const cart = getCart();

  const item = cart.find(
    product => Number(product.id) === Number(productId)
  );

  return item ? Number(item.quantity) : 0;
}


/* =========================================
   CREATE PRODUCT BUTTON
   ========================================= */

function createProductButton(product) {

  const quantity =
    getProductQuantity(product.id);


  /* ===============================
     PRODUCT NOT IN CART
     =============================== */

  if (quantity <= 0) {

    return `
      <button
        class="add-btn"
        type="button"
        data-product-id="${product.id}"
      >
        ADD
      </button>
    `;

  }


  /* ===============================
     PRODUCT ALREADY IN CART
     =============================== */

  return `
    <button
      class="add-btn added"
      type="button"
      data-product-id="${product.id}"
      aria-label="Change quantity of ${product.name}"
    >

      <span
        class="qty-minus"
        data-action="minus"
        role="button"
        aria-label="Decrease quantity"
      >
        −
      </span>

      <span class="qty-number">
        ${quantity}
      </span>

      <span
        class="qty-plus"
        data-action="plus"
        role="button"
        aria-label="Increase quantity"
      >
        +
      </span>

    </button>
  `;
}


/* =========================================
   CREATE PRODUCT CARD
   ========================================= */

function createProductCard(product) {

  return `
    <article class="product-card">

      <a
        href="product.html?id=${product.id}"
        class="product-image"
      >

        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.style.display='none'"
        >

      </a>


      <div class="product-info">

        <div class="product-category">
          ${formatCategory(product.category)}
        </div>


        <h3 class="product-name">
          ${product.name}
        </h3>


        <p class="product-unit">
          ${product.unit}
        </p>


        <div class="product-price-row">

          <span class="product-price">
            ${formatPrice(product.price)}
          </span>

          <span class="product-mrp">
            ${formatPrice(product.mrp)}
          </span>

          <span class="product-discount">
            ${product.discount}% OFF
          </span>

        </div>


        ${createProductButton(product)}

      </div>

    </article>
  `;
}


/* =========================================
   DISPLAY FEATURED PRODUCTS
   ========================================= */

function displayFeaturedProducts() {

  const container =
    document.querySelector("#featuredProducts");

  if (!container) {
    return;
  }


  container.innerHTML =
    products
      .slice(0, 8)
      .map(createProductCard)
      .join("");


  setupAddToCartButtons();

}


/* =========================================
   REFRESH PRODUCT BUTTON
   ========================================= */

function refreshProductButton(productId) {

  const buttons =
    document.querySelectorAll(
      `.add-btn[data-product-id="${productId}"]`
    );


  buttons.forEach(button => {

    const product =
      products.find(
        item => item.id === Number(productId)
      );


    if (!product) {
      return;
    }


    const quantity =
      getProductQuantity(productId);


    /* ===============================
       CART EMPTY
       =============================== */

    if (quantity <= 0) {

      button.className = "add-btn";

      button.innerHTML = "ADD";

      button.removeAttribute("aria-label");

      return;
    }


    /* ===============================
       CART HAS PRODUCT
       =============================== */

    button.className = "add-btn added";

    button.setAttribute(
      "aria-label",
      `Change quantity of ${product.name}`
    );


    button.innerHTML = `

      <span
        class="qty-minus"
        data-action="minus"
        role="button"
        aria-label="Decrease quantity"
      >
        −
      </span>

      <span class="qty-number">
        ${quantity}
      </span>

      <span
        class="qty-plus"
        data-action="plus"
        role="button"
        aria-label="Increase quantity"
      >
        +
      </span>

    `;

  });

}


/* =========================================
   ADD / QUANTITY BUTTONS
   ========================================= */

function setupAddToCartButtons() {

  const buttons =
    document.querySelectorAll(".add-btn");


  buttons.forEach(button => {

    button.addEventListener("click", event => {

      const productId =
        Number(button.dataset.productId);


      const product =
        products.find(
          item => item.id === productId
        );


      if (!product) {
        return;
      }


      /* ===============================
         PLUS
         =============================== */

      const plus =
        event.target.closest(
          '[data-action="plus"]'
        );


      if (plus) {

        addToCart(product);

        refreshProductButton(productId);

        return;
      }


      /* ===============================
         MINUS
         =============================== */

      const minus =
        event.target.closest(
          '[data-action="minus"]'
        );


      if (minus) {

        changeCartQuantity(productId, -1);

        refreshProductButton(productId);

        return;
      }


      /* ===============================
         ADD
         =============================== */

      addToCart(product);

      refreshProductButton(productId);

    });

  });

}


/* =========================================
   SYNC PRODUCTS WITH CART
   ========================================= */

function syncProductButtons() {

  const buttons =
    document.querySelectorAll(".add-btn");


  buttons.forEach(button => {

    const productId =
      Number(button.dataset.productId);


    if (productId) {

      refreshProductButton(productId);

    }

  });

}


/* =========================================
   START PRODUCTS
   ========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    displayFeaturedProducts();

    updateCartCount();

  }
);
