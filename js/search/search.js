/* =========================================
   ZYNEXCART — PROFESSIONAL LIVE SEARCH
   Complete Product + Category + Subcategory Search
========================================= */

(function () {
  "use strict";

  let searchInitialized = false;
  let suggestionBox = null;
  let outsideClickHandler = null;

  /*
   * IMPORTANT:
   * There is intentionally NO fixed product-result limit.
   *
   * Suggestions can scroll when many products match.
   * Full search results are handled by products.html.
   */

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
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ");
  }


  /* =========================================
     ESCAPE HTML
     Prevents product/category text from
     being inserted as unsafe HTML.
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
     ESCAPE HTML ATTRIBUTE
  ========================================= */

  function escapeAttribute(value) {
    return escapeHTML(value);
  }


  /* =========================================
     FORMAT CATEGORY
  ========================================= */

  function formatCategory(category) {
    return String(category || "")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, function (letter) {
        return letter.toUpperCase();
      });
  }


  /* =========================================
     GET PRODUCT CATEGORY NAME
  ========================================= */

  function getProductCategoryName(product) {
    return normalize(
      product && (
        product.category ||
        product.categoryName ||
        product.categoryId
      )
    );
  }


  /* =========================================
     GET PRODUCT SUBCATEGORY
  ========================================= */

  function getProductSubcategory(product) {
    if (!product) {
      return "";
    }

    return normalize(
      product.subcategory ||
      product.subcategoryName ||
      product.subCategory ||
      product.subCategoryName ||
      product.subcategoryId ||
      product.subCategoryId
    );
  }


  /* =========================================
     GET PRODUCT SEARCH TEXT
  ========================================= */

  function getProductSearchText(product) {
    if (!product) {
      return "";
    }

    return [
      product.name,
      product.category,
      product.categoryName,
      product.categoryId,
      product.subcategory,
      product.subcategoryName,
      product.subCategory,
      product.subCategoryName,
      product.subcategoryId,
      product.subCategoryId,
      product.unit
    ]
      .map(normalize)
      .filter(Boolean)
      .join(" ");
  }


  /* =========================================
     GET QUERY WORDS
  ========================================= */

  function getQueryWords(query) {
    return normalize(query)
      .split(" ")
      .map(function (word) {
        return word.trim();
      })
      .filter(Boolean);
  }


  /* =========================================
     SCORE PRODUCT
  ========================================= */

  function scoreProduct(product, query) {
    const searchQuery = normalize(query);

    if (!searchQuery || !product) {
      return 0;
    }

    const name = normalize(product.name);

    const category = normalize(
      product.category ||
      product.categoryName
    );

    const categoryId = normalize(
      product.categoryId
    );

    const subcategory = getProductSubcategory(
      product
    );

    const unit = normalize(product.unit);

    const searchText =
      getProductSearchText(product);

    if (!searchText) {
      return 0;
    }

    let score = 0;

    /* -----------------------------------------
       EXACT PRODUCT NAME
    ----------------------------------------- */

    if (name === searchQuery) {
      score += 3000;
    }


    /* -----------------------------------------
       PRODUCT NAME STARTS WITH QUERY
    ----------------------------------------- */

    if (name.startsWith(searchQuery)) {
      score += 1600;
    }


    /* -----------------------------------------
       PRODUCT NAME CONTAINS QUERY
    ----------------------------------------- */

    if (name.includes(searchQuery)) {
      score += 1000;
    }


    /* -----------------------------------------
       PRODUCT WORD MATCHING
    ----------------------------------------- */

    const nameWords = name.split(" ");

    nameWords.forEach(function (word) {
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


    /* -----------------------------------------
       CATEGORY MATCHING
    ----------------------------------------- */

    if (category === searchQuery) {
      score += 850;
    }

    if (category.startsWith(searchQuery)) {
      score += 600;
    }

    if (category.includes(searchQuery)) {
      score += 450;
    }


    /* -----------------------------------------
       CATEGORY ID MATCHING
    ----------------------------------------- */

    if (categoryId === searchQuery) {
      score += 750;
    }

    if (categoryId.startsWith(searchQuery)) {
      score += 500;
    }

    if (categoryId.includes(searchQuery)) {
      score += 350;
    }


    /* -----------------------------------------
       SUBCATEGORY MATCHING
    ----------------------------------------- */

    if (subcategory === searchQuery) {
      score += 950;
    }

    if (subcategory.startsWith(searchQuery)) {
      score += 700;
    }

    if (subcategory.includes(searchQuery)) {
      score += 500;
    }


    /* -----------------------------------------
       UNIT / SIZE MATCHING
    ----------------------------------------- */

    if (unit === searchQuery) {
      score += 150;
    }

    if (unit.startsWith(searchQuery)) {
      score += 100;
    }

    if (unit.includes(searchQuery)) {
      score += 70;
    }


    /* -----------------------------------------
       MULTI-WORD SEARCH
       Every query word should contribute.
    ----------------------------------------- */

    const queryWords =
      getQueryWords(searchQuery);

    if (queryWords.length > 1) {
      let matchedWords = 0;

      queryWords.forEach(function (word) {
        if (!word) {
          return;
        }

        if (name.includes(word)) {
          matchedWords += 1;
          score += 350;
          return;
        }

        if (subcategory.includes(word)) {
          matchedWords += 1;
          score += 300;
          return;
        }

        if (category.includes(word)) {
          matchedWords += 1;
          score += 250;
          return;
        }

        if (categoryId.includes(word)) {
          matchedWords += 1;
          score += 200;
          return;
        }

        if (unit.includes(word)) {
          matchedWords += 1;
          score += 100;
        }
      });

      /*
       * If not every query word matches,
       * reduce the result priority.
       */

      if (
        matchedWords === queryWords.length
      ) {
        score += 1000;
      } else if (
        matchedWords > 0
      ) {
        score += matchedWords * 50;
      }
    }


    /* -----------------------------------------
       GENERAL SEARCH FALLBACK
    ----------------------------------------- */

    if (searchText.includes(searchQuery)) {
      score += 25;
    }

    return score;
  }


  /* =========================================
     SEARCH PRODUCTS
     Returns ALL matching products.
  ========================================= */

  function searchProducts(query) {
    const searchQuery = normalize(query);

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

      .filter(function (result) {
        return result.score > 0;
      })

      .sort(function (a, b) {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        const nameA = String(
          a.product.name || ""
        );

        const nameB = String(
          b.product.name || ""
        );

        const nameCompare =
          nameA.localeCompare(
            nameB,
            undefined,
            {
              sensitivity: "base"
            }
          );

        if (nameCompare !== 0) {
          return nameCompare;
        }

        return a.index - b.index;
      })

      .map(function (result) {
        return result.product;
      });
  }


  /* =========================================
     SCORE CATEGORY
  ========================================= */

  function scoreCategory(
    category,
    query
  ) {
    const searchQuery = normalize(query);

    if (
      !searchQuery ||
      !category
    ) {
      return 0;
    }

    const name = normalize(
      category.name
    );

    const id = normalize(
      category.id
    );

    const description = normalize(
      category.description
    );

    let score = 0;


    if (name === searchQuery) {
      score += 1000;
    }

    if (name.startsWith(searchQuery)) {
      score += 600;
    }

    if (name.includes(searchQuery)) {
      score += 400;
    }

    if (id === searchQuery) {
      score += 800;
    }

    if (id.startsWith(searchQuery)) {
      score += 500;
    }

    if (id.includes(searchQuery)) {
      score += 350;
    }

    if (
      description.includes(searchQuery)
    ) {
      score += 100;
    }

    return score;
  }


  /* =========================================
     SEARCH CATEGORIES
  ========================================= */

  function searchCategories(query) {
    const searchQuery = normalize(query);

    if (!searchQuery) {
      return [];
    }

    return getCategories()
      .map(function (category) {
        return {
          category: category,
          score: scoreCategory(
            category,
            searchQuery
          )
        };
      })

      .filter(function (result) {
        return result.score > 0;
      })

      .sort(function (a, b) {
        return b.score - a.score;
      })

      .map(function (result) {
        return result.category;
      });
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

    const safeName =
      escapeHTML(name);

    const safeImage =
      escapeAttribute(image);

    const productId =
      product.id != null
        ? String(product.id)
        : "";

    const safeProductId =
      escapeAttribute(productId);


    return `
      <a
        href="product.html?id=${encodeURIComponent(
          productId
        )}"
        class="search-suggestion"
        role="option"
        data-product-id="${safeProductId}"
        aria-label="Open ${safeName}"
      >

        <span class="search-suggestion-image">

          ${
            image
              ? `
                <img
                  src="${safeImage}"
                  alt="${safeName}"
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
            ${safeName}
          </strong>

        </span>

      </a>
    `;
  }


  /* =========================================
     CREATE SEARCH RESULT TITLE
     
     Used on products.html when a search
     query is active.
  ========================================= */

  function updateSearchResultsTitle() {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const searchQuery =
      (params.get("search") || "").trim();

    if (!searchQuery) {
      return;
    }

    const pageTitle =
      document.getElementById(
        "productsPageTitle"
      );

    if (!pageTitle) {
      return;
    }

    pageTitle.textContent =
      `Showing results for "${searchQuery}"`;
  }


  /* =========================================
     SHOW SUGGESTIONS
     
     Product suggestions only.
     No Categories / Products headings.
     No artificial 6-product limit.
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
      searchProducts(searchQuery);


    /* =====================================
       NO RESULTS
    ===================================== */

    if (
      productsFound.length === 0
    ) {
      const safeQuery =
        escapeHTML(searchQuery);

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

      suggestionBox.setAttribute(
        "aria-label",
        `No results for ${safeQuery}`
      );

      suggestionBox.hidden = false;

      return;
    }


    /* =====================================
       BUILD PRODUCT SUGGESTIONS
       
       ALL matching products are rendered.
       The container itself is scrollable.
    ===================================== */

    suggestionBox.innerHTML =
      productsFound
        .map(createProductSuggestion)
        .join("");

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


  /* =========================================
     CLEAR SEARCH
  ========================================= */

  function clearSearch(
    searchInput
  ) {
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


  /* =========================================
     SETUP SEARCH
  ========================================= */

  function setupSearch() {
    if (searchInitialized) {
      updateSearchResultsTitle();
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


    /* -------------------------------------
       CREATE DROPDOWN
    ------------------------------------- */

    createSuggestionBox(
      searchForm
    );


    /* -------------------------------------
       SEARCH RESULT TITLE
    ------------------------------------- */

    updateSearchResultsTitle();


    /* -------------------------------------
       LIVE SEARCH
    ------------------------------------- */

    searchInput.addEventListener(
      "input",
      function () {
        showSuggestions(
          searchInput.value
        );
      }
    );


    /* -------------------------------------
       FOCUS
    ------------------------------------- */

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


    /* -------------------------------------
       FORM SUBMIT
    ------------------------------------- */

    searchForm.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        performSearch(
          searchInput
        );
      }
    );


    /* -------------------------------------
       KEYBOARD CONTROL
    ------------------------------------- */

    searchInput.addEventListener(
      "keydown",
      function (event) {

        /* Enter */

        if (
          event.key === "Enter"
        ) {
          event.preventDefault();

          performSearch(
            searchInput
          );

          return;
        }


        /* Escape */

        if (
          event.key === "Escape"
        ) {
          event.preventDefault();

          hideSuggestions();

          searchInput.blur();
        }

      }
    );


    /* -------------------------------------
       SUGGESTION CLICK
    ------------------------------------- */

    suggestionBox.addEventListener(
      "click",
      function (event) {

        const suggestion =
          event.target.closest(
            ".search-suggestion"
          );

        if (suggestion) {
          hideSuggestions();
        }

      }
    );


    /* -------------------------------------
       OUTSIDE CLICK
    ------------------------------------- */

    outsideClickHandler =
      function (event) {

        if (
          !searchForm.contains(
            event.target
          )
        ) {
          hideSuggestions();
        }

      };

    document.addEventListener(
      "click",
      outsideClickHandler
    );


    /* -------------------------------------
       ESCAPE FROM SEARCH BOX
    ------------------------------------- */

    searchInput.addEventListener(
      "blur",
      function () {
        /*
         * Small delay allows a suggestion
         * link to receive its click before
         * the dropdown disappears.
         */

        window.setTimeout(
          function () {

            if (
              !searchForm.contains(
                document.activeElement
              )
            ) {
              hideSuggestions();
            }

          },
          120
        );
      }
    );
  }


  /* =========================================
     REFRESH SEARCH
  ========================================= */

  function refreshSearch() {
    const searchInput =
      document.getElementById(
        "searchInput"
      );

    if (!searchInput) {
      return;
    }

    const value =
      searchInput.value.trim();

    if (value) {
      showSuggestions(value);
    }
  }


  /* =========================================
     PUBLIC API
  ========================================= */

  window.ZynexCartSearch = {

    setupSearch,

    searchProducts,

    searchCategories,

    hideSuggestions,

    refreshSearch,

    clearSearch,

    getProducts,

    getCategories,

    normalize,

    scoreProduct

  };


  /* =========================================
     AUTO INITIALIZATION
     
     app.js can also call setupSearch().
     The guard prevents duplicate setup.
  ========================================= */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      function () {
        setupSearch();
      },
      {
        once: true
      }
    );

  } else {

    setupSearch();

  }

})();
