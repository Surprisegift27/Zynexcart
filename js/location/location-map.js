// ZYNEXCART — LOCATION MAP
// Production location map
// Leaflet + OpenStreetMap
// Google Maps-style current/saved location behavior

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
      const existingScript = document.querySelector(
        'script[data-zynexcart-leaflet="true"]'
      );

      const existingCSS = document.querySelector(
        'link[data-zynexcart-leaflet="true"]'
      );

      /* ---------- LEAFLET CSS ---------- */

      if (!existingCSS) {
        const css = document.createElement("link");

        css.rel = "stylesheet";
        css.href =
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

        css.dataset.zynexcartLeaflet = "true";

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
              new Error("Unable to load Leaflet.")
            );
          },
          { once: true }
        );

        return;
      }

      /* ---------- NEW SCRIPT ---------- */

      const script = document.createElement("script");

      script.src =
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

      script.async = true;
      script.dataset.zynexcartLeaflet = "true";

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
          new Error("Unable to load Leaflet.")
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
    const elements = locationUI.getLocationElements();

    if (!elements.mapContainer) {
      return;
    }

    /* ---------- MAP ALREADY EXISTS ---------- */

    if (state.map) {
      requestMapResize();

      updateMapPositionFromState();
      updateMapUI();

      return state.map;
    }

    /* ---------- PREVENT DUPLICATE INITIALIZATION ---------- */

    if (mapInitializationPromise) {
      return mapInitializationPromise;
    }

    mapInitializationPromise = (async function () {
      try {
        await loadLeaflet();

        /* Map may have been created while Leaflet loaded */

        if (state.map) {
          requestMapResize();

          updateMapPositionFromState();
          updateMapUI();

          return state.map;
        }

        /* =================================================
           CREATE LEAFLET MAP
        ================================================= */

        state.map = L.map(
          elements.mapContainer,
          {
            zoomControl: true,
            attributionControl: true,

            /* Google Maps-like normal interaction */

            dragging: true,
            touchZoom: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: false,
            keyboard: true,

            minZoom: 3,
            maxZoom: 19
          }
        );

        /* =================================================
           OPENSTREETMAP TILE LAYER
        ================================================= */

        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            maxNativeZoom: 19,

            attribution:
              "&copy; OpenStreetMap contributors"
          }
        ).addTo(state.map);

        /* =================================================
           MAP CLICK
        ================================================= */

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

        /* =================================================
           RESTORE LOCATION
        ================================================= */

        updateMapPositionFromState();

        updateMapUI();

        requestMapResize();

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
        mapInitializationPromise = null;
      }
    })();

    return mapInitializationPromise;
  }

  /* =====================================================
     MAP RESIZE
  ===================================================== */

  function requestMapResize() {
    if (!state.map) {
      return;
    }

    requestAnimationFrame(function () {
      if (state.map) {
        state.map.invalidateSize({
          animate: false
        });
      }
    });

    setTimeout(function () {
      if (state.map) {
        state.map.invalidateSize({
          animate: false
        });
      }
    }, 100);
  }

  /* =====================================================
     CREATE LOCATION MARKER
     Google Maps-style visual marker
  ===================================================== */

  function createLocationMarkerIcon() {
    return L.divIcon({
      className: "zynexcart-location-marker",

      html: `
        <div style="
          width:34px;
          height:34px;
          position:relative;
        ">
          <div style="
            position:absolute;
            left:50%;
            top:50%;
            transform:translate(-50%,-50%);
            width:22px;
            height:22px;
            background:#ff6b00;
            border:4px solid #ffffff;
            border-radius:50% 50% 50% 0;
            box-shadow:
              0 3px 10px rgba(0,0,0,0.30);
            transform-origin:center;
            rotate:-45deg;
          ">
            <div style="
              position:absolute;
              width:7px;
              height:7px;
              background:#ffffff;
              border-radius:50%;
              left:50%;
              top:50%;
              transform:translate(-50%,-50%);
            "></div>
          </div>
        </div>
      `,

      iconSize: [34, 34],
      iconAnchor: [17, 32],
      popupAnchor: [0, -32]
    });
  }

  /* =====================================================
     UPDATE MAP POSITION FROM SAVED/CURRENT STATE
  ===================================================== */

  function updateMapPositionFromState() {
    if (!state.map) {
      return;
    }

    const latitude = Number(state.latitude);
    const longitude = Number(state.longitude);

    /* =================================================
       SAVED / CURRENT LOCATION EXISTS
    ================================================= */

    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude)
    ) {
      setMapPosition(
        latitude,
        longitude,
        false,
        true
      );

      return;
    }

    /* =================================================
       NO LOCATION
       Mumbai is ONLY fallback
    ================================================= */

    state.map.setView(
      [
        config.defaultLatitude,
        config.defaultLongitude
      ],
      13,
      {
        animate: false
      }
    );

    updateMapUI();
  }

  /* =====================================================
     SET MAP POSITION
  ===================================================== */

  function setMapPosition(
    latitude,
    longitude,
    reverseGeocode = false,
    restoreMode = false
  ) {
    const lat = Number(latitude);
    const lng = Number(longitude);

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

    /* =================================================
       DETERMINE ZOOM
    ================================================= */

    let zoom = 16;

    if (restoreMode) {
      zoom = Math.max(
        state.map.getZoom() || 16,
        16
      );
    }

    /* =================================================
       MOVE MAP TO LOCATION
    ================================================= */

    state.map.setView(
      [lat, lng],
      zoom,
      {
        animate: false
      }
    );

    /* =================================================
       CREATE / UPDATE LOCATION MARKER
    ================================================= */

    if (!state.marker) {
      state.marker = L.marker(
        [lat, lng],
        {
          draggable: true,
          icon: createLocationMarkerIcon(),
          keyboard: true,
          title: "Selected delivery location"
        }
      ).addTo(state.map);

      /* ---------- DRAG MARKER ---------- */

      state.marker.on(
        "dragend",
        function () {
          const position =
            state.marker.getLatLng();

          state.latitude =
            position.lat;

          state.longitude =
            position.lng;

          state.address = null;

          lastReverseGeocodeKey = null;

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

    /* =================================================
       REVERSE GEOCODE ONLY WHEN NEEDED
    ================================================= */

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
        reverseGeocode,
        false
      );

      requestMapResize();

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

    state.isLoadingLocation = true;

    const elements =
      locationUI.getLocationElements();

    /* Disable location buttons */

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

        state.isLoadingLocation = false;

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
        state.isLoadingLocation = false;

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
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return null;
    }

    const requestKey =
      `${lat.toFixed(6)},${lng.toFixed(6)}`;

    /* Same request already completed */

    if (
      requestKey ===
      lastReverseGeocodeKey
    ) {
      return state.address;
    }

    /* Existing request */

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
            typeof locationSearch
              .normalizeNominatimAddress ===
              "function"
          ) {
            address =
              locationSearch
                .normalizeNominatimAddress(
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
          reverseGeocodePromise = null;
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
