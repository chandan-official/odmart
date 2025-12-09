"use client";
import Link from "next/link";
import "../styles/navabar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__logo">
        <Link href="/">ShopEasy</Link>
      </div>
      <nav className="navbar__links">
        <Link href="/products">Products</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/orderHistory">Orders</Link>
        <Link href="/register">Login</Link>
      </nav>
    </header>
  );
}
