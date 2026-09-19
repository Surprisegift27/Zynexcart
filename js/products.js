/* =========================================
   ZYNEXCART — PRODUCTS
   Professional Product + Quantity Controls
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

  const quantity = getProductQuantity(product.id);

  /* PRODUCT NOT IN CART */

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


  /* PRODUCT ALREADY IN CART */

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

  setupProductControls();
}


/* =========================================
   REFRESH PRODUCT BUTTON
   ========================================= */

function refreshProductButton(productId) {

  const controls =
    document.querySelectorAll(
      `.add-btn[data-product-id="${productId}"]`
    );

  controls.forEach(control => {

    const product =
      products.find(
        item => item.id === Number(productId)
      );

    if (!product) {
      return;
    }

    const quantity =
      getProductQuantity(productId);


    /* CART EMPTY */

    if (quantity <= 0) {

      const addButton =
        document.createElement("button");

      addButton.type = "button";
      addButton.className = "add-btn";
      addButton.dataset.productId = productId;
      addButton.textContent = "ADD";

      control.replaceWith(addButton);

      setupSingleProductControl(addButton);

      return;
    }


    /* CART HAS PRODUCT */

    const quantityControl =
      document.createElement("div");

    quantityControl.className =
      "add-btn added";

    quantityControl.dataset.productId =
      productId;

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

    control.replaceWith(quantityControl);

    setupSingleProductControl(quantityControl);

  });
}


/* =========================================
   SETUP SINGLE PRODUCT CONTROL
   ========================================= */

function setupSingleProductControl(control) {

  if (!control) {
    return;
  }


  /* =======================================
     ADD BUTTON
     ======================================= */

  if (
    control.tagName === "BUTTON" &&
    !control.classList.contains("added")
  ) {

    control.addEventListener("click", () => {

      const productId =
        Number(control.dataset.productId);

      const product =
        products.find(
          item => item.id === productId
        );

      if (!product) {
        return;
      }

      addToCart(product);

      updateCartCount();

      refreshProductButton(productId);

    });

    return;
  }


  /* =======================================
     QUANTITY CONTROL
     ======================================= */

  control.addEventListener("click", event => {

    const actionButton =
      event.target.closest(
        "button[data-action]"
      );


    /*
      IMPORTANT:
      Only actual − or + buttons work.
      Clicking the number or empty area does nothing.
    */

    if (!actionButton) {
      return;
    }


    const productId =
      Number(control.dataset.productId);

    const product =
      products.find(
        item => item.id === productId
      );

    if (!product) {
      return;
    }


    const action =
      actionButton.dataset.action;


    /* =====================================
       PLUS
       ===================================== */

    if (action === "plus") {

      addToCart(product);

      updateCartCount();

      refreshProductButton(productId);

      return;
    }


    /* =====================================
       MINUS
       ===================================== */

    if (action === "minus") {

      changeCartQuantity(
        productId,
        -1
      );

      updateCartCount();

      refreshProductButton(productId);

      return;
    }

  });
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

  controls.forEach(control => {

    const productId =
      Number(control.dataset.productId);

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
