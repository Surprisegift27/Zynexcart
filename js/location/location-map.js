// ZYNEXCART — LOCATION MAP

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

  /**
   * Load Leaflet CSS + JavaScript
   */
  function loadLeaflet() {
    return new Promise(function (resolve, reject) {
      if (window.L) {
        state.leafletLoaded = true;
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
          function () {
            state.leafletLoaded = true;
            resolve();
          }
        );

        existingScript.addEventListener(
          "error",
          reject
        );

        return;
      }

      const existingCSS =
        document.querySelector(
          'link[data-zynexcart-leaflet="true"]'
        );

      if (!existingCSS) {
        const css = document.createElement("link");

        css.rel = "stylesheet";
        css.href =
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

        css.dataset.zynexcartLeaflet = "true";

        document.head.appendChild(css);
      }

      const script = document.createElement("script");

      script.src =
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

      script.async = true;

      script.dataset.zynexcartLeaflet = "true";

      script.onload = function () {
        state.leafletLoaded = true;
        resolve();
      };

      script.onerror = function () {
        reject(
          new Error("Unable to load Leaflet.")
        );
      };

      document.body.appendChild(script);
    });
  }

  /**
   * Initialize map
   */
  async function initializeMap() {
    const elements =
      locationUI.getLocationElements();

    if (!elements.mapContainer) {
      return;
    }

    try {
      await loadLeaflet();

      if (!state.map) {
        state.map = L.map(
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
        ).addTo(state.map);

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
      }

      setTimeout(function () {
        state.map.invalidateSize();
      }, 100);

      if (
        Number.isFinite(Number(state.latitude)) &&
        Number.isFinite(Number(state.longitude))
      ) {
        setMapPosition(
          state.latitude,
          state.longitude,
          false
        );
      } else {
        state.map.setView(
          [
            config.defaultLatitude,
            config.defaultLongitude
          ],
          12
        );
      }

      updateMapUI();

    } catch (error) {
      console.error(
        "ZynexCart map error:",
        error
      );

      locationUI.showLocationError(
        "Unable to load the map. Please try again."
      );
    }
  }

  /**
   * Set map position
   */
  function setMapPosition(
    latitude,
    longitude,
    reverseGeocode = false
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

    state.map.setView(
      [lat, lng],
      Math.max(
        state.map.getZoom() || 16,
        16
      ),
      {
        animate: true
      }
    );

    if (!state.marker) {
      state.marker = L.marker(
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

  /**
   * Open map at a location
   */
  async function openMapWithLocation(
    latitude,
    longitude,
    reverseGeocode = true
  ) {
    locationUI.openMapScreen();

    await initializeMap();

    setMapPosition(
      latitude,
      longitude,
      reverseGeocode
    );
  }

  /**
   * Use browser GPS location
   */
  function useCurrentLocation() {
    if (!navigator.geolocation) {
      locationUI.showLocationError(
        "Your browser does not support location services."
      );

      return;
    }

    if (state.isLoadingLocation) {
      return;
    }

    state.isLoadingLocation = true;

    const elements =
      locationUI.getLocationElements();

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

        if (elements.currentLocationBtn) {
          elements.currentLocationBtn.disabled =
            false;
        }

        if (elements.mapCurrentLocationBtn) {
          elements.mapCurrentLocationBtn.disabled =
            false;
        }

        await openMapWithLocation(
          latitude,
          longitude,
          true
        );
      },

      function (error) {
        state.isLoadingLocation = false;

        if (elements.currentLocationBtn) {
          elements.currentLocationBtn.disabled =
            false;
        }

        if (elements.mapCurrentLocationBtn) {
          elements.mapCurrentLocationBtn.disabled =
            false;
        }

        let message =
          "Unable to detect your location.";

        if (error.code === 1) {
          message =
            "Location permission was denied. Please allow location access in your browser.";
        }

        if (error.code === 2) {
          message =
            "Your location is currently unavailable. Please try again.";
        }

        if (error.code === 3) {
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

  /**
   * Reverse geocode coordinates
   */
  async function reverseGeocodeLocation(
    latitude,
    longitude
  ) {
    try {
      const url = new URL(
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
        latitude
      );

      url.searchParams.set(
        "lon",
        longitude
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
            latitude,
            longitude
          );
      } else {
        address = {
          displayName:
            data.display_name || "",

          latitude:
            Number(latitude),

          longitude:
            Number(longitude),

          accuracy:
            state.accuracy || null,

          placeId:
            data.place_id || "",

          city:
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "",

          state:
            data.address?.state || "",

          postcode:
            data.address?.postcode || "",

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
          `${Number(latitude).toFixed(6)}, ${Number(longitude).toFixed(6)}`,

        latitude:
          Number(latitude),

        longitude:
          Number(longitude),

        accuracy:
          state.accuracy || null,

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
    }
  }

  /**
   * Update map-related UI
   */
  function updateMapUI() {
    locationUI.updateDetectedLocationUI();
    locationUI.updateConfirmedLocation();

    const elements =
      locationUI.getLocationElements();

    if (
      elements.mapPlaceholder
    ) {
      elements.mapPlaceholder.hidden =
        Boolean(state.map);
    }
  }

  /**
   * Confirm current map location
   */
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

  /**
   * Expose map module
   */
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
