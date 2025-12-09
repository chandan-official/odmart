"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import "../../styles/checkout.css";

export default function CheckoutPage() {
  const searchParams = useSearchParams();

  // Getting product from query params
  const product = {
    id: searchParams.get("id"),
    name: searchParams.get("name"),
    price: Number(searchParams.get("price")),
    image: searchParams.get("image"),
  };

  // PRICE CALCULATION
  const deliveryCharge = 40;
  const discount = 0;
  const subtotal = product.price;
  const totalPayable = subtotal + deliveryCharge - discount;

  // SAVED ADDRESSES
  const [addresses, setAddresses] = useState([
    { id: 1, label: "Home", text: "Chandan Jha, Delhi NCR, India" },
    { id: 2, label: "Office", text: "Noida Sec 62, Uttar Pradesh" },
  ]);

  const [selectedAddress, setSelectedAddress] = useState(1);

  // MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    apartment: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleAddAddress = () => {
    // Required validations
    if (
      !newAddress.fullName ||
      !newAddress.phone ||
      !newAddress.apartment ||
      !newAddress.landmark ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode
    ) {
      alert("Please fill all required fields (*)");
      return;
    }

    const formatted =
      `${newAddress.fullName}, ${newAddress.apartment}, ` +
      `${newAddress.street ? newAddress.street + ", " : ""}` +
      `${newAddress.landmark}, ${newAddress.city}, ${newAddress.state} - ${newAddress.pincode}`;

    const addr = {
      id: addresses.length + 1,
      label: newAddress.fullName.split(" ")[0] || "New Address",
      text: formatted,
    };

    setAddresses([...addresses, addr]);
    setSelectedAddress(addr.id);

    // Reset
    setNewAddress({
      fullName: "",
      phone: "",
      apartment: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
    });

    setShowModal(false);
  };
  const handleCheckout = () => {
    alert("Order placed successfully! (dummy)");
    window.location.href = "/order-success";
  };
  return (
    <div className="co-container">
      <h1 className="co-title">Checkout</h1>

      {/* PRODUCT SUMMARY */}
      <div className="co-section">
        <h2 className="co-subtitle">Order Summary</h2>

        <div className="co-product">
          <img src={product.image!} alt="product" className="co-product-img" />
          <div>
            <h3 className="co-product-name">{product.name}</h3>
            <p className="co-product-price">₹{product.price}</p>
          </div>
        </div>
      </div>

      {/* PRICE BREAKDOWN */}
      <div className="co-section">
        <h2 className="co-subtitle">Price Details</h2>

        <div className="co-price-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="co-price-row">
          <span>Delivery Charge</span>
          <span>₹{deliveryCharge}</span>
        </div>

        <div className="co-price-row">
          <span>Discount</span>
          <span>₹{discount}</span>
        </div>

        <div className="co-total-row">
          <span>Net Payable</span>
          <span>₹{totalPayable}</span>
        </div>
      </div>

      {/* ADDRESS SECTION */}
      <div className="co-section">
        <h2 className="co-subtitle">Delivery Address</h2>

        {addresses.map((addr) => (
          <label key={addr.id} className="co-address-option">
            <input
              type="radio"
              name="savedAddress"
              checked={selectedAddress === addr.id}
              onChange={() => setSelectedAddress(addr.id)}
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

      {/* PAYMENT METHOD */}
      <div className="co-section">
        <h2 className="co-subtitle">Payment Method</h2>

        <label className="co-radio">
          <input type="radio" name="payment" defaultChecked />
          <span>Cash on Delivery (COD)</span>
        </label>
      </div>

      {/* PLACE ORDER */}
      <button className="co-place-btn" onClick={handleCheckout}>
        Place Order (₹{totalPayable})
      </button>

      {/* MODAL FOR ADDING NEW ADDRESS */}
      {/* MODAL FOR ADDING NEW ADDRESS */}
      {showModal && (
        <div className="co-modal">
          <div className="co-modal-box">
            <h2 className="co-modal-title">Add New Address</h2>

            <div className="co-input-group">
              <label>Full Name *</label>
              <input
                type="text"
                className="co-input"
                value={newAddress.fullName}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, fullName: e.target.value })
                }
              />
            </div>

            <div className="co-input-group">
              <label>Phone Number *</label>
              <input
                type="text"
                className="co-input"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
              />
            </div>

            <div className="co-input-group">
              <label>Apartment / Building *</label>
              <input
                type="text"
                className="co-input"
                value={newAddress.apartment}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, apartment: e.target.value })
                }
              />
            </div>

            <div className="co-input-group">
              <label>Street (Optional)</label>
              <input
                type="text"
                className="co-input"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
              />
            </div>

            <div className="co-input-group">
              <label>Landmark *</label>
              <input
                type="text"
                className="co-input"
                value={newAddress.landmark}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, landmark: e.target.value })
                }
              />
            </div>

            <div className="co-input-group">
              <label>City *</label>
              <input
                type="text"
                className="co-input"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
              />
            </div>

            <div className="co-input-group">
              <label>State *</label>
              <input
                type="text"
                className="co-input"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
              />
            </div>

            <div className="co-input-group">
              <label>Pincode *</label>
              <input
                type="text"
                className="co-input"
                value={newAddress.pincode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, pincode: e.target.value })
                }
              />
            </div>

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
