/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import "./orders.css";

interface Order {
  _id: string;
  user: string;
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  date: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // TODO: Replace with backend API
    setOrders([
      {
        _id: "ORD001",
        user: "Riya Patel",
        total: 1599,
        status: "pending",
        date: "2025-10-28",
      },
      {
        _id: "ORD002",
        user: "Aman Singh",
        total: 2499,
        status: "shipped",
        date: "2025-10-27",
      },
      {
        _id: "ORD003",
        user: "Chandan Jha",
        total: 999,
        status: "delivered",
        date: "2025-10-25",
      },
    ]);
  }, []);

  const updateStatus = (id: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <section className="orders-container">
      <h2>Order Management</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Total (₹)</th>
            <th>Status</th>
            <th>Date</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.user}</td>
              <td>{o.total}</td>
              <td>
                <span className={`status ${o.status}`}>{o.status}</span>
              </td>
              <td>{o.date}</td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) =>
                    updateStatus(o._id, e.target.value as Order["status"])
                  }
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
