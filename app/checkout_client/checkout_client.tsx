"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { API, apiRoutes } from "../../lib/api";
import "../../styles/checkout.css";
import { MdLocationOn, MdAdd, MdCheckCircle, MdLocalShipping, MdPayment, MdClose } from "react-icons/md";

interface Product { _id: string }
interface CartItem { product: Product; _id: string; name: string; price: number; qty: number; image: string }
interface Address { _id: string; label: string; street: string; city: string; state: string; postalCode: string; country: string; phone: string; text?: string }

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  
  const initialAddress = { label: "", street: "", city: "", state: "", postalCode: "", country: "", phone: "" };
  const [newAddress, setNewAddress] = useState(initialAddress);

  // --- 1. FETCH CART OR BUY NOW ITEM ---
  useEffect(() => {
    const buyNowId = searchParams.get("id");
    
    // CASE A: Buy Now Flow (Data passed via URL)
    if (buyNowId) {
      setCart([{
        _id: buyNowId,
        name: searchParams.get("name")!,
        price: Number(searchParams.get("price")!),
        qty: Number(searchParams.get("quantity")!),
        image: searchParams.get("image") || "/placeholder.png",
        product: { _id: buyNowId }
      }]);
      setLoading(false);
      return;
    }

    // CASE B: Standard Cart Flow (Fetch from API)
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return; // Wait for auth or handle redirect elsewhere

        const res = await API.get("/cart/getCart", { headers: { Authorization: `Bearer ${token}` } });
        setCart(res.data.items || []);
      } catch (err) { 
        console.error("Error fetching cart:", err);
      } finally { 
        setLoading(false); 
      }
    }

    fetchCart();
  }, [searchParams]);

  // --- 2. FETCH ADDRESSES ---
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const res = await API.get(apiRoutes.address.list, { headers: { Authorization: `Bearer ${token}` } });
        
        const mapped: Address[] = (res.data.addresses || []).map((addr: any) => ({
          ...addr,
          text: `${addr.label || "Address"}, ${addr.street}, ${addr.city}, ${addr.state} - ${addr.postalCode}, ${addr.country}`,
        }));
        
        setAddresses(mapped);
        
        // Auto-select the first address if available
        if (mapped.length > 0) setSelectedAddress(mapped[0]._id);
      } catch (err) { 
        console.error("Error fetching addresses:", err);
      } finally { 
        setLoading(false); 
      }
    }

    fetchAddresses();
  }, []);

  // --- 3. ADD NEW ADDRESS ---
  const handleAddAddress = async () => {
    // Simple validation
    const missingFields = Object.keys(newAddress).filter(key => !newAddress[key as keyof typeof newAddress]);
    if (missingFields.length > 0) { 
        alert("Please fill all required fields (*)"); 
        return; 
    }
    
    try {
      const token = localStorage.getItem("authToken");
      
      // Post new address
      await API.post(apiRoutes.address.create, newAddress, { headers: { Authorization: `Bearer ${token}` } });
      
      // Refresh address list
      const res = await API.get(apiRoutes.address.list, { headers: { Authorization: `Bearer ${token}` } });
      const mapped: Address[] = (res.data.addresses || []).map((addr: any) => ({
        ...addr,
        text: `${addr.label || "Address"}, ${addr.street}, ${addr.city}, ${addr.state} - ${addr.postalCode}, ${addr.country}`,
      }));
      setAddresses(mapped);
      
      // Select the new address automatically (usually the last one added)
      if (mapped.length > 0) setSelectedAddress(mapped[mapped.length - 1]._id);

      setNewAddress(initialAddress); 
      setShowModal(false);
      
    } catch (err) { 
        console.error(err); 
        alert("Failed to add address. Please try again."); 
    }
  }

  // --- 4. PLACE ORDER ---
  const handleCheckout = async () => {
    if (cart.length === 0) { alert("Cart is empty"); return; }
    
    const selected = addresses.find(addr => addr._id === selectedAddress);
    if (!selected) { alert("Please select a delivery address."); return; }

    try {
      const token = localStorage.getItem("authToken");
      
      const payload = {
        items: cart.map(item => ({ 
            product: item.product._id, 
            name: item.name, 
            image: item.image, 
            qty: item.qty, 
            price: item.price 
        })),
        shippingAddress: selected.text,
        paymentMethod: "COD", // Hardcoded for now as per original logic
        totalAmount: cart.reduce((acc, item) => acc + item.price * item.qty, 0),
      };

      await API.post("/orders/create", payload, { headers: { Authorization: `Bearer ${token}` } });
      
      // Redirect to Success Page
      window.location.href = "/order-success";
      
    } catch (err) { 
        console.error(err); 
        alert("Checkout failed. Please try again."); 
    }
  }

  if (loading) return <div className="checkout-loader">Loading secure checkout...</div>;

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="co-container">
      <div className="co-header">
        <h1>Secure Checkout</h1>
        <p>Complete your purchase securely.</p>
      </div>

      <div className="co-grid">
        {/* LEFT COLUMN: Addresses & Payment */}
        <div className="co-left-column">
            
            {/* Address Selection */}
            <div className="co-card glass">
                <div className="co-card-header">
                    <MdLocationOn className="co-icon" />
                    <h2>Delivery Address</h2>
                </div>
                
                <div className="address-list">
                    {addresses.length === 0 ? (
                        <p style={{color: '#aaa', fontStyle: 'italic'}}>No addresses found. Please add one.</p>
                    ) : (
                        addresses.map(addr => (
                        <label key={addr._id} className={`address-option ${selectedAddress === addr._id ? 'selected' : ''}`}>
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
                            {selectedAddress === addr._id && <MdCheckCircle className="check-icon"/>}
                        </label>
                        ))
                    )}
                </div>
                
                <button className="btn-add-address" onClick={() => setShowModal(true)}>
                    <MdAdd /> Add New Address
                </button>
            </div>

            {/* Payment Selection */}
            <div className="co-card glass">
                <div className="co-card-header">
                    <MdPayment className="co-icon" />
                    <h2>Payment Method</h2>
                </div>
                <div className="payment-option selected">
                    <MdLocalShipping className="cod-icon" />
                    <div>
                        <span className="pay-title">Cash on Delivery (COD)</span>
                        <p className="pay-desc">Pay safely when your order arrives.</p>
                    </div>
                    <MdCheckCircle className="check-icon"/>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="co-right-column">
            <div className="co-summary-card glass">
                <h3>Order Summary</h3>
                <div className="order-items-scroll">
                    {cart.map(item => (
                    <div key={item._id} className="summary-item">
                        <img src={item.image || "/placeholder.png"} alt={item.name} className="summary-img"/>
                        <div className="summary-info">
                            <h4>{item.name}</h4>
                            <p>Qty: {item.qty} x ₹{item.price.toLocaleString()}</p>
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
                <button onClick={() => setShowModal(false)}><MdClose /></button>
            </div>
            
            <div className="modal-body">
                {Object.keys(newAddress).map(key => (
                <div key={key} className="input-group">
                    <input 
                        type="text" 
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        value={newAddress[key as keyof typeof newAddress]} 
                        onChange={e => setNewAddress({...newAddress, [key]: e.target.value})}
                    />
                </div>
                ))}
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleAddAddress}>Save Address</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}