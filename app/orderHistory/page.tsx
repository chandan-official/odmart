/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import "../../styles/order-details.css";
import { API } from "../../lib/api";
import { MdLocalShipping, MdTimer, MdCheckCircle, MdCancel, MdChevronRight, MdClose } from "react-icons/md";

interface OrderItem {
  productId: string;
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
  status: "pending" | "confirmed" | "packed" | "in_transit" | "delivered" | "cancelled";
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

  // --- RESTORED: FETCH ORDERS API ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        // If no token, the API will likely return 401, handled in catch
        const res = await API.get("/orders/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // --- RESTORED: CANCEL ORDER API ---
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

      alert("Order cancelled successfully!");
      
      // Update local state to reflect cancellation
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
      alert("Failed to cancel order. It might already be processed.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
        case "delivered": return <MdCheckCircle />;
        case "cancelled": return <MdCancel />;
        case "in_transit": return <MdLocalShipping />;
        default: return <MdTimer />;
    }
  };

  if (loading) return <div className="loader-container">Loading orders...</div>;
  if (error) return <p className="error-text" style={{textAlign:'center', padding: '40px'}}>{error}</p>;

  return (
    <div className="od-container">
      <div className="od-header">
        <h1 className="od-title">Order History</h1>
        <p>Track, return, or buy things again.</p>
      </div>

      {!orders.length ? (
          <div className="no-orders" style={{textAlign:'center', color: '#888', fontStyle:'italic'}}>
              <p>No orders found.</p>
          </div>
      ) : (
          <div className="order-list">
            {orders.map((order) => {
                const subtotal = order.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
                const total = order.totalAmount || subtotal;
                const canCancel = ["pending", "confirmed"].includes(order.status);
                const isCancelled = order.status === "cancelled";

                return (
                <div className={`od-card glass ${isCancelled ? 'cancelled-card' : ''}`} key={order._id}>
                    <div className="od-card-header">
                        <div className="header-left">
                            <h2 className="od-id">Order #{order._id.slice(-6).toUpperCase()}</h2>
                            <p className="od-date">{new Date(order.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className={`status-badge ${order.status}`}>
                            {getStatusIcon(order.status)}
                            <span>{order.status.replace("_", " ")}</span>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="od-items">
                        {order.items.map((item, i) => (
                            <div className="od-item" key={i}>
                                <div className="img-wrapper">
                                    <img src={item.image || "/placeholder.png"} alt={item.name} />
                                </div>
                                <div className="item-info">
                                    <p className="item-name">{item.name}</p>
                                    <p className="item-meta">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                </div>
                                <div className="item-price">
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="divider"></div>

                    <div className="od-footer">
                        <div className="total-block">
                            <span>Total Amount</span>
                            <span className="total-price">₹{total.toLocaleString()}</span>
                        </div>
                        
                        <div className="action-buttons">
                            {canCancel && (
                                <button
                                    className="btn-cancel"
                                    onClick={() => { setSelectedOrder(order); setShowCancelModal(true); }}
                                >
                                    Cancel Order
                                </button>
                            )}
                            <button className="btn-details">
                                View Details <MdChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
                );
            })}
          </div>
      )}

      {/* CANCEL MODAL */}
      {showCancelModal && selectedOrder && (
        <div className="od-modal-overlay">
          <div className="od-modal-box glass">
            <div className="modal-header">
                <h3>Cancel Order</h3>
                <button onClick={() => setShowCancelModal(false)}><MdClose /></button>
            </div>

            <p className="modal-desc">Are you sure you want to cancel <strong>Order #{selectedOrder._id.slice(-6)}</strong>? This action cannot be undone.</p>

            <label className="modal-label">Reason for Cancellation</label>
            <textarea
              className="modal-textarea"
              placeholder="e.g. Changed my mind, Found a better price..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <div className="modal-actions">
              <button className="btn-modal-close" onClick={() => setShowCancelModal(false)}>Keep Order</button>
              <button className="btn-modal-confirm" onClick={handleConfirmCancel}>Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}