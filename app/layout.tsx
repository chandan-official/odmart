import "../styles/globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { AuthProvider } from "@/components/AuthContext";
// 1. Import the premium font
import { Plus_Jakarta_Sans } from "next/font/google";

// 2. Configure the font
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 3. Apply the font variable to the body */}
      <body className={jakarta.className}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}