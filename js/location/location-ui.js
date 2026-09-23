// ZYNEXCART — LOCATION UI

(function () {
  "use strict";

  const locationCore = window.ZynexCartLocation;
  const utils = window.ZynexCartUtils;

  if (!locationCore || !utils) {
    console.error("ZynexCart: Location UI dependencies not loaded.");
    return;
  }

  /**
   * Get all location-related DOM elements
   */
  function getLocationElements() {
    return {
      locationBtn: document.getElementById("locationBtn"),
      locationText:
        document.getElementById("locationText") ||
        document.querySelector(".location-text"),

      modal: document.getElementById("locationModal"),
      backdrop: document.getElementById("locationModalBackdrop"),

      closeBtn:
        document.getElementById("locationCloseBtn") ||
        document.getElementById("closeLocationModal"),

      backBtn: document.getElementById("locationBackBtn"),

      homeScreen: document.getElementById("locationHomeScreen"),
      mapScreen: document.getElementById("locationMapScreen"),
      addressScreen: document.getElementById("locationAddressScreen"),

      searchInput:
        document.getElementById("locationSearchInput"),

      currentLocationBtn:
        document.getElementById("useCurrentLocationBtn"),

      addAddressBtn:
        document.getElementById("addNewAddressBtn"),

      confirmLocationBtn:
        document.getElementById("confirmLocationBtn"),

      saveAddressBtn:
        document.getElementById("saveAddressBtn"),

      mapContainer:
        document.getElementById("locationMapContainer"),

      mapPlaceholder:
        document.getElementById("locationMapPlaceholder"),

      mapCurrentLocationBtn:
        document.getElementById("mapCurrentLocationBtn"),

      detectedLocationCard:
        document.getElementById("detectedLocationCard"),

      detectedLocationTitle:
        document.getElementById("detectedLocationTitle"),

      detectedLocationAddress:
        document.getElementById("detectedLocationAddress"),

      confirmedLocation:
        document.getElementById("confirmedLocation"),

      confirmedLocationText:
        document.getElementById("confirmedLocationText"),

      addressForm:
        document.getElementById("deliveryAddressForm"),

      savedAddresses:
        document.getElementById("savedAddresses"),

      searchResults:
        document.getElementById("locationSearchResults")
    };
  }

  /**
   * Open location modal
   */
  function openLocationModal() {
    const elements = getLocationElements();

    if (!elements.modal) return;

    elements.modal.hidden = false;
    document.body.classList.add("location-modal-open");

    showLocationScreen("home");

    if (window.ZynexCartSavedAddresses) {
      window.ZynexCartSavedAddresses.renderSavedAddresses();
    }
  }

  /**
   * Close location modal
   */
  function closeLocationModal() {
    const elements = getLocationElements();

    if (!elements.modal) return;

    elements.modal.hidden = true;
    document.body.classList.remove("location-modal-open");

    showLocationScreen("home");
  }

  /**
   * Show location screen
   *
   * Supported:
   * home
   * map
   * address
   */
  function showLocationScreen(screen) {
    const elements = getLocationElements();

    const screens = {
      home: elements.homeScreen,
      map: elements.mapScreen,
      address: elements.addressScreen
    };

    Object.values(screens).forEach((element) => {
      if (element) {
        element.hidden = true;
      }
    });

    const activeScreen = screens[screen];

    if (activeScreen) {
      activeScreen.hidden = false;
    }

    updateBackButton(screen);
  }

  /**
   * Update back button state
   */
  function updateBackButton(screen) {
    const elements = getLocationElements();

    if (!elements.backBtn) return;

    elements.backBtn.hidden = screen === "home";
  }

  /**
   * Show map screen
   */
  function openMapScreen() {
    showLocationScreen("map");

    if (window.ZynexCartLocationMap) {
      window.ZynexCartLocationMap.initializeMap();
    }
  }

  /**
   * Show address screen
   */
  function openAddressScreen() {
    showLocationScreen("address");

    if (window.ZynexCartLocationAddress) {
      window.ZynexCartLocationAddress.prefillAddressForm();
    }
  }

  /**
   * Update header location text
   */
  function updateHeaderLocation(address) {
    const elements = getLocationElements();

    if (!elements.locationText) return;

    if (!address) {
      elements.locationText.textContent =
        "Select location";
      return;
    }

    const text =
      address.displayName ||
      address.full_address ||
      [
        address.area,
        address.city,
        address.state
      ]
        .filter(Boolean)
        .join(", ");

    elements.locationText.textContent =
      text || "Select location";
  }

  /**
   * Show location error
   */
  function showLocationError(message) {
    const text =
      message ||
      "Unable to detect your location.";

    console.error("ZynexCart Location:", text);

    if (typeof window.alert === "function") {
      window.alert(text);
    }
  }

  /**
   * Show location success
   */
  function showLocationSuccess(message) {
    const text =
      message ||
      "Delivery location saved successfully.";

    console.log("ZynexCart Location:", text);
  }

  /**
   * Update detected location card
   */
  function updateDetectedLocationUI() {
    const elements = getLocationElements();
    const state = locationCore.locationState;

    if (
      !elements.detectedLocationCard ||
      !state.address
    ) {
      return;
    }

    const address = state.address;

    if (elements.detectedLocationTitle) {
      elements.detectedLocationTitle.textContent =
        "Location detected";
    }

    if (elements.detectedLocationAddress) {
      elements.detectedLocationAddress.textContent =
        address.displayName ||
        [
          address.area,
          address.city,
          address.state,
          address.postcode
        ]
          .filter(Boolean)
          .join(", ");
    }

    elements.detectedLocationCard.hidden = false;
  }

  /**
   * Update confirmed location
   */
  function updateConfirmedLocation() {
    const elements = getLocationElements();
    const state = locationCore.locationState;

    if (!elements.confirmedLocationText) {
      return;
    }

    if (!state.address) {
      elements.confirmedLocationText.textContent =
        "Location not selected";
      return;
    }

    elements.confirmedLocationText.textContent =
      state.address.displayName ||
      [
        state.address.area,
        state.address.city,
        state.address.state,
        state.address.postcode
      ]
        .filter(Boolean)
        .join(", ");
  }

  /**
   * Setup location UI events
   */
  function setupLocationEvents() {
    const elements = getLocationElements();

    if (elements.locationBtn) {
      elements.locationBtn.addEventListener(
        "click",
        openLocationModal
      );
    }

    if (elements.closeBtn) {
      elements.closeBtn.addEventListener(
        "click",
        closeLocationModal
      );
    }

    if (elements.backdrop) {
      elements.backdrop.addEventListener(
        "click",
        closeLocationModal
      );
    }

    if (elements.backBtn) {
      elements.backBtn.addEventListener(
        "click",
        function () {
          showLocationScreen("home");
        }
      );
    }

    if (elements.currentLocationBtn) {
      elements.currentLocationBtn.addEventListener(
        "click",
        function () {
          if (window.ZynexCartLocationMap) {
            window.ZynexCartLocationMap.useCurrentLocation();
          }
        }
      );
    }

    if (elements.mapCurrentLocationBtn) {
      elements.mapCurrentLocationBtn.addEventListener(
        "click",
        function () {
          if (window.ZynexCartLocationMap) {
            window.ZynexCartLocationMap.useCurrentLocation();
          }
        }
      );
    }

    if (elements.addAddressBtn) {
      elements.addAddressBtn.addEventListener(
        "click",
        function () {
          openMapScreen();
        }
      );
    }

    if (elements.confirmLocationBtn) {
      elements.confirmLocationBtn.addEventListener(
        "click",
        function () {
          if (window.ZynexCartLocationMap) {
            window.ZynexCartLocationMap.confirmMapLocation();
          }
        }
      );
    }

    if (elements.saveAddressBtn) {
      elements.saveAddressBtn.addEventListener(
        "click",
        function (event) {
          event.preventDefault();

          if (window.ZynexCartLocationAddress) {
            window.ZynexCartLocationAddress.saveDeliveryAddress();
          }
        }
      );
    }

    document.addEventListener(
      "keydown",
      function (event) {
        if (
          event.key === "Escape" &&
          elements.modal &&
          !elements.modal.hidden
        ) {
          closeLocationModal();
        }
      }
    );
  }

  /**
   * Expose location UI
   */
  window.ZynexCartLocationUI = {
    getLocationElements,
    openLocationModal,
    closeLocationModal,
    showLocationScreen,
    openMapScreen,
    openAddressScreen,
    updateHeaderLocation,
    updateDetectedLocationUI,
    updateConfirmedLocation,
    showLocationError,
    showLocationSuccess,
    setupLocationEvents
  };
})();
