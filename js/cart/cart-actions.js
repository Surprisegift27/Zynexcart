// ZYNEXCART — CART ACTIONS

(function () {
  "use strict";

  const cartCore = window.ZynexCartCart;

  if (!cartCore) {
    console.error("ZynexCart: Cart core module not loaded.");
    return;
  }

  /**
   * Add product to cart
   */
  function addToCart(product) {
    if (!product || product.id === undefined) {
      console.error("ZynexCart: Invalid product.");
      return;
    }

    const cart = cartCore.getCart();

    const existingItem = cart.find(
      item => String(item.id) === String(product.id)
    );

    if (existingItem) {
      existingItem.quantity =
        (Number(existingItem.quantity) || 0) + 1;
    } else {
      cart.push({
        ...product,
        quantity: 1
      });
    }

    cartCore.saveCart(cart);

    return cart;
  }

  /**
   * Remove product completely
   */
  function removeFromCart(productId) {
    const cart = cartCore.getCart();

    const updatedCart = cart.filter(
      item => String(item.id) !== String(productId)
    );

    cartCore.saveCart(updatedCart);

    return updatedCart;
  }

  /**
   * Increase or decrease product quantity
   */
  function changeCartQuantity(productId, change) {
    const cart = cartCore.getCart();

    const item = cart.find(
      product => String(product.id) === String(productId)
    );

    if (!item) {
      return cart;
    }

    const currentQuantity = Number(item.quantity) || 0;
    const quantityChange = Number(change) || 0;

    const newQuantity = currentQuantity + quantityChange;

    if (newQuantity <= 0) {
      return removeFromCart(productId);
    }

    item.quantity = newQuantity;

    cartCore.saveCart(cart);

    return cart;
  }

  /**
   * Set exact product quantity
   */
  function setCartQuantity(productId, quantity) {
    const cart = cartCore.getCart();

    const item = cart.find(
      product => String(product.id) === String(productId)
    );

    if (!item) {
      return cart;
    }

    const newQuantity = Math.max(
      0,
      Number(quantity) || 0
    );

    if (newQuantity === 0) {
      return removeFromCart(productId);
    }

    item.quantity = newQuantity;

    cartCore.saveCart(cart);

    return cart;
  }

  /**
   * Clear complete cart
   */
  function clearCart() {
    return cartCore.clearCart();
  }

  /**
   * Expose cart actions globally
   */
  window.ZynexCartCartActions = {
    addToCart,
    removeFromCart,
    changeCartQuantity,
    setCartQuantity,
    clearCart
  };
})();
