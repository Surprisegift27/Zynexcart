// ZYNEXCART — PROFESSIONAL SEARCH

(function () {
  "use strict";

  let searchInitialized = false;
  let suggestionBox = null;

  const MAX_SUGGESTIONS = 6;

  /*
   * Get products safely.
   * products.js currently defines `products` as a global
   * lexical variable, not necessarily window.products.
   */
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

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }

  function formatCategory(category) {
    return String(category || "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }

  /*
   * Additional search terms for better
   * e-commerce style product discovery.
   */
  function getProductKeywords(product) {
    const keywordMap = {
      1: [
        "milk",
        "fresh milk",
        "dairy",
        "dairy products",
        "1 litre",
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

    /* Exact product name */
    if (name === searchQuery) {
      score += 100;
    }

    /* Product name starts with search */
    if (name.startsWith(searchQuery)) {
      score += 70;
    }

    /* Product name contains search */
    if (name.includes(searchQuery)) {
      score += 50;
    }

    /* Category match */
    if (category === searchQuery) {
      score += 35;
    }

    if (category.includes(searchQuery)) {
      score += 25;
    }

    /* Unit match */
    if (unit.includes(searchQuery)) {
      score += 10;
    }

    /* Keyword match */
    keywords.forEach(keyword => {
      if (keyword === searchQuery) {
        score += 30;
      } else if (keyword.includes(searchQuery)) {
        score += 15;
      }
    });

    return score;
  }

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

  /*
   * Create suggestion dropdown inside the search form.
   * This allows the dropdown to stay perfectly aligned
   * with the search box on desktop and mobile.
   */
  function createSuggestionBox(searchForm) {
    if (suggestionBox) {
      return suggestionBox;
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

    /*
     * PRODUCT FOUND
     */
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

    /*
     * NO PRODUCT FOUND
     */
    suggestionBox.innerHTML = `
      <div class="search-no-results">
        <div class="search-no-results-icon">
          🔍
        </div>

        <div class="search-no-results-content">
          <strong>No products found</strong>

          <small>
            Try another product or category
          </small>
        </div>
      </div>
    `;

    suggestionBox.hidden = false;
  }

  function hideSuggestions() {
    if (!suggestionBox) {
      return;
    }

    suggestionBox.hidden = true;
  }

  function performSearch(searchInput) {
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

  function setupSearch() {
    if (searchInitialized) {
      return;
    }

    const searchForm =
      document.getElementById("searchForm");

    const searchInput =
      document.getElementById("searchInput");

    if (!searchForm || !searchInput) {
      return;
    }

    searchInitialized = true;

    createSuggestionBox(searchForm);

    /*
     * LIVE SEARCH
     */
    searchInput.addEventListener(
      "input",
      function () {
        showSuggestions(
          searchInput.value
        );
      }
    );

    /*
     * SHOW AGAIN WHEN INPUT GETS FOCUS
     */
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

    /*
     * ENTER / SEARCH BUTTON
     */
    searchForm.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        performSearch(
          searchInput
        );
      }
    );

    /*
     * SUGGESTION / VIEW ALL CLICK
     */
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

    /*
     * CLICK OUTSIDE
     */
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

    /*
     * ESCAPE
     */
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

  window.ZynexCartSearch = {
    setupSearch,
    searchProducts,
    hideSuggestions
  };
})();
