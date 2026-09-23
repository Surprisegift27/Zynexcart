// ZYNEXCART — LOCATION SEARCH

(function () {
  "use strict";

  const locationCore = window.ZynexCartLocation;
  const locationUI = window.ZynexCartLocationUI;

  if (!locationCore || !locationUI) {
    console.error("ZynexCart: Location search dependencies not loaded.");
    return;
  }

  const config = locationCore.LOCATION_CONFIG;
  const state = locationCore.locationState;

  /**
   * Search locations using Nominatim
   */
  async function searchLocation(query) {
    const elements = locationUI.getLocationElements();

    if (!elements.searchResults) {
      return;
    }

    const searchTerm = String(query || "").trim();

    if (!searchTerm) {
      clearLocationSearchResults();
      return;
    }

    renderLocationSearchLoading();

    try {
      const url = new URL(
        `${config.nominatimUrl}/search`
      );

      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("addressdetails", "1");
      url.searchParams.set("limit", "6");
      url.searchParams.set("countrycodes", "in");
      url.searchParams.set("q", searchTerm);

      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(
          `Location search failed: ${response.status}`
        );
      }

      const results = await response.json();

      renderLocationSearchResults(
        Array.isArray(results) ? results : []
      );
    } catch (error) {
      console.error(
        "ZynexCart location search error:",
        error
      );

      renderLocationSearchError();
    }
  }

  /**
   * Render search results
   */
  function renderLocationSearchResults(results) {
    const elements = locationUI.getLocationElements();

    if (!elements.searchResults) {
      return;
    }

    elements.searchResults.innerHTML = "";

    if (!results.length) {
      const empty = document.createElement("div");

      empty.className = "location-search-empty";
      empty.textContent = "No locations found.";

      elements.searchResults.appendChild(empty);
      return;
    }

    results.forEach(function (result) {
      const item = document.createElement("button");

      item.type = "button";
      item.className = "location-search-result";

      const title = getSearchResultTitle(result);
      const subtitle =
        result.display_name || "Location";

      item.innerHTML = `
        <span class="location-search-result-icon" aria-hidden="true">
          📍
        </span>

        <span class="location-search-result-content">
          <strong>${escapeHTML(title)}</strong>
          <small>${escapeHTML(subtitle)}</small>
        </span>
      `;

      item.addEventListener("click", function () {
        selectSearchResult(result);
      });

      elements.searchResults.appendChild(item);
    });
  }

  /**
   * Loading state
   */
  function renderLocationSearchLoading() {
    const elements = locationUI.getLocationElements();

    if (!elements.searchResults) {
      return;
    }

    elements.searchResults.innerHTML = `
      <div class="location-search-loading">
        Searching locations...
      </div>
    `;
  }

  /**
   * Error state
   */
  function renderLocationSearchError() {
    const elements = locationUI.getLocationElements();

    if (!elements.searchResults) {
      return;
    }

    elements.searchResults.innerHTML = `
      <div class="location-search-error">
        Unable to search location. Please try again.
      </div>
    `;
  }

  /**
   * Get readable result title
   */
  function getSearchResultTitle(result) {
    const address = result.address || {};

    return (
      address.road ||
      address.neighbourhood ||
      address.suburb ||
      address.city ||
      address.town ||
      address.village ||
      result.name ||
      "Location"
    );
  }

  /**
   * Select search result
   */
  function selectSearchResult(result) {
    if (!result) {
      return;
    }

    const latitude = Number(result.lat);
    const longitude = Number(result.lon);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return;
    }

    state.selectedSearchResult = result;

    locationCore.setCoordinates(
      latitude,
      longitude,
      null
    );

    const address =
      normalizeNominatimAddress(
        result,
        latitude,
        longitude
      );

    locationCore.setAddress(address);

    clearLocationSearchResults();

    const elements = locationUI.getLocationElements();

    if (elements.searchInput) {
      elements.searchInput.value =
        getSearchResultTitle(result);
    }

    if (window.ZynexCartLocationMap) {
      window.ZynexCartLocationMap.openMapWithLocation(
        latitude,
        longitude,
        true
      );
    } else {
      locationUI.openMapScreen();
    }
  }

  /**
   * Normalize Nominatim result
   */
  function normalizeNominatimAddress(
    data,
    latitude,
    longitude
  ) {
    const address = data?.address || {};

    const city =
      address.city ||
      address.town ||
      address.municipality ||
      address.village ||
      address.city_district ||
      "";

    const stateName =
      address.state || "";

    const postcode =
      address.postcode || "";

    const country =
      address.country || "";

    const road =
      address.road ||
      address.pedestrian ||
      address.residential ||
      "";

    const area =
      address.suburb ||
      address.neighbourhood ||
      address.quarter ||
      address.locality ||
      "";

    const houseNumber =
      address.house_number || "";

    return {
      displayName:
        data.display_name || "",

      latitude: Number(latitude),
      longitude: Number(longitude),

      accuracy:
        state.accuracy || null,

      placeId:
        data.place_id || "",

      city,
      state: stateName,
      postcode,
      country,

      road,
      area,
      houseNumber,

      full_address:
        data.display_name || "",

      raw: data
    };
  }

  /**
   * Clear search results
   */
  function clearLocationSearchResults() {
    const elements = locationUI.getLocationElements();

    if (elements.searchResults) {
      elements.searchResults.innerHTML = "";
    }
  }

  /**
   * Escape HTML
   */
  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Debounced search
   */
  function handleSearchInput(query) {
    clearTimeout(state.searchTimer);

    state.searchTimer = setTimeout(
      function () {
        searchLocation(query);
      },
      config.searchDelay
    );
  }

  /**
   * Setup search input events
   */
  function setupLocationSearch() {
    const elements = locationUI.getLocationElements();

    if (!elements.searchInput) {
      return;
    }

    elements.searchInput.addEventListener(
      "input",
      function () {
        handleSearchInput(
          elements.searchInput.value
        );
      }
    );

    elements.searchInput.addEventListener(
      "keydown",
      function (event) {
        if (event.key !== "Enter") {
          return;
        }

        event.preventDefault();

        clearTimeout(state.searchTimer);

        searchLocation(
          elements.searchInput.value
        );
      }
    );
  }

  /**
   * Expose location search
   */
  window.ZynexCartLocationSearch = {
    searchLocation,
    renderLocationSearchResults,
    selectSearchResult,
    normalizeNominatimAddress,
    clearLocationSearchResults,
    setupLocationSearch
  };
})();
