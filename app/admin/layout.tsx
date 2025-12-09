"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./adminLayout.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="logo">🛍️ Admin</div>
        <nav>
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/users">Users</Link>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="main-content">
        {/* Header / Navbar */}
        <header className="admin-header">
          <button className="menu-btn" onClick={() => setOpen(!open)}>
            ☰
          </button>
          <h1 className="header-title">Admin Panel</h1>

          {/* Profile Dropdown */}
          <div className="profile-menu">
            <button
              className="profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              👤 Admin ▼
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link
                  href="/admin/profile"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/admin/change-password"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  Change Password
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout">
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
