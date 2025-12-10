"use client";

import { Suspense } from "react";
import CheckoutClient from "./checkout_client";

export const dynamic = "force-dynamic"; // forces client-only rendering

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p style={{ padding: 20 }}>Loading checkout...</p>}>
      {" "}
      <CheckoutClient />{" "}
    </Suspense>
  );
}
