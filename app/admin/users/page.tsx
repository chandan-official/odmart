/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import "./user.css";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  status: "active" | "blocked";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // TODO: Replace with backend API
    setUsers([
      {
        _id: "1",
        name: "Chandan Jha",
        email: "chandan@mail.com",
        phone: "9876543210",
        role: "admin",
        status: "active",
      },
      {
        _id: "2",
        name: "Riya Patel",
        email: "riya@mail.com",
        phone: "9976543210",
        role: "user",
        status: "active",
      },
      {
        _id: "3",
        name: "Aman Singh",
        email: "aman@mail.com",
        phone: "9988776655",
        role: "user",
        status: "blocked",
      },
    ]);
  }, []);

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === id
          ? { ...u, status: u.status === "active" ? "blocked" : "active" }
          : u
      )
    );
  };

  return (
    <section className="users-container">
      <h2>User Management</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u._id}>
              <td>{i + 1}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.role}</td>
              <td>
                <span className={`status ${u.status}`}>{u.status}</span>
              </td>
              <td>
                <button
                  className={`btn ${
                    u.status === "active" ? "block" : "activate"
                  }`}
                  onClick={() => toggleStatus(u._id)}
                >
                  {u.status === "active" ? "Block" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
