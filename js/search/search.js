// ZYNEXCART — SEARCH

(function () {
  "use strict";

  /**
   * Initialize product search
   */
  function setupSearch() {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");

    if (!searchForm || !searchInput) {
      return;
    }

    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const searchTerm = searchInput.value.trim();

      if (!searchTerm) {
        searchInput.focus();
        return;
      }

      const searchUrl =
        `products.html?search=${encodeURIComponent(searchTerm)}`;

      window.location.href = searchUrl;
    });
  }

  /**
   * Expose search module
   */
  window.ZynexCartSearch = {
    setupSearch
  };
})();
