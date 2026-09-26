// =====================================================
// ZYNEXCART — PROFESSIONAL LIVE SEARCH
// =====================================================

(function () {
  "use strict";

  let searchInitialized = false;
  let suggestionBox = null;

  const MAX_SUGGESTIONS = 6;


  // =====================================================
  // GET PRODUCTS
  // =====================================================

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


  // =====================================================
  // NORMALIZE
  // =====================================================

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }


  // =====================================================
  // FORMAT CATEGORY
  // =====================================================

  function formatCategory(category) {
    return String(category || "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, function (letter) {
        return letter.toUpperCase();
      });
  }


  // =====================================================
  // PRODUCT KEYWORDS
  // =====================================================

  function getProductKeywords(product) {
    const keywordMap = {
      1: [
        "milk",
        "fresh milk",
        "dairy",
        "dairy products",
        "grocery",
        "1 litre",
        "1 liter",
        "1 l"
      ],

      2: [
        "bread",
        "brown bread",
        "bakery",
        "bakery products",
        "grocery",
        "400 g"
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
        "personal-care"
      ],

      5: [
        "shampoo",
        "hair care",
        "haircare",
        "personal care",
        "personal-care"
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
        "beauty",
        "personal care"
      ],

      8: [
        "dishwash",
        "dish wash",
        "dishwashing",
        "cleaning",
        "cleaning essentials",
        "household"
      ]
    };

    return keywordMap[product.id] || [];
  }


  // =====================================================
  // SEARCH SCORE
  //
  // Important:
  // As user types more characters, unrelated products
  // automatically disappear.
  // =====================================================

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


    // -----------------------------------------------------
    // EXACT PRODUCT NAME
    // -----------------------------------------------------

    if (name === searchQuery) {
      score += 1000;
    }


    // -----------------------------------------------------
    // PRODUCT NAME STARTS WITH QUERY
    //
    // milk -> Fresh Milk
    // bre  -> Brown Bread
    // sha  -> Shampoo
    // -----------------------------------------------------

    if (name.startsWith(searchQuery)) {
      score += 800;
    }


    // -----------------------------------------------------
    // WORD STARTS WITH QUERY
    //
    // "fresh milk"
    // query "mil" -> milk
    // -----------------------------------------------------

    const nameWords = name.split(" ");

    nameWords.forEach(function (word) {
      if (word === searchQuery) {
        score += 900;
      } else if (word.startsWith(searchQuery)) {
        score += 700;
      }
    });


    // -----------------------------------------------------
    // PRODUCT NAME CONTAINS QUERY
    // -----------------------------------------------------

    if (name.includes(searchQuery)) {
      score += 450;
    }


    // -----------------------------------------------------
    // CATEGORY MATCH
    // -----------------------------------------------------

    if (category === searchQuery) {
      score += 400;
    }

    if (category.startsWith(searchQuery)) {
      score += 300;
    }

    if (category.includes(searchQuery)) {
      score += 180;
    }


    // -----------------------------------------------------
    // CATEGORY WORD MATCH
    // -----------------------------------------------------

    const categoryWords = category.split(" ");

    categoryWords.forEach(function (word) {
      if (word.startsWith(searchQuery)) {
        score += 220;
      }
    });


    // -----------------------------------------------------
    // KEYWORD MATCH
    // -----------------------------------------------------

    keywords.forEach(function (keyword) {
      if (keyword === searchQuery) {
        score += 500;
      } else if (keyword.startsWith(searchQuery)) {
        score += 350;
      } else if (keyword.includes(searchQuery)) {
        score += 120;
      }
    });


    // -----------------------------------------------------
    // UNIT MATCH
    // -----------------------------------------------------

    if (unit === searchQuery) {
      score += 100;
    }

    if (unit.includes(searchQuery)) {
      score += 50;
    }


    return score;
  }


  // =====================================================
  // SEARCH PRODUCTS
  // =====================================================

  function searchProducts(query) {
    const searchQuery = normalize(query);

    if (!searchQuery) {
      return [];
    }

    return getProducts()
      .map(function (product) {
        return {
          product: product,
          score: scoreProduct(
            product,
            searchQuery
          )
        };
      })

      .filter(function (result) {
        return result.score > 0;
      })

      .sort(function (a, b) {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return String(
          a.product.name
        ).localeCompare(
          String(b.product.name)
        );
      })

      .map(function (result) {
        return result.product;
      });
  }


  // =====================================================
  // CREATE SUGGESTION BOX
  // =====================================================

  function createSuggestionBox(searchForm) {
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


  // =====================================================
  // CREATE PRODUCT SUGGESTION
  // =====================================================

  function createSuggestion(product) {
    return `
      <a
        href="product.html?id=${encodeURIComponent(
          product.id
        )}"
        class="search-suggestion"
        role="option"
        data-product-id="${product.id}"
      >

        <span
          class="search-suggestion-image"
        >

          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
            onerror="this.style.display='none'"
          >

        </span>


        <span
          class="search-suggestion-content"
        >

          <strong
            class="search-suggestion-name"
          >
            ${product.name}
          </strong>


          <span
            class="search-suggestion-meta"
          >

            ${formatCategory(
              product.category
            )}

            <span aria-hidden="true">
              •
            </span>

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


  // =====================================================
  // SHOW LIVE SUGGESTIONS
  // =====================================================

  function showSuggestions(query) {
    if (!suggestionBox) {
      return;
    }

    const searchQuery =
      normalize(query);


    // -----------------------------------------------------
    // EMPTY SEARCH
    // -----------------------------------------------------

    if (!searchQuery) {
      hideSuggestions();
      return;
    }


    // -----------------------------------------------------
    // FIND MATCHING PRODUCTS
    // -----------------------------------------------------

    const results =
      searchProducts(
        searchQuery
      );


    // -----------------------------------------------------
    // PRODUCTS FOUND
    // -----------------------------------------------------

    if (results.length > 0) {

      suggestionBox.innerHTML = `

        <div
          class="search-suggestions-header"
        >
          <span>
            Products
          </span>
        </div>


        ${results
          .slice(
            0,
            MAX_SUGGESTIONS
          )
          .map(
            createSuggestion
          )
          .join("")}


        ${
          results.length >
          MAX_SUGGESTIONS
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

                <span
                  aria-hidden="true"
                >
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


    // -----------------------------------------------------
    // NO PRODUCTS FOUND
    // -----------------------------------------------------

    suggestionBox.innerHTML = `

      <div
        class="search-no-results"
      >

        <div
          class="search-no-results-icon"
        >
          🔍
        </div>


        <div
          class="search-no-results-content"
        >

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


  // =====================================================
  // HIDE SUGGESTIONS
  // =====================================================

  function hideSuggestions() {
    if (!suggestionBox) {
      return;
    }

    suggestionBox.hidden = true;
  }


  // =====================================================
  // PERFORM SEARCH
  // =====================================================

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


  // =====================================================
  // SETUP SEARCH
  // =====================================================

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


    createSuggestionBox(
      searchForm
    );


    // ===================================================
    // LIVE SEARCH WHILE TYPING
    // ===================================================

    searchInput.addEventListener(
      "input",
      function () {

        showSuggestions(
          searchInput.value
        );

      }
    );


    // ===================================================
    // SHOW AGAIN WHEN INPUT GETS FOCUS
    // ===================================================

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


    // ===================================================
    // SEARCH FORM
    // ===================================================

    searchForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        performSearch(
          searchInput
        );

      }
    );


    // ===================================================
    // SUGGESTION CLICK
    // ===================================================

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


    // ===================================================
    // CLICK OUTSIDE
    // ===================================================

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


    // ===================================================
    // ESCAPE
    // ===================================================

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


  // =====================================================
  // PUBLIC API
  // =====================================================

  window.ZynexCartSearch = {

    setupSearch,

    searchProducts,

    hideSuggestions

  };

})();
