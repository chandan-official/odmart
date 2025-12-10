"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { API, apiRoutes } from "../../lib/api";
import "../../styles/checkout.css";

interface Product { _id: string }
interface CartItem { product: Product; _id: string; name: string; price: number; qty: number; image: string }
interface Address { _id: string; label: string; street: string; city: string; state: string; postalCode: string; country: string; phone: string; text?: string }

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const initialAddress = { label: "", street: "", city: "", state: "", postalCode: "", country: "", phone: "" };
  const [newAddress, setNewAddress] = useState(initialAddress);

  // Fetch cart
  useEffect(() => {
    const buyNowId = searchParams.get("id");
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

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await API.get("/cart/getCart", { headers: { Authorization: `Bearer ${token}` } });
        setCart(res.data.items || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }

    fetchCart();
  }, [searchParams]);

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const res = await API.get(apiRoutes.address.list, { headers: { Authorization: `Bearer ${token}` } });
        const mapped: Address[] = (res.data.addresses || []).map((addr: any) => ({
          ...addr,
          text: `${addr.label || "Address"}, ${addr.street}, ${addr.city}, ${addr.state} - ${addr.postalCode}, ${addr.country}`,
        }));
        setAddresses(mapped);
        if (mapped.length > 0) setSelectedAddress(mapped[0]._id);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }

    fetchAddresses();
  }, []);

  // Add address
  const handleAddAddress = async () => {
    const missingFields = Object.keys(newAddress).filter(key => !newAddress[key as keyof typeof newAddress]);
    if (missingFields.length > 0) { alert("Please fill all required fields (*)"); return; }
    try {
      const token = localStorage.getItem("authToken");
      await API.post(apiRoutes.address.create, newAddress, { headers: { Authorization: `Bearer ${token}` } });
      setNewAddress(initialAddress); setShowModal(false);
      // refresh
      const res = await API.get(apiRoutes.address.list, { headers: { Authorization: `Bearer ${token}` } });
      const mapped: Address[] = (res.data.addresses || []).map((addr: any) => ({
        ...addr,
        text: `${addr.label || "Address"}, ${addr.street}, ${addr.city}, ${addr.state} - ${addr.postalCode}, ${addr.country}`,
      }));
      setAddresses(mapped);
      if (mapped.length > 0) setSelectedAddress(mapped[0]._id);
    } catch (err) { console.error(err); alert("Failed to add address"); }
  }

  // Checkout
  const handleCheckout = async () => {
    if (cart.length === 0) { alert("Cart is empty"); return; }
    const selected = addresses.find(addr => addr._id === selectedAddress);
    if (!selected) { alert("Select delivery address"); return; }

    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        items: cart.map(item => ({ product: item.product._id, name: item.name, image: item.image, qty: item.qty, price: item.price })),
        shippingAddress: selected.text,
        paymentMethod: "COD",
        totalAmount: cart.reduce((acc, item) => acc + item.price * item.qty, 0),
      };
      await API.post("/orders/create", payload, { headers: { Authorization: `Bearer ${token}` } });
      window.location.href = "/order-success";
    } catch (err) { console.error(err); alert("Checkout failed"); }
  }

  if (loading) return <p>Loading checkout...</p>;

  return (
    <div className="co-container">
      <h1 className="co-title">Checkout</h1>
      {/* Order Summary */}
      <div className="co-section">
        <h2 className="co-subtitle">Order Summary</h2>
        {cart.map(item => (
          <div key={item._id} className="co-product">
            <img src={item.image || "/placeholder.png"} alt={item.name} className="co-product-img"/>
            <div>
              <h3>{item.name}</h3>
              <p>₹{item.price} x {item.qty} = ₹{item.price * item.qty}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Addresses */}
      <div className="co-section">
        <h2 className="co-subtitle">Delivery Address</h2>
        {addresses.map(addr => (
          <label key={addr._id}>
            <input type="radio" name="savedAddress" checked={selectedAddress === addr._id} onChange={() => setSelectedAddress(addr._id)} />
            <span>{addr.text}</span>
          </label>
        ))}
        <button onClick={() => setShowModal(true)}>+ Add Address</button>
      </div>
      <button onClick={handleCheckout}>Place Order</button>
      {showModal && (
        <div>
          {Object.keys(newAddress).map(key => (
            <div key={key}>
              <label>{key}</label>
              <input type="text" value={newAddress[key as keyof typeof newAddress]} onChange={e => setNewAddress({...newAddress, [key]: e.target.value})}/>
            </div>
          ))}
          <button onClick={() => setShowModal(false)}>Cancel</button>
          <button onClick={handleAddAddress}>Save</button>
        </div>
      )}
    </div>
  );
}

