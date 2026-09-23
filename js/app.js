/* =========================================================
   ZYNEXCART — MAIN APP
   Professional Cart + Delivery Location System
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const CART_STORAGE_KEY = "zynexcart_cart";
const LOCATION_STORAGE_KEY = "zynexcart_delivery_location";


/* =========================================================
   APP INITIALIZATION
========================================================= */

function initializeZynexCart() {

  updateCartHeader();

  setupSearch();

  setupLocationSystem();

  restoreSavedLocation();

}


/*
 * app.js dynamically load ho sakta hai.
 * Isliye DOMContentLoaded aur already-loaded
 * dono situations handle ki ja rahi hain.
 */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initializeZynexCart,
    { once: true }
  );

} else {

  initializeZynexCart();

}


/* =========================================================
   CART
========================================================= */


/* =========================================================
   GET CART
========================================================= */

function getCart() {

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


/* =========================================================
   SAVE CART
========================================================= */

function saveCart(cart) {

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


    updateCartHeader();


    document.dispatchEvent(
      new CustomEvent(
        "zynexcart:cartUpdated"
      )
    );

  } catch (error) {

    console.error(
      "ZynexCart: Unable to save cart.",
      error
    );

  }

}


/* =========================================================
   TOTAL ITEM QUANTITY
========================================================= */

function getCartItemCount() {

  const cart =
    getCart();

  return cart.reduce(
    (total, item) => {

      return total +
        Number(item.quantity || 0);

    },
    0
  );

}


/* =========================================================
   TOTAL CART AMOUNT
========================================================= */

function getCartTotal() {

  const cart =
    getCart();

  return cart.reduce(
    (total, item) => {

      return total +
        (
          Number(item.price || 0) *
          Number(item.quantity || 0)
        );

    },
    0
  );

}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }
  ).format(
    Number(price) || 0
  );

}


/* =========================================================
   UPDATE CART HEADER
========================================================= */

function updateCartHeader() {

  const itemCount =
    getCartItemCount();

  const totalAmount =
    getCartTotal();


  /* OLD CART COUNT */

  const cartCountElements =
    document.querySelectorAll(
      "#cartCount"
    );

  cartCountElements.forEach(
    element => {

      element.textContent =
        itemCount;

    }
  );


  /* HEADER ITEM TEXT */

  const cartItemsText =
    document.querySelectorAll(
      "#cartItemsText"
    );

  cartItemsText.forEach(
    element => {

      element.textContent =
        `${itemCount} ${
          itemCount === 1
            ? "item"
            : "items"
        }`;

    }
  );


  /* HEADER TOTAL */

  const cartTotalElements =
    document.querySelectorAll(
      "#cartTotal"
    );

  cartTotalElements.forEach(
    element => {

      element.textContent =
        formatPrice(totalAmount);

    }
  );


  /* CART SUMMARY */

  const cartSummaryElements =
    document.querySelectorAll(
      "#cartSummary"
    );

  cartSummaryElements.forEach(
    element => {

      element.textContent =
        `${itemCount} ${
          itemCount === 1
            ? "item"
            : "items"
        } • ${formatPrice(totalAmount)}`;

    }
  );

}


/* =========================================================
   UPDATE CART COUNT
========================================================= */

function updateCartCount() {

  updateCartHeader();

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

  const searchForm =
    document.querySelector(
      "#searchForm"
    );

  const searchInput =
    document.querySelector(
      "#searchInput"
    );


  if (
    !searchForm ||
    !searchInput
  ) {

    return;

  }


  if (
    searchForm.dataset.searchReady ===
    "true"
  ) {

    return;

  }


  searchForm.dataset.searchReady =
    "true";


  searchForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const searchTerm =
        searchInput.value.trim();


      if (!searchTerm) {
        return;
      }


      window.location.href =
        `products.html?search=${encodeURIComponent(
          searchTerm
        )}`;

    }
  );

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(product) {

  if (
    !product ||
    product.id === undefined
  ) {

    console.error(
      "ZynexCart: Invalid product.",
      product
    );

    return;

  }


  const cart =
    getCart();


  const existingProduct =
    cart.find(
      item =>
        String(item.id) ===
        String(product.id)
    );


  if (existingProduct) {

    existingProduct.quantity =
      Number(
        existingProduct.quantity || 0
      ) + 1;

  } else {

    cart.push({

      id: product.id,

      name:
        product.name || "",

      price:
        Number(product.price || 0),

      mrp:
        Number(product.mrp || 0),

      unit:
        product.unit || "",

      image:
        product.image || "",

      category:
        product.category || "",

      quantity: 1

    });

  }


  saveCart(cart);

}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(productId) {

  const cart =
    getCart();


  const updatedCart =
    cart.filter(
      item =>
        String(item.id) !==
        String(productId)
    );


  saveCart(updatedCart);

}


/* =========================================================
   CHANGE CART QUANTITY
========================================================= */

function changeCartQuantity(
  productId,
  change
) {

  const cart =
    getCart();


  const product =
    cart.find(
      item =>
        String(item.id) ===
        String(productId)
    );


  if (!product) {
    return;
  }


  product.quantity =
    Number(
      product.quantity || 0
    ) +
    Number(
      change || 0
    );


  if (
    product.quantity <= 0
  ) {

    removeFromCart(
      productId
    );

    return;

  }


  saveCart(cart);

}


/* =========================================================
   SET EXACT QUANTITY
========================================================= */

function setCartQuantity(
  productId,
  quantity
) {

  const cart =
    getCart();


  const product =
    cart.find(
      item =>
        String(item.id) ===
        String(productId)
    );


  if (!product) {
    return;
  }


  const newQuantity =
    Number(quantity);


  if (
    !Number.isFinite(
      newQuantity
    ) ||
    newQuantity <= 0
  ) {

    removeFromCart(
      productId
    );

    return;

  }


  product.quantity =
    newQuantity;


  saveCart(cart);

}


/* =========================================================
   CLEAR ENTIRE CART
========================================================= */

function clearCart() {

  localStorage.removeItem(
    CART_STORAGE_KEY
  );


  updateCartHeader();


  document.dispatchEvent(
    new CustomEvent(
      "zynexcart:cartUpdated"
    )
  );

}


/* =========================================================
   LOCAL STORAGE CART SYNC
========================================================= */

window.addEventListener(
  "storage",
  event => {

    if (
      event.key ===
      CART_STORAGE_KEY
    ) {

      updateCartHeader();


      document.dispatchEvent(
        new CustomEvent(
          "zynexcart:cartUpdated"
        )
      );

    }

  }
);


/* =========================================================
   CART UPDATE EVENT
========================================================= */

document.addEventListener(
  "zynexcart:cartUpdated",
  () => {

    updateCartHeader();

  }
);


/* =========================================================
   LOCATION SYSTEM
========================================================= */


/*
 * Current selected location.
 */

let zynexLocation = null;


/*
 * Leaflet map instance.
 */

let zynexMap = null;


/*
 * Map marker.
 */

let zynexMarker = null;


/*
 * Last selected coordinates.
 */

let zynexCoordinates = {
  latitude: null,
  longitude: null
};


/*
 * Prevent duplicate location setup.
 */

let locationSystemInitialized = false;


/* =========================================================
   SETUP LOCATION SYSTEM
========================================================= */

function setupLocationSystem() {

  if (locationSystemInitialized) {
    return;
  }


  const locationBtn =
    document.querySelector(
      "#locationBtn"
    );

  const locationModal =
    document.querySelector(
      "#locationModal"
    );


  if (
    !locationBtn ||
    !locationModal
  ) {

    return;

  }


  locationSystemInitialized =
    true;


  locationBtn.addEventListener(
    "click",
    openLocationModal
  );


  setupLocationModalEvents();

}


/* =========================================================
   LOCATION MODAL EVENTS
========================================================= */

function setupLocationModalEvents() {

  const backdrop =
    document.querySelector(
      "#locationModalBackdrop"
    );


  const closeBtn =
    document.querySelector(
      "#closeLocationModalBtn"
    );


  const backBtn =
    document.querySelector(
      "#locationBackBtn"
    );


  const useCurrentLocationBtn =
    document.querySelector(
      "#useCurrentLocationBtn"
    );


  const addNewAddressBtn =
    document.querySelector(
      "#addNewAddressBtn"
    );


  const mapCurrentLocationBtn =
    document.querySelector(
      "#mapCurrentLocationBtn"
    );


  const confirmLocationBtn =
    document.querySelector(
      "#confirmLocationBtn"
    );


  const saveAddressBtn =
    document.querySelector(
      "#saveAddressBtn"
    );


  const searchInput =
    document.querySelector(
      "#locationSearchInput"
    );


  const addressForm =
    document.querySelector(
      "#deliveryAddressForm"
    );


  if (backdrop) {

    backdrop.addEventListener(
      "click",
      closeLocationModal
    );

  }


  if (closeBtn) {

    closeBtn.addEventListener(
      "click",
      closeLocationModal
    );

  }


  if (backBtn) {

    backBtn.addEventListener(
      "click",
      () => {

        showLocationScreen(
          "locationHomeScreen"
        );

      }
    );

  }


  if (useCurrentLocationBtn) {

    useCurrentLocationBtn.addEventListener(
      "click",
      detectCurrentLocation
    );

  }


  if (addNewAddressBtn) {

    addNewAddressBtn.addEventListener(
      "click",
      () => {

        showLocationScreen(
          "locationMapScreen"
        );

        initializeLocationMap();

      }
    );

  }


  if (mapCurrentLocationBtn) {

    mapCurrentLocationBtn.addEventListener(
      "click",
      detectCurrentLocation
    );

  }


  if (confirmLocationBtn) {

    confirmLocationBtn.addEventListener(
      "click",
      confirmSelectedLocation
    );

  }


  if (saveAddressBtn) {

    saveAddressBtn.addEventListener(
      "click",
      saveDeliveryAddress
    );

  }


  if (addressForm) {

    addressForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        saveDeliveryAddress();

      }
    );

  }


  if (searchInput) {

    let searchTimeout = null;


    searchInput.addEventListener(
      "input",
      event => {

        const query =
          event.target.value.trim();


        clearTimeout(
          searchTimeout
        );


        if (query.length < 3) {

          clearLocationSearchResults();

          return;

        }


        searchTimeout =
          setTimeout(
            () => {

              searchLocation(
                query
              );

            },
            450
          );

      }
    );

  }


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        closeLocationModal();

      }

    }
  );

}


/* =========================================================
   OPEN LOCATION MODAL
========================================================= */

function openLocationModal() {

  const modal =
    document.querySelector(
      "#locationModal"
    );


  if (!modal) {
    return;
  }


  modal.classList.add(
    "is-open"
  );


  document.body.classList.add(
    "location-modal-open"
  );


  showLocationScreen(
    "locationHomeScreen"
  );


  loadSavedAddresses();


  setTimeout(
    () => {

      const input =
        document.querySelector(
          "#locationSearchInput"
        );

      if (input) {
        input.focus();
      }

    },
    150
  );

}


/* =========================================================
   CLOSE LOCATION MODAL
========================================================= */

function closeLocationModal() {

  const modal =
    document.querySelector(
      "#locationModal"
    );


  if (!modal) {
    return;
  }


  modal.classList.remove(
    "is-open"
  );


  document.body.classList.remove(
    "location-modal-open"
  );

}


/* =========================================================
   SHOW LOCATION SCREEN
========================================================= */

function showLocationScreen(
  screenId
) {

  const screens =
    document.querySelectorAll(
      ".location-screen"
    );


  screens.forEach(
    screen => {

      screen.hidden =
        screen.id !== screenId;

      screen.classList.toggle(
        "is-active",
        screen.id === screenId
      );

    }
  );

}


/* =========================================================
   LOAD LEAFLET
========================================================= */

function loadLeaflet() {

  return new Promise(
    (resolve, reject) => {

      if (
        window.L
      ) {

        resolve();

        return;

      }


      const existingScript =
        document.querySelector(
          'script[data-zynexcart-leaflet="true"]'
        );


      if (existingScript) {

        existingScript.addEventListener(
          "load",
          () => resolve()
        );

        existingScript.addEventListener(
          "error",
          () =>
            reject(
              new Error(
                "Unable to load map library."
              )
            )
        );

        return;

      }


      if (
        !document.querySelector(
          'link[data-zynexcart-leaflet="true"]'
        )
      ) {

        const stylesheet =
          document.createElement(
            "link"
          );

        stylesheet.rel =
          "stylesheet";

        stylesheet.href =
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

        stylesheet.dataset.zynexcartLeaflet =
          "true";

        document.head.appendChild(
          stylesheet
        );

      }


      const script =
        document.createElement(
          "script"
        );

      script.src =
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

      script.async =
        true;

      script.dataset.zynexcartLeaflet =
        "true";


      script.onload =
        () => resolve();


      script.onerror =
        () =>
          reject(
            new Error(
              "Unable to load Leaflet."
            )
          );


      document.head.appendChild(
        script
      );

    }
  );

}


/* =========================================================
   INITIALIZE MAP
========================================================= */

async function initializeLocationMap() {

  const mapContainer =
    document.querySelector(
      "#locationMapContainer"
    );


  if (!mapContainer) {
    return;
  }


  try {

    await loadLeaflet();


    /*
     * Agar map already bana hua hai,
     * sirf resize/update karo.
     */

    if (zynexMap) {

      setTimeout(
        () => {

          zynexMap.invalidateSize();

        },
        100
      );

      return;

    }


    /*
     * Default centre:
     * India.
     *
     * Actual user location baad mein
     * GPS se set hogi.
     */

    const defaultLatitude =
      20.5937;

    const defaultLongitude =
      78.9629;


    zynexMap =
      L.map(
        mapContainer,
        {
          zoomControl: true,
          attributionControl: true
        }
      ).setView(
        [
          defaultLatitude,
          defaultLongitude
        ],
        5
      );


    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; OpenStreetMap contributors'
      }
    ).addTo(
      zynexMap
    );


    /*
     * Create draggable marker.
     */

    zynexMarker =
      L.marker(
        [
          defaultLatitude,
          defaultLongitude
        ],
        {
          draggable: true
        }
      ).addTo(
        zynexMap
      );


    zynexMarker.on(
      "dragend",
      async () => {

        const position =
          zynexMarker.getLatLng();


        await updateCoordinates(
          position.lat,
          position.lng,
          true
        );

      }
    );


    /*
     * Clicking anywhere on map
     * moves delivery pin.
     */

    zynexMap.on(
      "click",
      async event => {

        const latitude =
          event.latlng.lat;

        const longitude =
          event.latlng.lng;


        moveMapMarker(
          latitude,
          longitude
        );


        await updateCoordinates(
          latitude,
          longitude,
          true
        );

      }
    );


    setTimeout(
      () => {

        zynexMap.invalidateSize();

      },
      150
    );


  } catch (error) {

    console.error(
      "ZynexCart: Map initialization failed.",
      error
    );

    showLocationError(
      "Map load nahi ho paaya. Please check your internet connection."
    );

  }

}


/* =========================================================
   MOVE MAP MARKER
========================================================= */

function moveMapMarker(
  latitude,
  longitude
) {

  if (
    !zynexMap ||
    !zynexMarker
  ) {

    return;

  }


  const position =
    [
      latitude,
      longitude
    ];


  zynexMarker.setLatLng(
    position
  );


  zynexMap.panTo(
    position
  );

}


/* =========================================================
   CURRENT LOCATION
========================================================= */

function detectCurrentLocation() {

  if (
    !navigator.geolocation
  ) {

    showLocationError(
      "Aapke browser mein location service available nahi hai."
    );

    return;

  }


  setLocationLoading(
    true
  );


  navigator.geolocation.getCurrentPosition(
    async position => {

      const latitude =
        position.coords.latitude;

      const longitude =
        position.coords.longitude;

      const accuracy =
        position.coords.accuracy;


      zynexCoordinates = {
        latitude,
        longitude
      };


      showLocationScreen(
        "locationMapScreen"
      );


      await initializeLocationMap();


      moveMapMarker(
        latitude,
        longitude
      );


      if (zynexMap) {

        zynexMap.setView(
          [
            latitude,
            longitude
          ],
          17
        );

      }


      await updateCoordinates(
        latitude,
        longitude,
        true,
        accuracy
      );


      setLocationLoading(
        false
      );

    },

    error => {

      console.error(
        "ZynexCart location error:",
        error
      );


      setLocationLoading(
        false
      );


      let message =
        "Location detect nahi ho paayi.";


      if (
        error.code ===
        error.PERMISSION_DENIED
      ) {

        message =
          "Location permission allow karke dobara try karein.";

      }


      if (
        error.code ===
        error.POSITION_UNAVAILABLE
      ) {

        message =
          "Current location available nahi hai.";

      }


      if (
        error.code ===
        error.TIMEOUT
      ) {

        message =
          "Location request timeout ho gaya. Dobara try karein.";

      }


      showLocationError(
        message
      );

    },

    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }

  );

}


/* =========================================================
   UPDATE COORDINATES
========================================================= */

async function updateCoordinates(
  latitude,
  longitude,
  reverseGeocode = true,
  accuracy = null
) {

  zynexCoordinates = {
    latitude,
    longitude
  };


  if (reverseGeocode) {

    await reverseGeocodeLocation(
      latitude,
      longitude,
      accuracy
    );

  }

}


/* =========================================================
   REVERSE GEOCODING
========================================================= */

async function reverseGeocodeLocation(
  latitude,
  longitude,
  accuracy = null
) {

  try {

    showMapAddressLoading(
      true
    );


    const url =
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
        latitude
      )}&lon=${encodeURIComponent(
        longitude
      )}&zoom=18&addressdetails=1`;


    const response =
      await fetch(
        url,
        {
          headers: {
            "Accept":
              "application/json"
          }
        }
      );


    if (
      !response.ok
    ) {

      throw new Error(
        "Reverse geocoding failed."
      );

    }


    const data =
      await response.json();


    const address =
      data.address || {};


    const readableAddress =
      data.display_name ||
      buildReadableAddress(
        address
      );


    zynexLocation = {

      latitude,

      longitude,

      accuracy_meters:
        Number.isFinite(
          Number(accuracy)
        )
          ? Number(accuracy)
          : null,

      address:
        readableAddress,

      city:
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        "",

      state:
        address.state ||
        "",

      pincode:
        address.postcode ||
        "",

      country:
        address.country ||
        "",

      place_id:
        data.place_id ||
        "",

      osm_type:
        data.osm_type ||
        "",

      osm_id:
        data.osm_id ||
        "",

      raw_address:
        address

    };


    updateDetectedLocationUI(
      zynexLocation
    );


    updateConfirmedLocationUI(
      zynexLocation
    );


    setLocationLoading(
      false
    );


  } catch (error) {

    console.error(
      "ZynexCart: Reverse geocoding failed.",
      error
    );


    /*
     * Coordinates still remain usable
     * even if address lookup fails.
     */

    zynexLocation = {

      latitude,

      longitude,

      accuracy_meters:
        Number.isFinite(
          Number(accuracy)
        )
          ? Number(accuracy)
          : null,

      address:
        `${latitude.toFixed(
          6
        )}, ${longitude.toFixed(
          6
        )}`,

      city: "",

      state: "",

      pincode: "",

      country: "",

      place_id: "",

      raw_address: {}

    };


    updateDetectedLocationUI(
      zynexLocation
    );


    updateConfirmedLocationUI(
      zynexLocation
    );


    setLocationLoading(
      false
    );


  } finally {

    showMapAddressLoading(
      false
    );

  }

}


/* =========================================================
   BUILD READABLE ADDRESS
========================================================= */

function buildReadableAddress(
  address
) {

  return [
    address.house_number,
    address.road,
    address.neighbourhood,
    address.suburb,
    address.city ||
      address.town ||
      address.village,
    address.state,
    address.postcode
  ]
    .filter(Boolean)
    .join(", ");

}


/* =========================================================
   DETECTED LOCATION UI
========================================================= */

function updateDetectedLocationUI(
  location
) {

  const card =
    document.querySelector(
      "#detectedLocationCard"
    );


  if (!card) {
    return;
  }


  const title =
    card.querySelector(
      ".detected-location-title"
    );


  const address =
    card.querySelector(
      ".detected-location-address"
    );


  const accuracy =
    card.querySelector(
      ".detected-location-accuracy"
    );


  if (title) {

    title.textContent =
      getLocationTitle(
        location
      );

  }


  if (address) {

    address.textContent =
      location.address ||
      "Location selected";

  }


  if (
    accuracy &&
    location.accuracy_meters
  ) {

    accuracy.textContent =
      `Location accuracy: approximately ${Math.round(
        location.accuracy_meters
      )} m`;

  }


  card.hidden =
    false;

}


/* =========================================================
   LOCATION TITLE
========================================================= */

function getLocationTitle(
  location
) {

  return (
    location.city ||
    location.raw_address?.suburb ||
    location.raw_address?.neighbourhood ||
    "Selected Location"
  );

}


/* =========================================================
   CONFIRMED LOCATION UI
========================================================= */

function updateConfirmedLocationUI(
  location
) {

  const box =
    document.querySelector(
      "#confirmedLocationBox"
    );


  if (!box) {
    return;
  }


  const address =
    box.querySelector(
      ".confirmed-location-address"
    );


  if (address) {

    address.textContent =
      location.address ||
      "Location selected";

  }


  box.hidden =
    false;

}


/* =========================================================
   CONFIRM LOCATION
========================================================= */

function confirmSelectedLocation() {

  if (
    !zynexLocation ||
    !Number.isFinite(
      Number(
        zynexLocation.latitude
      )
    ) ||
    !Number.isFinite(
      Number(
        zynexLocation.longitude
      )
    )
  ) {

    showLocationError(
      "Please map par apni delivery location select karein."
    );

    return;

  }


  populateAddressForm(
    zynexLocation
  );


  showLocationScreen(
    "locationAddressScreen"
  );

}


/* =========================================================
   POPULATE ADDRESS FORM
========================================================= */

function populateAddressForm(
  location
) {

  const pincodeInput =
    document.querySelector(
      "#addressPincode"
    );


  if (
    pincodeInput &&
    location.pincode
  ) {

    pincodeInput.value =
      location.pincode;

  }


  const areaInput =
    document.querySelector(
      "#addressArea"
    );


  if (
    areaInput &&
    location.raw_address
  ) {

    areaInput.value =
      [
        location.raw_address.road,
        location.raw_address.neighbourhood,
        location.raw_address.suburb
      ]
        .filter(Boolean)
        .join(", ");

  }


  const cityInput =
    document.querySelector(
      "#addressCity"
    );


  if (
    cityInput &&
    location.city
  ) {

    cityInput.value =
      location.city;

  }


  const stateInput =
    document.querySelector(
      "#addressState"
    );


  if (
    stateInput &&
    location.state
  ) {

    stateInput.value =
      location.state;

  }

}


/* =========================================================
   SAVE DELIVERY ADDRESS
========================================================= */

function saveDeliveryAddress() {

  if (
    !zynexLocation
  ) {

    showLocationError(
      "Pehle delivery location select karein."
    );

    return;

  }


  const getValue =
    selector => {

      const element =
        document.querySelector(
          selector
        );

      return element
        ? element.value.trim()
        : "";

    };


  const house =
    getValue(
      "#addressHouse"
    );


  const building =
    getValue(
      "#addressBuilding"
    );


  const area =
    getValue(
      "#addressArea"
    );


  const landmark =
    getValue(
      "#addressLandmark"
    );


  const pincode =
    getValue(
      "#addressPincode"
    );


  const city =
    getValue(
      "#addressCity"
    ) ||
    zynexLocation.city ||
    "";


  const state =
    getValue(
      "#addressState"
    ) ||
    zynexLocation.state ||
    "";


  const instructions =
    getValue(
      "#deliveryInstructions"
    );


  const selectedType =
    document.querySelector(
      'input[name="addressType"]:checked'
    );


  const addressType =
    selectedType
      ? selectedType.value
      : "Home";


  /*
   * Basic validation.
   */

  if (!house) {

    showLocationError(
      "House / Flat / Shop number enter karein."
    );

    focusElement(
      "#addressHouse"
    );

    return;

  }


  if (!area) {

    showLocationError(
      "Area / Road enter karein."
    );

    focusElement(
      "#addressArea"
    );

    return;

  }


  if (
    pincode &&
    !/^\d{6}$/.test(
      pincode
    )
  ) {

    showLocationError(
      "Please valid 6-digit pincode enter karein."
    );

    focusElement(
      "#addressPincode"
    );

    return;

  }


  const fullAddress =
    [
      house,
      building,
      area,
      landmark
    ]
      .filter(Boolean)
      .join(", ");


  const savedAddress = {

    id:
      `address_${Date.now()}`,

    type:
      addressType,

    house:
      house,

    building:
      building,

    area:
      area,

    landmark:
      landmark,

    city:
      city,

    state:
      state,

    pincode:
      pincode ||
      zynexLocation.pincode ||
      "",

    full_address:
      fullAddress,

    latitude:
      zynexLocation.latitude,

    longitude:
      zynexLocation.longitude,

    accuracy_meters:
      zynexLocation.accuracy_meters ||
      null,

    place_id:
      zynexLocation.place_id ||
      "",

    plus_code:
      zynexLocation.plus_code ||
      "",

    detected_address:
      zynexLocation.address ||
      "",

    delivery_instructions:
      instructions,

    created_at:
      new Date().toISOString()

  };


  saveAddressToStorage(
    savedAddress
  );


  /*
   * Make this address the
   * active delivery location.
   */

  saveActiveLocation(
    savedAddress
  );


  updateHeaderLocation(
    savedAddress
  );


  closeLocationModal();


  showLocationSuccess();

}


/* =========================================================
   SAVE ADDRESS TO STORAGE
========================================================= */

function saveAddressToStorage(
  address
) {

  try {

    const stored =
      localStorage.getItem(
        LOCATION_STORAGE_KEY
      );


    let addresses = [];


    if (stored) {

      const parsed =
        JSON.parse(
          stored
        );


      if (
        Array.isArray(parsed)
      ) {

        addresses =
          parsed;

      }

    }


    /*
     * Newest address first.
     */

    addresses =
      [
        address,
        ...addresses.filter(
          item =>
            item &&
            item.id !==
              address.id
        )
      ];


    /*
     * Keep last 10 addresses.
     */

    addresses =
      addresses.slice(
        0,
        10
      );


    localStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify(
        addresses
      )
    );


  } catch (error) {

    console.error(
      "ZynexCart: Unable to save address.",
      error
    );

  }

}


/* =========================================================
   SAVE ACTIVE LOCATION
========================================================= */

function saveActiveLocation(
  address
) {

  try {

    localStorage.setItem(
      `${LOCATION_STORAGE_KEY}_active`,
      JSON.stringify(
        address
      )
    );

  } catch (error) {

    console.error(
      "ZynexCart: Unable to save active location.",
      error
    );

  }

}


/* =========================================================
   GET SAVED ADDRESSES
========================================================= */

function getSavedAddresses() {

  try {

    const stored =
      localStorage.getItem(
        LOCATION_STORAGE_KEY
      );


    if (!stored) {
      return [];
    }


    const parsed =
      JSON.parse(
        stored
      );


    return Array.isArray(
      parsed
    )
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


/* =========================================================
   RESTORE ACTIVE LOCATION
========================================================= */

function restoreSavedLocation() {

  try {

    const stored =
      localStorage.getItem(
        `${LOCATION_STORAGE_KEY}_active`
      );


    if (!stored) {
      return;
    }


    const activeLocation =
      JSON.parse(
        stored
      );


    if (
      !activeLocation
    ) {

      return;

    }


    updateHeaderLocation(
      activeLocation
    );


  } catch (error) {

    console.error(
      "ZynexCart: Unable to restore location.",
      error
    );

  }

}


/* =========================================================
   LOAD SAVED ADDRESSES
========================================================= */

function loadSavedAddresses() {

  const container =
    document.querySelector(
      "#savedAddressesList"
    );


  if (!container) {
    return;
  }


  const addresses =
    getSavedAddresses();


  container.innerHTML =
    "";


  if (
    addresses.length === 0
  ) {

    container.hidden =
      true;

    return;

  }


  container.hidden =
    false;


  addresses.forEach(
    address => {

      const item =
        document.createElement(
          "button"
        );


      item.type =
        "button";

      item.className =
        "saved-address-item";


      const title =
        document.createElement(
          "strong"
        );


      title.textContent =
        address.type ||
        "Address";


      const text =
        document.createElement(
          "span"
        );


      text.textContent =
        address.full_address ||
        address.detected_address ||
        "Saved location";


      item.appendChild(
        title
      );

      item.appendChild(
        text
      );


      item.addEventListener(
        "click",
        () => {

          selectSavedAddress(
            address
          );

        }
      );


      container.appendChild(
        item
      );

    }
  );

}


/* =========================================================
   SELECT SAVED ADDRESS
========================================================= */

function selectSavedAddress(
  address
) {

  if (!address) {
    return;
  }


  saveActiveLocation(
    address
  );


  updateHeaderLocation(
    address
  );


  closeLocationModal();


  showLocationSuccess();

}


/* =========================================================
   UPDATE HEADER LOCATION
========================================================= */

function updateHeaderLocation(
  address
) {

  const elements =
    document.querySelectorAll(
      "#locationText"
    );


  const text =
    getShortLocationText(
      address
    );


  elements.forEach(
    element => {

      element.textContent =
        text;

    }
  );

}


/* =========================================================
   SHORT LOCATION TEXT
========================================================= */

function getShortLocationText(
  address
) {

  if (
    address.city
  ) {

    return address.city;

  }


  if (
    address.area
  ) {

    return address.area;

  }


  if (
    address.full_address
  ) {

    const parts =
      address.full_address
        .split(",");

    return (
      parts[0] ||
      "Location selected"
    ).trim();

  }


  return "Enter location";

}


/* =========================================================
   SEARCH LOCATION
========================================================= */

async function searchLocation(
  query
) {

  try {

    showLocationSearchLoading(
      true
    );


    const url =
      `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
        query
      )}&countrycodes=in&addressdetails=1&limit=5`;


    const response =
      await fetch(
        url,
        {
          headers: {
            "Accept":
              "application/json"
          }
        }
      );


    if (
      !response.ok
    ) {

      throw new Error(
        "Location search failed."
      );

    }


    const results =
      await response.json();


    renderLocationSearchResults(
      results
    );


  } catch (error) {

    console.error(
      "ZynexCart: Location search failed.",
      error
    );


    showLocationError(
      "Location search temporarily available nahi hai."
    );

  } finally {

    showLocationSearchLoading(
      false
    );

  }

}


/* =========================================================
   RENDER LOCATION SEARCH RESULTS
========================================================= */

function renderLocationSearchResults(
  results
) {

  const container =
    document.querySelector(
      "#locationSearchResults"
    );


  if (!container) {
    return;
  }


  container.innerHTML =
    "";


  if (
    !Array.isArray(results) ||
    results.length === 0
  ) {

    container.innerHTML =
      `
        <div class="location-search-empty">
          No location found
        </div>
      `;

    return;

  }


  results.forEach(
    result => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";

      button.className =
        "location-search-result";


      const title =
        document.createElement(
          "strong"
        );


      const resultAddress =
        result.address || {};


      title.textContent =
        resultAddress.city ||
        resultAddress.town ||
        resultAddress.village ||
        resultAddress.suburb ||
        "Location";


      const description =
        document.createElement(
          "span"
        );


      description.textContent =
        result.display_name ||
        "";


      button.appendChild(
        title
      );

      button.appendChild(
        description
      );


      button.addEventListener(
        "click",
        async () => {

          const latitude =
            Number(
              result.lat
            );

          const longitude =
            Number(
              result.lon
            );


          showLocationScreen(
            "locationMapScreen"
          );


          await initializeLocationMap();


          moveMapMarker(
            latitude,
            longitude
          );


          if (zynexMap) {

            zynexMap.setView(
              [
                latitude,
                longitude
              ],
              17
            );

          }


          await updateCoordinates(
            latitude,
            longitude,
            true
          );

        }
      );


      container.appendChild(
        button
      );

    }
  );

}


/* =========================================================
   CLEAR SEARCH RESULTS
========================================================= */

function clearLocationSearchResults() {

  const container =
    document.querySelector(
      "#locationSearchResults"
    );


  if (container) {

    container.innerHTML =
      "";

  }

}


/* =========================================================
   LOADING STATES
========================================================= */

function setLocationLoading(
  loading
) {

  const buttons =
    document.querySelectorAll(
      "#useCurrentLocationBtn, #mapCurrentLocationBtn"
    );


  buttons.forEach(
    button => {

      button.disabled =
        loading;


      button.classList.toggle(
        "is-loading",
        loading
      );

    }
  );

}


function showMapAddressLoading(
  loading
) {

  const card =
    document.querySelector(
      "#detectedLocationCard"
    );


  if (!card) {
    return;
  }


  card.classList.toggle(
    "is-loading",
    loading
  );

}


function showLocationSearchLoading(
  loading
) {

  const container =
    document.querySelector(
      "#locationSearchResults"
    );


  if (!container) {
    return;
  }


  if (loading) {

    container.innerHTML =
      `
        <div class="location-search-loading">
          Searching location...
        </div>
      `;

  }

}


/* =========================================================
   ERROR MESSAGE
========================================================= */

function showLocationError(
  message
) {

  /*
   * Prefer an existing UI element
   * if header.html contains one.
   */

  const existing =
    document.querySelector(
      "#locationError"
    );


  if (existing) {

    existing.textContent =
      message;

    existing.hidden =
      false;


    setTimeout(
      () => {

        existing.hidden =
          true;

      },
      4000
    );


    return;

  }


  /*
   * Fallback professional toast.
   */

  let toast =
    document.querySelector(
      ".zynexcart-location-toast"
    );


  if (!toast) {

    toast =
      document.createElement(
        "div"
      );


    toast.className =
      "zynexcart-location-toast";


    document.body.appendChild(
      toast
    );

  }


  toast.textContent =
    message;


  toast.classList.add(
    "is-visible"
  );


  clearTimeout(
    toast._hideTimer
  );


  toast._hideTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "is-visible"
        );

      },
      4000
    );

}


/* =========================================================
   SUCCESS MESSAGE
========================================================= */

function showLocationSuccess() {

  let toast =
    document.querySelector(
      ".zynexcart-location-toast"
    );


  if (!toast) {

    toast =
      document.createElement(
        "div"
      );


    toast.className =
      "zynexcart-location-toast";


    document.body.appendChild(
      toast
    );

  }


  toast.textContent =
    "Delivery location saved successfully.";


  toast.classList.add(
    "is-success",
    "is-visible"
  );


  clearTimeout(
    toast._hideTimer
  );


  toast._hideTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "is-visible",
          "is-success"
        );

      },
      3000
    );

}


/* =========================================================
   FOCUS ELEMENT
========================================================= */

function focusElement(
  selector
) {

  const element =
    document.querySelector(
      selector
    );


  if (element) {

    element.focus();

  }

}


/* =========================================================
   GLOBAL LOCATION FUNCTIONS
========================================================= */

window.openLocationModal =
  openLocationModal;

window.closeLocationModal =
  closeLocationModal;

window.getSavedAddresses =
  getSavedAddresses;

window.restoreSavedLocation =
  restoreSavedLocation;


/* =========================================================
   GLOBAL CART FUNCTIONS
========================================================= */

window.getCart =
  getCart;

window.saveCart =
  saveCart;

window.addToCart =
  addToCart;

window.removeFromCart =
  removeFromCart;

window.changeCartQuantity =
  changeCartQuantity;

window.setCartQuantity =
  setCartQuantity;

window.clearCart =
  clearCart;

window.getCartItemCount =
  getCartItemCount;

window.getCartTotal =
  getCartTotal;

window.formatPrice =
  formatPrice;

window.updateCartHeader =
  updateCartHeader;

window.updateCartCount =
  updateCartCount;
