"use client";
import { useEffect, useState } from "react";
import "../../styles/order.css";

interface Order {
  _id: string;
  date: string;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Paid" | "Pending" | "Failed";
  items: { name: string; quantity: number; price: number }[];
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const handleView = () => {
    alert("Viewing order details (dummy)...");
    window.location.href = "/order-detail";
  };

  useEffect(() => {
    // 🧩 Dummy data simulating backend response
    setTimeout(() => {
      setOrders([
        {
          _id: "ORD123456",
          date: "2025-10-25",
          total: 3298,
          status: "Delivered",
          paymentStatus: "Paid",
          items: [
            { name: "Wireless Mouse", quantity: 1, price: 999 },
            { name: "Keyboard", quantity: 1, price: 2299 },
          ],
        },
        {
          _id: "ORD789012",
          date: "2025-10-20",
          total: 1499,
          status: "Processing",
          paymentStatus: "Pending",
          items: [{ name: "Bluetooth Speaker", quantity: 1, price: 1499 }],
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) return <p className="loading">Loading your orders...</p>;

  return (
    <section className="orders-container">
      <h2>📦 My Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order._id}</h3>
                <p>Date: {order.date}</p>
              </div>
              <div className="status-box">
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
                <span
                  className={`payment ${order.paymentStatus.toLowerCase()}`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span>{item.name}</span>
                  <span>
                    {item.quantity} × ₹{item.price}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <p>
                <strong>Total:</strong> ₹{order.total.toLocaleString()}
              </p>
              <button className="btn-view" onClick={handleView}>
                View Details
              </button>
            </div>
          </div>
        ))
      )}
    </section>
  );
}
