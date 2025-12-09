/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import "../../styles/checkout.css";
import { API, apiRoutes } from "../../lib/api";

interface Product {
  _id: string;
}

interface CartItem {
  product: Product;
  _id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface Address {
  _id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  text?: string; // formatted text
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();

  const buyNowProduct = searchParams.get("id")
    ? [
        {
          _id: searchParams.get("id")!,
          name: searchParams.get("name")!,
          price: Number(searchParams.get("price")!),
          qty: Number(searchParams.get("quantity")!),
          image: searchParams.get("image") || "/placeholder.png",
          product: { _id: searchParams.get("id")! },
        },
      ]
    : [];

  const [cart, setCart] = useState<CartItem[]>(buyNowProduct);
  const [loading, setLoading] = useState(buyNowProduct.length === 0);

  // ---------------------------
  // FETCH CART IF NOT BUY NOW
  // ---------------------------
  useEffect(() => {
    if (buyNowProduct.length > 0) return;

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await API.get("/cart/getCart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // ---------------------------
  // PRICE CALCULATION
  // ---------------------------
  const deliveryCharge = 0;
  const discount = 0;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalPayable = subtotal + deliveryCharge - discount;

  // ---------------------------
  // ADDRESSES
  // ---------------------------
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await API.get(apiRoutes.address.list, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Map addresses to display text
      const mapped: Address[] = (res.data.addresses || []).map((addr: any) => ({
        ...addr,
        text: `${addr.label || "Address"}, ${addr.street}, ${addr.city}, ${
          addr.state
        } - ${addr.postalCode}, ${addr.country}`,
      }));

      setAddresses(mapped);
      if (mapped.length > 0) setSelectedAddress(mapped[0]._id);
    } catch (err) {
      console.error("Addresses fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ---------------------------
  // NEW ADDRESS FORM
  // ---------------------------
  const [showModal, setShowModal] = useState(false);
  const initialAddress = {
    label: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  };
  const [newAddress, setNewAddress] = useState(initialAddress);

  const handleAddAddress = async () => {
    const missingFields = Object.keys(newAddress).filter(
      (key) => !newAddress[key as keyof typeof newAddress]
    );
    if (missingFields.length > 0) {
      alert("Please fill all required fields (*)");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await API.post(apiRoutes.address.create, newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewAddress(initialAddress);
      setShowModal(false);
      fetchAddresses(); // refresh list
    } catch (err) {
      console.error("Add address failed:", err);
      alert("Failed to add address. Try again.");
    }
  };

  // ---------------------------
  // CHECKOUT
  // ---------------------------
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const selected = addresses.find((addr) => addr._id === selectedAddress);
      if (!selected) {
        alert("Please select a delivery address");
        return;
      }

      const payload = {
        items: cart.map((item) => ({
          product: item.product._id,
          name: item.name,
          image: item.image,
          qty: item.qty,
          price: item.price,
        })),
        shippingAddress: selected.text,
        paymentMethod: "COD",
        totalAmount: totalPayable,
      };

      await API.post("/orders/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      window.location.href = "/order-success";
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Checkout failed, please try again!");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading checkout...</p>;

  return (
    <div className="co-container">
      {" "}
      <h1 className="co-title">Checkout</h1>
      {/* Order Summary */}
      <div className="co-section">
        <h2 className="co-subtitle">Order Summary</h2>
        {cart.map((item) => (
          <div key={item._id} className="co-product">
            <img
              src={item.image || "/placeholder.png"}
              alt={item.name}
              className="co-product-img"
            />
            <div>
              <h3 className="co-product-name">{item.name}</h3>
              <p>
                ₹{item.price} x {item.qty} = ₹{item.price * item.qty}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Price Details */}
      <div className="co-section">
        <h2 className="co-subtitle">Price Details</h2>
        <div className="co-price-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="co-price-row">
          <span>Discount</span>
          <span>₹{discount}</span>
        </div>
        <div className="co-price-row">
          <span>Delivery</span>
          <span>₹{deliveryCharge}</span>
        </div>
        <div className="co-total-row">
          <span>Total Payable</span>
          <span>₹{totalPayable}</span>
        </div>
      </div>
      {/* Addresses */}
      <div className="co-section">
        <h2 className="co-subtitle">Delivery Address</h2>
        {addresses.map((addr) => (
          <label key={addr._id} className="co-address-option">
            <input
              type="radio"
              name="savedAddress"
              checked={selectedAddress === addr._id}
              onChange={() => setSelectedAddress(addr._id)}
            />
            <div>
              <p className="co-address-title">{addr.label}</p>
              <p className="co-address-text">{addr.text}</p>
            </div>
          </label>
        ))}
        <button
          className="co-add-address-btn"
          onClick={() => setShowModal(true)}
        >
          + Add New Address
        </button>
      </div>
      {/* Payment Method */}
      <div className="co-section">
        <h2 className="co-subtitle">Payment Method</h2>
        <label className="co-radio">
          <input type="radio" name="payment" defaultChecked />
          <span>Cash on Delivery (COD)</span>
        </label>
      </div>
      {/* Place Order */}
      <button className="co-place-btn" onClick={handleCheckout}>
        Place Order (₹{totalPayable})
      </button>
      {/* Modal for New Address */}
      {showModal && (
        <div className="co-modal">
          <div className="co-modal-box">
            <h2 className="co-modal-title">Add New Address</h2>
            {Object.keys(newAddress).map((key) => (
              <div className="co-input-group" key={key}>
                <label>{key}</label>
                <input
                  type="text"
                  value={newAddress[key as keyof typeof newAddress]}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, [key]: e.target.value })
                  }
                />
              </div>
            ))}
            <div className="co-modal-actions">
              <button
                className="co-modal-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="co-modal-save" onClick={handleAddAddress}>
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
