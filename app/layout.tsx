import "../styles/globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Grid1 from "@/components/grid1";
import Grid2 from "@/components/grid2";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
