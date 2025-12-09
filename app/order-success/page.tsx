"use client";

import { useRouter } from "next/navigation";
import "../../styles/order-success.css";

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <div className="os-container">
      <div className="os-box">
        <img src="/success.gif" alt="success" className="os-icon" />

        <h1 className="os-title">Thank You for Shopping with Us! 🎉</h1>

        <p className="os-msg">
          Your order has been successfully placed. For all updates, please visit
          the <strong>Orders</strong> page. All details will also be shared via{" "}
          <strong>email/phone</strong>.
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
