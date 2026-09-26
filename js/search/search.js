// ZYNEXCART — PROFESSIONAL SEARCH
(function () {
  "use strict";

  let searchInitialized = false;
  let suggestionBox = null;
  let retryTimer = null;

  const MAX_SUGGESTIONS = 6;

  /* =====================================================
     GET PRODUCTS
  ===================================================== */

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

    if (Array.isArray(window.products)) {
      return window.products;
    }

    return [];
  }


  /* =====================================================
     NORMALIZE SEARCH TEXT
  ===================================================== */

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }


  /* =====================================================
     FORMAT CATEGORY
  ===================================================== */

  function formatCategory(category) {
    return String(category || "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }


  /* =====================================================
     PRODUCT KEYWORDS
  ===================================================== */

  function getProductKeywords(product) {
    const keywordMap = {
      1: [
        "milk",
        "fresh milk",
        "dairy",
        "dairy products",
        "milk products",
        "1 litre",
        "1 liter",
        "1 l"
      ],

      2: [
        "bread",
        "brown bread",
        "bakery",
        "bakery products",
        "baked"
      ],

      3: [
        "chips",
        "potato chips",
        "potato",
        "snacks",
        "snack",
        "namkeen"
      ],

      4: [
        "soap",
        "bath soap",
        "personal care",
        "body soap"
      ],

      5: [
        "shampoo",
        "hair care",
        "personal care",
        "hair"
      ],

      6: [
        "juice",
        "orange juice",
        "orange",
        "drink",
        "drinks",
        "beverage",
        "beverages"
      ],

      7: [
        "face wash",
        "facewash",
        "skincare",
        "skin care",
        "beauty"
      ],

      8: [
        "dishwash",
        "dish wash",
        "dishwashing",
        "cleaning",
        "household",
        "cleaning essentials"
      ]
    };

    return keywordMap[product.id] || [];
  }


  /* =====================================================
     SCORE PRODUCT
  ===================================================== */

  function scoreProduct(product, query) {
    const searchQuery = normalize(query);

    if (!searchQuery || !product) {
      return 0;
    }

    const name = normalize(product.name);
    const category = normalize(product.category);
    const unit = normalize(product.unit);

    const keywords = getProductKeywords(product)
      .map(normalize)
      .filter(Boolean);

    let score = 0;


    /* ---------- EXACT PRODUCT NAME ---------- */

    if (name === searchQuery) {
      score += 1000;
    }


    /* ---------- PRODUCT NAME STARTS WITH QUERY ---------- */

    if (name.startsWith(searchQuery)) {
      score += 500;
    }


    /* ---------- PRODUCT NAME CONTAINS QUERY ---------- */

    if (name.includes(searchQuery)) {
      score += 300;
    }


    /* ---------- CATEGORY ---------- */

    if (category === searchQuery) {
      score += 200;
    }

    if (category.includes(searchQuery)) {
      score += 120;
    }


    /* ---------- UNIT ---------- */

    if (unit === searchQuery) {
      score += 80;
    }

    if (unit.includes(searchQuery)) {
      score += 40;
    }


    /* ---------- KEYWORDS ---------- */

    keywords.forEach(keyword => {
      if (keyword === searchQuery) {
        score += 180;
      } else if (keyword.startsWith(searchQuery)) {
        score += 100;
      } else if (keyword.includes(searchQuery)) {
        score += 70;
      }
    });


    return score;
  }


  /* =====================================================
     SEARCH PRODUCTS
  ===================================================== */

  function searchProducts(query) {
    const searchQuery = normalize(query);

    if (!searchQuery) {
      return [];
    }

    const productList = getProducts();

    if (!productList.length) {
      return [];
    }

    return productList
      .map(product => ({
        product,
        score: scoreProduct(
          product,
          searchQuery
        )
      }))
      .filter(result => result.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
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
      .map(result => result.product);
  }


  /* =====================================================
     CREATE / GET SUGGESTION BOX
  ===================================================== */

  function createSuggestionBox(searchForm) {
    if (!searchForm) {
      return null;
    }

    const existing =
      searchForm.querySelector(
        "#searchSuggestions"
      );

    if (existing) {
      suggestionBox = existing;
      return existing;
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

    suggestionBox.setAttribute(
      "aria-label",
      "Search suggestions"
    );

    suggestionBox.hidden = true;

    searchForm.appendChild(
      suggestionBox
    );

    return suggestionBox;
  }


  /* =====================================================
     CREATE PRODUCT SUGGESTION
  ===================================================== */

  function createSuggestion(product) {
    const productId =
      encodeURIComponent(
        product.id
      );

    const productName =
      String(
        product.name || ""
      );

    const productCategory =
      formatCategory(
        product.category
      );

    const productUnit =
      String(
        product.unit || ""
      );

    const productImage =
      String(
        product.image || ""
      );

    return `
      <a
        href="product.html?id=${productId}"
        class="search-suggestion"
        role="option"
        aria-label="View ${productName}"
        data-product-id="${product.id}"
      >

        <span class="search-suggestion-image">
          <img
            src="${productImage}"
            alt=""
            loading="lazy"
            onerror="this.style.display='none'"
          >
        </span>

        <span class="search-suggestion-content">

          <strong class="search-suggestion-name">
            ${productName}
          </strong>

          <span class="search-suggestion-meta">
            ${productCategory}
            <span aria-hidden="true">•</span>
            ${productUnit}
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


  /* =====================================================
     NO RESULTS UI
  ===================================================== */

  function createNoResults() {
    return `
      <div
        class="search-no-results"
        role="status"
        aria-live="polite"
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
  }


  /* =====================================================
     SHOW PRODUCT SUGGESTIONS
  ===================================================== */

  function showSuggestions(query) {
    if (!suggestionBox) {
      return;
    }

    const searchQuery =
      normalize(query);

    /*
     * EMPTY SEARCH
     */
    if (!searchQuery) {
      hideSuggestions();
      return;
    }

    const results =
      searchProducts(
        searchQuery
      );


    /* =================================================
       PRODUCTS FOUND
    ================================================= */

    if (results.length > 0) {

      const visibleResults =
        results.slice(
          0,
          MAX_SUGGESTIONS
        );

      suggestionBox.innerHTML = `
        <div class="search-suggestions-header">
          <span>Products</span>
        </div>

        ${visibleResults
          .map(createSuggestion)
          .join("")}

        ${
          results.length > MAX_SUGGESTIONS
            ? `
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

                <span aria-hidden="true">
                  →
                </span>
              </button>
            `
            : ""
        }
      `;

      suggestionBox.hidden = false;

      return;
    }


    /* =================================================
       NO PRODUCTS FOUND
    ================================================= */

    suggestionBox.innerHTML =
      createNoResults();

    suggestionBox.hidden = false;
  }


  /* =====================================================
     HIDE SUGGESTIONS
  ===================================================== */

  function hideSuggestions() {
    if (!suggestionBox) {
      return;
    }

    suggestionBox.hidden = true;
  }


  /* =====================================================
     PERFORM FULL SEARCH
  ===================================================== */

  function performSearch(searchInput) {
    if (!searchInput) {
      return;
    }

    const searchTerm =
      searchInput.value.trim();

    if (!searchTerm) {
      searchInput.focus();
      hideSuggestions();
      return;
    }

    hideSuggestions();

    window.location.href =
      `products.html?search=${encodeURIComponent(
        searchTerm
      )}`;
  }


  /* =====================================================
     CLEAR SEARCH
  ===================================================== */

  function clearSearch(searchInput) {
    if (!searchInput) {
      return;
    }

    searchInput.value = "";

    hideSuggestions();

    searchInput.focus();

    searchInput.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );
  }


  /* =====================================================
     BIND SEARCH
  ===================================================== */

  function bindSearch(
    searchForm,
    searchInput
  ) {
    if (
      !searchForm ||
      !searchInput
    ) {
      return false;
    }


    /* ---------- PREVENT DUPLICATE BINDING ---------- */

    if (
      searchForm.dataset.searchBound ===
      "true"
    ) {
      createSuggestionBox(
        searchForm
      );

      return true;
    }

    searchForm.dataset.searchBound =
      "true";


    /* ---------- CREATE DROPDOWN ---------- */

    createSuggestionBox(
      searchForm
    );


    if (!suggestionBox) {
      return false;
    }


    /* =================================================
       INPUT
    ================================================= */

    searchInput.addEventListener(
      "input",
      function () {
        showSuggestions(
          searchInput.value
        );
      }
    );


    /* =================================================
       FOCUS
    ================================================= */

    searchInput.addEventListener(
      "focus",
      function () {

        const value =
          searchInput.value.trim();

        if (value) {
          showSuggestions(
            value
          );
        }

      }
    );


    /* =================================================
       FORM SUBMIT
    ================================================= */

    searchForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        performSearch(
          searchInput
        );

      }
    );


    /* =================================================
       SEARCH BUTTON
    ================================================= */

    const searchButton =
      searchForm.querySelector(
        'button[type="submit"]'
      );

    if (searchButton) {

      searchButton.addEventListener(
        "click",
        function (event) {

          event.preventDefault();

          performSearch(
            searchInput
          );

        }
      );

    }


    /* =================================================
       SUGGESTION DROPDOWN CLICK
    ================================================= */

    suggestionBox.addEventListener(
      "click",
      function (event) {

        /* ---------- VIEW ALL ---------- */

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

            hideSuggestions();

            window.location.href =
              `products.html?search=${encodeURIComponent(
                query
              )}`;

          }

          return;
        }


        /* ---------- PRODUCT ---------- */

        const suggestion =
          event.target.closest(
            ".search-suggestion"
          );

        if (suggestion) {

          hideSuggestions();

          /*
           * Allow normal <a> navigation.
           * No preventDefault here.
           */

        }

      }
    );


    /* =================================================
       CLICK OUTSIDE
    ================================================= */

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


    /* =================================================
       ESCAPE
    ================================================= */

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


    /* =================================================
       CLEAR BUTTON SUPPORT
    ================================================= */

    searchInput.addEventListener(
      "search",
      function () {

        if (
          !searchInput.value.trim()
        ) {
          hideSuggestions();
        }

      }
    );


    return true;
  }


  /* =====================================================
     SETUP SEARCH
  ===================================================== */

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


    /*
     * Header can load dynamically.
     * Retry until search elements exist.
     */

    if (
      !searchForm ||
      !searchInput
    ) {

      if (!retryTimer) {

        retryTimer =
          setTimeout(
            function retrySearchSetup() {

              retryTimer = null;

              setupSearch();

            },
            100
          );

      }

      return;
    }


    const bound =
      bindSearch(
        searchForm,
        searchInput
      );

    if (bound) {
      searchInitialized = true;
    }

  }


  /* =====================================================
     INITIALIZE
  ===================================================== */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      setupSearch,
      {
        once: true
      }
    );

  } else {

    setupSearch();

  }


  /* =====================================================
     PUBLIC API
  ===================================================== */

  window.ZynexCartSearch = {
    setupSearch,
    searchProducts,
    hideSuggestions,
    showSuggestions,
    performSearch,
    clearSearch
  };

})();
