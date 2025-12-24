"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API, apiRoutes } from "../../../lib/api";
import "./orderid.css";

interface ProductImage {
  url: string;
}

interface Product {
  _id: string;
  name: string;
  productImageurls?: ProductImage[];
  price: number;
}

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  product: Product;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  let orderId = params?.orderId;

  // Ensure orderId is a string
  if (Array.isArray(orderId)) orderId = orderId[0];

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const res = await API.get<Order>(apiRoutes.orders.getById(orderId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) return alert("Please enter a reason!");
    alert("Order cancelled!");
    setShowCancelModal(false);
  };

  if (loading) return <div>Loading order...</div>;
  if (!order) return <div>Order not found!</div>;

  const canCancel = !["Delivered", "Cancelled", "Shipped"].includes(
    order.status
  );

  return (
    <div className="od-container">
      <h1 className="od-title">Order Details</h1>

      {/* ORDER INFO */}
      <div className="od-section">
        <h2>Order #{order._id.slice(-6).toUpperCase()}</h2>
        <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Payment Mode: {order.paymentMethod}</p>
        <p>Status: {order.status}</p>
      </div>

      {/* STATUS TRACKER */}
      <div className="od-section">
        <h2>Delivery Status</h2>
        <div className="od-tracker">
          {["Processing", "Packed", "Shipped", "Delivered"].map((step) => (
            <div
              key={step}
              className={`od-step ${
                ["Processing", "Packed", "Shipped", "Delivered"].indexOf(
                  step
                ) <=
                ["Processing", "Packed", "Shipped", "Delivered"].indexOf(
                  order.status
                )
                  ? "active"
                  : ""
              }`}
            >
              {step}
            </div>
          ))}
        </div>

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
        <h2>Items</h2>
        {order.orderItems.map((item, i) => (
          <div key={i} className="od-item">
            <img
              src={
                item.product.productImageurls?.[0]?.url || "/placeholder.png"
              }
              alt={item.name}
              className="od-item-img"
            />
            <div>
              <p>{item.name}</p>
              <p>Qty: {item.qty}</p>
              <p>₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="od-section">
        <h2>Total Amount</h2>
        <p>₹{order.totalPrice}</p>
      </div>

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="od-modal">
          <div className="od-modal-box">
            <h3>Cancel Order</h3>
            <label>Reason *</label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Why do you want to cancel?"
            />
            <div className="od-modal-actions">
              <button onClick={() => setShowCancelModal(false)}>Close</button>
              <button onClick={handleConfirmCancel}>Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
