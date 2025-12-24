/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/cart.css";
import { API } from "../../lib/api";
import { AxiosError } from "axios";
import { MdDeleteOutline, MdShoppingBag } from "react-icons/md";

interface CartItem {
  quantity: number;
  _id: string; // Cart Item ID or Product ID depending on your backend structure
  name: string;
  price: number;
  qty?: number; // Handling potential inconsistency in naming
  image: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- RESTORED: FETCH CART FROM API ---
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        
        // If no token, user might need to login, but we'll try fetching anyway or handle empty
        if (!token) {
            setLoading(false);
            return;
        }

        const res = await API.get("/cart/getCart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Ensure we handle the response structure correctly
        setCart(res.data.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // --- RESTORED: UPDATE QUANTITY API ---
  const updateQuantity = async (id: string, delta: number) => {
    const item = cart.find((i) => i._id === id);
    if (!item) return;

    // effective quantity handling
    const currentQty = item.qty || item.quantity;
    const newQuantity = Math.max(1, currentQty + delta);

    try {
      await API.put(`/cart/${id}`, { quantity: newQuantity });
      
      // Update local state to reflect change immediately
      setCart((prev) =>
        prev.map((i) => (i._id === id ? { ...i, quantity: newQuantity, qty: newQuantity } : i))
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // --- RESTORED: REMOVE ITEM API ---
  const handleRemove = async (itemId: string) => {
    try {
      await API.delete(`/cart/${itemId}`);
      setCart((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error(err.response?.data || err.message);
        alert((err.response?.data as any)?.message || "Failed to remove item");
      } else {
        console.error(err);
        alert("Failed to remove item");
      }
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    router.push("/checkout_client");
  };

  // Calculate total items helper
  const getTotalItems = () => cart.reduce((acc, item) => acc + (item.qty || item.quantity), 0);
  
  // Calculate total price helper
  const getTotalPrice = () => cart.reduce((acc, item) => acc + (item.qty || item.quantity) * item.price, 0);

  if (loading) return (
    <div className="cart-loader">
      <div className="spinner"></div>
      <p>Loading your bag...</p>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Shopping Bag</h1>
        <p>{getTotalItems()} Items</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart-container">
          <MdShoppingBag className="empty-icon" />
          <h2>Your bag is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
        </div>
      ) : (
        <div className="cart-grid">
          {/* LEFT COLUMN: Items */}
          <div className="cart-items-column">
            {cart.map((item) => (
              <div key={item._id} className="cart-item-card glass">
                
                <div className="item-image-wrapper">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="item-image"
                  />
                </div>

                <div className="item-details">
                  <div className="item-header">
                    <h3>{item.name}</h3>
                    <button
                      className="btn-remove"
                      onClick={() => handleRemove(item._id)}
                    >
                      <MdDeleteOutline />
                    </button>
                  </div>

                  <p className="item-price">₹{item.price.toLocaleString()}</p>

                  <div className="item-controls-row">
                    <div className="qty-selector">
                      <button onClick={() => updateQuantity(item._id, -1)}>−</button>
                      <span>{item.qty || item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                    </div>

                    <p className="item-subtotal">
                      Total: ₹{(item.price * (item.qty || item.quantity)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: Summary */}
          <div className="cart-summary-column">
            <div className="summary-card glass">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{getTotalPrice().toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span className="text-green">Free</span>
              </div>

              <div className="divider"></div>

              <div className="summary-row total">
                <span>Total</span>
                <span>₹{getTotalPrice().toLocaleString()}</span>
              </div>

              <button className="btn-checkout-glow" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}