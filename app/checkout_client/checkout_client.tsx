/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { API, apiRoutes } from "../../lib/api";
import "../../styles/checkout.css";

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      const buyNowId = searchParams.get("id");
      if (buyNowId) {
        setCart([
          {
            _id: buyNowId,
            name: searchParams.get("name")!,
            price: Number(searchParams.get("price")!),
            qty: Number(searchParams.get("quantity")!),
          },
        ]);
      } else {
        try {
          const token = localStorage.getItem("authToken");
          const res = await API.get("/cart/getCart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCart(res.data.items || []);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };

    fetchCart();
  }, [searchParams]);

  if (loading) return <p>Loading checkout...</p>;

  return (
    <div>
      <h1>Checkout</h1>
      {cart.map((item) => (
        <div key={item._id}>
          {item.name} x {item.qty} = ₹{item.price * item.qty}
        </div>
      ))}
    </div>
  );
}
