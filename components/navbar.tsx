"use client";
import Link from "next/link";
import { useAuth } from "../components/AuthContext";
import "../styles/navbar.css"; // Fixed the typo here

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="navbar glass-header">
      <div className="navbar__container">
        {/* Logo Area */}
        <div className="navbar__logo">
          <Link href="/">ODmart</Link>
        </div>

        {/* Navigation Links */}
        <nav className="navbar__links">
          <Link href="/products" className="nav-link">Products</Link>
          <Link href="/cart" className="nav-link">Cart</Link>

          {!isLoggedIn && (
            <Link href="/register" className="nav-btn-primary">
              Login
            </Link>
          )}

          {isLoggedIn && (
            <>
              <Link href="/profile" className="nav-link">Profile</Link>
              <Link href="/orderHistory" className="nav-link">Orders</Link>
              <button onClick={logout} className="nav-btn-logout">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}