/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import "../../styles/order-details.css";

export default function OrderDetailsPage() {
  // Fake order for now (replace with real API)
  const order = {
    id: "OD12345",
    date: "Jan 26, 2025",
    paymentMode: "Cash on Delivery",
    status: "Processing", // Processing | Packed | Shipped | Delivered | Cancelled
    subtotal: 1999,
    deliveryCharge: 40,
    discount: 0,
    items: [
      {
        name: "Running Shoes Pro",
        qty: 1,
        price: 1999,
        image: "/shoe.jpeg",
      },
    ],
  };

  const total = order.subtotal + order.deliveryCharge - order.discount;

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const canCancel =
    order.status !== "Shipped" &&
    order.status !== "Delivered" &&
    order.status !== "Cancelled";

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) return alert("Please enter a reason!");
    alert("Order cancelled!");
    setShowCancelModal(false);
  };

  return (
    <div className="od-container">
      <h1 className="od-title">Order Details</h1>

      {/* ORDER INFO */}
      <div className="od-section">
        <h2 className="od-subtitle">Order #{order.id}</h2>
        <p className="od-date">Placed on {order.date}</p>
      </div>

      {/* STATUS */}
      <div className="od-section">
        <h2 className="od-subtitle">Delivery Status</h2>
        <p className="od-status">{order.status}</p>

        <div className="od-tracker">
          <div
            className={`od-step ${
              order.status !== "Processing" ? "active" : ""
            }`}
          >
            Processing
          </div>
          <div
            className={`od-step ${
              order.status === "Packed" ||
              order.status === "Shipped" ||
              order.status === "Delivered"
                ? "active"
                : ""
            }`}
          >
            Packed
          </div>
          <div
            className={`od-step ${
              order.status === "Shipped" || order.status === "Delivered"
                ? "active"
                : ""
            }`}
          >
            Shipped
          </div>
          <div
            className={`od-step ${
              order.status === "Delivered" ? "active" : ""
            }`}
          >
            Delivered
          </div>
        </div>

        {/* Cancel Order */}
        {canCancel && (
          <button
            className="od-cancel-btn"
            onClick={() => setShowCancelModal(true)}
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* ITEMS */}
      <div className="od-section">
        <h2 className="od-subtitle">Items</h2>

        {order.items.map((item, i) => (
          <div className="od-item" key={i}>
            <img src={item.image} className="od-item-img" />
            <div>
              <p className="od-item-name">{item.name}</p>
              <p className="od-item-price">₹{item.price}</p>
              <p className="od-item-qty">Qty: {item.qty}</p>
            </div>
          </div>
        ))}
      </div>

      {/* PAYMENT */}
      <div className="od-section">
        <h2 className="od-subtitle">Payment</h2>
        <p className="od-payment">{order.paymentMode}</p>
      </div>

      {/* BILL */}
      <div className="od-section">
        <h2 className="od-subtitle">Bill Summary</h2>

        <div className="od-row">
          <span>Subtotal</span>
          <span>₹{order.subtotal}</span>
        </div>

        <div className="od-row">
          <span>Delivery Charge</span>
          <span>₹{order.deliveryCharge}</span>
        </div>

        <div className="od-row">
          <span>Discount</span>
          <span>₹{order.discount}</span>
        </div>

        <div className="od-total-row">
          <span>Total Payable</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* HELP */}
      <div className="od-section">
        <h2 className="od-subtitle">Help & Support</h2>
        <p className="od-help-text">
          Need assistance? Contact us at <strong>support@shopeasy.com</strong>{" "}
          or call <strong>+91 98765 43210</strong>.
        </p>
      </div>

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="od-modal">
          <div className="od-modal-box">
            <h3 className="od-modal-title">Cancel Order</h3>

            <label className="od-modal-label">Reason *</label>
            <textarea
              className="od-modal-input"
              placeholder="Why do you want to cancel?"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <div className="od-modal-actions">
              <button
                className="od-modal-cancel"
                onClick={() => setShowCancelModal(false)}
              >
                Close
              </button>
              <button
                className="od-modal-confirm"
                onClick={handleConfirmCancel}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
