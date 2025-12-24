"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { API, apiRoutes } from "../../lib/api";
import "../../styles/checkout.css";
import {
  MdLocationOn,
  MdAdd,
  MdCheckCircle,
  MdLocalShipping,
  MdPayment,
  MdClose,
} from "react-icons/md";

interface ProductImage {
  url: string;
}

interface Product {
  _id: string;
  productImageurls?: ProductImage[];
}

interface CartItem {
  _id: string;
  product: Product;
  name: string;
  price: number;
  qty: number;
}

interface Address {
  id: string;
  _id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  text?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: { email?: string; name?: string; contact?: string };
  theme?: { color: string };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">("COD");

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

  // --- CART / BUY NOW ---
  useEffect(() => {
    const buyNowId = searchParams.get("id");
    if (buyNowId) {
      setCart([
        {
          _id: buyNowId,
          name: searchParams.get("name") || "",
          price: Number(searchParams.get("price")),
          qty: Number(searchParams.get("quantity")),
          product: {
            _id: buyNowId,
            productImageurls: searchParams.get("image")
              ? [{ url: searchParams.get("image")! }]
              : [],
          },
        },
      ]);
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        const res = await API.get("/cart/getCart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.cartItems || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [searchParams]);

  // --- FETCH ADDRESSES ---
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const res = await API.get(apiRoutes.address.list, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        });

        const addressesFromAPI: Address[] = Array.isArray(res.data?.addresses)
          ? res.data.addresses
          : [];

        const mapped: Address[] = addressesFromAPI.map((addr) => ({
          ...addr,
          text: `${addr.label || "Address"}, ${addr.street}, ${addr.city}, ${
            addr.state
          } - ${addr.postalCode}, ${addr.country}`,
        }));

        setAddresses(mapped);

        if (mapped.length > 0 && !selectedAddress)
          setSelectedAddress(mapped[0]._id);
      } catch (err) {
        console.error("Error fetching addresses:", err);
      }
    };

    fetchAddresses();
  }, []);

  // --- ADD NEW ADDRESS ---
  const handleAddAddress = async () => {
    const missing = Object.values(newAddress).some((v) => !v);
    if (missing) return alert("Please fill all fields");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      await API.post(apiRoutes.address.create, newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await API.get(apiRoutes.address.list, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });

      const addressesFromAPI: Address[] = Array.isArray(res.data?.addresses)
        ? res.data.addresses
        : [];

      const mapped: Address[] = addressesFromAPI.map((addr) => ({
        ...addr,
        text: `${addr.label}, ${addr.street}, ${addr.city}, ${addr.state} - ${addr.postalCode}, ${addr.country}`,
      }));

      setAddresses(mapped);
      setSelectedAddress(mapped[mapped.length - 1]?._id || "");
      setNewAddress(initialAddress);
      setShowModal(false);
    } catch (err) {
      console.error("Error adding address:", err);
      alert("Failed to add address");
    }
  };

  // --- PLACE ORDER ---
  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty");

    const address = addresses.find((a) => a._id === selectedAddress);
    if (!address) return alert("Select delivery address");

    // Fix: use qty instead of quantity to match backend
    const orderItems = cart.map((item) => ({
      product: item.product._id,
      name: item.name,
      image: item.product.productImageurls?.[0]?.url || "/placeholder.png",
      qty: item.qty, // ✅ must be 'qty'
      price: item.price,
    }));

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const shippingAddress = {
      address: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country || "India",
      phone: address.phone,
      fullName: address.label || "",
    };

    const payload = {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    };

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Login required");

      if (paymentMethod === "COD") {
        await API.post("/orders/create", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        router.push("/order-success");
        return;
      }

      // Razorpay flow
      const { data } = await API.post(
        "/payments/create-order",
        { amount: totalPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.order.amount,
        currency: "INR",
        name: "Your Store",
        description: "Purchase",
        order_id: data.order.id,
        handler: async (response: RazorpayPaymentResponse) => {
          await API.post(
            "/payments/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: "temporary-order-id",
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          router.push("/order-success");
        },
        prefill: {
          email: "user@example.com",
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed. Please try again.");
    }
  };

  if (loading) return <div className="checkout-loader">Loading checkout…</div>;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="co-container">
      <div className="co-header">
        <h1>Secure Checkout</h1>
        <p>Complete your purchase securely.</p>
      </div>

      <div className="co-grid">
        {/* LEFT COLUMN */}
        <div className="co-left-column">
          {/* Address */}
          <div className="co-card glass">
            <div className="co-card-header">
              <MdLocationOn className="co-icon" />
              <h2>Delivery Address</h2>
            </div>
            <div className="address-list">
              {addresses.length === 0 ? (
                <p style={{ color: "#aaa", fontStyle: "italic" }}>
                  No addresses found.
                </p>
              ) : (
                addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`address-option ${
                      selectedAddress === addr._id ? "selected" : ""
                    }`}
                  >
                    <div className="radio-wrapper">
                      <input
                        type="radio"
                        name="savedAddress"
                        checked={selectedAddress === addr._id}
                        onChange={() => setSelectedAddress(addr._id)}
                      />
                    </div>
                    <div className="address-details">
                      <span className="addr-label">{addr.label}</span>
                      <p className="addr-text">{addr.text}</p>
                    </div>
                    {selectedAddress === addr._id && (
                      <MdCheckCircle className="check-icon" />
                    )}
                  </label>
                ))
              )}
            </div>
            <button
              className="btn-add-address"
              onClick={() => setShowModal(true)}
            >
              <MdAdd /> Add New Address
            </button>
          </div>

          {/* Payment Methods */}
          <div className="co-card glass">
            <div className="co-card-header">
              <MdPayment className="co-icon" />
              <h2>Payment Method</h2>
            </div>
            <div
              className={`payment-option ${
                paymentMethod === "COD" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("COD")}
            >
              <MdLocalShipping className="cod-icon" />
              <div>
                <span className="pay-title">Cash on Delivery (COD)</span>
                <p className="pay-desc">Pay when your order arrives</p>
              </div>
              {paymentMethod === "COD" && (
                <MdCheckCircle className="check-icon" />
              )}
            </div>
            <div
              className={`payment-option ${
                paymentMethod === "RAZORPAY" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("RAZORPAY")}
            >
              <MdPayment className="cod-icon" />
              <div>
                <span className="pay-title">UPI / Card / Netbanking</span>
                <p className="pay-desc">Pay securely via Razorpay</p>
              </div>
              {paymentMethod === "RAZORPAY" && (
                <MdCheckCircle className="check-icon" />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="co-right-column">
          <div className="co-summary-card glass">
            <h3>Order Summary</h3>
            <div className="order-items-scroll">
              {cart.map((item) => (
                <div key={item._id} className="summary-item">
                  <img
                    src={
                      item.product.productImageurls?.[0]?.url ||
                      "/placeholder.png"
                    }
                    alt={item.name}
                    className="summary-img"
                  />
                  <div className="summary-info">
                    <h4>{item.name}</h4>
                    <p>
                      Qty: {item.qty} x ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="summary-price">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="divider"></div>
            <div className="price-row">
              <span>Subtotal</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span>Shipping</span>
              <span className="text-green">Free</span>
            </div>
            <div className="divider"></div>
            <div className="total-row">
              <span>Grand Total</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
            <button className="btn-place-order" onClick={handleCheckout}>
              Place Order
            </button>
            <p className="secure-text">🔒 SSL Secured Payment</p>
          </div>
        </div>
      </div>

      {/* ADD ADDRESS MODAL */}
      {showModal && (
        <div className="co-modal-overlay">
          <div className="co-modal-box glass">
            <div className="modal-header">
              <h3>Add New Address</h3>
              <button onClick={() => setShowModal(false)}>
                <MdClose />
              </button>
            </div>
            <div className="modal-body">
              {Object.keys(newAddress).map((key) => (
                <div key={key} className="input-group">
                  <input
                    type="text"
                    placeholder={
                      key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")
                    }
                    value={newAddress[key as keyof typeof newAddress]}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn-save" onClick={handleAddAddress}>
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
