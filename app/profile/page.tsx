"use client";

import { useEffect, useState } from "react";
import { API, apiRoutes } from "../../lib/api";
import "../../styles/profile.css";

interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  label?: string;
  phone: string;
}

interface User {
  name: string;
  email: string;
  phone: string;
  addresses?: Address[];
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<Address>({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    label: "",
    phone: "",
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // FETCH PROFILE & ADDRESSES
  // -----------------------------
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get(apiRoutes.profile.get);
      setUser(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await API.get(apiRoutes.address.list);
      console.log("Addresses response:", res.data); // debug
      setAddresses(res.data.addresses || []); // or res.data if the endpoint returns array directly
    } catch (err) {
      console.error("Addresses fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, []);

  // -----------------------------
  // HANDLE INPUT CHANGE
  // -----------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // ADD / UPDATE ADDRESS
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        // Update address
        await API.put(apiRoutes.address.update(editing), form);
      } else {
        // Add new address
        await API.post(apiRoutes.address.create, form);
      }

      // Reset form
      setForm({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        label: "",
        phone: "",
      });
      setEditing(null);

      // Refresh addresses
      fetchProfile();
    } catch (err) {
      console.error("Save address error:", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // LOAD ADDRESS INTO FORM FOR EDIT
  // -----------------------------
  const handleEdit = (id: string) => {
    const addr = addresses.find((a) => a._id === id);
    if (addr) {
      setForm(addr);
      setEditing(id);
    }
  };

  // -----------------------------
  // DELETE ADDRESS
  // -----------------------------
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await API.delete(apiRoutes.address.delete(id));
      fetchProfile();
    } catch (err) {
      console.error("Delete address error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="profile-container">
      {" "}
      <div className="profile-box">
        {" "}
        <h2>My Profile</h2>
        {!user || loading ? (
          <p>Loading...</p>
        ) : (
          <div className="user-info">
            {" "}
            <p>
              <strong>Name:</strong> {user.name}
            </p>{" "}
            <p>
              <strong>Email:</strong> {user.email}
            </p>{" "}
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>{" "}
          </div>
        )}{" "}
      </div>
      <div className="address-box">
        <h2>My Addresses 📍</h2>

        <form onSubmit={handleSubmit} className="address-form">
          <input
            type="text"
            required
            name="label"
            placeholder="Label (Home, Work)"
            value={form.label}
            onChange={handleChange}
          />
          <input
            type="text"
            required
            name="street"
            placeholder="Street"
            value={form.street}
            onChange={handleChange}
          />
          <input
            type="text"
            required
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />
          <input
            type="text"
            required
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
          />
          <input
            type="text"
            required
            name="postalCode"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={handleChange}
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
          />
          <input
            type="text"
            required
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />

          <button className="btn-primary" disabled={loading}>
            {editing ? "Update Address" : "Add Address"}
          </button>
        </form>

        <div className="address-list">
          {addresses.length === 0 ? (
            <p className="no-address">No addresses added.</p>
          ) : (
            addresses.map((addr) => (
              <div key={addr._id} className="address-item">
                <div>
                  <p>{addr.street}</p>
                  <p>
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  <p>{addr.country}</p>
                  {addr.label && <p>Label: {addr.label}</p>}
                  <p>Phone: {addr.phone}</p>
                </div>

                <div className="actions">
                  <button onClick={() => handleEdit(addr._id!)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(addr._id!)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
