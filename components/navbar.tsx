"use client";
import Link from "next/link";
import { useAuth } from "../components/AuthContext";
import "../styles/navabar.css";

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__logo">
        <Link href="/">ODmart</Link>
      </div>

      <nav className="navbar__links">
        <Link href="/products">Products</Link>
        <Link href="/cart">Cart</Link>

        {!isLoggedIn && <Link href="/register">Login</Link>}
        {isLoggedIn && <Link href="/profile">Profile</Link>}
        {isLoggedIn && <Link href="/orderHistory">Orders</Link>}
        {isLoggedIn && (
          <button onClick={logout} className="navbar__link-button">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
