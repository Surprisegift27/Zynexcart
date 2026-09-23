// ZYNEXCART — CORE EVENTS

(function () {
  "use strict";

  /**
   * Dispatch a ZynexCart custom event
   */
  function emit(eventName, detail = {}) {
    document.dispatchEvent(
      new CustomEvent(eventName, {
        detail
      })
    );
  }

  /**
   * Listen for a ZynexCart custom event
   */
  function on(eventName, callback) {
    if (typeof callback !== "function") return;

    document.addEventListener(eventName, callback);
  }

  /**
   * Remove a ZynexCart event listener
   */
  function off(eventName, callback) {
    if (typeof callback !== "function") return;

    document.removeEventListener(eventName, callback);
  }

  /**
   * ZynexCart event names
   */
  const EVENTS = {
    CART_UPDATED: "zynexcart:cartUpdated",
    LOCATION_UPDATED: "zynexcart:locationUpdated",
    ADDRESS_UPDATED: "zynexcart:addressUpdated"
  };

  /**
   * Expose event system globally
   */
  window.ZynexCartEvents = {
    emit,
    on,
    off,
    EVENTS
  };
})();
