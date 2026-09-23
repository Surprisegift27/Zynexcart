// ZYNEXCART — LOCATION ADDRESS

(function () {
  "use strict";

  const locationCore = window.ZynexCartLocation;
  const locationUI = window.ZynexCartLocationUI;
  const utils = window.ZynexCartUtils;

  if (!locationCore || !locationUI || !utils) {
    console.error(
      "ZynexCart: Location address dependencies not loaded."
    );
    return;
  }

  const state = locationCore.locationState;

  /**
   * Prefill delivery address form
   *
   * Important:
   * Header uses name="house"
   * We intentionally use "house" here.
   */
  function prefillAddressForm() {
    const elements =
      locationUI.getLocationElements();

    const form = elements.addressForm;

    if (!form || !state.address) {
      return;
    }

    const address = state.address;

    utils.setFormValue(
      form,
      "house",
      address.houseNumber || ""
    );

    utils.setFormValue(
      form,
      "building",
      address.building || ""
    );

    utils.setFormValue(
      form,
      "area",
      address.area ||
        address.road ||
        ""
    );

    utils.setFormValue(
      form,
      "city",
      address.city || ""
    );

    utils.setFormValue(
      form,
      "state",
      address.state || ""
    );

    utils.setFormValue(
      form,
      "landmark",
      address.landmark || ""
    );

    utils.setFormValue(
      form,
      "pincode",
      address.postcode || ""
    );

    utils.setFormValue(
      form,
      "deliveryInstructions",
      ""
    );

    const addressType =
      form.elements.namedItem(
        "addressType"
      );

    if (addressType) {
      const homeOption =
        form.querySelector(
          'input[name="addressType"][value="Home"]'
        );

      if (homeOption) {
        homeOption.checked = true;
      }
    }
  }

  /**
   * Save delivery address
   */
  function saveDeliveryAddress() {
    const elements =
      locationUI.getLocationElements();

    const form = elements.addressForm;

    if (!form) {
      return;
    }

    if (
      !Number.isFinite(
        Number(state.latitude)
      ) ||
      !Number.isFinite(
        Number(state.longitude)
      )
    ) {
      locationUI.showLocationError(
        "Please select your delivery location first."
      );

      return;
    }

    const formData =
      new FormData(form);

    const address = {
      id: `addr_${Date.now()}`,

      latitude:
        Number(state.latitude),

      longitude:
        Number(state.longitude),

      accuracy_meters:
        state.accuracy || null,

      place_id:
        state.address?.placeId || "",

      full_address:
        state.address?.displayName || "",

      house_number:
        utils.getFormDataValue(
          formData,
          "house"
        ),

      building:
        utils.getFormDataValue(
          formData,
          "building"
        ),

      area:
        utils.getFormDataValue(
          formData,
          "area"
        ),

      landmark:
        utils.getFormDataValue(
          formData,
          "landmark"
        ),

      city:
        utils.getFormDataValue(
          formData,
          "city"
        ) ||
        state.address?.city ||
        "",

      state:
        utils.getFormDataValue(
          formData,
          "state"
        ) ||
        state.address?.state ||
        "",

      pincode:
        utils.getFormDataValue(
          formData,
          "pincode"
        ) ||
        state.address?.postcode ||
        "",

      address_type:
        utils.getFormDataValue(
          formData,
          "addressType"
        ) || "Home",

      delivery_instructions:
        utils.getFormDataValue(
          formData,
          "deliveryInstructions"
        ),

      saved_at:
        new Date().toISOString()
    };

    /**
     * Validate important delivery fields
     */
    if (!address.city) {
      locationUI.showLocationError(
        "Please enter your city."
      );

      return;
    }

    if (!address.pincode) {
      locationUI.showLocationError(
        "Please enter your pincode."
      );

      return;
    }

    /**
     * Build readable full address
     */
    address.full_address =
      buildFullDeliveryAddress(
        address
      );

    /**
     * Get existing saved addresses
     */
    const savedAddresses =
      window.ZynexCartSavedAddresses
        ? window.ZynexCartSavedAddresses.getSavedAddresses()
        : [];

    /**
     * Add new address
     */
    savedAddresses.push(address);

    /**
     * Save address
     */
    if (
      window.ZynexCartSavedAddresses
    ) {
      window.ZynexCartSavedAddresses.saveSavedAddresses(
        savedAddresses
      );
    }

    /**
     * Save selected location
     */
    locationCore.saveSelectedLocation({
      latitude:
        address.latitude,

      longitude:
        address.longitude,

      accuracy:
        address.accuracy_meters,

      displayName:
        address.full_address,

      full_address:
        address.full_address,

      placeId:
        address.place_id,

      city:
        address.city,

      state:
        address.state,

      postcode:
        address.pincode
    });

    /**
     * Update current location state
     */
    locationCore.setAddress({
      ...state.address,

      displayName:
        address.full_address,

      latitude:
        address.latitude,

      longitude:
        address.longitude,

      placeId:
        address.place_id,

      city:
        address.city,

      state:
        address.state,

      postcode:
        address.pincode,

      houseNumber:
        address.house_number,

      area:
        address.area
    });

    /**
     * Update header
     */
    locationUI.updateHeaderLocation(
      locationCore.locationState.address
    );

    /**
     * Refresh saved address UI
     */
    if (
      window.ZynexCartSavedAddresses
    ) {
      window.ZynexCartSavedAddresses.renderSavedAddresses();
    }

    /**
     * Notify other modules
     */
    if (window.ZynexCartEvents) {
      window.ZynexCartEvents.emit(
        window.ZynexCartEvents.EVENTS
          .LOCATION_UPDATED,
        {
          address
        }
      );

      window.ZynexCartEvents.emit(
        window.ZynexCartEvents.EVENTS
          .ADDRESS_UPDATED,
        {
          address
        }
      );
    }

    /**
     * Close modal
     */
    locationUI.closeLocationModal();

    locationUI.showLocationSuccess(
      "Delivery location saved successfully."
    );

    return address;
  }

  /**
   * Build readable delivery address
   */
  function buildFullDeliveryAddress(
    address
  ) {
    const parts = [];

    if (address.house_number) {
      parts.push(
        address.house_number
      );
    }

    if (address.building) {
      parts.push(
        address.building
      );
    }

    if (address.area) {
      parts.push(
        address.area
      );
    }

    if (address.landmark) {
      parts.push(
        `Near ${address.landmark}`
      );
    }

    if (address.city) {
      parts.push(
        address.city
      );
    }

    if (address.state) {
      parts.push(
        address.state
      );
    }

    if (address.pincode) {
      parts.push(
        address.pincode
      );
    }

    return parts
      .filter(Boolean)
      .join(", ");
  }

  /**
   * Expose address module
   */
  window.ZynexCartLocationAddress = {
    prefillAddressForm,
    saveDeliveryAddress,
    buildFullDeliveryAddress
  };
})();
