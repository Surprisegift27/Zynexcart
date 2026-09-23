/* =========================================================
   ZYNEXCART — STORAGE MODULE
   ========================================================= */

const CART_STORAGE_KEY = "zynexcart_cart";
const LOCATION_STORAGE_KEY = "zynexcart_selected_location";
const ADDRESS_STORAGE_KEY = "zynexcart_saved_addresses";


/* =========================================================
   CART STORAGE
   ========================================================= */

function getStoredCart() {

  try {

    const storedCart =
      localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart =
      JSON.parse(storedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.filter(item => {

      return (
        item &&
        item.id !== undefined &&
        Number(item.quantity) > 0
      );

    });

  } catch (error) {

    console.error(
      "ZynexCart: Unable to read cart.",
      error
    );

    return [];

  }

}


function setStoredCart(cart) {

  try {

    const validCart =
      Array.isArray(cart)
        ? cart.filter(item => {

            return (
              item &&
              item.id !== undefined &&
              Number(item.quantity) > 0
            );

          })
        : [];


    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(validCart)
    );

    return true;

  } catch (error) {

    console.error(
      "ZynexCart: Unable to save cart.",
      error
    );

    return false;

  }

}


function clearStoredCart() {

  try {

    localStorage.removeItem(
      CART_STORAGE_KEY
    );

    return true;

  } catch (error) {

    console.error(
      "ZynexCart: Unable to clear cart.",
      error
    );

    return false;

  }

}


/* =========================================================
   SAVED ADDRESS STORAGE
   ========================================================= */

function getStoredAddresses() {

  try {

    const stored =
      localStorage.getItem(
        ADDRESS_STORAGE_KEY
      );

    if (!stored) {
      return [];
    }

    const parsed =
      JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed
      : [];

  } catch (error) {

    console.error(
      "ZynexCart: Unable to read saved addresses.",
      error
    );

    return [];

  }

}


function setStoredAddresses(addresses) {

  try {

    localStorage.setItem(
      ADDRESS_STORAGE_KEY,
      JSON.stringify(
        Array.isArray(addresses)
          ? addresses
          : []
      )
    );

    return true;

  } catch (error) {

    console.error(
      "ZynexCart: Unable to save addresses.",
      error
    );

    return false;

  }

}


/* =========================================================
   SELECTED LOCATION STORAGE
   ========================================================= */

function getStoredSelectedLocation() {

  try {

    const stored =
      localStorage.getItem(
        LOCATION_STORAGE_KEY
      );

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);

  } catch (error) {

    console.error(
      "ZynexCart: Unable to read selected location.",
      error
    );

    return null;

  }

}


function setStoredSelectedLocation(address) {

  try {

    localStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify(address)
    );

    return true;

  } catch (error) {

    console.error(
      "ZynexCart: Unable to save selected location.",
      error
    );

    return false;

  }

}


/* =========================================================
   STORAGE EXPORTS
   ========================================================= */

window.ZynexCartStorage = {

  CART_STORAGE_KEY,

  LOCATION_STORAGE_KEY,

  ADDRESS_STORAGE_KEY,

  getStoredCart,
  setStoredCart,
  clearStoredCart,

  getStoredAddresses,
  setStoredAddresses,

  getStoredSelectedLocation,
  setStoredSelectedLocation

};
