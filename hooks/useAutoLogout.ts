/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import * as jwt_decode from "jwt-decode"; // ✅ import everything
import { useRouter } from "next/navigation";

export default function useAutoLogout() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const decoded = (jwt_decode as any)(token) as { exp: number };
      const now = Date.now() / 1000;
      const timeLeft = decoded.exp - now;

      if (timeLeft <= 0) {
        // Token expired
        localStorage.removeItem("authToken");
        router.push("/register");
      } else {
        // Set timeout to auto logout
        const timeout = setTimeout(() => {
          localStorage.removeItem("authToken");
          router.push("/register");
        }, timeLeft * 1000);

        return () => clearTimeout(timeout);
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("authToken");
      router.push("/register");
    }
  }, [router]);
}
