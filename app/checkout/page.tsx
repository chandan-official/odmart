// app/checkout/page.tsx
import { Suspense } from "react";
import CheckoutClient from "../checkout_client/page"; // Adjust path if necessary

export default function CheckoutPage() {
  return (
    // The Suspense boundary tells Next.js to wait for the client to render
    // components that rely on browser APIs like useSearchParams.
    <Suspense fallback={<div>Loading checkout details...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}
