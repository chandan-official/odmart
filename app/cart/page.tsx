/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/cart.css";
import { API } from "../../lib/api";
import { AxiosError } from "axios";

interface CartItem {
  quantity: number;
  _id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("authToken"); // your JWT token
        const res = await API.get("/cart/getCart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Backend returns { items: [...] }
        setCart(res.data.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Update quantity
  const updateQuantity = async (id: string, delta: number) => {
    const item = cart.find((i) => i._id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);

    try {
      await API.put(`/cart/${id}`, { quantity: newQuantity }); // Backend update
      setCart((prev) =>
        prev.map((i) => (i._id === id ? { ...i, quantity: newQuantity } : i))
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // Remove item
  const handleRemove = async (itemId: string) => {
    try {
      await API.delete(`/cart/${itemId}`);
      setCart((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err: unknown) {
      // ✅ Type guard
      if (err instanceof AxiosError) {
        console.error(err.response?.data || err.message);
        alert(
          (err.response?.data as any)?.message ||
            err.message ||
            "Failed to remove item"
        );
      } else {
        console.error(err);
        alert("Failed to remove item");
      }
    }
  };

  // Total price
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    router.push("/checkout_client"); // Or pass cart info if needed
  };

  if (loading) return <p style={{ padding: 20 }}>Loading cart...</p>;

  return (
    <section className="cart-container">
      <h2>🛍️ My Cart</h2>
      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty 🛒</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="cart-img"
                />

                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>₹{item.price.toLocaleString()}</p>
                </div>

                <div className="cart-controls">
                  <button onClick={() => updateQuantity(item._id, -1)}>
                    -
                  </button>
                  <span>{item.qty}</span> {/* changed from quantity */}
                  <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                </div>

                <div className="cart-total">
                  ₹{(item.price * item.qty).toLocaleString()}{" "}
                  {/* changed from quantity */}
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
              <strong>Total Items:</strong>{" "}
              {cart.reduce((acc, item) => acc + item.qty, 0)}{" "}
              {/* changed from quantity */}
            </p>
            <p>
              <strong>Grand Total:</strong> ₹
              {cart
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toLocaleString()}
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
