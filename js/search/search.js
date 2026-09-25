// ZYNEXCART — PROFESSIONAL SEARCH
(function () {
  "use strict";

  let searchInitialized = false;
  let suggestionBox = null;
  let currentResults = [];

  const MAX_SUGGESTIONS = 6;

  function getProducts() {
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

  function createSearchKeywords(product) {
    const keywordMap = {
      1: ["milk", "dairy", "fresh milk", "1 litre", "1 l"],
      2: ["bread", "bakery", "brown bread"],
      3: ["chips", "snacks", "potato", "namkeen"],
      4: ["soap", "bath", "personal care"],
      5: ["shampoo", "hair care", "personal care"],
      6: ["juice", "orange", "drink", "beverage"],
      7: ["face wash", "facewash", "skincare", "beauty"],
      8: ["dishwash", "dish wash", "cleaning", "household"]
    };

    return [
      product.name,
      product.category,
      product.unit,
      ...(keywordMap[product.id] || [])
    ]
      .map(normalize)
      .filter(Boolean);
  }

  function scoreProduct(product, query) {
    const searchQuery = normalize(query);

    if (!searchQuery) return 0;

    const name = normalize(product.name);
    const category = normalize(product.category);
    const unit = normalize(product.unit);
    const keywords = createSearchKeywords(product);

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

  function createSuggestionBox(searchForm) {
    if (suggestionBox) {
      return suggestionBox;
    }

    suggestionBox = document.createElement("div");

    suggestionBox.className = "search-suggestions";
    suggestionBox.id = "searchSuggestions";
    suggestionBox.setAttribute("role", "listbox");
    suggestionBox.hidden = true;

    searchForm.parentElement.appendChild(suggestionBox);

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
            ${formatCategory(product.category)} · ${product.unit}
          </span>
        </span>

        <span class="search-suggestion-arrow" aria-hidden="true">
          →
        </span>
      </a>
    `;
  }

  function showSuggestions(query) {
    if (!suggestionBox) return;

    const searchQuery = normalize(query);

    if (!searchQuery) {
      hideSuggestions();
      return;
    }

    currentResults = searchProducts(searchQuery);

    const results = currentResults.slice(0, MAX_SUGGESTIONS);

    if (!results.length) {
      suggestionBox.innerHTML = `
        <div class="search-no-results">
          <span class="search-no-results-icon">⌕</span>
          <div>
            <strong>No products found</strong>
            <small>Try another product or category</small>
          </div>
        </div>
      `;

      suggestionBox.hidden = false;
      return;
    }

    suggestionBox.innerHTML = `
      <div class="search-suggestions-header">
        <span>Suggestions</span>
      </div>

      ${results.map(createSuggestion).join("")}

      ${
        currentResults.length > MAX_SUGGESTIONS
          ? `
            <button
              type="button"
              class="search-view-all"
              data-search-query="${encodeURIComponent(searchQuery)}"
            >
              View all results
              <span>→</span>
            </button>
          `
          : ""
      }
    `;

    suggestionBox.hidden = false;
  }

  function hideSuggestions() {
    if (!suggestionBox) return;

    suggestionBox.hidden = true;
  }

  function performSearch(searchInput) {
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
      searchInput.focus();
      hideSuggestions();
      return;
    }

    const searchUrl =
      `products.html?search=${encodeURIComponent(searchTerm)}`;

    window.location.href = searchUrl;
  }

  function setupSearch() {
    if (searchInitialized) {
      return;
    }

    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");

    if (!searchForm || !searchInput) {
      return;
    }

    searchInitialized = true;

    const box = createSuggestionBox(searchForm);

    searchInput.addEventListener("input", function () {
      showSuggestions(searchInput.value);
    });

    searchInput.addEventListener("focus", function () {
      if (searchInput.value.trim()) {
        showSuggestions(searchInput.value);
      }
    });

    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      performSearch(searchInput);
    });

    box.addEventListener("click", function (event) {
      const viewAllButton =
        event.target.closest(".search-view-all");

      if (viewAllButton) {
        event.preventDefault();

        const query =
          decodeURIComponent(
            viewAllButton.dataset.searchQuery || ""
          );

        if (query) {
          window.location.href =
            `products.html?search=${encodeURIComponent(query)}`;
        }

        return;
      }

      const suggestion =
        event.target.closest(".search-suggestion");

      if (suggestion) {
        hideSuggestions();
      }
    });

    document.addEventListener("click", function (event) {
      if (!searchForm.contains(event.target) &&
          !box.contains(event.target)) {
        hideSuggestions();
      }
    });

    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        hideSuggestions();
        searchInput.blur();
      }
    });
  }

  window.ZynexCartSearch = {
    setupSearch,
    searchProducts,
    hideSuggestions
  };
})();
