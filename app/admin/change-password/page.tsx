/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import "./adminchangepswd.css";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (form.newPassword !== form.confirmPassword) {
      return setError("New passwords do not match");
    }

    if (form.newPassword.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    try {
      setLoading(true);
      // Dummy API simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // ✅ Replace with real API later:
      // await axios.post("/api/admin/change-password", form, { headers: { Authorization: `Bearer ${token}` } });

      setMessage("Password changed successfully ✅");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setError("Failed to change password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="change-password-container">
      <div className="change-password-box">
        <h2>Change Password 🔑</h2>

        <form onSubmit={handleSubmit} className="change-password-form">
          <div className="input-group">
            <label>Current Password</label>
            <input
              type={show ? "text" : "password"}
              name="currentPassword"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>New Password</label>
            <input
              type={show ? "text" : "password"}
              name="newPassword"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm New Password</label>
            <input
              type={show ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="toggle-show">
            <label>
              <input
                type="checkbox"
                checked={show}
                onChange={() => setShow(!show)}
              />{" "}
              Show Passwords
            </label>
          </div>

          {error && <p className="error-msg">{error}</p>}
          {message && <p className="success-msg">{message}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </section>
  );
}
