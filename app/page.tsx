import "../styles/home.css";
import Product from "./products/page";
export default function Home() {
  return (
    <section className="homepage">
      <div className="home">
        <div className="home__content">
          <h1>Welcome to ODmart 🛍️</h1>
          <p>Find the best deals and shop smarter, not harder.</p>
        </div>
      </div>
      <Product />
    </section>
  );
}
