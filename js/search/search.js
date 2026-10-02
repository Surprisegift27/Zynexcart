/* =========================================
   ZYNEXCART — PROFESSIONAL LIVE SEARCH
   Product + Category Search
========================================= */

(function () {
  "use strict";

  let searchInitialized = false;
  let suggestionBox = null;

  const MAX_PRODUCTS = 6;
  const MAX_CATEGORIES = 3;


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
        "ZynexCart: Unable to access products.js data.",
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

    if (
      Array.isArray(window.ZynexCartCategories)
    ) {
      return window.ZynexCartCategories;
    }

    return [];

  }


  /* =========================================
     NORMALIZE TEXT
  ========================================= */

  function normalize(value) {

    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");

  }


  /* =========================================
     FORMAT CATEGORY
  ========================================= */

  function formatCategory(category) {

    return String(category || "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, letter =>
        letter.toUpperCase()
      );

  }


  /* =========================================
     PRODUCT SEARCH TEXT
  ========================================= */

  function getProductSearchText(product) {

    return [
      product.name,
      product.category,
      product.categoryId,
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

    const searchQuery =
      normalize(query);

    if (!searchQuery || !product) {
      return 0;
    }

    const name =
      normalize(product.name);

    const category =
      normalize(product.category);

    const categoryId =
      normalize(product.categoryId);

    const unit =
      normalize(product.unit);

    const searchText =
      getProductSearchText(product);

    let score = 0;


    /* Exact product name */

    if (name === searchQuery) {
      score += 1000;
    }


    /* Product name starts with query */

    if (name.startsWith(searchQuery)) {
      score += 500;
    }


    /* Product name contains query */

    if (name.includes(searchQuery)) {
      score += 300;
    }


    /* Individual product words */

    const nameWords =
      name.split(" ");

    nameWords.forEach(word => {

      if (word === searchQuery) {
        score += 400;
      }

      else if (
        word.startsWith(searchQuery)
      ) {
        score += 250;
      }

      else if (
        word.includes(searchQuery)
      ) {
        score += 150;
      }

    });


    /* Existing category */

    if (category === searchQuery) {
      score += 200;
    }

    if (
      category.startsWith(searchQuery)
    ) {
      score += 120;
    }

    if (
      category.includes(searchQuery)
    ) {
      score += 80;
    }


    /* Category ID */

    if (
      categoryId === searchQuery
    ) {
      score += 180;
    }

    if (
      categoryId.startsWith(searchQuery)
    ) {
      score += 100;
    }

    if (
      categoryId.includes(searchQuery)
    ) {
      score += 70;
    }


    /* Unit */

    if (unit === searchQuery) {
      score += 40;
    }

    if (unit.includes(searchQuery)) {
      score += 20;
    }


    /* General fallback */

    if (
      searchText.includes(searchQuery)
    ) {
      score += 10;
    }

    return score;

  }


  /* =========================================
     SEARCH PRODUCTS
  ========================================= */

  function searchProducts(query) {

    const searchQuery =
      normalize(query);

    if (!searchQuery) {
      return [];
    }

    return getProducts()

      .map(product => ({
        product,
        score:
          scoreProduct(
            product,
            searchQuery
          )
      }))

      .filter(result =>
        result.score > 0
      )

      .sort((a, b) => {

        if (
          b.score !== a.score
        ) {
          return b.score - a.score;
        }

        return String(
          a.product.name || ""
        ).localeCompare(
          String(
            b.product.name || ""
          )
        );

      })

      .map(result =>
        result.product
      );

  }


  /* =========================================
     SCORE CATEGORY
  ========================================= */

  function scoreCategory(
    category,
    query
  ) {

    const searchQuery =
      normalize(query);

    if (
      !searchQuery ||
      !category
    ) {
      return 0;
    }

    const name =
      normalize(category.name);

    const id =
      normalize(category.id);

    const description =
      normalize(category.description);

    let score = 0;


    /* Exact category */

    if (name === searchQuery) {
      score += 1000;
    }


    /* Starts with */

    if (
      name.startsWith(searchQuery)
    ) {
      score += 500;
    }


    /* Contains */

    if (
      name.includes(searchQuery)
    ) {
      score += 300;
    }


    /* Individual words */

    name.split(" ")
      .forEach(word => {

        if (
          word === searchQuery
        ) {
          score += 400;
        }

        else if (
          word.startsWith(searchQuery)
        ) {
          score += 250;
        }

        else if (
          word.includes(searchQuery)
        ) {
          score += 150;
        }

      });


    /* Category ID */

    if (
      id === searchQuery
    ) {
      score += 200;
    }

    if (
      id.includes(searchQuery)
    ) {
      score += 100;
    }


    /* Description */

    if (
      description.includes(searchQuery)
    ) {
      score += 50;
    }

    return score;

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

      .map(category => ({
        category,
        score:
          scoreCategory(
            category,
            searchQuery
          )
      }))

      .filter(result =>
        result.score > 0
      )

      .sort((a, b) =>
        b.score - a.score
      )

      .map(result =>
        result.category
      );

  }


  /* =========================================
     CREATE SUGGESTION BOX
  ========================================= */

  function createSuggestionBox(
    searchForm
  ) {

    if (suggestionBox) {
      return suggestionBox;
    }

    suggestionBox =
      document.createElement("div");

    suggestionBox.className =
      "search-suggestions";

    suggestionBox.id =
      "searchSuggestions";

    suggestionBox.setAttribute(
      "role",
      "listbox"
    );

    suggestionBox.hidden = true;

    searchForm.appendChild(
      suggestionBox
    );

    return suggestionBox;

  }


  /* =========================================
     CREATE PRODUCT SUGGESTION
  ========================================= */

  function createProductSuggestion(
    product
  ) {

    const image =
      product.image || "";

    const name =
      product.name || "Product";

    const category =
      formatCategory(
        product.category
      );

    const unit =
      product.unit || "";


    return `
      <a
        href="product.html?id=${encodeURIComponent(product.id)}"
        class="search-suggestion"
        role="option"
        data-product-id="${product.id}"
      >

        <span class="search-suggestion-image">

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
                <span
                  class="search-suggestion-image-placeholder"
                  aria-hidden="true"
                >
                  🛒
                </span>
              `
          }

        </span>


        <span class="search-suggestion-content">

          <strong class="search-suggestion-name">
            ${name}
          </strong>

          <span class="search-suggestion-meta">

            ${category}

            ${
              unit
                ? `
                  <span
                    aria-hidden="true"
                  >
                    •
                  </span>
                  ${unit}
                `
                : ""
            }

          </span>

        </span>


        <span
          class="search-suggestion-arrow"
          aria-hidden="true"
        >
          →
        </span>

      </a>
    `;

  }


  /* =========================================
     CREATE CATEGORY SUGGESTION
  ========================================= */

  function createCategorySuggestion(
    category
  ) {

    const image =
      category.image || "";

    const name =
      category.name || "Category";

    const description =
      category.description || "";


    return `
      <a
        href="products.html?category=${encodeURIComponent(category.id)}"
        class="search-suggestion search-category-suggestion"
        role="option"
        data-category-id="${category.id}"
      >

        <span class="search-suggestion-image">

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
                <span
                  class="search-suggestion-image-placeholder"
                  aria-hidden="true"
                >
                  🛍️
                </span>
              `
          }

        </span>


        <span class="search-suggestion-content">

          <strong class="search-suggestion-name">
            ${name}
          </strong>

          <span class="search-suggestion-meta">
            ${description}
          </span>

        </span>


        <span
          class="search-suggestion-arrow"
          aria-hidden="true"
        >
          →
        </span>

      </a>
    `;

  }


  /* =========================================
     SHOW SUGGESTIONS
  ========================================= */

  function showSuggestions(query) {

    if (!suggestionBox) {
      return;
    }

    const searchQuery =
      normalize(query);

    if (!searchQuery) {
      hideSuggestions();
      return;
    }


    const productsFound =
      searchProducts(
        searchQuery
      );


    const categoriesFound =
      searchCategories(
        searchQuery
      );


    /* =====================================
       NO RESULTS
    ===================================== */

    if (
      productsFound.length === 0 &&
      categoriesFound.length === 0
    ) {

      suggestionBox.innerHTML = `

        <div
          class="search-no-results"
          role="status"
        >

          <div
            class="search-no-results-icon"
            aria-hidden="true"
          >
            🔍
          </div>


          <div class="search-no-results-content">

            <strong>
              No products found
            </strong>

            <small>
              Try another product or category
            </small>

          </div>

        </div>

      `;

      suggestionBox.hidden = false;

      return;
    }


    /* =====================================
       BUILD RESULTS
    ===================================== */

    let html = "";


    /* -------------------------------------
       CATEGORY RESULTS
    ------------------------------------- */

    if (
      categoriesFound.length > 0
    ) {

      html += `

        <div
          class="search-suggestions-header"
        >
          <span>Categories</span>
        </div>

      `;

      html +=
        categoriesFound
          .slice(
            0,
            MAX_CATEGORIES
          )
          .map(
            createCategorySuggestion
          )
          .join("");

    }


    /* -------------------------------------
       PRODUCT RESULTS
    ------------------------------------- */

    if (
      productsFound.length > 0
    ) {

      html += `

        <div
          class="search-suggestions-header"
        >
          <span>Products</span>
        </div>

      `;

      html +=
        productsFound
          .slice(
            0,
            MAX_PRODUCTS
          )
          .map(
            createProductSuggestion
          )
          .join("");


      /* View all */

      if (
        productsFound.length >
        MAX_PRODUCTS
      ) {

        html += `

          <button
            type="button"
            class="search-view-all"
            data-search-query="${encodeURIComponent(
              searchQuery
            )}"
          >

            <span>
              View all results
            </span>

            <span
              aria-hidden="true"
            >
              →
            </span>

          </button>

        `;

      }

    }


    suggestionBox.innerHTML =
      html;

    suggestionBox.hidden = false;

  }


  /* =========================================
     HIDE SUGGESTIONS
  ========================================= */

  function hideSuggestions() {

    if (!suggestionBox) {
      return;
    }

    suggestionBox.hidden = true;

  }


  /* =========================================
     PERFORM SEARCH
  ========================================= */

  function performSearch(
    searchInput
  ) {

    const searchTerm =
      searchInput.value.trim();

    if (!searchTerm) {

      searchInput.focus();

      hideSuggestions();

      return;
    }

    window.location.href =
      `products.html?search=${encodeURIComponent(
        searchTerm
      )}`;

  }


  /* =========================================
     SETUP SEARCH
  ========================================= */

  function setupSearch() {

    if (searchInitialized) {
      return;
    }

    const searchForm =
      document.getElementById(
        "searchForm"
      );

    const searchInput =
      document.getElementById(
        "searchInput"
      );

    if (
      !searchForm ||
      !searchInput
    ) {
      return;
    }

    searchInitialized = true;


    /* Create dropdown */

    createSuggestionBox(
      searchForm
    );


    /* =====================================
       LIVE SEARCH
    ===================================== */

    searchInput.addEventListener(
      "input",
      function () {

        showSuggestions(
          searchInput.value
        );

      }
    );


    /* =====================================
       FOCUS
    ===================================== */

    searchInput.addEventListener(
      "focus",
      function () {

        const value =
          searchInput.value.trim();

        if (value) {
          showSuggestions(value);
        }

      }
    );


    /* =====================================
       FORM SUBMIT
    ===================================== */

    searchForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        performSearch(
          searchInput
        );

      }
    );


    /* =====================================
       SUGGESTION CLICK
    ===================================== */

    suggestionBox.addEventListener(
      "click",
      function (event) {

        const viewAllButton =
          event.target.closest(
            ".search-view-all"
          );


        if (viewAllButton) {

          event.preventDefault();

          const query =
            decodeURIComponent(
              viewAllButton.dataset
                .searchQuery || ""
            );

          if (query) {

            window.location.href =
              `products.html?search=${encodeURIComponent(
                query
              )}`;

          }

          return;
        }


        const suggestion =
          event.target.closest(
            ".search-suggestion"
          );

        if (suggestion) {
          hideSuggestions();
        }

      }
    );


    /* =====================================
       OUTSIDE CLICK
    ===================================== */

    document.addEventListener(
      "click",
      function (event) {

        if (
          !searchForm.contains(
            event.target
          )
        ) {

          hideSuggestions();

        }

      }
    );


    /* =====================================
       ESCAPE
    ===================================== */

    searchInput.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape"
        ) {

          hideSuggestions();

          searchInput.blur();

        }

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

    hideSuggestions,

    getProducts,

    getCategories

  };

})();
