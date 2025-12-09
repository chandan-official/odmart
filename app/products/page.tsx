/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";

import Link from "next/link";
import "../../styles/products.css";
import { useEffect, useRef, useState } from "react";
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import { api } from "../../lib/api";

interface ProductImage {
  url: string;
  public_id?: string;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  discount?: string;
  rating?: number;
  stock: number;
  productImageurls?: ProductImage[];
}

export default function ProductsPage() {
  const [liked, setLiked] = useState<{ [key: string]: boolean }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [mainImages, setMainImages] = useState<{ [key: string]: string }>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const toggleLike = (id: string) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchProducts = async (pageNumber: number) => {
    if (!hasMore) return;
    setLoading(true);

    try {
      const res = await api.getProducts(pageNumber, 12);
      const newProducts: Product[] = res.data.products;

      if (!newProducts || newProducts.length === 0) {
        setHasMore(false);
        return;
      }

      setProducts((prev) => [...prev, ...newProducts]);

      // Set initial main image for each product
      newProducts.forEach((p) => {
        if (p.productImageurls && p.productImageurls.length > 0) {
          setMainImages((prev) => ({
            ...prev,
            [p._id]: p.productImageurls![0].url,
          }));
        }
      });
    } catch (err) {
      console.error("Product fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) fetchProducts(page);
  }, [page]);

  const handleThumbnailHover = (
    e: React.MouseEvent,
    productId: string,
    imageUrl: string
  ) => {
    // Stop link navigation when hovering over the thumbnail
    e.preventDefault();
    setMainImages((prev) => ({
      ...prev,
      [productId]: imageUrl,
    }));
  };

  return (
    <div className="products-page">
      <div className="search-filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search for products…"
        />
        <select className="filter-select">
          <option>Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
        </select>
      </div>

      {/* --- Product Grid --- */}
      <div className="product-grid">
        {products.map((product) => (
          <Link
            href={`/product_page/${product._id}`}
            key={product._id}
            className="product-link"
          >
            <div className="products-cards">
              {/* Image and Thumbnails Section */}
              <div className="product-image-container">
                {/* Main Image */}
                <div className="product-main-img">
                  <Image
                    src={mainImages[product._id] || "/placeholder.png"}
                    alt={product.name}
                    width={280}
                    height={200}
                    priority={true}
                  />
                </div>

                {/* Thumbnails */}
                {product.productImageurls &&
                  product.productImageurls.length > 1 && (
                    <div className="thumbnails-wrapper">
                      {product.productImageurls?.slice(0, 4).map((img, idx) => (
                        <div
                          key={idx}
                          className={`thumbnail ${
                            mainImages[product._id] === img.url ? "active" : ""
                          }`}
                          onMouseEnter={(e) =>
                            handleThumbnailHover(e, product._id, img.url)
                          }
                        >
                          <Image
                            src={img.url}
                            alt={`${product.name} thumbnail ${idx + 1}`}
                            width={40}
                            height={40}
                          />
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Product Info Section */}
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>

                {/* Product Description */}
                <p className="product-description">
                  {product.description ||
                    "A high-quality item offering premium comfort and durability."}
                </p>

                {/* Price and Discount Details */}
                <div className="price-details">
                  <p className="current-price">₹{product.price}</p>

                  {/* Compare price with faded color and parentheses */}
                  {product.compareAtPrice &&
                    product.compareAtPrice > product.price && (
                      <span className="compare-price-wrapper">
                        (
                        <span className="strike-through faded-price">
                          ₹{product.compareAtPrice}
                        </span>
                        )
                      </span>
                    )}

                  {product.discount && (
                    <span className="discount-tag">{product.discount}</span>
                  )}
                </div>

                {/* Rating and Stock */}
                <div className="rating-stock">
                  <p className="rating-text">
                    ⭐ {product.rating?.toFixed(1) || 4.5}
                  </p>
                  <p
                    className={`stock-status ${
                      product.stock > 0 ? "in-stock" : "out-of-stock"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="btn-grp">
                  <button className="add-to-cart">Shop Now</button>

                  <button
                    className={`wishlist-btn ${
                      liked[product._id] ? "liked" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleLike(product._id);
                    }}
                  >
                    {liked[product._id] ? (
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

      {/* Infinite Scroll Loader */}
      <div ref={loaderRef} style={{ padding: "40px", textAlign: "center" }}>
        {loading && hasMore && (
          <span className="loading-text">Loading more products…</span>
        )}
        {!hasMore && (
          <span className="all-loaded-text">🎉 All products loaded</span>
        )}
      </div>
    </div>
  );
}
