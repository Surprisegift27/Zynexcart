// ZYNEXCART — CORE UTILITIES

(function () {
  "use strict";

  /**
   * Format price in Indian Rupees
   */
  function formatPrice(price) {
    const amount = Number(price) || 0;

    return `₹${amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2
    })}`;
  }

  /**
   * Escape HTML to prevent unsafe HTML injection
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
   * Safely get a form field value
   */
  function getFormDataValue(formData, name) {
    if (!formData) return "";

    const value = formData.get(name);

    return typeof value === "string"
      ? value.trim()
      : value ?? "";
  }

  /**
   * Safely set a form field value
   */
  function setFormValue(form, name, value) {
    if (!form) return;

    const field = form.elements.namedItem(name);

    if (field) {
      field.value = value ?? "";
    }
  }

  /**
   * Dispatch a custom ZynexCart event
   */
  function dispatchZynexCartEvent(eventName, detail = {}) {
    document.dispatchEvent(
      new CustomEvent(eventName, {
        detail
      })
    );
  }

  /**
   * Check whether an element exists
   */
  function elementExists(element) {
    return Boolean(element);
  }

  /**
   * Safely parse JSON
   */
  function safeJSONParse(value, fallback = null) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  /**
   * Expose utilities globally
   */
  window.ZynexCartUtils = {
    formatPrice,
    escapeHTML,
    getFormDataValue,
    setFormValue,
    dispatchZynexCartEvent,
    elementExists,
    safeJSONParse
  };
})();
