"use client";
import { useEffect, useState } from "react";
import "./dashboard.css";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalSales: 120450,
    totalOrders: 324,
    totalUsers: 189,
    productsListed: 87,
  });

  const [recentOrders, setRecentOrders] = useState([
    { id: "ORD001", user: "Chandan Jha", total: 1499, status: "Delivered" },
    { id: "ORD002", user: "Riya Patel", total: 899, status: "Processing" },
    { id: "ORD003", user: "Aman Singh", total: 2499, status: "Shipped" },
    { id: "ORD004", user: "Sneha Rao", total: 499, status: "Cancelled" },
  ]);

  useEffect(() => {
    // TODO: Replace with actual API call
  }, []);

  return (
    <section className="dashboard">
      <h2>Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p>₹ {stats.totalSales.toLocaleString()}</p>
        </div>

        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>

        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="stat-card">
          <h3>Products Listed</h3>
          <p>{stats.productsListed}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <h3>Recent Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user}</td>
                <td>₹ {order.total}</td>
                <td>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
