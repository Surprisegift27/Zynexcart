/* =========================================
   ZYNEXCART — PRODUCTS
   Professional Product + Quantity Controls
========================================= */


/* =========================================
   PRODUCT DATA
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
    .replace(/-/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}


/* =========================================
   GET PRODUCT
========================================= */

function getProductById(productId) {
  return products.find(
    product => Number(product.id) === Number(productId)
  );
}


/* =========================================
   GET PRODUCT QUANTITY
========================================= */

function getProductQuantity(productId) {

  if (typeof getCart !== "function") {
    return 0;
  }

  const cart = getCart();

  if (!Array.isArray(cart)) {
    return 0;
  }

  const item = cart.find(
    item => Number(item.id) === Number(productId)
  );

  return item
    ? Number(item.quantity || 0)
    : 0;
}


/* =========================================
   CREATE PRODUCT BUTTON
========================================= */

function createProductButton(product) {

  const quantity =
    getProductQuantity(product.id);


  /* -----------------------------------------
     ADD STATE
  ----------------------------------------- */

  if (quantity <= 0) {

    return `
      <button
        type="button"
        class="add-btn"
        data-product-id="${product.id}"
      >
        ADD
      </button>
    `;

  }


  /* -----------------------------------------
     QUANTITY STATE
  ----------------------------------------- */

  return `
    <div
      class="add-btn added"
      data-product-id="${product.id}"
    >

      <button
        type="button"
        class="qty-minus"
        data-action="minus"
        aria-label="Decrease ${product.name} quantity"
      >
        −
      </button>

      <span
        class="qty-number"
        aria-live="polite"
      >
        ${quantity}
      </span>

      <button
        type="button"
        class="qty-plus"
        data-action="plus"
        aria-label="Increase ${product.name} quantity"
      >
        +
      </button>

    </div>
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
        aria-label="View ${product.name}"
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

  container.innerHTML = products
    .slice(0, 8)
    .map(createProductCard)
    .join("");

  setupProductControls();
}


/* =========================================
   CREATE QUANTITY CONTROL
========================================= */

function createQuantityControl(product, quantity) {

  const quantityControl =
    document.createElement("div");

  quantityControl.className =
    "add-btn added";

  quantityControl.dataset.productId =
    product.id;

  quantityControl.innerHTML = `

    <button
      type="button"
      class="qty-minus"
      data-action="minus"
      aria-label="Decrease ${product.name} quantity"
    >
      −
    </button>

    <span
      class="qty-number"
      aria-live="polite"
    >
      ${quantity}
    </span>

    <button
      type="button"
      class="qty-plus"
      data-action="plus"
      aria-label="Increase ${product.name} quantity"
    >
      +
    </button>

  `;

  return quantityControl;
}


/* =========================================
   REFRESH PRODUCT BUTTON
========================================= */

function refreshProductButton(productId) {

  const product =
    getProductById(productId);

  if (!product) {
    return;
  }

  const quantity =
    getProductQuantity(productId);

  const controls =
    document.querySelectorAll(
      `.add-btn[data-product-id="${productId}"]`
    );


  controls.forEach(control => {


    /* -------------------------------------
       CART EMPTY → ADD BUTTON
    ------------------------------------- */

    if (quantity <= 0) {

      if (
        control.tagName === "BUTTON" &&
        !control.classList.contains("added")
      ) {
        return;
      }

      const addButton =
        document.createElement("button");

      addButton.type = "button";

      addButton.className = "add-btn";

      addButton.dataset.productId =
        productId;

      addButton.textContent = "ADD";

      control.replaceWith(addButton);

      setupSingleProductControl(addButton);

      return;
    }


    /* -------------------------------------
       ALREADY QUANTITY CONTROL
    ------------------------------------- */

    if (
      control.classList.contains("added")
    ) {

      const number =
        control.querySelector(".qty-number");

      if (number) {
        number.textContent = quantity;
      }

      return;
    }


    /* -------------------------------------
       ADD → QUANTITY CONTROL
    ------------------------------------- */

    const quantityControl =
      createQuantityControl(
        product,
        quantity
      );

    control.replaceWith(
      quantityControl
    );

    setupSingleProductControl(
      quantityControl
    );

  });
}


/* =========================================
   SETUP SINGLE PRODUCT CONTROL
========================================= */

function setupSingleProductControl(control) {

  if (
    !control ||
    control.dataset.bound === "true"
  ) {
    return;
  }

  control.dataset.bound = "true";


  /* =======================================
     ADD BUTTON
  ======================================= */

  if (
    control.tagName === "BUTTON" &&
    !control.classList.contains("added")
  ) {

    control.addEventListener(
      "click",
      () => {

        const productId =
          Number(control.dataset.productId);

        const product =
          getProductById(productId);

        if (!product) {
          return;
        }

        addToCart(product);

        refreshProductButton(productId);

        updateCartCount();

      }
    );

    return;
  }


  /* =======================================
     QUANTITY CONTROL
  ======================================= */

  if (
    !control.classList.contains("added")
  ) {
    return;
  }


  control.addEventListener(
    "click",
    event => {

      const actionButton =
        event.target.closest(
          "button.qty-minus, button.qty-plus"
        );

      if (!actionButton) {
        return;
      }

      if (!control.contains(actionButton)) {
        return;
      }


      const productId =
        Number(control.dataset.productId);

      const product =
        getProductById(productId);

      if (!product) {
        return;
      }


      /* =====================================
         PLUS
      ===================================== */

      if (
        actionButton.classList.contains(
          "qty-plus"
        )
      ) {

        addToCart(product);

        refreshProductButton(productId);

        updateCartCount();

        return;
      }


      /* =====================================
         MINUS
      ===================================== */

      if (
        actionButton.classList.contains(
          "qty-minus"
        )
      ) {

        changeCartQuantity(
          productId,
          -1
        );

        refreshProductButton(productId);

        updateCartCount();

      }

    }
  );
}


/* =========================================
   SETUP ALL PRODUCT CONTROLS
========================================= */

function setupProductControls() {

  const controls =
    document.querySelectorAll(
      ".add-btn[data-product-id]"
    );

  controls.forEach(control => {

    setupSingleProductControl(control);

  });
}


/* =========================================
   SYNC PRODUCT BUTTONS
========================================= */

function syncProductButtons() {

  const controls =
    document.querySelectorAll(
      ".add-btn[data-product-id]"
    );

  const productIds = new Set();

  controls.forEach(control => {

    const productId =
      Number(control.dataset.productId);

    if (productId) {
      productIds.add(productId);
    }

  });


  productIds.forEach(productId => {

    refreshProductButton(productId);

  });
}


/* =========================================
   CART UPDATE LISTENER
========================================= */

/*
   IMPORTANT:

   Cart page par jab:

   +  → quantity increase
   −  → quantity decrease
   Remove → product remove

   hota hai, app.js se:

   zynexcart:cartUpdated

   event dispatch hona chahiye.

   Ye listener us event ko receive karke
   product page ko immediately sync karta hai.

   Refresh ki zarurat nahi hogi.
*/

document.addEventListener(
  "zynexcart:cartUpdated",
  () => {

    syncProductButtons();

    updateCartCount();

  }
);


/* =========================================
   START PRODUCTS
========================================= */

function initProducts() {

  displayFeaturedProducts();

  updateCartCount();

}


/* =========================================
   SUPPORT BOTH:
   1. NORMAL PAGE LOADING
   2. DYNAMICALLY LOADED COMPONENTS
========================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initProducts
  );

} else {

  initProducts();

}
