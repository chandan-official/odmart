"use client";
import { useState } from "react";
import "./profile.css";

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState({
    name: "Admin User",
    email: "admin@example.com",
  });

  const [form, setForm] = useState(admin);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // ✅ Replace with real API later:
      // await axios.put("/api/admin/profile", form, { headers: { Authorization: `Bearer ${token}` } });

      setAdmin(form);
      setEditing(false);
      setMessage("Profile updated successfully ✅");
    } catch (err) {
      setMessage("Failed to update profile ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-profile-container">
      <div className="admin-profile-box">
        <h2>Admin Profile 👤</h2>

        {!editing ? (
          <div className="admin-profile-view">
            <p>
              <strong>Name:</strong> {admin.name}
            </p>
            <p>
              <strong>Email:</strong> {admin.email}
            </p>
            <button className="btn-primary" onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="admin-profile-form">
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="action-buttons">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditing(false);
                  setForm(admin);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}

        {message && <p className="status-msg">{message}</p>}
      </div>
    </section>
  );
}
