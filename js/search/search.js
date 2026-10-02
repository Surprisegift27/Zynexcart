/* =========================================
   ZYNEXCART — PROFESSIONAL SEARCH SYSTEM
   Full-screen live search experience
========================================= */

(function () {
  "use strict";

  let searchInitialized = false;
  let searchScreen = null;
  let searchInput = null;
  let originalSearchInput = null;

  const SUGGESTION_LIMIT = 8;


  /* =========================================
     NORMALIZE
  ========================================= */

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ");
  }


  /* =========================================
     ESCAPE HTML
  ========================================= */

  function escapeHTML(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* =========================================
     GET PRODUCTS
  ========================================= */

  function getProducts() {
    try {
      if (
        typeof products !== "undefined" &&
        Array.isArray(products)
      ) {
        return products;
      }
    } catch (error) {
      console.error(
        "ZynexCart: Unable to access products.",
        error
      );
    }

    return Array.isArray(window.products)
      ? window.products
      : [];
  }


  /* =========================================
     GET CATEGORIES
  ========================================= */

  function getCategories() {
    return Array.isArray(
      window.ZynexCartCategories
    )
      ? window.ZynexCartCategories
      : [];
  }


  /* =========================================
     PRODUCT SEARCH TEXT
  ========================================= */

  function getProductSearchText(product) {
    if (!product) {
      return "";
    }

    return [
      product.name,
      product.category,
      product.categoryId,
      product.subcategory,
      product.subcategoryId,
      product.subCategory,
      product.subCategoryId,
      product.unit
    ]
      .map(normalize)
      .filter(Boolean)
      .join(" ");
  }


  /* =========================================
     SCORE PRODUCT
  ========================================= */

  function scoreProduct(product, query) {
    const searchQuery = normalize(query);

    if (!searchQuery || !product) {
      return 0;
    }

    const name =
      normalize(product.name);

    const category =
      normalize(product.category);

    const categoryId =
      normalize(product.categoryId);

    const subcategory =
      normalize(
        product.subcategory ||
        product.subcategoryId ||
        product.subCategory ||
        product.subCategoryId
      );

    const unit =
      normalize(product.unit);

    const searchText =
      getProductSearchText(product);

    let score = 0;


    if (name === searchQuery) {
      score += 3000;
    }

    if (name.startsWith(searchQuery)) {
      score += 1600;
    }

    if (name.includes(searchQuery)) {
      score += 1000;
    }


    name.split(" ").forEach(function (word) {
      if (word === searchQuery) {
        score += 900;
      } else if (
        word.startsWith(searchQuery)
      ) {
        score += 650;
      } else if (
        word.includes(searchQuery)
      ) {
        score += 400;
      }
    });


    if (category === searchQuery) {
      score += 850;
    }

    if (category.startsWith(searchQuery)) {
      score += 600;
    }

    if (category.includes(searchQuery)) {
      score += 450;
    }


    if (categoryId === searchQuery) {
      score += 750;
    }

    if (categoryId.includes(searchQuery)) {
      score += 350;
    }


    if (subcategory === searchQuery) {
      score += 950;
    }

    if (subcategory.startsWith(searchQuery)) {
      score += 700;
    }

    if (subcategory.includes(searchQuery)) {
      score += 500;
    }


    if (unit.includes(searchQuery)) {
      score += 100;
    }


    const queryWords =
      searchQuery.split(" ").filter(Boolean);

    if (queryWords.length > 1) {
      let matched = 0;

      queryWords.forEach(function (word) {
        if (
          name.includes(word) ||
          category.includes(word) ||
          categoryId.includes(word) ||
          subcategory.includes(word) ||
          unit.includes(word)
        ) {
          matched += 1;
        }
      });

      score += matched * 250;

      if (
        matched === queryWords.length
      ) {
        score += 800;
      }
    }


    if (
      searchText.includes(searchQuery)
    ) {
      score += 20;
    }

    return score;
  }


  /* =========================================
     SEARCH PRODUCTS
     ALL MATCHING PRODUCTS RETURNED
  ========================================= */

  function searchProducts(query) {
    const searchQuery =
      normalize(query);

    if (!searchQuery) {
      return [];
    }

    return getProducts()
      .map(function (product, index) {
        return {
          product: product,
          score: scoreProduct(
            product,
            searchQuery
          ),
          index: index
        };
      })

      .filter(function (item) {
        return item.score > 0;
      })

      .sort(function (a, b) {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return (
          String(a.product.name || "")
            .localeCompare(
              String(b.product.name || "")
            )
          || a.index - b.index
        );
      })

      .map(function (item) {
        return item.product;
      });
  }


  /* =========================================
     SEARCH CATEGORIES
  ========================================= */

  function searchCategories(query) {
    const searchQuery =
      normalize(query);

    if (!searchQuery) {
      return [];
    }

    return getCategories()
      .filter(function (category) {
        const name =
          normalize(category.name);

        const id =
          normalize(category.id);

        const description =
          normalize(category.description);

        return (
          name.includes(searchQuery) ||
          id.includes(searchQuery) ||
          description.includes(searchQuery)
        );
      });
  }


  /* =========================================
     CREATE SEARCH SCREEN
  ========================================= */

  function createSearchScreen() {
    if (searchScreen) {
      return searchScreen;
    }

    searchScreen =
      document.createElement("section");

    searchScreen.id =
      "zynexcartSearchScreen";

    searchScreen.className =
      "zynexcart-search-screen";

    searchScreen.hidden = true;

    searchScreen.innerHTML = `
      <div class="zynexcart-search-shell">

        <form
          class="zynexcart-search-bar"
          id="zynexcartLiveSearchForm"
          role="search"
        >

          <button
            type="button"
            class="zynexcart-search-back"
            id="zynexcartSearchBack"
            aria-label="Back"
          >
            ←
          </button>

          <input
            type="search"
            id="zynexcartLiveSearchInput"
            autocomplete="off"
            aria-label="Search products"
            placeholder="Search for products..."
          />

          <button
            type="button"
            class="zynexcart-search-clear"
            id="zynexcartSearchClear"
            aria-label="Clear search"
          >
            ×
          </button>

        </form>


        <div
          class="zynexcart-search-content"
          id="zynexcartSearchContent"
        >

          <div
            class="zynexcart-search-suggestions"
            id="zynexcartSearchSuggestions"
          ></div>


          <div
            class="zynexcart-search-results"
            id="zynexcartSearchResults"
          ></div>

        </div>

      </div>
    `;

    document.body.appendChild(
      searchScreen
    );

    return searchScreen;
  }


  /* =========================================
     CREATE SUGGESTION
  ========================================= */

  function createSuggestion(product) {
    const id =
      escapeHTML(product.id);

    const name =
      escapeHTML(
        product.name || "Product"
      );

    const image =
      escapeHTML(
        product.image || ""
      );

    return `
      <a
        href="product.html?id=${encodeURIComponent(
          product.id
        )}"
        class="zynexcart-search-suggestion"
        data-product-id="${id}"
      >

        <span
          class="zynexcart-search-suggestion-image"
        >

          ${
            image
              ? `
                <img
                  src="${image}"
                  alt="${name}"
                  loading="lazy"
                >
              `
              : `
                <span aria-hidden="true">
                  🛒
                </span>
              `
          }

        </span>

        <span
          class="zynexcart-search-suggestion-name"
        >
          ${name}
        </span>

      </a>
    `;
  }


  /* =========================================
     RENDER SEARCH
  ========================================= */

  function renderSearch(query) {
    if (!searchScreen) {
      return;
    }

    const suggestions =
      document.getElementById(
        "zynexcartSearchSuggestions"
      );

    const results =
      document.getElementById(
        "zynexcartSearchResults"
      );

    if (!suggestions || !results) {
      return;
    }

    const searchQuery =
      normalize(query);


    if (!searchQuery) {
      suggestions.innerHTML = "";
      results.innerHTML = "";
      return;
    }


    const matchingProducts =
      searchProducts(searchQuery);


    /* =====================================
       LIVE SUGGESTIONS
    ===================================== */

    const suggestionProducts =
      matchingProducts.slice(
        0,
        SUGGESTION_LIMIT
      );

    suggestions.innerHTML =
      suggestionProducts
        .map(createSuggestion)
        .join("");


    /* =====================================
       SEARCH RESULTS
    ===================================== */

    if (
      matchingProducts.length === 0
    ) {
      results.innerHTML = `
        <div class="zynexcart-search-no-results">
          <strong>
            No products found
          </strong>

          <span>
            Try another product or category.
          </span>
        </div>
      `;

      return;
    }


    let productCards = "";

    const productAPI =
      window.ZynexCartProducts;

    if (
      productAPI &&
      typeof productAPI.createProductCard ===
        "function"
    ) {
      productCards =
        matchingProducts
          .map(
            productAPI.createProductCard
          )
          .join("");
    }


    /*
     * If products.js has not finished exposing
     * createProductCard yet, do not create a
     * second product-card design.
     *
     * The search results will update again
     * when the user types.
     */

    if (!productCards) {
      results.innerHTML = `
        <div class="zynexcart-search-no-results">
          <strong>
            Loading products...
          </strong>
        </div>
      `;

      return;
    }


    results.innerHTML = `
      <h2 class="zynexcart-search-results-title">
        Showing results for "${escapeHTML(
          searchQuery
        )}"
      </h2>

      <div
        class="product-grid zynexcart-search-product-grid"
        id="zynexcartSearchProductGrid"
      >
        ${productCards}
      </div>
    `;
  }


  /* =========================================
     OPEN SEARCH SCREEN
  ========================================= */

  function openSearchScreen(value) {
    createSearchScreen();

    if (!searchScreen) {
      return;
    }

    searchScreen.hidden = false;

    document.body.classList.add(
      "zynexcart-search-open"
    );

    searchInput =
      document.getElementById(
        "zynexcartLiveSearchInput"
      );

    if (searchInput) {
      searchInput.value =
        value || "";

      window.setTimeout(
        function () {
          searchInput.focus();

          const length =
            searchInput.value.length;

          try {
            searchInput.setSelectionRange(
              length,
              length
            );
          } catch (error) {
            /* Ignore unsupported selection */
          }
        },
        0
      );
    }

    renderSearch(
      value || ""
    );
  }


  /* =========================================
     CLOSE SEARCH SCREEN
  ========================================= */

  function closeSearchScreen() {
    if (!searchScreen) {
      return;
    }

    searchScreen.hidden = true;

    document.body.classList.remove(
      "zynexcart-search-open"
    );

    if (originalSearchInput) {
      originalSearchInput.value =
        searchInput
          ? searchInput.value
          : originalSearchInput.value;

      originalSearchInput.blur();
    }
  }


  /* =========================================
     CLEAR SEARCH
  ========================================= */

  function clearSearch() {
    if (!searchInput) {
      return;
    }

    searchInput.value = "";

    if (originalSearchInput) {
      originalSearchInput.value = "";
    }

    renderSearch("");

    searchInput.focus();
  }


  /* =========================================
     PERFORM SEARCH
  ========================================= */

  function performSearch(value) {
    const query =
      normalize(value);

    if (!query) {
      return;
    }

    window.location.href =
      `products.html?search=${encodeURIComponent(
        query
      )}`;
  }


  /* =========================================
     SETUP SEARCH SCREEN EVENTS
  ========================================= */

  function setupSearchScreenEvents() {
    const form =
      document.getElementById(
        "zynexcartLiveSearchForm"
      );

    const backButton =
      document.getElementById(
        "zynexcartSearchBack"
      );

    const clearButton =
      document.getElementById(
        "zynexcartSearchClear"
      );

    if (!form || !searchInput) {
      return;
    }


    searchInput.addEventListener(
      "input",
      function () {
        const value =
          searchInput.value;

        if (originalSearchInput) {
          originalSearchInput.value =
            value;
        }

        renderSearch(value);
      }
    );


    searchInput.addEventListener(
      "keydown",
      function (event) {
        if (
          event.key === "Escape"
        ) {
          event.preventDefault();
          closeSearchScreen();
          return;
        }

        if (
          event.key === "Enter"
        ) {
          event.preventDefault();
          performSearch(
            searchInput.value
          );
        }
      }
    );


    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        performSearch(
          searchInput.value
        );
      }
    );


    backButton.addEventListener(
      "click",
      function () {
        closeSearchScreen();
      }
    );


    clearButton.addEventListener(
      "click",
      function () {
        clearSearch();
      }
    );


    const suggestions =
      document.getElementById(
        "zynexcartSearchSuggestions"
      );

    if (suggestions) {
      suggestions.addEventListener(
        "click",
        function () {
          window.setTimeout(
            function () {
              closeSearchScreen();
            },
            50
          );
        }
      );
    }
  }


  /* =========================================
     SETUP ORIGINAL HEADER SEARCH
  ========================================= */

  function setupSearch() {
    if (searchInitialized) {
      return;
    }

    const form =
      document.getElementById(
        "searchForm"
      );

    originalSearchInput =
      document.getElementById(
        "searchInput"
      );

    if (
      !form ||
      !originalSearchInput
    ) {
      return;
    }

    searchInitialized = true;


    createSearchScreen();

    searchInput =
      document.getElementById(
        "zynexcartLiveSearchInput"
      );

    setupSearchScreenEvents();


    /* -------------------------------------
       ORIGINAL SEARCH INPUT
    ------------------------------------- */

    originalSearchInput.addEventListener(
      "focus",
      function () {
        openSearchScreen(
          originalSearchInput.value
        );
      }
    );


    originalSearchInput.addEventListener(
      "input",
      function () {
        openSearchScreen(
          originalSearchInput.value
        );
      }
    );


    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        performSearch(
          originalSearchInput.value
        );
      }
    );
  }


  /* =========================================
     PUBLIC API
  ========================================= */

  window.ZynexCartSearch = {

    setupSearch,

    searchProducts,

    searchCategories,

    getProducts,

    getCategories,

    normalize,

    openSearchScreen,

    closeSearchScreen,

    clearSearch

  };


  /* =========================================
     AUTO INITIALIZATION
     Header is dynamically loaded.
  ========================================= */

  function initializeWhenReady() {
    if (
      document.getElementById("searchForm") &&
      document.getElementById("searchInput")
    ) {
      setupSearch();
      return true;
    }

    return false;
  }


  initializeWhenReady();


  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initializeWhenReady,
      {
        once: true
      }
    );
  }


  const observer =
    new MutationObserver(
      function () {
        if (
          initializeWhenReady()
        ) {
          observer.disconnect();
        }
      }
    );


  observer.observe(
    document.body,
    {
      childList: true,
      subtree: true
    }
  );

})();
