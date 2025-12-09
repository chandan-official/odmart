/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import "../../styles/cart.css";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 🧩 Simulate fetching cart from API
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCart([
        {
          _id: "1",
          name: "Wireless Headphones",
          price: 1999,
          quantity: 1,
          image: "./shoe.jpeg",
        },
        {
          _id: "2",
          name: "Smart Watch",
          price: 2499,
          quantity: 2,
          image: "./shoe.jpeg",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // 🧠 Update quantity logic
  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // 🗑️ Remove from cart
  const handleRemove = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // 💰 Total price
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ✅ Checkout simulation
  const handleCheckout = () => {
    alert("Proceeding to checkout (dummy)...");
    // Navigate to checkout page with cart details
    const query = new URLSearchParams();
    cart.forEach((item) => {
      query.append("id", item._id);
      query.append("name", item.name);
      query.append("price", item.price.toString());
      query.append("quantity", item.quantity.toString());
      query.append("image", item.image);
    });
    window.location.href = `/checkout?${query.toString()}`;
  };

  return (
    <section className="cart-container">
      <h2>🛍️ My Cart</h2>

      {loading ? (
        <p>Loading your cart...</p>
      ) : cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty 🛒</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-img" />

                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>₹{item.price.toLocaleString()}</p>
                </div>

                <div className="cart-controls">
                  <button onClick={() => updateQuantity(item._id, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                </div>

                <div className="cart-total">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item._id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Cart Summary</h3>
            <p>
              <strong>Total Items:</strong> {cart.length}
            </p>
            <p>
              <strong>Grand Total:</strong> ₹{total.toLocaleString()}
            </p>
            <button className="btn-checkout" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
}
