/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import "../../styles/order-details.css";
import { API } from "../../lib/api";

interface OrderItem {
  productId: string; // just store the ID
  name: string;
  image?: string;
  quantity: number;
  price: number;
}

interface Address {
  fullName: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  street: string;
  landmark?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "packed"
    | "in_transit"
    | "delivered"
    | "cancelled";
  statusHistory: { status: string; timestamp: string }[];
  paymentInfo: { method: string; transactionId?: string; status?: string };
  address: Address;
  createdAt: string;
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  // Fetch orders using auth token
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await API.get("/orders/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) return alert("Please enter a reason!");
    if (!selectedOrder) return alert("No order selected");

    try {
      const token = localStorage.getItem("authToken");
      await API.put(
        `/orders/cancel/${selectedOrder._id}`,
        { reason: cancelReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order cancelled!");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id ? { ...o, status: "cancelled" } : o
        )
      );

      setShowCancelModal(false);
      setSelectedOrder(null);
      setCancelReason("");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading orders...</p>;
  if (error) return <p>{error}</p>;
  if (!orders.length) return <p>No orders found</p>;

  return (
    <div className="od-container">
      <h1 className="od-title">Your Orders</h1>

      {orders.map((order) => {
        const subtotal = order.items.reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
          0
        );
        const total = order.totalAmount || subtotal;
        const canCancel = ["pending", "confirmed"].includes(order.status);

        return (
          <div className="od-section" key={order._id}>
            <h2 className="od-subtitle">Order #{order._id.slice(-6)}</h2>
            <p className="od-date">
              Placed on {new Date(order.createdAt).toDateString()}
            </p>
            <p className="od-status">Status: {order.status}</p>

            <h3>Items</h3>
            {order.items.map((item, i) => (
              <div className="od-item" key={i}>
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name || "Item"}
                  className="od-item-img"
                />
                <div>
                  <p className="od-item-name">{item.name}</p>
                  <p className="od-item-price">₹{item.price}</p>
                  <p className="od-item-qty">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}

            <h3>Bill Summary</h3>
            <div className="od-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="od-row">
              <span>Total Payable</span>
              <span>₹{total}</span>
            </div>

            {canCancel && (
              <button
                className="od-cancel-btn"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowCancelModal(true);
                }}
              >
                Cancel Order
              </button>
            )}
          </div>
        );
      })}

      {/* Cancel Modal */}
      {showCancelModal && selectedOrder && (
        <div className="od-modal">
          <div className="od-modal-box">
            <h3 className="od-modal-title">
              Cancel Order #{selectedOrder._id.slice(-6)}
            </h3>

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
