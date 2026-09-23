/* =========================================================
   ZYNEXCART — MAIN APP
   Professional Cart + Delivery Location System
   ========================================================= */


/* =========================================================
   STORAGE KEYS
   ========================================================= */

const CART_STORAGE_KEY = "zynexcart_cart";
const LOCATION_STORAGE_KEY = "zynexcart_selected_location";
const ADDRESS_STORAGE_KEY = "zynexcart_saved_addresses";


/* =========================================================
   LOCATION CONFIG
   ========================================================= */

const LOCATION_CONFIG = {
  defaultLatitude: 19.0760,
  defaultLongitude: 72.8777,

  geolocationOptions: {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  },

  searchDelay: 500,

  nominatimUrl: "https://nominatim.openstreetmap.org"
};


/* =========================================================
   APP INITIALIZATION
   ========================================================= */

function initializeZynexCart() {

  updateCartHeader();

  setupSearch();

  initializeLocationSystem();

}


/* =========================================================
   DOM READY
   ========================================================= */

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


/* -------------------------
   GET CART
------------------------- */

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


/* -------------------------
   SAVE CART
------------------------- */

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


/* -------------------------
   CART ITEM COUNT
------------------------- */

function getCartItemCount() {

  return getCart().reduce(
    (total, item) => {

      return total +
        Number(item.quantity || 0);

    },
    0
  );

}


/* -------------------------
   CART TOTAL
------------------------- */

function getCartTotal() {

  return getCart().reduce(
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


/* -------------------------
   FORMAT PRICE
------------------------- */

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


/* -------------------------
   UPDATE CART HEADER
------------------------- */

function updateCartHeader() {

  const itemCount =
    getCartItemCount();

  const totalAmount =
    getCartTotal();


  document
    .querySelectorAll("#cartCount")
    .forEach(element => {

      element.textContent =
        itemCount;

    });


  document
    .querySelectorAll("#cartItemsText")
    .forEach(element => {

      element.textContent =
        `${itemCount} ${
          itemCount === 1
            ? "item"
            : "items"
        }`;

    });


  document
    .querySelectorAll("#cartTotal")
    .forEach(element => {

      element.textContent =
        formatPrice(totalAmount);

    });


  document
    .querySelectorAll("#cartSummary")
    .forEach(element => {

      element.textContent =
        `${itemCount} ${
          itemCount === 1
            ? "item"
            : "items"
        } • ${formatPrice(totalAmount)}`;

    });

}


/* -------------------------
   UPDATE CART COUNT
------------------------- */

function updateCartCount() {

  updateCartHeader();

}


/* -------------------------
   ADD TO CART
------------------------- */

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


/* -------------------------
   REMOVE FROM CART
------------------------- */

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


/* -------------------------
   CHANGE QUANTITY
------------------------- */

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


/* -------------------------
   SET QUANTITY
------------------------- */

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
    !Number.isFinite(newQuantity) ||
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


/* -------------------------
   CLEAR CART
------------------------- */

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


/* -------------------------
   CART STORAGE SYNC
------------------------- */

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


/* -------------------------
   CART EVENT
------------------------- */

document.addEventListener(
  "zynexcart:cartUpdated",
  () => {

    updateCartHeader();

  }
);


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
   LOCATION SYSTEM
   ========================================================= */


/* =========================================================
   LOCATION ELEMENTS
   ========================================================= */

function getLocationElements() {

  return {

    button:
      document.querySelector(
        "#locationBtn"
      ),

    text:
      document.querySelector(
        "#locationText"
      ) ||
      document.querySelector(
        ".location-text"
      ),

    modal:
      document.querySelector(
        "#locationModal"
      ),

    backdrop:
      document.querySelector(
        "#locationModalBackdrop"
      ),

    close:
      document.querySelector(
        "#locationCloseBtn"
      ) ||
      document.querySelector(
        "#closeLocationModal"
      ),

    back:
      document.querySelector(
        "#locationBackBtn"
      ),

    homeScreen:
      document.querySelector(
        "#locationHomeScreen"
      ),

    mapScreen:
      document.querySelector(
        "#locationMapScreen"
      ),

    addressScreen:
      document.querySelector(
        "#locationAddressScreen"
      ),

    searchInput:
      document.querySelector(
        "#locationSearchInput"
      ),

    currentLocationBtn:
      document.querySelector(
        "#useCurrentLocationBtn"
      ),

    addAddressBtn:
      document.querySelector(
        "#addNewAddressBtn"
      ),

    confirmLocationBtn:
      document.querySelector(
        "#confirmLocationBtn"
      ),

    saveAddressBtn:
      document.querySelector(
        "#saveAddressBtn"
      ),

    mapContainer:
      document.querySelector(
        "#locationMapContainer"
      ),

    mapPlaceholder:
      document.querySelector(
        "#locationMapPlaceholder"
      ),

    mapCurrentLocationBtn:
      document.querySelector(
        "#mapCurrentLocationBtn"
      ),

    detectedLocationCard:
      document.querySelector(
        "#detectedLocationCard"
      ),

    detectedLocationTitle:
      document.querySelector(
        "#detectedLocationTitle"
      ),

    detectedLocationAddress:
      document.querySelector(
        "#detectedLocationAddress"
      ),

    confirmedLocation:
      document.querySelector(
        "#confirmedLocation"
      ),

    confirmedLocationText:
      document.querySelector(
        "#confirmedLocationText"
      ),

    addressForm:
      document.querySelector(
        "#deliveryAddressForm"
      ),

    savedAddresses:
      document.querySelector(
        "#savedAddresses"
      ),

    searchResults:
      document.querySelector(
        "#locationSearchResults"
      )

  };

}


/* =========================================================
   LOCATION STATE
   ========================================================= */

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


/* =========================================================
   INITIALIZE LOCATION
   ========================================================= */

function initializeLocationSystem() {

  const elements =
    getLocationElements();


  if (!elements.button) {
    return;
  }


  setupLocationEvents();

  restoreSelectedLocation();

  renderSavedAddresses();

}


/* =========================================================
   LOCATION EVENTS
   ========================================================= */

function setupLocationEvents() {

  const elements =
    getLocationElements();


  /* -------------------------
     OPEN LOCATION
  ------------------------- */

  if (elements.button) {

    elements.button.addEventListener(
      "click",
      event => {

        event.preventDefault();

        openLocationModal();

      }
    );

  }


  /* -------------------------
     CLOSE
  ------------------------- */

  if (elements.close) {

    elements.close.addEventListener(
      "click",
      closeLocationModal
    );

  }


  if (elements.backdrop) {

    elements.backdrop.addEventListener(
      "click",
      closeLocationModal
    );

  }


  /* -------------------------
     ESCAPE
  ------------------------- */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        elements.modal &&
        elements.modal.classList.contains(
          "is-open"
        )
      ) {

        closeLocationModal();

      }

    }
  );


  /* -------------------------
     CURRENT LOCATION
  ------------------------- */

  if (elements.currentLocationBtn) {

    elements.currentLocationBtn.addEventListener(
      "click",
      () => {

        useCurrentLocation();

      }
    );

  }


  /* -------------------------
     MAP CURRENT LOCATION
  ------------------------- */

  if (elements.mapCurrentLocationBtn) {

    elements.mapCurrentLocationBtn.addEventListener(
      "click",
      () => {

        useCurrentLocation();

      }
    );

  }


  /* -------------------------
     ADD NEW ADDRESS
  ------------------------- */

  if (elements.addAddressBtn) {

    elements.addAddressBtn.addEventListener(
      "click",
      () => {

        openMapScreen();

      }
    );

  }


  /* -------------------------
     CONFIRM MAP LOCATION
  ------------------------- */

  if (elements.confirmLocationBtn) {

    elements.confirmLocationBtn.addEventListener(
      "click",
      () => {

        confirmMapLocation();

      }
    );

  }


  /* -------------------------
     SAVE ADDRESS
  ------------------------- */

  if (elements.saveAddressBtn) {

    elements.saveAddressBtn.addEventListener(
      "click",
      saveDeliveryAddress
    );

  }


  /* -------------------------
     ADDRESS FORM SUBMIT
  ------------------------- */

  if (elements.addressForm) {

    elements.addressForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        saveDeliveryAddress();

      }
    );

  }


  /* -------------------------
     LOCATION BACK
  ------------------------- */

  if (elements.back) {

    elements.back.addEventListener(
      "click",
      () => {

        showLocationScreen(
          "home"
        );

      }
    );

  }


  /* -------------------------
     SEARCH
  ------------------------- */

  if (elements.searchInput) {

    elements.searchInput.addEventListener(
      "input",
      () => {

        clearTimeout(
          locationState.searchTimer
        );


        const query =
          elements.searchInput.value.trim();


        if (query.length < 3) {

          clearLocationSearchResults();

          return;

        }


        locationState.searchTimer =
          setTimeout(
            () => {

              searchLocation(query);

            },
            LOCATION_CONFIG.searchDelay
          );

      }
    );


    elements.searchInput.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter"
        ) {

          event.preventDefault();

          const query =
            elements.searchInput.value.trim();


          if (
            query.length >= 3
          ) {

            searchLocation(
              query
            );

          }

        }

      }
    );

  }

}


/* =========================================================
   OPEN MODAL
   ========================================================= */

function openLocationModal() {

  const elements =
    getLocationElements();


  if (!elements.modal) {
    return;
  }


  elements.modal.classList.add(
    "is-open"
  );


  elements.modal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "location-modal-open"
  );


  showLocationScreen(
    "home"
  );


  renderSavedAddresses();


  setTimeout(
    () => {

      if (
        elements.searchInput
      ) {

        elements.searchInput.focus();

      }

    },
    100
  );

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeLocationModal() {

  const elements =
    getLocationElements();


  if (!elements.modal) {
    return;
  }


  elements.modal.classList.remove(
    "is-open"
  );


  elements.modal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "location-modal-open"
  );

}


/* =========================================================
   SHOW LOCATION SCREEN
   ========================================================= */

function showLocationScreen(
  screen
) {

  const elements =
    getLocationElements();


  const screens = [

    elements.homeScreen,

    elements.mapScreen,

    elements.addressScreen

  ];


  screens.forEach(
    element => {

      if (!element) {
        return;
      }

      element.hidden = true;

      element.classList.remove(
        "is-active"
      );

    }
  );


  let target = null;


  if (screen === "home") {

    target =
      elements.homeScreen;

  }


  if (screen === "map") {

    target =
      elements.mapScreen;

  }


  if (screen === "address") {

    target =
      elements.addressScreen;

  }


  if (target) {

    target.hidden = false;

    target.classList.add(
      "is-active"
    );

  }

}


/* =========================================================
   OPEN MAP SCREEN
   ========================================================= */

async function openMapScreen() {

  showLocationScreen(
    "map"
  );


  const elements =
    getLocationElements();


  if (
    elements.mapPlaceholder
  ) {

    elements.mapPlaceholder.textContent =
      "Loading map...";

  }


  await loadLeaflet();


  initializeMap();


  const selected =
    locationState;


  if (
    selected.latitude &&
    selected.longitude
  ) {

    setMapPosition(
      selected.latitude,
      selected.longitude,
      true
    );

  } else {

    setMapPosition(
      LOCATION_CONFIG.defaultLatitude,
      LOCATION_CONFIG.defaultLongitude,
      true
    );

  }

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

        locationState.leafletLoaded =
          true;

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
          () => {

            locationState.leafletLoaded =
              true;

            resolve();

          }
        );

        existingScript.addEventListener(
          "error",
          reject
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

      script.async = true;

      script.dataset.zynexcartLeaflet =
        "true";


      script.onload =
        () => {

          locationState.leafletLoaded =
            true;

          resolve();

        };


      script.onerror =
        () => {

          console.error(
            "ZynexCart: Unable to load map library."
          );

          reject(
            new Error(
              "Leaflet could not be loaded."
            )
          );

        };


      document.head.appendChild(
        script
      );

    }
  );

}


/* =========================================================
   INITIALIZE MAP
   ========================================================= */

function initializeMap() {

  const elements =
    getLocationElements();


  if (
    !elements.mapContainer
  ) {

    return;

  }


  if (
    !window.L
  ) {

    return;

  }


  if (
    locationState.map
  ) {

    setTimeout(
      () => {

        locationState.map.invalidateSize();

      },
      150
    );

    return;

  }


  locationState.map =
    L.map(
      elements.mapContainer,
      {
        zoomControl: true,
        attributionControl: true
      }
    );


  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; OpenStreetMap contributors'
    }
  ).addTo(
    locationState.map
  );


  locationState.map.on(
    "click",
    event => {

      setMapPosition(
        event.latlng.lat,
        event.latlng.lng,
        true
      );

    }
  );


  setTimeout(
    () => {

      locationState.map.invalidateSize();

    },
    200
  );

}


/* =========================================================
   SET MAP POSITION
   ========================================================= */

function setMapPosition(
  latitude,
  longitude,
  reverseGeocode = false
) {

  const lat =
    Number(latitude);

  const lng =
    Number(longitude);


  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {

    return;

  }


  locationState.latitude =
    lat;

  locationState.longitude =
    lng;


  if (
    locationState.map &&
    window.L
  ) {

    const position =
      [lat, lng];


    locationState.map.setView(
      position,
      17,
      {
        animate: true
      }
    );


    if (
      !locationState.marker
    ) {

      locationState.marker =
        L.marker(
          position,
          {
            draggable: true
          }
        ).addTo(
          locationState.map
        );


      locationState.marker.on(
        "dragend",
        event => {

          const marker =
            event.target;

          const markerPosition =
            marker.getLatLng();


          locationState.latitude =
            markerPosition.lat;

          locationState.longitude =
            markerPosition.lng;


          reverseGeocodeLocation(
            markerPosition.lat,
            markerPosition.lng
          );

        }
      );

    } else {

      locationState.marker.setLatLng(
        position
      );

    }

  }


  if (
    reverseGeocode
  ) {

    reverseGeocodeLocation(
      lat,
      lng
    );

  }

}


/* =========================================================
   CURRENT LOCATION
   ========================================================= */

function useCurrentLocation() {

  if (
    locationState.isLoadingLocation
  ) {

    return;

  }


  if (
    !navigator.geolocation
  ) {

    showLocationError(
      "Your browser does not support location access."
    );

    return;

  }


  locationState.isLoadingLocation =
    true;


  const elements =
    getLocationElements();


  const buttons = [

    elements.currentLocationBtn,

    elements.mapCurrentLocationBtn

  ];


  buttons.forEach(
    button => {

      if (!button) {
        return;
      }

      button.disabled = true;

      button.dataset.originalText =
        button.textContent;

      button.textContent =
        "Detecting location...";

    }
  );


  navigator.geolocation.getCurrentPosition(

    position => {

      locationState.isLoadingLocation =
        false;


      buttons.forEach(
        button => {

          if (!button) {
            return;
          }

          button.disabled = false;

          if (
            button.dataset.originalText
          ) {

            button.textContent =
              button.dataset.originalText;

          }

        }
      );


      const latitude =
        position.coords.latitude;

      const longitude =
        position.coords.longitude;

      const accuracy =
        position.coords.accuracy;


      locationState.latitude =
        latitude;

      locationState.longitude =
        longitude;

      locationState.accuracy =
        accuracy;


      openMapScreen()
        .then(
          () => {

            setMapPosition(
              latitude,
              longitude,
              true
            );

          }
        );

    },

    error => {

      locationState.isLoadingLocation =
        false;


      buttons.forEach(
        button => {

          if (!button) {
            return;
          }

          button.disabled = false;

          if (
            button.dataset.originalText
          ) {

            button.textContent =
              button.dataset.originalText;

          }

        }
      );


      let message =
        "Unable to detect your location.";


      if (
        error.code ===
        error.PERMISSION_DENIED
      ) {

        message =
          "Location permission was denied. Please allow location access in your browser.";

      }


      if (
        error.code ===
        error.POSITION_UNAVAILABLE
      ) {

        message =
          "Your current location is unavailable. Please try again or select the location on the map.";

      }


      if (
        error.code ===
        error.TIMEOUT
      ) {

        message =
          "Location detection timed out. Please try again.";

      }


      showLocationError(
        message
      );

    },

    LOCATION_CONFIG.geolocationOptions

  );

}


/* =========================================================
   REVERSE GEOCODING
   ========================================================= */

async function reverseGeocodeLocation(
  latitude,
  longitude
) {

  const elements =
    getLocationElements();


  if (
    elements.detectedLocationTitle
  ) {

    elements.detectedLocationTitle.textContent =
      "Finding address...";

  }


  if (
    elements.detectedLocationAddress
  ) {

    elements.detectedLocationAddress.textContent =
      "Please wait while we identify this location.";

  }


  try {

    const url =
      `${LOCATION_CONFIG.nominatimUrl}/reverse` +
      `?format=jsonv2` +
      `&lat=${encodeURIComponent(latitude)}` +
      `&lon=${encodeURIComponent(longitude)}` +
      `&zoom=18` +
      `&addressdetails=1`;


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


    locationState.address =
      normalizeNominatimAddress(
        data,
        latitude,
        longitude
      );


    updateDetectedLocationUI();


    return locationState.address;

  } catch (error) {

    console.error(
      "ZynexCart: Reverse geocoding error.",
      error
    );


    locationState.address = {

      displayName:
        `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,

      latitude,

      longitude,

      accuracy:
        locationState.accuracy || null

    };


    updateDetectedLocationUI();


    return locationState.address;

  }

}


/* =========================================================
   NORMALIZE ADDRESS
   ========================================================= */

function normalizeNominatimAddress(
  data,
  latitude,
  longitude
) {

  const address =
    data &&
    data.address
      ? data.address
      : {};


  const city =
    address.city ||
    address.town ||
    address.municipality ||
    address.village ||
    address.city_district ||
    "";


  const state =
    address.state ||
    "";


  const postcode =
    address.postcode ||
    "";


  const country =
    address.country ||
    "";


  const road =
    address.road ||
    address.pedestrian ||
    address.residential ||
    "";


  const area =
    address.suburb ||
    address.neighbourhood ||
    address.quarter ||
    address.locality ||
    "";


  return {

    displayName:
      data.display_name ||
      `${latitude}, ${longitude}`,

    latitude:
      Number(latitude),

    longitude:
      Number(longitude),

    accuracy:
      locationState.accuracy || null,

    placeId:
      data.place_id || "",

    road,

    area,

    city,

    state,

    postcode,

    country,

    houseNumber:
      address.house_number || "",

    raw:
      data

  };

}


/* =========================================================
   UPDATE DETECTED LOCATION
   ========================================================= */

function updateDetectedLocationUI() {

  const elements =
    getLocationElements();


  const address =
    locationState.address;


  if (!address) {
    return;
  }


  if (
    elements.detectedLocationTitle
  ) {

    elements.detectedLocationTitle.textContent =
      address.city ||
      address.area ||
      "Selected Location";

  }


  if (
    elements.detectedLocationAddress
  ) {

    elements.detectedLocationAddress.textContent =
      address.displayName ||
      `${address.latitude}, ${address.longitude}`;

  }


  if (
    elements.detectedLocationCard
  ) {

    elements.detectedLocationCard.hidden =
      false;

  }


  if (
    elements.confirmLocationBtn
  ) {

    elements.confirmLocationBtn.disabled =
      false;

  }

}


/* =========================================================
   SEARCH LOCATION
   ========================================================= */

async function searchLocation(
  query
) {

  const elements =
    getLocationElements();


  if (
    !query ||
    query.length < 3
  ) {

    return;

  }


  if (
    elements.searchResults
  ) {

    elements.searchResults.innerHTML =
      `
        <div class="location-search-loading">
          Searching locations...
        </div>
      `;

  }


  try {

    const url =
      `${LOCATION_CONFIG.nominatimUrl}/search` +
      `?format=jsonv2` +
      `&q=${encodeURIComponent(query)}` +
      `&limit=6` +
      `&addressdetails=1` +
      `&countrycodes=in`;


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
      "ZynexCart: Location search error.",
      error
    );


    if (
      elements.searchResults
    ) {

      elements.searchResults.innerHTML =
        `
          <div class="location-search-empty">
            Unable to search right now. Please try again.
          </div>
        `;

    }

  }

}


/* =========================================================
   RENDER SEARCH RESULTS
   ========================================================= */

function renderLocationSearchResults(
  results
) {

  const elements =
    getLocationElements();


  if (
    !elements.searchResults
  ) {

    return;

  }


  elements.searchResults.innerHTML =
    "";


  if (
    !Array.isArray(results) ||
    results.length === 0
  ) {

    elements.searchResults.innerHTML =
      `
        <div class="location-search-empty">
          No locations found.
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
        getSearchResultTitle(
          result
        );


      const subtitle =
        result.display_name ||
        "";


      button.innerHTML = `
        <span class="location-result-icon">
          📍
        </span>

        <span class="location-result-content">
          <strong>
            ${escapeHTML(title)}
          </strong>

          <small>
            ${escapeHTML(subtitle)}
          </small>
        </span>
      `;


      button.addEventListener(
        "click",
        () => {

          selectSearchResult(
            result
          );

        }
      );


      elements.searchResults.appendChild(
        button
      );

    }
  );

}


/* =========================================================
   SEARCH RESULT TITLE
   ========================================================= */

function getSearchResultTitle(
  result
) {

  if (
    result.address
  ) {

    const address =
      result.address;


    return (
      address.road ||
      address.neighbourhood ||
      address.suburb ||
      address.city ||
      address.town ||
      address.village ||
      result.name ||
      "Selected Location"
    );

  }


  return (
    result.name ||
    "Selected Location"
  );

}


/* =========================================================
   SELECT SEARCH RESULT
   ========================================================= */

function selectSearchResult(
  result
) {

  const latitude =
    Number(result.lat);

  const longitude =
    Number(result.lon);


  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {

    return;

  }


  locationState.latitude =
    latitude;

  locationState.longitude =
    longitude;

  locationState.accuracy =
    null;

  locationState.selectedSearchResult =
    result;


  locationState.address =
    normalizeNominatimAddress(
      result,
      latitude,
      longitude
    );


  openMapScreen()
    .then(
      () => {

        setMapPosition(
          latitude,
          longitude,
          false
        );


        updateDetectedLocationUI();

      }
    );


  clearLocationSearchResults();

}


/* =========================================================
   CLEAR SEARCH RESULTS
   ========================================================= */

function clearLocationSearchResults() {

  const elements =
    getLocationElements();


  if (
    elements.searchResults
  ) {

    elements.searchResults.innerHTML =
      "";

  }

}


/* =========================================================
   CONFIRM MAP LOCATION
   ========================================================= */

function confirmMapLocation() {

  if (
    !Number.isFinite(
      Number(locationState.latitude)
    ) ||
    !Number.isFinite(
      Number(locationState.longitude)
    )
  ) {

    showLocationError(
      "Please select a location on the map first."
    );

    return;

  }


  const address =
    locationState.address;


  if (
    !address
  ) {

    reverseGeocodeLocation(
      locationState.latitude,
      locationState.longitude
    )
      .then(
        () => {

          openAddressScreen();

        }
      );

    return;

  }


  openAddressScreen();

}


/* =========================================================
   ADDRESS SCREEN
   ========================================================= */

function openAddressScreen() {

  const elements =
    getLocationElements();


  showLocationScreen(
    "address"
  );


  if (
    elements.confirmedLocationText
  ) {

    elements.confirmedLocationText.textContent =
      locationState.address &&
      locationState.address.displayName
        ? locationState.address.displayName
        : `${locationState.latitude}, ${locationState.longitude}`;

  }


  prefillAddressForm();

}


/* =========================================================
   PREFILL ADDRESS
   ========================================================= */

function prefillAddressForm() {

  const elements =
    getLocationElements();


  const form =
    elements.addressForm;


  if (!form) {
    return;
  }


  const address =
    locationState.address ||
    {};


  setFormValue(
    form,
    "houseNumber",
    address.houseNumber
  );


  setFormValue(
    form,
    "area",
    address.area ||
    address.road
  );


  setFormValue(
    form,
    "pincode",
    address.postcode
  );


  setFormValue(
    form,
    "city",
    address.city
  );


  setFormValue(
    form,
    "state",
    address.state
  );


  setFormValue(
    form,
    "landmark",
    ""
  );


  setFormValue(
    form,
    "building",
    ""
  );


  setFormValue(
    form,
    "deliveryInstructions",
    ""
  );

}


/* =========================================================
   FORM VALUE HELPER
   ========================================================= */

function setFormValue(
  form,
  name,
  value
) {

  const element =
    form.querySelector(
      `[name="${name}"]`
    );


  if (
    !element
  ) {

    return;

  }


  element.value =
    value || "";

}


/* =========================================================
   SAVE DELIVERY ADDRESS
   ========================================================= */

function saveDeliveryAddress() {

  if (
    !Number.isFinite(
      Number(locationState.latitude)
    ) ||
    !Number.isFinite(
      Number(locationState.longitude)
    )
  ) {

    showLocationError(
      "Please select your delivery location first."
    );

    return;

  }


  const elements =
    getLocationElements();


  const form =
    elements.addressForm;


  const formData =
    form
      ? new FormData(form)
      : null;


  const address = {

    id:
      `addr_${Date.now()}`,

    latitude:
      Number(locationState.latitude),

    longitude:
      Number(locationState.longitude),

    accuracy_meters:
      locationState.accuracy || null,

    place_id:
      locationState.address
        ? locationState.address.placeId || ""
        : "",

    full_address:
      locationState.address
        ? locationState.address.displayName || ""
        : "",

    house_number:
      getFormDataValue(
        formData,
        "houseNumber"
      ),

    building:
      getFormDataValue(
        formData,
        "building"
      ),

    area:
      getFormDataValue(
        formData,
        "area"
      ),

    landmark:
      getFormDataValue(
        formData,
        "landmark"
      ),

    city:
      getFormDataValue(
        formData,
        "city"
      ) ||
      (
        locationState.address
          ? locationState.address.city
          : ""
      ),

    state:
      getFormDataValue(
        formData,
        "state"
      ) ||
      (
        locationState.address
          ? locationState.address.state
          : ""
      ),

    pincode:
      getFormDataValue(
        formData,
        "pincode"
      ) ||
      (
        locationState.address
          ? locationState.address.postcode
          : ""
      ),

    address_type:
      getFormDataValue(
        formData,
        "addressType"
      ) ||
      "Home",

    delivery_instructions:
      getFormDataValue(
        formData,
        "deliveryInstructions"
      ),

    saved_at:
      new Date().toISOString()

  };


  address.full_address =
    buildFullDeliveryAddress(
      address
    );


  const savedAddresses =
    getSavedAddresses();


  savedAddresses.unshift(
    address
  );


  saveSavedAddresses(
    savedAddresses
  );


  saveSelectedLocation(
    address
  );


  updateHeaderLocation(
    address
  );


  renderSavedAddresses();


  closeLocationModal();


  showLocationSuccess();

}


/* =========================================================
   FORM DATA VALUE
   ========================================================= */

function getFormDataValue(
  formData,
  name
) {

  if (!formData) {
    return "";
  }


  const value =
    formData.get(name);


  return value
    ? String(value).trim()
    : "";

}


/* =========================================================
   BUILD FULL ADDRESS
   ========================================================= */

function buildFullDeliveryAddress(
  address
) {

  const parts = [

    address.house_number,

    address.building,

    address.area,

    address.landmark,

    address.city,

    address.state,

    address.pincode

  ];


  return parts
    .filter(
      part =>
        part &&
        String(part).trim()
    )
    .map(
      part =>
        String(part).trim()
    )
    .join(", ");

}


/* =========================================================
   SAVED ADDRESSES
   ========================================================= */

function getSavedAddresses() {

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


/* =========================================================
   SAVE ADDRESSES
   ========================================================= */

function saveSavedAddresses(
  addresses
) {

  try {

    localStorage.setItem(
      ADDRESS_STORAGE_KEY,
      JSON.stringify(
        Array.isArray(addresses)
          ? addresses
          : []
      )
    );

  } catch (error) {

    console.error(
      "ZynexCart: Unable to save addresses.",
      error
    );

  }

}


/* =========================================================
   SELECTED LOCATION
   ========================================================= */

function saveSelectedLocation(
  address
) {

  try {

    localStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify(
        address
      )
    );

  } catch (error) {

    console.error(
      "ZynexCart: Unable to save selected location.",
      error
    );

  }

}


/* =========================================================
   RESTORE SELECTED LOCATION
   ========================================================= */

function restoreSelectedLocation() {

  try {

    const stored =
      localStorage.getItem(
        LOCATION_STORAGE_KEY
      );


    if (!stored) {
      return;
    }


    const address =
      JSON.parse(stored);


    if (
      !address ||
      !Number.isFinite(
        Number(address.latitude)
      ) ||
      !Number.isFinite(
        Number(address.longitude)
      )
    ) {

      return;

    }


    locationState.latitude =
      Number(address.latitude);

    locationState.longitude =
      Number(address.longitude);

    locationState.accuracy =
      address.accuracy_meters ||
      null;

    locationState.address = {

      displayName:
        address.full_address ||
        "",

      latitude:
        Number(address.latitude),

      longitude:
        Number(address.longitude),

      accuracy:
        address.accuracy_meters ||
        null,

      placeId:
        address.place_id ||
        "",

      city:
        address.city ||
        "",

      state:
        address.state ||
        "",

      postcode:
        address.pincode ||
        ""

    };


    updateHeaderLocation(
      address
    );

  } catch (error) {

    console.error(
      "ZynexCart: Unable to restore location.",
      error
    );

  }

}


/* =========================================================
   RENDER SAVED ADDRESSES
   ========================================================= */

function renderSavedAddresses() {

  const elements =
    getLocationElements();


  if (
    !elements.savedAddresses
  ) {

    return;

  }


  const addresses =
    getSavedAddresses();


  elements.savedAddresses.innerHTML =
    "";


  if (
    addresses.length === 0
  ) {

    elements.savedAddresses.innerHTML =
      `
        <div class="saved-address-empty">
          No saved addresses yet.
        </div>
      `;

    return;

  }


  addresses.forEach(
    address => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";

      button.className =
        "saved-address-item";


      const title =
        address.address_type ||
        "Address";


      const text =
        address.full_address ||
        buildFullDeliveryAddress(
          address
        );


      button.innerHTML = `
        <span class="saved-address-icon">
          ${getAddressTypeIcon(title)}
        </span>

        <span class="saved-address-content">
          <strong>
            ${escapeHTML(title)}
          </strong>

          <small>
            ${escapeHTML(text || "Saved delivery address")}
          </small>
        </span>

        <span class="saved-address-arrow">
          ›
        </span>
      `;


      button.addEventListener(
        "click",
        () => {

          selectSavedAddress(
            address
          );

        }
      );


      elements.savedAddresses.appendChild(
        button
      );

    }
  );

}


/* =========================================================
   ADDRESS ICON
   ========================================================= */

function getAddressTypeIcon(
  type
) {

  const value =
    String(type)
      .toLowerCase();


  if (
    value === "work"
  ) {

    return "💼";

  }


  if (
    value === "other"
  ) {

    return "📍";

  }


  return "🏠";

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


  saveSelectedLocation(
    address
  );


  locationState.latitude =
    Number(address.latitude);

  locationState.longitude =
    Number(address.longitude);

  locationState.accuracy =
    address.accuracy_meters ||
    null;


  updateHeaderLocation(
    address
  );


  closeLocationModal();


  document.dispatchEvent(
    new CustomEvent(
      "zynexcart:locationUpdated",
      {
        detail: address
      }
    )
  );

}


/* =========================================================
   UPDATE HEADER LOCATION
   ========================================================= */

function updateHeaderLocation(
  address
) {

  const elements =
    getLocationElements();


  if (
    !elements.text
  ) {

    return;

  }


  let text =
    "";


  if (
    address
  ) {

    text =
      address.area ||
      address.city ||
      address.full_address ||
      address.displayName ||
      "";

  }


  if (!text) {

    text =
      "Enter location";

  }


  elements.text.textContent =
    text;


  elements.text.title =
    address &&
    address.full_address
      ? address.full_address
      : text;

}


/* =========================================================
   LOCATION ERROR
   ========================================================= */

function showLocationError(
  message
) {

  console.error(
    "ZynexCart Location:",
    message
  );


  const elements =
    getLocationElements();


  const target =
    elements.detectedLocationAddress ||
    elements.searchResults;


  if (
    target
  ) {

    target.textContent =
      message;

  }

}


/* =========================================================
   LOCATION SUCCESS
   ========================================================= */

function showLocationSuccess() {

  const elements =
    getLocationElements();


  if (
    !elements.button
  ) {

    return;

  }


  elements.button.classList.add(
    "location-selected"
  );


  setTimeout(
    () => {

      elements.button.classList.remove(
        "location-selected"
      );

    },
    1200
  );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(
  value
) {

  return String(
    value || ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   GLOBAL API
   ========================================================= */


/* CART */

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


/* LOCATION */

window.openLocationModal =
  openLocationModal;

window.closeLocationModal =
  closeLocationModal;

window.useCurrentLocation =
  useCurrentLocation;

window.searchLocation =
  searchLocation;

window.confirmMapLocation =
  confirmMapLocation;

window.saveDeliveryAddress =
  saveDeliveryAddress;

window.getSavedAddresses =
  getSavedAddresses;

window.selectSavedAddress =
  selectSavedAddress;

window.getSelectedLocation =
  function () {

    try {

      const stored =
        localStorage.getItem(
          LOCATION_STORAGE_KEY
        );

      return stored
        ? JSON.parse(stored)
        : null;

    } catch {

      return null;

    }

  };


/* =========================================================
   END OF ZYNEXCART APP
   ========================================================= */
