// ZYNEXCART — CART CORE

(function () {
  "use strict";

  const storage = window.ZynexCartStorage;

  if (!storage) {
    console.error("ZynexCart: Storage module not loaded.");
    return;
  }

  /**
   * Get current cart
   */
  function getCart() {
    return storage.getStoredCart();
  }

  /**
   * Save cart
   */
  function saveCart(cart) {
    const safeCart = Array.isArray(cart) ? cart : [];

    storage.setStoredCart(safeCart);

    if (window.ZynexCartEvents) {
      window.ZynexCartEvents.emit(
        window.ZynexCartEvents.EVENTS.CART_UPDATED,
        {
          cart: safeCart
        }
      );
    }

    return safeCart;
  }

  /**
   * Get total quantity of all products
   */
  function getCartItemCount() {
    return getCart().reduce((total, item) => {
      return total + (Number(item.quantity) || 0);
    }, 0);
  }

  /**
   * Get total cart amount
   */
  function getCartTotal() {
    return getCart().reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;

      return total + price * quantity;
    }, 0);
  }

  /**
   * Clear complete cart
   */
  function clearCart() {
    return saveCart([]);
  }

  /**
   * Expose cart core
   */
  window.ZynexCartCart = {
    getCart,
    saveCart,
    getCartItemCount,
    getCartTotal,
    clearCart
  };
})();
