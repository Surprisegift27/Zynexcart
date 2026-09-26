// ZYNEXCART — APPLICATION ORCHESTRATOR
// Connects all modular ZynexCart systems together.

(function () {
  "use strict";

  /* =========================================================
     MODULE REFERENCES
  ========================================================= */

  const storage = window.ZynexCartStorage;
  const utils = window.ZynexCartUtils;
  const events = window.ZynexCartEvents;

  const cart = window.ZynexCartCart;
  const cartActions = window.ZynexCartCartActions;
  const cartUI = window.ZynexCartCartUI;

  const search = window.ZynexCartSearch;

  const locationCore = window.ZynexCartLocation;
  const locationUI = window.ZynexCartLocationUI;
  const locationSearch = window.ZynexCartLocationSearch;
  const locationMap = window.ZynexCartLocationMap;
  const locationAddress = window.ZynexCartLocationAddress;
  const savedAddresses = window.ZynexCartSavedAddresses;


  /* =========================================================
     DEPENDENCY CHECK
  ========================================================= */

  function checkDependencies() {
    const missing = [];

    if (!storage) missing.push("core/storage.js");
    if (!utils) missing.push("core/utils.js");
    if (!events) missing.push("core/events.js");

    if (!cart) missing.push("cart/cart.js");
    if (!cartActions) missing.push("cart/cart-actions.js");
    if (!cartUI) missing.push("cart/cart-ui.js");

    if (!search) missing.push("search/search.js");

    if (!locationCore) missing.push("location/location.js");
    if (!locationUI) missing.push("location/location-ui.js");
    if (!locationSearch) missing.push("location/location-search.js");
    if (!locationMap) missing.push("location/location-map.js");
    if (!locationAddress) missing.push("location/location-address.js");
    if (!savedAddresses) missing.push("location/saved-addresses.js");

    if (missing.length) {
      console.error(
        "ZynexCart: Missing modules:",
        missing
      );

      return false;
    }

    return true;
  }


  /* =========================================================
     CART API
  ========================================================= */

  function getCart() {
    return cart.getCart();
  }

  function saveCart(cartItems) {
    return cart.saveCart(cartItems);
  }

  function getCartItemCount() {
    return cart.getCartItemCount();
  }

  function getCartTotal() {
    return cart.getCartTotal();
  }

  function addToCart(product) {
    return cartActions.addToCart(product);
  }

  function removeFromCart(productId) {
    return cartActions.removeFromCart(productId);
  }

  function changeCartQuantity(productId, change) {
    return cartActions.changeCartQuantity(
      productId,
      change
    );
  }

  function setCartQuantity(productId, quantity) {
    return cartActions.setCartQuantity(
      productId,
      quantity
    );
  }

  function clearCart() {
    return cartActions.clearCart();
  }

  function updateCartHeader() {
    return cartUI.updateCartHeader();
  }

  function updateCartCount() {
    return cartUI.updateCartCount();
  }

  function formatPrice(price) {
    return utils.formatPrice(price);
  }


  /* =========================================================
     SEARCH API
  ========================================================= */

  function setupSearch() {
    if (!search || !search.setupSearch) {
      return;
    }

    search.setupSearch();
  }


  /* =========================================================
     LOCATION API
  ========================================================= */

  function openLocationModal() {
    if (
      locationUI &&
      typeof locationUI.openLocationModal === "function"
    ) {
      locationUI.openLocationModal();
    }
  }

  function closeLocationModal() {
    if (
      locationUI &&
      typeof locationUI.closeLocationModal === "function"
    ) {
      locationUI.closeLocationModal();
    }
  }

  function useCurrentLocation() {
    if (
      locationMap &&
      typeof locationMap.useCurrentLocation === "function"
    ) {
      return locationMap.useCurrentLocation();
    }
  }

  function searchLocation(query) {
    if (
      locationSearch &&
      typeof locationSearch.searchLocation === "function"
    ) {
      return locationSearch.searchLocation(query);
    }
  }

  function confirmMapLocation() {
    if (
      locationMap &&
      typeof locationMap.confirmMapLocation === "function"
    ) {
      return locationMap.confirmMapLocation();
    }
  }

  function saveDeliveryAddress() {
    if (
      locationAddress &&
      typeof locationAddress.saveDeliveryAddress === "function"
    ) {
      return locationAddress.saveDeliveryAddress();
    }
  }

  function getSavedAddresses() {
    if (
      savedAddresses &&
      typeof savedAddresses.getSavedAddresses === "function"
    ) {
      return savedAddresses.getSavedAddresses();
    }

    return [];
  }

  function selectSavedAddress(address) {
    if (
      savedAddresses &&
      typeof savedAddresses.selectSavedAddress === "function"
    ) {
      return savedAddresses.selectSavedAddress(address);
    }
  }

  function getSelectedLocation() {
    if (
      storage &&
      typeof storage.getStoredSelectedLocation === "function"
    ) {
      return storage.getStoredSelectedLocation();
    }

    return null;
  }


  /* =========================================================
     LOCATION INITIALIZATION
  ========================================================= */

  function initializeLocation() {
    if (
      locationCore &&
      typeof locationCore.initializeLocationSystem === "function"
    ) {
      locationCore.initializeLocationSystem();
    }

    if (
      locationSearch &&
      typeof locationSearch.setupLocationSearch === "function"
    ) {
      locationSearch.setupLocationSearch();
    }

    if (
      savedAddresses &&
      typeof savedAddresses.renderSavedAddresses === "function"
    ) {
      savedAddresses.renderSavedAddresses();
    }
  }


  /* =========================================================
     GLOBAL API
     
     Backward compatibility for existing ZynexCart pages.
  ========================================================= */

  window.getCart = getCart;
  window.saveCart = saveCart;

  window.getCartItemCount = getCartItemCount;
  window.getCartTotal = getCartTotal;

  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.changeCartQuantity = changeCartQuantity;
  window.setCartQuantity = setCartQuantity;
  window.clearCart = clearCart;

  window.updateCartHeader = updateCartHeader;
  window.updateCartCount = updateCartCount;

  window.formatPrice = formatPrice;

  window.setupSearch = setupSearch;

  window.openLocationModal = openLocationModal;
  window.closeLocationModal = closeLocationModal;
  window.useCurrentLocation = useCurrentLocation;
  window.searchLocation = searchLocation;
  window.confirmMapLocation = confirmMapLocation;
  window.saveDeliveryAddress = saveDeliveryAddress;

  window.getSavedAddresses = getSavedAddresses;
  window.selectSavedAddress = selectSavedAddress;

  window.getSelectedLocation = getSelectedLocation;


  /* =========================================================
     APPLICATION INITIALIZATION
  ========================================================= */

  function initializeApp() {
    if (!checkDependencies()) {
      return;
    }

    console.log(
      "ZynexCart: Initializing application..."
    );

    /* -------------------------
       CART
    ------------------------- */

    cartUI.initializeCartUI();


    /* -------------------------
       SEARCH
    ------------------------- */

    setupSearch();


    /* -------------------------
       LOCATION
    ------------------------- */

    initializeLocation();


    /* -------------------------
       CATEGORIES
    ------------------------- */

    if (
      window.ZynexCartCategoryUI &&
      typeof window.ZynexCartCategoryUI.renderCategories === "function"
    ) {
      window.ZynexCartCategoryUI.renderCategories();
    }


    /* -------------------------
       CART EVENT SYNC
    ------------------------- */

    if (events) {
      events.on(
        events.EVENTS.CART_UPDATED,
        function () {
          updateCartHeader();
        }
      );
    }


    /* -------------------------
       LOCATION EVENT SYNC
    ------------------------- */

    if (events) {
      events.on(
        events.EVENTS.LOCATION_UPDATED,
        function () {

          if (
            savedAddresses &&
            typeof savedAddresses.renderSavedAddresses ===
              "function"
          ) {
            savedAddresses.renderSavedAddresses();
          }
        }
      );
    }


    /* -------------------------
       FINAL HEADER SYNC
    ------------------------- */

    updateCartHeader();


    console.log(
      "ZynexCart: Application initialized successfully."
    );
  }


  /* =========================================================
     DOM READY
  ========================================================= */

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initializeApp,
      {
        once: true
      }
    );

  } else {

    initializeApp();

  }


  /* =========================================================
     DEBUG API
     
     Useful during development.
  ========================================================= */

  window.ZynexCartApp = {
    initializeApp,

    getCart,
    saveCart,
    getCartItemCount,
    getCartTotal,

    addToCart,
    removeFromCart,
    changeCartQuantity,
    setCartQuantity,
    clearCart,

    updateCartHeader,
    updateCartCount,

    formatPrice,

    setupSearch,

    openLocationModal,
    closeLocationModal,
    useCurrentLocation,
    searchLocation,
    confirmMapLocation,
    saveDeliveryAddress,

    getSavedAddresses,
    selectSavedAddress,
    getSelectedLocation
  };

})();
