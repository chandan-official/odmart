/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Grid1 from "@/components/grid1";
import Link from "next/link"; // ✅ Added
import "../../styles/products.css";
import { useEffect, useRef, useState } from "react";
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";

export default function ProductsPage() {
  const [liked, setLiked] = useState<{ [key: number]: boolean }>({});
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const toggleLike = (id: number) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // GENERATE DUMMY PRODUCTS FOR DEMO
  const generateProducts = (pageNumber: number) => {
    const start = (pageNumber - 1) * 12;
    return Array.from({ length: 12 }).map((_, i) => ({
      id: start + i + 1,
      name: `Running Shoes ${start + i + 1}`,
      desc: "Premium comfort & durability",
      price: 999 + i * 100,
      oldPrice: 1599 + i * 100,
      discount: "-30%",
      rating: (3.5 + (i % 2)).toFixed(1),
      stock: i % 2 === 0 ? "In Stock" : "Only Few Left!",
      image: "/shoe.jpeg",
    }));
  };

  // LOAD INITIAL PRODUCTS
  useEffect(() => {
    setProducts(generateProducts(1));
  }, []);

  // INTERSECTION OBSERVER (Infinite Scroll)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, []);

  // LOAD NEW PRODUCTS WHEN PAGE INCREASES
  useEffect(() => {
    if (page === 1) return;

    const newProducts = generateProducts(page);
    setProducts((prev) => [...prev, ...newProducts]);
  }, [page]);

  return (
    <div className="products-page">
      {/* CATEGORY SLIDER */}
      <div className="category-slider">
        <Grid1 />
      </div>

      {/* SEARCH + FILTER BAR */}
      <div className="search-filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search for products…"
        />

        <select className="filter-select">
          <option>Sort By</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest</option>
          <option>Popular</option>
        </select>
      </div>

      {/* PRODUCT GRID */}
      <div className="product-grid">
        {products.map((product) => (
          <Link
            href={`/product_page?id=${product.id}`} // ✅ Redirect to product page
            key={product.id}
            className="product-link"
          >
            <div className="products-cards">
              {/* IMAGE */}
              <div className="product-img">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={260}
                  height={200}
                />
              </div>

              {/* INFO */}
              <div className="product-info">
                <div className="span-grp">
                  <span>Limited Time Deal</span>
                  <span className="badge">{product.discount}</span>
                </div>

                <h3>{product.name}</h3>
                <p>{product.desc}</p>

                <p className="price">
                  ₹{product.price}
                  <span className="strike-through">₹{product.oldPrice}</span>
                  <span className="discount">{product.discount}</span>
                </p>

                <p>⭐ {product.rating}</p>
                <p className="stock">{product.stock}</p>

                <div className="btn-grp">
                  <button className="add-to-cart">Shop Now</button>
                  <button
                    className={`wishlist-btn ${
                      liked[product.id] ? "liked" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault(); // ❗ Prevent page redirect on heart click
                      toggleLike(product.id);
                    }}
                  >
                    {liked[product.id] ? (
                      <MdFavorite />
                    ) : (
                      <MdOutlineFavoriteBorder />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* LOADER SENTINEL FOR INFINITE SCROLL */}
      <div ref={loaderRef} style={{ padding: "40px", textAlign: "center" }}>
        <span style={{ fontSize: "16px", opacity: "0.6" }}>
          Loading more products…
        </span>
      </div>
    </div>
  );
}
