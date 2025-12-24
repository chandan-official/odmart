/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/cart.css";
import { API } from "../../lib/api";
import { AxiosError } from "axios";
import { MdDeleteOutline, MdShoppingBag } from "react-icons/md";

interface ProductImage {
  url: string;
}

interface Product {
  _id: string;
  productImageurls?: ProductImage[];
}

interface CartItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
  product: Product;
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
        setCart(res.data.cartItems || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // --- RESTORED: UPDATE QUANTITY API ---
  const updateQuantity = async (cartItemId: string, delta: number) => {
    const item = cart.find((i) => i._id === cartItemId);
    if (!item) return;

    const newQty = Math.max(1, item.qty + delta);

    try {
      await API.put(`/cart/update/${cartItemId}`, { qty: newQty });

      setCart((prev) =>
        prev.map((i) => (i._id === cartItemId ? { ...i, qty: newQty } : i))
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // --- RESTORED: REMOVE ITEM API ---
  const handleRemove = async (cartItemId: string) => {
    try {
      const token = localStorage.getItem("authToken");

      await API.delete(`/cart/clear/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart((prev) => prev.filter((item) => item._id !== cartItemId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
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
  const getTotalItems = () => cart.reduce((acc, item) => acc + item.qty, 0);

  const getTotalPrice = () =>
    cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  if (loading)
    return (
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
          <p>Looks like you haven&apos;t added anything yet.</p>
        </div>
      ) : (
        <div className="cart-grid">
          {/* LEFT COLUMN: Items */}
          <div className="cart-items-column">
            {cart.map((item) => (
              <div key={item._id} className="cart-item-card glass">
                <div className="item-image-wrapper">
                  <img
                    src={
                      item.product?.productImageurls?.[0]?.url ||
                      "/placeholder.png"
                    }
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
                      <button onClick={() => updateQuantity(item._id, -1)}>
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQuantity(item._id, 1)}>
                        +
                      </button>
                    </div>

                    <p className="item-subtotal">
                      Total: ₹{(item.price * item.qty).toLocaleString()}
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
