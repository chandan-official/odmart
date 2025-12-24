"use client";

import { useRouter } from "next/navigation";
import "../../styles/order-success.css";
import { MdCheckCircle } from "react-icons/md"; // Using a clean icon instead of a GIF

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <div className="os-container">
      <div className="os-box glass-panel">
        
        {/* Animated Success Icon */}
        <div className="icon-wrapper">
            <MdCheckCircle className="os-icon" />
            <div className="pulse-ring"></div>
        </div>

        <h1 className="os-title">Order Placed Successfully! 🎉</h1>

        <p className="os-msg">
          Thank you for shopping with us. Your order has been confirmed.
          <br />
          For updates, visit the <strong>Orders</strong> page. Details have been sent via <strong>Email/SMS</strong>.
        </p>

        <div className="os-btn-group">
          <button className="os-home-btn" onClick={() => router.push("/")}>
            Continue Shopping
          </button>

          <button
            className="os-orders-btn"
            onClick={() => router.push("/orderHistory")}
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
}