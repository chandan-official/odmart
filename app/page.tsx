import "../styles/home.css";
// We keep your Product component exactly as it is
import Product from "./products/page"; 

export default function Home() {
  return (
    <main className="homepage">
      {/* Hero Section: The big visual banner at the top */}
      <section className="hero">
        <div className="hero__glow" /> {/* This creates the background light */}
        
        <div className="hero__content">
          <h1 className="hero__title">
            Welcome to <span className="text-gradient">ODmart</span>
          </h1>
          <p className="hero__subtitle">
            Experience the future of shopping. Best deals, premium quality.
          </p>
        </div>
      </section>

      {/* Product Section: Your existing logic runs here */}
      <section className="products-container">
        <Product />
      </section>
    </main>
  );
}