// ZYNEXCART — LOCATION MAP
// Optimized production version
// Prevents duplicate map initialization and repeated location requests.

(function () {
  "use strict";

  const locationCore = window.ZynexCartLocation;
  const locationUI = window.ZynexCartLocationUI;
  const locationSearch = window.ZynexCartLocationSearch;

  if (!locationCore || !locationUI) {
    console.error(
      "ZynexCart: Location map dependencies not loaded."
    );
    return;
  }

  const config = locationCore.LOCATION_CONFIG;
  const state = locationCore.locationState;

  /* =====================================================
     INTERNAL LOADING STATE
     ===================================================== */

  let leafletPromise = null;
  let mapInitializationPromise = null;
  let lastReverseGeocodeKey = null;
  let reverseGeocodePromise = null;


  /* =====================================================
     LOAD LEAFLET
     ===================================================== */

  function loadLeaflet() {

    if (window.L) {
      state.leafletLoaded = true;
      return Promise.resolve();
    }

    if (leafletPromise) {
      return leafletPromise;
    }

    leafletPromise = new Promise(function (resolve, reject) {

      const existingScript =
        document.querySelector(
          'script[data-zynexcart-leaflet="true"]'
        );

      const existingCSS =
        document.querySelector(
          'link[data-zynexcart-leaflet="true"]'
        );


      /* ---------- CSS ---------- */

      if (!existingCSS) {

        const css =
          document.createElement("link");

        css.rel = "stylesheet";

        css.href =
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

        css.dataset.zynexcartLeaflet =
          "true";

        document.head.appendChild(css);
      }


      /* ---------- EXISTING SCRIPT ---------- */

      if (existingScript) {

        if (window.L) {

          state.leafletLoaded = true;

          resolve();

          return;
        }

        existingScript.addEventListener(
          "load",
          function () {

            state.leafletLoaded = true;

            resolve();

          },
          { once: true }
        );

        existingScript.addEventListener(
          "error",
          function () {

            leafletPromise = null;

            reject(
              new Error(
                "Unable to load Leaflet."
              )
            );

          },
          { once: true }
        );

        return;
      }


      /* ---------- NEW SCRIPT ---------- */

      const script =
        document.createElement("script");

      script.src =
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

      script.async = true;

      script.dataset.zynexcartLeaflet =
        "true";


      script.onload = function () {

        if (!window.L) {

          leafletPromise = null;

          reject(
            new Error(
              "Leaflet loaded but was not available."
            )
          );

          return;
        }

        state.leafletLoaded = true;

        resolve();

      };


      script.onerror = function () {

        leafletPromise = null;

        reject(
          new Error(
            "Unable to load Leaflet."
          )
        );

      };


      document.head.appendChild(script);

    });

    return leafletPromise;
  }


  /* =====================================================
     INITIALIZE MAP
     ===================================================== */

  async function initializeMap() {

    const elements =
      locationUI.getLocationElements();

    if (!elements.mapContainer) {
      return;
    }


    /* Prevent duplicate initialization */

    if (state.map) {

      setTimeout(function () {

        if (state.map) {
          state.map.invalidateSize();
        }

      }, 50);

      updateMapPositionFromState();

      updateMapUI();

      return state.map;
    }


    /* Prevent multiple initializeMap calls */

    if (mapInitializationPromise) {
      return mapInitializationPromise;
    }


    mapInitializationPromise =
      (async function () {

        try {

          await loadLeaflet();


          /* Map may have been created while waiting */

          if (state.map) {

            state.map.invalidateSize();

            updateMapPositionFromState();

            updateMapUI();

            return state.map;
          }


          /* Create map */

          state.map =
            L.map(
              elements.mapContainer,
              {
                zoomControl: true,
                attributionControl: true
              }
            );


          /* OpenStreetMap */

          L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              maxZoom: 19,

              attribution:
                "&copy; OpenStreetMap contributors"
            }
          ).addTo(state.map);


          /* Map click */

          state.map.on(
            "click",
            function (event) {

              const latitude =
                event.latlng.lat;

              const longitude =
                event.latlng.lng;

              setMapPosition(
                latitude,
                longitude,
                true
              );

            }
          );


          /* Correct map size */

          setTimeout(function () {

            if (state.map) {
              state.map.invalidateSize();
            }

          }, 50);


          /* Restore saved/current position */

          updateMapPositionFromState();


          updateMapUI();


          return state.map;

        } catch (error) {

          console.error(
            "ZynexCart map error:",
            error
          );

          state.map = null;

          locationUI.showLocationError(
            "Unable to load the map. Please try again."
          );

          throw error;

        } finally {

          mapInitializationPromise =
            null;

        }

      })();


    return mapInitializationPromise;
  }


  /* =====================================================
     UPDATE MAP POSITION FROM STATE
     ===================================================== */

  function updateMapPositionFromState() {

    if (!state.map) {
      return;
    }


    if (
      Number.isFinite(
        Number(state.latitude)
      ) &&
      Number.isFinite(
        Number(state.longitude)
      )
    ) {

      setMapPosition(
        state.latitude,
        state.longitude,
        false
      );

      return;
    }


    state.map.setView(
      [
        config.defaultLatitude,
        config.defaultLongitude
      ],
      12,
      {
        animate: false
      }
    );
  }


  /* =====================================================
     SET MAP POSITION
     ===================================================== */

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


    locationCore.setCoordinates(
      lat,
      lng,
      state.accuracy
    );


    if (!state.map) {
      return;
    }


    /* Move map */

    state.map.setView(
      [lat, lng],
      Math.max(
        state.map.getZoom() || 16,
        16
      ),
      {
        animate: false
      }
    );


    /* Create marker once */

    if (!state.marker) {

      state.marker =
        L.marker(
          [lat, lng],
          {
            draggable: true
          }
        ).addTo(state.map);


      state.marker.on(
        "dragend",
        function () {

          const position =
            state.marker.getLatLng();


          state.latitude =
            position.lat;

          state.longitude =
            position.lng;


          reverseGeocodeLocation(
            position.lat,
            position.lng
          );

        }
      );

    } else {

      state.marker.setLatLng(
        [lat, lng]
      );

    }


    updateMapUI();


    if (reverseGeocode) {

      reverseGeocodeLocation(
        lat,
        lng
      );

    }

  }


  /* =====================================================
     OPEN MAP WITH LOCATION
     ===================================================== */

  async function openMapWithLocation(
    latitude,
    longitude,
    reverseGeocode = true
  ) {

    locationUI.openMapScreen();


    try {

      await initializeMap();


      setMapPosition(
        latitude,
        longitude,
        reverseGeocode
      );

    } catch (error) {

      console.error(
        "ZynexCart: Unable to open map.",
        error
      );

    }

  }


  /* =====================================================
     USE CURRENT LOCATION
     ===================================================== */

  function useCurrentLocation() {

    if (!navigator.geolocation) {

      locationUI.showLocationError(
        "Your browser does not support location services."
      );

      return;
    }


    /* Prevent duplicate GPS requests */

    if (state.isLoadingLocation) {
      return;
    }


    state.isLoadingLocation =
      true;


    const elements =
      locationUI.getLocationElements();


    /* Disable buttons */

    if (elements.currentLocationBtn) {

      elements.currentLocationBtn.disabled =
        true;

    }


    if (elements.mapCurrentLocationBtn) {

      elements.mapCurrentLocationBtn.disabled =
        true;

    }


    navigator.geolocation.getCurrentPosition(

      async function (position) {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const accuracy =
          position.coords.accuracy;


        state.accuracy =
          Number.isFinite(
            Number(accuracy)
          )
            ? Number(accuracy)
            : null;


        state.isLoadingLocation =
          false;


        enableLocationButtons(
          elements
        );


        try {

          await openMapWithLocation(
            latitude,
            longitude,
            true
          );

        } catch (error) {

          console.error(
            "ZynexCart: Current location map error.",
            error
          );

        }

      },


      function (error) {

        state.isLoadingLocation =
          false;


        enableLocationButtons(
          elements
        );


        let message =
          "Unable to detect your location.";


        if (error.code === 1) {

          message =
            "Location permission was denied. Please allow location access in your browser.";

        } else if (error.code === 2) {

          message =
            "Your location is currently unavailable. Please try again.";

        } else if (error.code === 3) {

          message =
            "Location request timed out. Please try again.";

        }


        locationUI.showLocationError(
          message
        );

      },

      config.geolocationOptions

    );

  }


  /* =====================================================
     ENABLE LOCATION BUTTONS
     ===================================================== */

  function enableLocationButtons(
    elements
  ) {

    if (elements.currentLocationBtn) {

      elements.currentLocationBtn.disabled =
        false;

    }


    if (elements.mapCurrentLocationBtn) {

      elements.mapCurrentLocationBtn.disabled =
        false;

    }

  }


  /* =====================================================
     REVERSE GEOCODING
     ===================================================== */

  async function reverseGeocodeLocation(
    latitude,
    longitude
  ) {

    const lat =
      Number(latitude);

    const lng =
      Number(longitude);


    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return null;
    }


    /*
     * Avoid sending exactly the same
     * reverse-geocoding request repeatedly.
     */

    const requestKey =
      `${lat.toFixed(6)},${lng.toFixed(6)}`;


    if (
      requestKey ===
      lastReverseGeocodeKey
    ) {

      return state.address;

    }


    if (reverseGeocodePromise) {
      return reverseGeocodePromise;
    }


    lastReverseGeocodeKey =
      requestKey;


    reverseGeocodePromise =
      (async function () {

        try {

          const url =
            new URL(
              `${config.nominatimUrl}/reverse`
            );


          url.searchParams.set(
            "format",
            "jsonv2"
          );

          url.searchParams.set(
            "zoom",
            "18"
          );

          url.searchParams.set(
            "addressdetails",
            "1"
          );

          url.searchParams.set(
            "lat",
            lat
          );

          url.searchParams.set(
            "lon",
            lng
          );


          const response =
            await fetch(
              url.toString(),
              {
                headers: {
                  Accept:
                    "application/json"
                }
              }
            );


          if (!response.ok) {

            throw new Error(
              `Reverse geocoding failed: ${response.status}`
            );

          }


          const data =
            await response.json();


          let address;


          if (
            locationSearch &&
            typeof locationSearch.normalizeNominatimAddress ===
              "function"
          ) {

            address =
              locationSearch.normalizeNominatimAddress(
                data,
                lat,
                lng
              );

          } else {

            address = {

              displayName:
                data.display_name || "",

              latitude: lat,

              longitude: lng,

              accuracy:
                state.accuracy ||
                null,

              placeId:
                data.place_id ||
                "",

              city:
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                "",

              state:
                data.address?.state ||
                "",

              postcode:
                data.address?.postcode ||
                "",

              raw: data

            };

          }


          locationCore.setAddress(
            address
          );


          updateMapUI();


          return address;


        } catch (error) {

          console.error(
            "ZynexCart reverse geocoding error:",
            error
          );


          const fallbackAddress = {

            displayName:
              `${lat.toFixed(6)}, ${lng.toFixed(6)}`,

            latitude: lat,

            longitude: lng,

            accuracy:
              state.accuracy ||
              null,

            placeId: "",

            city: "",

            state: "",

            postcode: ""

          };


          locationCore.setAddress(
            fallbackAddress
          );


          updateMapUI();


          return fallbackAddress;


        } finally {

          reverseGeocodePromise =
            null;

        }

      })();


    return reverseGeocodePromise;

  }


  /* =====================================================
     UPDATE MAP UI
     ===================================================== */

  function updateMapUI() {

    locationUI.updateDetectedLocationUI();

    locationUI.updateConfirmedLocation();


    const elements =
      locationUI.getLocationElements();


    if (elements.mapPlaceholder) {

      elements.mapPlaceholder.hidden =
        Boolean(state.map);

    }

  }


  /* =====================================================
     CONFIRM MAP LOCATION
     ===================================================== */

  function confirmMapLocation() {

    if (
      !Number.isFinite(
        Number(state.latitude)
      ) ||
      !Number.isFinite(
        Number(state.longitude)
      )
    ) {

      locationUI.showLocationError(
        "Please select a location on the map."
      );

      return;

    }


    if (!state.address) {

      reverseGeocodeLocation(
        state.latitude,
        state.longitude
      ).then(function () {

        locationUI.openAddressScreen();

      });

      return;

    }


    locationUI.openAddressScreen();

  }


  /* =====================================================
     EXPOSE MAP MODULE
     ===================================================== */

  window.ZynexCartLocationMap = {

    loadLeaflet,

    initializeMap,

    setMapPosition,

    openMapWithLocation,

    useCurrentLocation,

    reverseGeocodeLocation,

    confirmMapLocation

  };

})();
