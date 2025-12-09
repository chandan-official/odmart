import Grid2 from "@/components/grid2";
import "../styles/home.css";
import Grid1 from "@/components/grid1";

export default function Home() {
  return (
    <section className="homepage">
      <div className="home">
        <div className="home__content">
          <h1>Welcome to ShopEasy 🛍️</h1>
          <p>Find the best deals and shop smarter, not harder.</p>
        </div>
      </div>
      <Grid1 />
      <Grid2 />
    </section>
  );
}
