/* =====================================================
   ZYNEXCART — ORDERS
   Professional Order Management
   ===================================================== */

(function () {
  "use strict";

  const ORDERS_KEY = "zynexcart_orders";
  const CART_KEY = "zynexcart_cart";

  /* ---------------------------------------------------
     STORAGE
     --------------------------------------------------- */

  function getOrders() {
    try {
      const orders = JSON.parse(
        localStorage.getItem(ORDERS_KEY) || "[]"
      );

      return Array.isArray(orders) ? orders : [];
    } catch (error) {
      console.error("Unable to read orders:", error);
      return [];
    }
  }

  function saveOrders(orders) {
    localStorage.setItem(
      ORDERS_KEY,
      JSON.stringify(orders)
    );
  }

  /* ---------------------------------------------------
     ORDER ID
     --------------------------------------------------- */

  function createOrderId() {
    const now = new Date();

    const date =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");

    const random = Math.floor(
      1000 + Math.random() * 9000
    );

    return `ZC${date}${random}`;
  }

  /* ---------------------------------------------------
     CREATE ORDER
     --------------------------------------------------- */

  function createOrder(orderData = {}) {
    const order = {
      id: orderData.id || createOrderId(),

      createdAt:
        orderData.createdAt ||
        new Date().toISOString(),

      status:
        orderData.status ||
        "Placed",

      paymentMethod:
        orderData.paymentMethod ||
        "Cash on Delivery",

      address:
        orderData.address || "",

      items:
        Array.isArray(orderData.items)
          ? orderData.items
          : [],

      subtotal:
        Number(orderData.subtotal) || 0,

      deliveryFee:
        Number(orderData.deliveryFee) || 0,

      discount:
        Number(orderData.discount) || 0,

      total:
        Number(orderData.total) || 0
    };

    const orders = getOrders();

    orders.unshift(order);

    saveOrders(orders);

    return order;
  }

  /* ---------------------------------------------------
     GET ORDER
     --------------------------------------------------- */

  function getOrder(orderId) {
    return getOrders().find(
      order => order.id === orderId
    ) || null;
  }

  /* ---------------------------------------------------
     UPDATE STATUS
     --------------------------------------------------- */

  function updateOrderStatus(orderId, status) {
    const orders = getOrders();

    const order = orders.find(
      item => item.id === orderId
    );

    if (!order) {
      return false;
    }

    order.status = status;

    saveOrders(orders);

    return true;
  }

  /* ---------------------------------------------------
     FORMAT PRICE
     --------------------------------------------------- */

  function formatPrice(value) {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  }

  /* ---------------------------------------------------
     FORMAT DATE
     --------------------------------------------------- */

  function formatDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function formatTime(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  /* ---------------------------------------------------
     STATUS CLASS
     --------------------------------------------------- */

  function getStatusClass(status) {
    return String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  /* ---------------------------------------------------
     ESCAPE HTML
     --------------------------------------------------- */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* ---------------------------------------------------
     ITEM IMAGE
     --------------------------------------------------- */

  function getItemImage(item) {
    return (
      item.image ||
      item.img ||
      item.imageUrl ||
      "assets/logo.png"
    );
  }

  /* ---------------------------------------------------
     ITEM NAME
     --------------------------------------------------- */

  function getItemName(item) {
    return (
      item.name ||
      item.title ||
      "Product"
    );
  }

  /* ---------------------------------------------------
     ITEM QUANTITY
     --------------------------------------------------- */

  function getItemQuantity(item) {
    return Number(
      item.quantity ??
      item.qty ??
      1
    );
  }

  /* ---------------------------------------------------
     ITEM PRICE
     --------------------------------------------------- */

  function getItemPrice(item) {
    return Number(
      item.price ??
      item.salePrice ??
      0
    );
  }

  /* ---------------------------------------------------
     RENDER ORDERS
     --------------------------------------------------- */

  function renderOrders() {

    const container =
      document.querySelector("#ordersList") ||
      document.querySelector(".orders-list") ||
      document.querySelector("#ordersContainer") ||
      document.querySelector(".orders-container");

    if (!container) {
      return;
    }

    const orders = getOrders();

    if (!orders.length) {

      container.innerHTML = `
        <div class="empty-orders">
          <div class="empty-orders-icon">🛍️</div>

          <h2>No orders yet</h2>

          <p>
            Your placed orders will appear here.
          </p>

          <a
            href="products.html"
            class="primary-btn"
          >
            Start Shopping
          </a>
        </div>
      `;

      return;
    }

    container.innerHTML = orders
      .map(renderOrderCard)
      .join("");

    attachOrderEvents();
  }

  /* ---------------------------------------------------
     ORDER CARD
     --------------------------------------------------- */

  function renderOrderCard(order) {

    const items = Array.isArray(order.items)
      ? order.items
      : [];

    const itemCount = items.reduce(
      (total, item) =>
        total + getItemQuantity(item),
      0
    );

    const previewItems = items
      .slice(0, 3)
      .map(item => {

        const image = escapeHTML(
          getItemImage(item)
        );

        const name = escapeHTML(
          getItemName(item)
        );

        const quantity =
          getItemQuantity(item);

        return `
          <div class="order-item">

            <div class="order-item-image">
              <img
                src="${image}"
                alt="${name}"
                loading="lazy"
              >
            </div>

            <div class="order-item-info">
              <strong>${name}</strong>
              <span>
                Qty: ${quantity}
              </span>
            </div>

            <strong class="order-item-price">
              ${formatPrice(
                getItemPrice(item) * quantity
              )}
            </strong>

          </div>
        `;
      })
      .join("");

    const extraItems =
      items.length > 3
        ? `
          <div class="order-more-items">
            +${items.length - 3} more item(s)
          </div>
        `
        : "";

    const statusClass =
      getStatusClass(order.status);

    return `
      <article
        class="order-card"
        data-order-id="${escapeHTML(order.id)}"
      >

        <div class="order-card-header">

          <div>
            <span class="order-label">
              ORDER ID
            </span>

            <strong class="order-id">
              ${escapeHTML(order.id)}
            </strong>
          </div>

          <span
            class="order-status ${statusClass}"
          >
            ${escapeHTML(order.status)}
          </span>

        </div>

        <div class="order-meta">

          <span>
            ${formatDate(order.createdAt)}
          </span>

          <span>
            ${formatTime(order.createdAt)}
          </span>

          <span>
            ${itemCount} item${itemCount === 1 ? "" : "s"}
          </span>

        </div>

        <div class="order-items">
          ${previewItems}
          ${extraItems}
        </div>

        <div class="order-card-footer">

          <div class="order-total">
            <span>Total</span>
            <strong>
              ${formatPrice(order.total)}
            </strong>
          </div>

          <div class="order-actions">

            <button
              type="button"
              class="order-details-btn"
              data-action="details"
              data-order-id="${escapeHTML(order.id)}"
            >
              View Details
            </button>

            <button
              type="button"
              class="order-reorder-btn"
              data-action="reorder"
              data-order-id="${escapeHTML(order.id)}"
            >
              Reorder
            </button>

          </div>

        </div>

      </article>
    `;
  }

  /* ---------------------------------------------------
     EVENTS
     --------------------------------------------------- */

  function attachOrderEvents() {

    document
      .querySelectorAll("[data-action='details']")
      .forEach(button => {

        button.addEventListener(
          "click",
          function () {

            const orderId =
              this.dataset.orderId;

            openOrderDetails(orderId);
          }
        );

      });

    document
      .querySelectorAll("[data-action='reorder']")
      .forEach(button => {

        button.addEventListener(
          "click",
          function () {

            const orderId =
              this.dataset.orderId;

            reorder(orderId);
          }
        );

      });
  }

  /* ---------------------------------------------------
     ORDER DETAILS
     --------------------------------------------------- */

  function openOrderDetails(orderId) {

    const order = getOrder(orderId);

    if (!order) {
      return;
    }

    const items = order.items || [];

    const itemHTML = items
      .map(item => {

        const name = escapeHTML(
          getItemName(item)
        );

        const quantity =
          getItemQuantity(item);

        const price =
          getItemPrice(item);

        return `
          <div class="order-detail-item">

            <span>
              ${name}
              × ${quantity}
            </span>

            <strong>
              ${formatPrice(
                price * quantity
              )}
            </strong>

          </div>
        `;
      })
      .join("");

    const existingModal =
      document.querySelector(
        ".order-details-modal"
      );

    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement("div");

    modal.className =
      "order-details-modal";

    modal.innerHTML = `
      <div class="order-modal-backdrop"></div>

      <div class="order-modal">

        <div class="order-modal-header">

          <div>
            <span class="order-label">
              ORDER DETAILS
            </span>

            <h2>
              ${escapeHTML(order.id)}
            </h2>
          </div>

          <button
            type="button"
            class="order-modal-close"
            aria-label="Close"
          >
            ×
          </button>

        </div>

        <div class="order-modal-status">
          <span
            class="order-status ${getStatusClass(order.status)}"
          >
            ${escapeHTML(order.status)}
          </span>
        </div>

        <div class="order-detail-items">
          ${itemHTML}
        </div>

        <div class="order-detail-summary">

          <div>
            <span>Subtotal</span>
            <strong>
              ${formatPrice(order.subtotal)}
            </strong>
          </div>

          <div>
            <span>Delivery</span>
            <strong>
              ${
                order.deliveryFee
                  ? formatPrice(order.deliveryFee)
                  : "FREE"
              }
            </strong>
          </div>

          <div>
            <span>Discount</span>
            <strong>
              ${
                order.discount
                  ? `-${formatPrice(order.discount)}`
                  : "₹0"
              }
            </strong>
          </div>

          <div class="order-detail-total">
            <span>Total</span>
            <strong>
              ${formatPrice(order.total)}
            </strong>
          </div>

        </div>

        <div class="order-payment">
          <span>Payment</span>
          <strong>
            ${escapeHTML(order.paymentMethod)}
          </strong>
        </div>

      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => {
      modal.remove();
    };

    modal
      .querySelector(".order-modal-close")
      .addEventListener(
        "click",
        closeModal
      );

    modal
      .querySelector(".order-modal-backdrop")
      .addEventListener(
        "click",
        closeModal
      );
  }

  /* ---------------------------------------------------
     REORDER
     --------------------------------------------------- */

  function reorder(orderId) {

    const order = getOrder(orderId);

    if (!order || !order.items?.length) {
      return;
    }

    let cart = [];

    try {
      cart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      if (!Array.isArray(cart)) {
        cart = [];
      }
    } catch (error) {
      cart = [];
    }

    order.items.forEach(orderItem => {

      const name =
        getItemName(orderItem);

      const existing =
        cart.find(item =>
          String(
            item.id ??
            item.productId ??
            item.name
          ) ===
          String(
            orderItem.id ??
            orderItem.productId ??
            orderItem.name
          )
        );

      if (existing) {

        existing.quantity =
          getItemQuantity(existing) +
          getItemQuantity(orderItem);

      } else {

        cart.push({
          ...orderItem,
          quantity:
            getItemQuantity(orderItem)
        });

      }
    });

    localStorage.setItem(
      CART_KEY,
      JSON.stringify(cart)
    );

    window.location.href =
      "cart.html";
  }

  /* ---------------------------------------------------
     INITIALIZE
     --------------------------------------------------- */

  function initOrders() {
    renderOrders();
  }

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initOrders
    );

  } else {

    initOrders();

  }

  /* ---------------------------------------------------
     GLOBAL API
     --------------------------------------------------- */

  window.ZynexCartOrders = {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    renderOrders,
    reorder
  };

})();
