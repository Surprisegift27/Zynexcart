// ZYNEXCART — PROFESSIONAL SEARCH

(function () {
  "use strict";

  let searchInitialized = false;
  let suggestionBox = null;

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
     NORMALIZE
     ===================================================== */

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }


  /* =====================================================
     CATEGORY FORMAT
     ===================================================== */

  function formatCategory(category) {
    return String(category || "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }


  /* =====================================================
     SEARCH KEYWORDS
     ===================================================== */

  function getProductKeywords(product) {
    const keywordMap = {
      1: [
        "milk",
        "fresh milk",
        "dairy",
        "dairy products",
        "1 litre",
        "1 liter",
        "1 l"
      ],

      2: [
        "bread",
        "brown bread",
        "bakery",
        "bakery products"
      ],

      3: [
        "chips",
        "potato chips",
        "potato",
        "snacks",
        "namkeen"
      ],

      4: [
        "soap",
        "bath soap",
        "personal care"
      ],

      5: [
        "shampoo",
        "hair care",
        "personal care"
      ],

      6: [
        "juice",
        "orange juice",
        "orange",
        "drink",
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
        "cleaning",
        "household",
        "cleaning essentials"
      ]
    };

    return keywordMap[product.id] || [];
  }


  /* =====================================================
     PRODUCT SCORE
     ===================================================== */

  function scoreProduct(product, query) {
    const searchQuery = normalize(query);

    if (!searchQuery) {
      return 0;
    }

    const name = normalize(product.name);
    const category = normalize(product.category);
    const unit = normalize(product.unit);

    const keywords = getProductKeywords(product)
      .map(normalize)
      .filter(Boolean);

    let score = 0;

    if (name === searchQuery) {
      score += 100;
    }

    if (name.startsWith(searchQuery)) {
      score += 70;
    }

    if (name.includes(searchQuery)) {
      score += 50;
    }

    if (category === searchQuery) {
      score += 35;
    }

    if (category.includes(searchQuery)) {
      score += 25;
    }

    if (unit.includes(searchQuery)) {
      score += 10;
    }

    keywords.forEach(keyword => {
      if (keyword === searchQuery) {
        score += 30;
      } else if (keyword.includes(searchQuery)) {
        score += 15;
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

    return getProducts()
      .map(product => ({
        product,
        score: scoreProduct(product, searchQuery)
      }))
      .filter(result => result.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return String(a.product.name).localeCompare(
          String(b.product.name)
        );
      })
      .map(result => result.product);
  }


  /* =====================================================
     CREATE SUGGESTION BOX
     ===================================================== */

  function createSuggestionBox(searchForm) {
    if (!searchForm) {
      return null;
    }

    const existing =
      searchForm.querySelector("#searchSuggestions");

    if (existing) {
      suggestionBox = existing;
      return existing;
    }

    suggestionBox = document.createElement("div");

    suggestionBox.className = "search-suggestions";
    suggestionBox.id = "searchSuggestions";

    suggestionBox.setAttribute(
      "role",
      "listbox"
    );

    suggestionBox.hidden = true;

    searchForm.appendChild(suggestionBox);

    return suggestionBox;
  }


  /* =====================================================
     CREATE SUGGESTION
     ===================================================== */

  function createSuggestion(product) {
    return `
      <a
        href="product.html?id=${encodeURIComponent(product.id)}"
        class="search-suggestion"
        role="option"
        data-product-id="${product.id}"
      >

        <span class="search-suggestion-image">
          <img
            src="${product.image}"
            alt=""
            loading="lazy"
            onerror="this.style.display='none'"
          >
        </span>

        <span class="search-suggestion-content">

          <strong class="search-suggestion-name">
            ${product.name}
          </strong>

          <span class="search-suggestion-meta">
            ${formatCategory(product.category)}
            <span aria-hidden="true">•</span>
            ${product.unit}
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
     SHOW SUGGESTIONS
     ===================================================== */

  function showSuggestions(query) {
    if (!suggestionBox) {
      return;
    }

    const searchQuery = normalize(query);

    if (!searchQuery) {
      hideSuggestions();
      return;
    }

    const results = searchProducts(searchQuery);

    if (results.length > 0) {
      suggestionBox.innerHTML = `
        <div class="search-suggestions-header">
          <span>Products</span>
        </div>

        ${results
          .slice(0, MAX_SUGGESTIONS)
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
                <span>View all results</span>
                <span aria-hidden="true">→</span>
              </button>
            `
            : ""
        }
      `;

      suggestionBox.hidden = false;
      return;
    }

    suggestionBox.innerHTML = `
      <div class="search-no-results">

        <div class="search-no-results-icon">
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
     PERFORM SEARCH
     ===================================================== */

  function performSearch(searchInput) {
    if (!searchInput) {
      return;
    }

    const searchTerm =
      normalize(searchInput.value);

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
     BIND SEARCH
     ===================================================== */

  function bindSearch(searchForm, searchInput) {
    if (
      !searchForm ||
      !searchInput
    ) {
      return false;
    }

    if (
      searchForm.dataset.searchBound === "true"
    ) {
      return true;
    }

    searchForm.dataset.searchBound = "true";

    createSuggestionBox(searchForm);


    /* -----------------------------------------------------
       LIVE SEARCH
       ----------------------------------------------------- */

    searchInput.addEventListener(
      "input",
      function () {
        showSuggestions(
          searchInput.value
        );
      }
    );


    /* -----------------------------------------------------
       FOCUS
       ----------------------------------------------------- */

    searchInput.addEventListener(
      "focus",
      function () {
        if (
          searchInput.value.trim()
        ) {
          showSuggestions(
            searchInput.value
          );
        }
      }
    );


    /* -----------------------------------------------------
       FORM SUBMIT
       ----------------------------------------------------- */

    searchForm.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        performSearch(
          searchInput
        );
      }
    );


    /* -----------------------------------------------------
       SEARCH BUTTON
       ----------------------------------------------------- */

    const searchButton =
      searchForm.querySelector(
        'button[type="submit"]'
      );

    if (searchButton) {
      searchButton.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          event.stopPropagation();

          performSearch(
            searchInput
          );
        }
      );
    }


    /* -----------------------------------------------------
       SUGGESTION CLICK
       ----------------------------------------------------- */

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
              viewAllButton.dataset.searchQuery || ""
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


    /* -----------------------------------------------------
       OUTSIDE CLICK
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       ESCAPE
       ----------------------------------------------------- */

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

    if (
      !searchForm ||
      !searchInput
    ) {
      setTimeout(
        setupSearch,
        100
      );

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
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      setupSearch,
      { once: true }
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
    showSuggestions
  };

})();
