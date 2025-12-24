/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import React from "react";
import "../styles/footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section about">
          <h3>ODmart</h3>
          <p>
            Your trusted shopping partner for quality products at the best
            prices. Fast delivery, secure payments, and reliable service —
            always.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/products">Products</a>
            </li>
            <li>
              <a href="/cart">Cart</a>
            </li>
            <li>
              <a href="/profile">My Account</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section contact">
          <h4>Contact Us</h4>
          <p>📞 +91 98765 43210</p>
          <p>📧 support@shopease.com</p>
          <p>📍 Mumbai, India</p>
        </div>

        {/* Social Links */}
        <div className="footer-section social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#">
              <FaFacebookF />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ODmart. All rights reserved.</p>
      </div>
    </footer>
  );
}
