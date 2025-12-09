"use client";
import "../styles/globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { AuthProvider } from "@/components/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
