// ZYNEXCART — CART UI

(function () {
  "use strict";

  const cartCore = window.ZynexCartCart;
  const utils = window.ZynexCartUtils;
  const events = window.ZynexCartEvents;

  if (!cartCore || !utils) {
    console.error("ZynexCart: Cart UI dependencies not loaded.");
    return;
  }

  /**
   * Update cart count and total in header
   */
  function updateCartHeader() {
    const count = cartCore.getCartItemCount();
    const total = cartCore.getCartTotal();

    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    if (cartCount) {
      cartCount.textContent = count;
    }

    if (cartTotal) {
      cartTotal.textContent = utils.formatPrice(total);
    }

    updateCartVisibility(count);
  }

  /**
   * Update cart count only
   */
  function updateCartCount() {
    const count = cartCore.getCartItemCount();

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
      cartCount.textContent = count;
    }

    updateCartVisibility(count);
  }

  /**
   * Show/hide cart quantity badge
   */
  function updateCartVisibility(count) {
    const cartCount = document.getElementById("cartCount");

    if (!cartCount) return;

    cartCount.hidden = Number(count) <= 0;
  }

  /**
   * Initialize cart UI
   */
  function initializeCartUI() {
    updateCartHeader();

    if (events) {
      events.on(
        events.EVENTS.CART_UPDATED,
        updateCartHeader
      );
    }

    window.addEventListener("storage", function (event) {
      if (
        event.key === "zynexcart_cart" ||
        event.key === null
      ) {
        updateCartHeader();
      }
    });
  }

  /**
   * Expose cart UI globally
   */
  window.ZynexCartCartUI = {
    updateCartHeader,
    updateCartCount,
    initializeCartUI
  };
})();
