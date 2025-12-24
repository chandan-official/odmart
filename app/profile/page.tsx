"use client";

import { useEffect, useState } from "react";
import { API, apiRoutes } from "../../lib/api";
import "../../styles/profile.css";
import { MdEmail, MdPhone, MdEdit, MdDelete, MdSave } from "react-icons/md";

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

  // --- RESTORED: FETCH PROFILE API ---
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

  // --- RESTORED: FETCH ADDRESSES API ---
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await API.get(apiRoutes.address.list);
      setAddresses(res.data.addresses || []);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- RESTORED: ADD / UPDATE ADDRESS API ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        // Update existing address
        await API.put(apiRoutes.address.update(editing), form);
      } else {
        // Create new address
        await API.post(apiRoutes.address.create, form);
      }

      // Reset Form
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
      
      // Refresh Data
      fetchProfile();
      fetchAddresses();
      
    } catch (err) {
      console.error("Save address error:", err);
      alert("Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    const addr = addresses.find((a) => a._id === id);
    if (addr) {
      setForm(addr);
      setEditing(id);
    }
    document.querySelector('.address-form-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- RESTORED: DELETE ADDRESS API ---
  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this address?")) return;
    
    setLoading(true);
    try {
      await API.delete(apiRoutes.address.delete(id));
      fetchProfile();
      fetchAddresses();
    } catch (err) {
      console.error("Delete address error:", err);
      alert("Failed to delete address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="profile-container">
      
      <div className="profile-header">
         <h1>My Account</h1>
         <p>Manage your profile and shipping details.</p>
      </div>

      <div className="profile-grid">
          {/* LEFT COLUMN: User Info */}
          <div className="profile-left">
            <div className="user-card glass-panel">
                <div className="avatar-circle">
                    {user?.name?.charAt(0) || "U"}
                </div>
                <h2>{user?.name || "User"}</h2>
                <div className="member-badge">Member</div>

                <div className="info-list">
                    <div className="info-item">
                        <MdEmail className="info-icon" />
                        <span>{user?.email || "No Email"}</span>
                    </div>
                    <div className="info-item">
                        <MdPhone className="info-icon" />
                        <span>{user?.phone || "No Phone"}</span>
                    </div>
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Addresses */}
          <div className="profile-right">
             <div className="address-section">
                <h3>Saved Addresses</h3>
                <div className="address-grid-list">
                    {addresses.length === 0 ? (
                        <p className="no-address">No addresses found. Add one below!</p>
                    ) : (
                        addresses.map((addr) => (
                        <div key={addr._id} className="address-card glass-panel">
                            <div className="addr-header">
                                <span className="addr-label-badge">{addr.label || "Home"}</span>
                                <div className="addr-actions">
                                    <button onClick={() => handleEdit(addr._id!)} title="Edit"><MdEdit /></button>
                                    <button onClick={() => handleDelete(addr._id!)} title="Delete" className="delete-btn"><MdDelete /></button>
                                </div>
                            </div>
                            <p className="addr-text">{addr.street}</p>
                            <p className="addr-text">{addr.city}, {addr.state} - {addr.postalCode}</p>
                            <p className="addr-text country">{addr.country}</p>
                            <p className="addr-phone"><MdPhone style={{marginRight: 5}}/> {addr.phone}</p>
                        </div>
                        ))
                    )}
                </div>
             </div>

             <div className="address-form-card glass-panel">
                <h3>{editing ? "Edit Address" : "Add New Address"}</h3>
                <form onSubmit={handleSubmit} className="address-form">
                    <div className="form-row">
                        <input type="text" name="label" placeholder="Label (e.g. Home)" value={form.label} onChange={handleChange} required />
                        <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
                    </div>
                    <input type="text" name="street" placeholder="Street Address" value={form.street} onChange={handleChange} required />
                    <div className="form-row">
                        <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
                        <input type="text" name="state" placeholder="State" value={form.state} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <input type="text" name="postalCode" placeholder="Postal Code" value={form.postalCode} onChange={handleChange} required />
                        <input type="text" name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
                    </div>

                    <button className="btn-save-addr" disabled={loading}>
                        <MdSave style={{fontSize: '1.2rem'}}/> 
                        {editing ? "Update Address" : "Save Address"}
                    </button>
                    {editing && (
                        <button type="button" className="btn-cancel-edit" onClick={() => {setEditing(null); setForm({street: "", city: "", state: "", postalCode: "", country: "", label: "", phone: ""})}}>
                            Cancel
                        </button>
                    )}
                </form>
             </div>
          </div>
      </div>
    </section>
  );
}