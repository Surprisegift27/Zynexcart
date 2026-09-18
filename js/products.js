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


        <button
          class="add-btn"
          type="button"
          data-product-id="${product.id}"
        >
          ADD
        </button>

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
   ADD TO CART BUTTONS
   ========================================= */

function setupAddToCartButtons() {

  const buttons =
    document.querySelectorAll(".add-btn");


  buttons.forEach(button => {

    button.addEventListener("click", () => {

      const productId =
        Number(button.dataset.productId);


      const product =
        products.find(item => item.id === productId);


      if (!product) {
        return;
      }


      addToCart(product);


      button.textContent = "ADDED ✓";


      setTimeout(() => {
        button.textContent = "ADD";
      }, 1000);

    });

  });

}


/* =========================================
   START PRODUCTS
   ========================================= */

document.addEventListener(
  "DOMContentLoaded",
  displayFeaturedProducts
);