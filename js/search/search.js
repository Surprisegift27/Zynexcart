/* =========================================
   ZYNEXCART — PROFESSIONAL SEARCH SYSTEM
   Full-screen live search experience
   + Professional Voice Search
========================================= */

(function () {
  "use strict";

  let searchInitialized = false;
  let searchScreen = null;
  let searchInput = null;
  let originalSearchInput = null;

  let voiceRecognition = null;
  let isVoiceSupported = false;
  let isListening = false;
  let voiceBaseText = "";
  let voiceMessageTimer = null;

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
     VOICE ICON
  ========================================= */

  function getMicIcon() {
    return `
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        class="zynexcart-mic-svg"
      >
        <path
          d="M12 14.5a3.5 3.5 0 0 0 3.5-3.5V6a3.5 3.5 0 0 0-7 0v5a3.5 3.5 0 0 0 3.5 3.5Z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M18.5 11a6.5 6.5 0 0 1-13 0"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
        <path
          d="M12 17.5V21"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
        <path
          d="M9 21h6"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
      </svg>
    `;
  }


  /* =========================================
     STOP ICON
  ========================================= */

  function getStopIcon() {
    return `
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        class="zynexcart-mic-svg"
      >
        <rect
          x="7"
          y="7"
          width="10"
          height="10"
          rx="2"
          fill="currentColor"
        />
      </svg>
    `;
  }


  /* =========================================
     ADD VOICE STYLES
     Scoped only to voice-search UI
  ========================================= */

  function ensureVoiceStyles() {
    if (
      document.getElementById(
        "zynexcartVoiceSearchStyles"
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "zynexcartVoiceSearchStyles";

    style.textContent = `
      .zynexcart-search-voice {
        width: 56px;
        height: 56px;
        min-width: 56px;
        min-height: 56px;
        flex: 0 0 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 20;
        margin: 0;
        padding: 0;
        border: 0;
        outline: none;
        background: transparent;
        color: #071b3a;
        font-family: inherit;
        cursor: pointer;
        pointer-events: auto;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        transition:
          color 0.2s ease,
          background-color 0.2s ease,
          transform 0.15s ease;
      }

      .zynexcart-search-voice:hover {
        color: #ff6b00;
      }

      .zynexcart-search-voice:focus-visible {
        color: #ff6b00;
        box-shadow:
          inset 0 0 0 2px rgba(255, 107, 0, 0.2);
        border-radius: 14px;
      }

      .zynexcart-search-voice:active {
        transform: scale(0.94);
      }

      .zynexcart-search-voice.is-listening {
        color: #ff6b00;
        background: rgba(255, 107, 0, 0.08);
        border-radius: 50%;
      }

      .zynexcart-mic-svg {
        width: 24px;
        height: 24px;
        display: block;
      }

      .zynexcart-voice-status {
        position: fixed;
        left: 50%;
        bottom: 24px;
        z-index: 2147483648;
        max-width: calc(100% - 32px);
        padding: 11px 16px;
        border-radius: 999px;
        background: #071b3a;
        color: #ffffff;
        font-size: 13px;
        font-weight: 700;
        line-height: 1.35;
        text-align: center;
        box-shadow: 0 8px 28px rgba(7, 27, 58, 0.22);
        transform: translateX(-50%);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .zynexcart-voice-status.is-visible {
        opacity: 1;
      }

      @media (max-width: 600px) {
        .zynexcart-search-voice {
          width: 56px;
          height: 56px;
          min-width: 56px;
          min-height: 56px;
          flex-basis: 56px;
        }

        .zynexcart-mic-svg {
          width: 23px;
          height: 23px;
        }

        .zynexcart-voice-status {
          bottom: 18px;
          font-size: 12px;
        }
      }

      @media (max-width: 380px) {
        .zynexcart-search-voice {
          width: 52px;
          height: 52px;
          min-width: 52px;
          min-height: 52px;
          flex-basis: 52px;
        }
      }
    `;

    document.head.appendChild(style);
  }


  /* =========================================
     CREATE SEARCH SCREEN
  ========================================= */

  function createSearchScreen() {
    if (searchScreen) {
      return searchScreen;
    }

    ensureVoiceStyles();

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
            type="text"
            id="zynexcartLiveSearchInput"
            autocomplete="off"
            aria-label="Search products"
            placeholder="Search for products..."
          />

          <button
            type="button"
            class="zynexcart-search-voice"
            id="zynexcartSearchVoice"
            aria-label="Search by voice"
            title="Search by voice"
          >
            ${getMicIcon()}
          </button>

          <button
            type="button"
            class="zynexcart-search-clear"
            id="zynexcartSearchClear"
            aria-label="Clear search"
            title="Clear search"
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

    createVoiceStatus();

    return searchScreen;
  }


  /* =========================================
     VOICE STATUS
  ========================================= */

  function createVoiceStatus() {
    if (
      document.getElementById(
        "zynexcartVoiceStatus"
      )
    ) {
      return;
    }

    const status =
      document.createElement("div");

    status.id =
      "zynexcartVoiceStatus";

    status.className =
      "zynexcart-voice-status";

    status.setAttribute(
      "role",
      "status"
    );

    status.setAttribute(
      "aria-live",
      "polite"
    );

    document.body.appendChild(status);
  }


  function showVoiceMessage(
    message,
    duration = 2600
  ) {
    const status =
      document.getElementById(
        "zynexcartVoiceStatus"
      );

    if (!status) {
      return;
    }

    if (voiceMessageTimer) {
      window.clearTimeout(
        voiceMessageTimer
      );
    }

    status.textContent =
      message;

    status.classList.add(
      "is-visible"
    );

    voiceMessageTimer =
      window.setTimeout(
        function () {
          status.classList.remove(
            "is-visible"
          );
        },
        duration
      );
  }


  /* =========================================
     VOICE SUPPORT
  ========================================= */

  function getSpeechRecognitionConstructor() {
    return (
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      null
    );
  }


  function setupVoiceRecognition() {
    const Recognition =
      getSpeechRecognitionConstructor();

    if (!Recognition) {
      isVoiceSupported = false;
      return false;
    }

    isVoiceSupported = true;

    try {
      voiceRecognition =
        new Recognition();

      voiceRecognition.continuous =
        false;

      voiceRecognition.interimResults =
        true;

      voiceRecognition.maxAlternatives =
        1;

      /*
       * Indian English gives good support
       * for both common English and
       * Indian-accented speech.
       */
      voiceRecognition.lang =
        "en-IN";


      voiceRecognition.onstart =
        function () {
          isListening = true;

          updateVoiceButton();

          showVoiceMessage(
            "Listening… Speak now"
          );
        };


      voiceRecognition.onresult =
        function (event) {
          if (!searchInput) {
            return;
          }

          let finalTranscript = "";
          let interimTranscript = "";

          for (
            let i = event.resultIndex;
            i < event.results.length;
            i += 1
          ) {
            const result =
              event.results[i];

            const transcript =
              result[0]
                ? result[0].transcript
                : "";

            if (result.isFinal) {
              finalTranscript +=
                transcript;
            } else {
              interimTranscript +=
                transcript;
            }
          }

          const spokenText =
            finalTranscript ||
            interimTranscript;

          const combinedText =
            [
              voiceBaseText,
              spokenText
            ]
              .filter(Boolean)
              .join(" ")
              .trim();

          searchInput.value =
            combinedText;

          if (originalSearchInput) {
            originalSearchInput.value =
              combinedText;
          }

          updateSearchActions();

          renderSearch(
            combinedText
          );
        };


      voiceRecognition.onerror =
        function (event) {
          isListening = false;

          updateVoiceButton();

          handleVoiceError(
            event &&
              event.error
              ? event.error
              : "unknown"
          );
        };


      voiceRecognition.onend =
        function () {
          isListening = false;

          updateVoiceButton();

          if (
            searchInput &&
            normalize(searchInput.value)
          ) {
            renderSearch(
              searchInput.value
            );
          }
        };

      return true;

    } catch (error) {
      console.error(
        "ZynexCart: Voice recognition initialization failed.",
        error
      );

      voiceRecognition =
        null;

      isVoiceSupported =
        false;

      return false;
    }
  }


  /* =========================================
     VOICE ERROR HANDLING
  ========================================= */

  function handleVoiceError(errorCode) {
    switch (errorCode) {
      case "not-allowed":
      case "service-not-allowed":
        showVoiceMessage(
          "Microphone permission was denied. Please allow microphone access."
        );
        break;

      case "audio-capture":
        showVoiceMessage(
          "Microphone is unavailable. Please check your device microphone."
        );
        break;

      case "no-speech":
        showVoiceMessage(
          "No speech detected. Please try again."
        );
        break;

      case "network":
        showVoiceMessage(
          "Voice search needs a network connection. Please try again."
        );
        break;

      case "aborted":
        break;

      case "language-not-supported":
        showVoiceMessage(
          "Voice language is not supported on this browser."
        );
        break;

      default:
        showVoiceMessage(
          "Voice search could not start. Please try again."
        );
        break;
    }
  }


  /* =========================================
     UPDATE VOICE BUTTON
  ========================================= */

  function updateVoiceButton() {
    const voiceButton =
      document.getElementById(
        "zynexcartSearchVoice"
      );

    if (!voiceButton) {
      return;
    }

    if (isListening) {
      voiceButton.classList.add(
        "is-listening"
      );

      voiceButton.innerHTML =
        getStopIcon();

      voiceButton.setAttribute(
        "aria-label",
        "Stop voice search"
      );

      voiceButton.setAttribute(
        "title",
        "Stop voice search"
      );

      return;
    }

    voiceButton.classList.remove(
      "is-listening"
    );

    voiceButton.innerHTML =
      getMicIcon();

    voiceButton.setAttribute(
      "aria-label",
      "Search by voice"
    );

    voiceButton.setAttribute(
      "title",
      "Search by voice"
    );
  }


  /* =========================================
     START VOICE SEARCH
  ========================================= */

  function startVoiceSearch() {
    if (!searchInput) {
      return;
    }

    if (!isVoiceSupported) {
      showVoiceMessage(
        "Voice search is not supported in this browser. You can type your search."
      );

      return;
    }

    if (!voiceRecognition) {
      if (!setupVoiceRecognition()) {
        showVoiceMessage(
          "Voice search is unavailable in this browser."
        );

        return;
      }
    }

    if (isListening) {
      stopVoiceSearch();
      return;
    }

    /*
     * Save existing text so spoken words
     * can be added after it naturally.
     */
    voiceBaseText =
      normalize(searchInput.value);

    try {
      voiceRecognition.start();
    } catch (error) {
      /*
       * Calling start() while recognition is
       * already active can throw InvalidStateError.
       * We handle it without breaking search.
       */
      if (
        error &&
        error.name ===
          "InvalidStateError"
      ) {
        return;
      }

      console.error(
        "ZynexCart: Unable to start voice search.",
        error
      );

      isListening = false;

      updateVoiceButton();

      showVoiceMessage(
        "Voice search could not start. Please try again."
      );
    }
  }


  /* =========================================
     STOP VOICE SEARCH
  ========================================= */

  function stopVoiceSearch() {
    if (!voiceRecognition) {
      isListening = false;
      updateVoiceButton();
      return;
    }

    try {
      voiceRecognition.stop();
    } catch (error) {
      /*
       * Safe fallback if recognition has
       * already ended.
       */
      console.debug(
        "ZynexCart: Voice recognition stop completed.",
        error
      );
    }

    isListening = false;

    updateVoiceButton();
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
     UPDATE SEARCH ACTIONS
  ========================================= */

  function updateSearchActions() {
    const clearButton =
      document.getElementById(
        "zynexcartSearchClear"
      );

    const voiceButton =
      document.getElementById(
        "zynexcartSearchVoice"
      );

    if (!searchInput) {
      return;
    }

    const hasText =
      Boolean(
        normalize(
          searchInput.value
        )
      );


    /*
     * Empty:
     * Mic visible
     * Clear hidden
     *
     * Typing:
     * Mic hidden
     * Clear visible
     */

    if (clearButton) {
      clearButton.hidden =
        !hasText;
    }

    if (voiceButton) {
      voiceButton.hidden =
        hasText && !isListening;
    }


    /*
     * If user is currently listening,
     * keep the stop button available.
     */
    if (
      voiceButton &&
      isListening
    ) {
      voiceButton.hidden =
        false;
    }
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

      updateSearchActions();

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

      updateSearchActions();

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
     */

    if (!productCards) {
      results.innerHTML = `
        <div class="zynexcart-search-no-results">
          <strong>
            Loading products...
          </strong>
        </div>
      `;

      updateSearchActions();

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

    updateSearchActions();
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

      updateSearchActions();

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
    stopVoiceSearch();

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
    stopVoiceSearch();

    if (!searchInput) {
      return;
    }

    searchInput.value = "";

    voiceBaseText = "";

    if (originalSearchInput) {
      originalSearchInput.value = "";
    }

    renderSearch("");

    updateSearchActions();

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

    stopVoiceSearch();

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

    const voiceButton =
      document.getElementById(
        "zynexcartSearchVoice"
      );

    if (!form || !searchInput) {
      return;
    }


    /* -------------------------------------
       VOICE SETUP
    ------------------------------------- */

    setupVoiceRecognition();

    updateVoiceButton();


    /* -------------------------------------
       INPUT
    ------------------------------------- */

    searchInput.addEventListener(
      "input",
      function () {
        /*
         * Manual typing while listening
         * becomes the new base text.
         */
        if (!isListening) {
          voiceBaseText = "";
        }

        const value =
          searchInput.value;

        if (originalSearchInput) {
          originalSearchInput.value =
            value;
        }

        updateSearchActions();

        renderSearch(value);
      }
    );


    /* -------------------------------------
       KEYBOARD
    ------------------------------------- */

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


    /* -------------------------------------
       FORM SUBMIT
    ------------------------------------- */

    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        performSearch(
          searchInput.value
        );
      }
    );


    /* -------------------------------------
       BACK
    ------------------------------------- */

    if (backButton) {
      backButton.addEventListener(
        "click",
        function () {
          closeSearchScreen();
        }
      );
    }


    /* -------------------------------------
       CLEAR
    ------------------------------------- */

    if (clearButton) {
      clearButton.addEventListener(
        "click",
        function () {
          clearSearch();
        }
      );
    }


    /* -------------------------------------
       VOICE BUTTON
    ------------------------------------- */

    if (voiceButton) {
      voiceButton.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          event.stopPropagation();

          startVoiceSearch();
        }
      );
    }


    /* -------------------------------------
       SUGGESTIONS
    ------------------------------------- */

    const suggestions =
      document.getElementById(
        "zynexcartSearchSuggestions"
      );

    if (suggestions) {
      suggestions.addEventListener(
        "click",
        function () {
          stopVoiceSearch();

          window.setTimeout(
            function () {
              closeSearchScreen();
            },
            50
          );
        }
      );
    }


    /* -------------------------------------
       INITIAL ACTION STATE
    ------------------------------------- */

    updateSearchActions();
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
     ANDROID / BROWSER BACK
  ========================================= */

  function setupBrowserBackHandling() {
    window.addEventListener(
      "popstate",
      function () {
        if (
          searchScreen &&
          !searchScreen.hidden
        ) {
          closeSearchScreen();
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

    getProducts,

    getCategories,

    normalize,

    openSearchScreen,

    closeSearchScreen,

    clearSearch,

    startVoiceSearch,

    stopVoiceSearch,

    isVoiceSupported:
      function () {
        return isVoiceSupported;
      },

    isListening:
      function () {
        return isListening;
      }

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


  if (document.body) {
    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );
  }


  setupBrowserBackHandling();

})();
