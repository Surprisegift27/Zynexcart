// ZYNEXCART — SAVED ADDRESSES

(function () {
  "use strict";

  const storage = window.ZynexCartStorage;
  const locationCore = window.ZynexCartLocation;
  const locationUI = window.ZynexCartLocationUI;
  const utils = window.ZynexCartUtils;

  if (!storage || !locationCore || !locationUI || !utils) {
    console.error(
      "ZynexCart: Saved address dependencies not loaded."
    );
    return;
  }

  /**
   * Get all saved addresses
   */
  function getSavedAddresses() {
    return storage.getStoredAddresses();
  }

  /**
   * Save all addresses
   */
  function saveSavedAddresses(addresses) {
    const safeAddresses =
      Array.isArray(addresses)
        ? addresses
        : [];

    storage.setStoredAddresses(
      safeAddresses
    );

    return safeAddresses;
  }

  /**
   * Render saved addresses
   */
  function renderSavedAddresses() {
    const elements =
      locationUI.getLocationElements();

    const container =
      elements.savedAddresses;

    if (!container) {
      return;
    }

    const addresses =
      getSavedAddresses();

    container.innerHTML = "";

    const section =
      document.getElementById(
        "savedAddressesSection"
      );

    if (!addresses.length) {
      if (section) {
        section.hidden = true;
      }

      return;
    }

    if (section) {
      section.hidden = false;
    }

    addresses.forEach(function (address) {
      const item =
        document.createElement("button");

      item.type = "button";
      item.className =
        "saved-address-item";

      item.dataset.addressId =
        address.id || "";

      const icon =
        getAddressTypeIcon(
          address.address_type
        );

      const title =
        address.address_type ||
        "Address";

      const addressText =
        address.full_address ||
        buildSavedAddressText(
          address
        );

      item.innerHTML = `
        <span
          class="saved-address-icon"
          aria-hidden="true"
        >
          ${icon}
        </span>

        <span
          class="saved-address-content"
        >
          <strong>
            ${utils.escapeHTML(title)}
          </strong>

          <small>
            ${utils.escapeHTML(addressText)}
          </small>
        </span>
      `;

      item.addEventListener(
        "click",
        function () {
          selectSavedAddress(address);
        }
      );

      container.appendChild(item);
    });
  }

  /**
   * Get address type icon
   */
  function getAddressTypeIcon(type) {
    const normalized =
      String(type || "")
        .toLowerCase();

    if (normalized === "work") {
      return "💼";
    }

    if (normalized === "other") {
      return "📍";
    }

    return "🏠";
  }

  /**
   * Build readable address
   */
  function buildSavedAddressText(
    address
  ) {
    return [
      address.house_number,
      address.building,
      address.area,
      address.landmark
        ? `Near ${address.landmark}`
        : "",
      address.city,
      address.state,
      address.pincode
    ]
      .filter(Boolean)
      .join(", ");
  }

  /**
   * Select saved address
   */
  function selectSavedAddress(address) {
    if (!address) {
      return;
    }

    const latitude =
      Number(address.latitude);

    const longitude =
      Number(address.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      locationUI.showLocationError(
        "This saved address has invalid location data."
      );

      return;
    }

    /**
     * Update current location state
     */
    locationCore.setCoordinates(
      latitude,
      longitude,
      address.accuracy_meters || null
    );

    locationCore.setAddress({
      displayName:
        address.full_address ||
        buildSavedAddressText(
          address
        ),

      latitude,
      longitude,

      accuracy:
        address.accuracy_meters ||
        null,

      placeId:
        address.place_id || "",

      city:
        address.city || "",

      state:
        address.state || "",

      postcode:
        address.pincode || "",

      houseNumber:
        address.house_number || "",

      building:
        address.building || "",

      area:
        address.area || "",

      landmark:
        address.landmark || ""
    });

    /**
     * Save selected location
     */
    locationCore.saveSelectedLocation({
      latitude,
      longitude,

      accuracy:
        address.accuracy_meters ||
        null,

      displayName:
        address.full_address ||
        buildSavedAddressText(
          address
        ),

      full_address:
        address.full_address ||
        buildSavedAddressText(
          address
        ),

      placeId:
        address.place_id || "",

      city:
        address.city || "",

      state:
        address.state || "",

      postcode:
        address.pincode || ""
    });

    /**
     * Update header
     */
    locationUI.updateHeaderLocation(
      locationCore.locationState.address
    );

    /**
     * Notify application
     */
    if (window.ZynexCartEvents) {
      window.ZynexCartEvents.emit(
        window.ZynexCartEvents.EVENTS
          .LOCATION_UPDATED,
        {
          address
        }
      );
    }

    /**
     * Close location modal
     */
    locationUI.closeLocationModal();
  }

  /**
   * Expose saved address module
   */
  window.ZynexCartSavedAddresses = {
    getSavedAddresses,
    saveSavedAddresses,
    renderSavedAddresses,
    getAddressTypeIcon,
    selectSavedAddress
  };
})();
