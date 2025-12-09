/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import "../../styles/profile.css";

interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Chandan Jha",
    email: "example@mail.com",
    phone: "9876543210",
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<Address>({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🧩 Simulate Fetching Profile + Addresses
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Dummy "fetched" data
      setUser({
        name: "Chandan Jha",
        email: "chandan@example.com",
        phone: "9876543210",
      });
      setAddresses([
        {
          _id: "1",
          street: "123 Main Street",
          city: "Patna",
          state: "Bihar",
          pincode: "800001",
        },
        {
          _id: "2",
          street: "22 Tech Park Road",
          city: "Bangalore",
          state: "Karnataka",
          pincode: "560001",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🧠 Simulate Add / Update API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (editing) {
        // Update dummy record
        setAddresses((prev) =>
          prev.map((a) => (a._id === editing ? { ...form, _id: editing } : a))
        );
        setEditing(null);
      } else {
        // Add new dummy record
        setAddresses((prev) => [
          ...prev,
          { ...form, _id: Date.now().toString() },
        ]);
      }

      setForm({ street: "", city: "", state: "", pincode: "" });
      setLoading(false);
    }, 800);
  };

  const handleEdit = (id: string) => {
    const addr = addresses.find((a) => a._id === id);
    if (addr) {
      setForm(addr);
      setEditing(id);
    }
  };

  // 🗑️ Simulate Delete API
  const handleDelete = async (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      setLoading(false);
    }, 600);
  };

  return (
    <section className="profile-container">
      <div className="profile-box">
        <h2>My Profile </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="user-info">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
          </div>
        )}
      </div>

      <div className="address-box">
        <h2>My Addresses 📍</h2>

        <form onSubmit={handleSubmit} className="address-form">
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={form.street}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {editing ? "Update Address" : "Add Address"}
          </button>
        </form>

        <div className="address-list">
          {addresses.length === 0 && (
            <p className="no-address">No addresses added yet.</p>
          )}

          {addresses.map((addr) => (
            <div key={addr._id} className="address-item">
              <div>
                <p>{addr.street}</p>
                <p>
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
              <div className="actions">
                <button onClick={() => handleEdit(addr._id!)}>✏️ Edit</button>
                <button onClick={() => handleDelete(addr._id!)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
