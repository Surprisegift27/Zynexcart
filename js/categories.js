/* =========================================
   ZYNEXCART — CATEGORY DATA & RENDERER
========================================= */

(function () {
  "use strict";

  const categories = [
    {
      id: "paan",
      name: "Paan Corner",
      image: "assets/categories/paan-corner.jpg",
      description: "Paan & mouth fresheners"
    },
    {
      id: "dairy-bread-eggs",
      name: "Dairy, Bread & Eggs",
      image: "assets/categories/dairy-bread-eggs.jpg",
      description: "Fresh everyday essentials"
    },
    {
      id: "fruits-vegetables",
      name: "Fruits & Vegetables",
      image: "assets/categories/fruits-vegetables.jpg",
      description: "Fresh & healthy choices"
    },
    {
      id: "cold-drinks-juices",
      name: "Cold Drinks & Juices",
      image: "assets/categories/cold-drinks-juices.jpg",
      description: "Refreshing drinks"
    },
    {
      id: "snacks-munchies",
      name: "Snacks & Munchies",
      image: "assets/categories/snacks-munchies.jpg",
      description: "Tasty favourites"
    },
    {
      id: "breakfast-instant-food",
      name: "Breakfast & Instant Food",
      image: "assets/categories/breakfast-instant-food.jpg",
      description: "Quick & easy meals"
    },
    {
      id: "sweet-tooth",
      name: "Sweet Tooth",
      image: "assets/categories/sweet-tooth.jpg",
      description: "Sweets & desserts"
    },
    {
      id: "bakery-biscuits",
      name: "Bakery & Biscuits",
      image: "assets/categories/bakery-biscuits.jpg",
      description: "Fresh bakery favourites"
    },
    {
      id: "tea-coffee-milk",
      name: "Tea, Coffee & Milk Drinks",
      image: "assets/categories/tea-coffee-milk-drinks.jpg",
      description: "Hot & refreshing drinks"
    },
    {
      id: "atta-rice-dal",
      name: "Atta, Rice & Dal",
      image: "assets/categories/atta-rice-dal.jpg",
      description: "Kitchen staples"
    },
    {
      id: "masala-oil",
      name: "Masala, Oil & More",
      image: "assets/categories/masala-oil-more.jpg",
      description: "Cooking essentials"
    },
    {
      id: "sauces-spreads",
      name: "Sauces & Spreads",
      image: "assets/categories/sauces-spreads.jpg",
      description: "Flavours for every meal"
    },
    {
      id: "chicken-meat-fish",
      name: "Chicken, Meat & Fish",
      image: "assets/categories/chicken-meat-fish.jpg",
      description: "Fresh non-veg essentials"
    },
    {
      id: "organic-healthy",
      name: "Organic & Healthy Living",
      image: "assets/categories/organic-healthy-living.jpg",
      description: "Healthy everyday choices"
    },
    {
      id: "baby-care",
      name: "Baby Care",
      image: "assets/categories/baby-care.jpg",
      description: "Care for little ones"
    },
    {
      id: "pharma-wellness",
      name: "Pharma & Wellness",
      image: "assets/categories/pharma-wellness.jpg",
      description: "Health & wellness essentials"
    },
    {
      id: "cleaning-essentials",
      name: "Cleaning Essentials",
      image: "assets/categories/cleaning-essentials.jpg",
      description: "Keep your home clean"
    },
    {
      id: "home-office",
      name: "Home & Office",
      image: "assets/categories/home-office.jpg",
      description: "Everyday home essentials"
    },
    {
      id: "personal-care",
      name: "Personal Care",
      image: "assets/categories/personal-care.jpg",
      description: "Daily care essentials"
    },
    {
      id: "pet-care",
      name: "Pet Care",
      image: "assets/categories/pet-care.jpg",
      description: "Essentials for your pets"
    },
    {
      id: "offers",
      name: "Offers & Deals",
      image: "assets/categories/offers-deals.jpg",
      description: "Save more on every order"
    }
  ];

  function renderCategories() {
    const grid = document.getElementById("categoriesGrid");

    if (!grid) {
      console.warn(
        "ZynexCart: categoriesGrid not found."
      );
      return;
    }

    grid.innerHTML = categories
      .map(function (category) {
        return `
          <a
            href="products.html?category=${encodeURIComponent(category.id)}"
            class="category-card"
            data-category="${category.id}"
          >
            <div class="category-image">
              <img
                src="${category.image}"
                alt="${category.name}"
                loading="lazy"
              >
            </div>

            <div class="category-content">
              <h3>${category.name}</h3>
              <p>${category.description}</p>
            </div>
          </a>
        `;
      })
      .join("");
  }

  window.ZynexCartCategories = categories;

  window.ZynexCartCategoryUI = {
    renderCategories
  };

})();
