// ZYNEXCART — LOCATION CORE

(function () {
  "use strict";

  const storage = window.ZynexCartStorage;

  if (!storage) {
    console.error("ZynexCart: Storage module not loaded.");
    return;
  }

  /**
   * Location configuration
   */
  const LOCATION_CONFIG = {
    defaultLatitude: 19.0760,
    defaultLongitude: 72.8777,

    geolocationOptions: {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    },

    searchDelay: 500,

    nominatimUrl:
      "https://nominatim.openstreetmap.org"
  };

  /**
   * Current location state
   */
  const locationState = {
    map: null,
    marker: null,

    latitude: null,
    longitude: null,
    accuracy: null,

    address: null,

    selectedSearchResult: null,

    searchTimer: null,

    leafletLoaded: false,

    isLoadingLocation: false
  };

  /**
   * Get location configuration
   */
  function getLocationConfig() {
    return LOCATION_CONFIG;
  }

  /**
   * Get current location state
   */
  function getLocationState() {
    return locationState;
  }

  /**
   * Set coordinates
   */
  function setCoordinates(
    latitude,
    longitude,
    accuracy = null
  ) {
    locationState.latitude = Number(latitude);
    locationState.longitude = Number(longitude);
    locationState.accuracy =
      accuracy !== null
        ? Number(accuracy)
        : null;
  }

  /**
   * Set normalized address
   */
  function setAddress(address) {
    locationState.address = address || null;
  }

  /**
   * Reset temporary location state
   */
  function resetLocationState() {
    locationState.map = null;
    locationState.marker = null;

    locationState.latitude = null;
    locationState.longitude = null;
    locationState.accuracy = null;

    locationState.address = null;

    locationState.selectedSearchResult = null;

    locationState.searchTimer = null;

    locationState.isLoadingLocation = false;
  }

  /**
   * Restore saved location from localStorage
   */
  function restoreSelectedLocation() {
    const savedLocation =
      storage.getStoredSelectedLocation();

    if (!savedLocation) {
      return null;
    }

    if (
      !Number.isFinite(Number(savedLocation.latitude)) ||
      !Number.isFinite(Number(savedLocation.longitude))
    ) {
      return null;
    }

    locationState.latitude =
      Number(savedLocation.latitude);

    locationState.longitude =
      Number(savedLocation.longitude);

    locationState.accuracy =
      savedLocation.accuracy ?? null;

    locationState.address = {
      displayName:
        savedLocation.displayName ||
        savedLocation.full_address ||
        "",

      latitude:
        Number(savedLocation.latitude),

      longitude:
        Number(savedLocation.longitude),

      accuracy:
        savedLocation.accuracy ?? null,

      placeId:
        savedLocation.placeId ||
        savedLocation.place_id ||
        "",

      city:
        savedLocation.city || "",

      state:
        savedLocation.state || "",

      postcode:
        savedLocation.postcode ||
        savedLocation.pincode ||
        ""
    };

    return locationState.address;
  }

  /**
   * Save current selected location
   */
  function saveSelectedLocation(address) {
    if (
      !address ||
      !Number.isFinite(Number(address.latitude)) ||
      !Number.isFinite(Number(address.longitude))
    ) {
      return false;
    }

    const selectedLocation = {
      latitude: Number(address.latitude),
      longitude: Number(address.longitude),

      accuracy:
        address.accuracy ??
        locationState.accuracy ??
        null,

      displayName:
        address.displayName ||
        address.full_address ||
        "",

      full_address:
        address.full_address ||
        address.displayName ||
        "",

      placeId:
        address.placeId ||
        address.place_id ||
        "",

      city:
        address.city || "",

      state:
        address.state || "",

      postcode:
        address.postcode ||
        address.pincode ||
        ""
    };

    storage.setStoredSelectedLocation(
      selectedLocation
    );

    return true;
  }

  /**
   * Initialize location system
   */
  function initializeLocationSystem() {
    restoreSelectedLocation();

    if (window.ZynexCartLocationUI) {
      window.ZynexCartLocationUI.updateHeaderLocation(
        locationState.address
      );
    }

    if (window.ZynexCartSavedAddresses) {
      window.ZynexCartSavedAddresses.renderSavedAddresses();
    }

    if (window.ZynexCartLocationUI) {
      window.ZynexCartLocationUI.setupLocationEvents();
    }
  }

  /**
   * Expose location core
   */
  window.ZynexCartLocation = {
    LOCATION_CONFIG,

    locationState,

    getLocationConfig,
    getLocationState,

    setCoordinates,
    setAddress,

    resetLocationState,

    restoreSelectedLocation,
    saveSelectedLocation,

    initializeLocationSystem
  };
})();
