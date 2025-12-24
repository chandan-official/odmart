/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import "../../styles/products.css";
import { useEffect, useRef, useState } from "react";
import { MdFavorite, MdOutlineFavoriteBorder, MdSearch, MdSort } from "react-icons/md";
import { api } from "../../lib/api"; // Ensuring your API is imported

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
    // If we have reached the end, don't fetch anymore
    if (!hasMore && pageNumber > 1) return;
    
    setLoading(true);

    try {
      // --- RESTORED: REAL API CONNECTION ---
      const res = await api.getProducts(pageNumber, 12);
      const newProducts: Product[] = res.data.products;

      // Logic: If no products returned, we are at the end
      if (!newProducts || newProducts.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      // Logic: If page 1, replace data. If page > 1, append data.
      if (pageNumber === 1) {
          setProducts(newProducts);
      } else {
          setProducts((prev) => [...prev, ...newProducts]);
      }

      // Logic: Set initial main image for each product
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

  // Infinite Scroll Observer
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
    e.preventDefault();
    setMainImages((prev) => ({
      ...prev,
      [productId]: imageUrl,
    }));
  };

  return (
    <div className="products-page">
      {/* --- Controls Bar --- */}
      <div className="controls-container">
        <div className="search-wrapper">
          <MdSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search premium products..."
          />
        </div>
        
        <div className="filter-wrapper">
          <MdSort className="sort-icon" />
          <select className="filter-select">
            <option>Sort By</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div>

      {/* --- Product Grid --- */}
      <div className="product-grid">
        {products.map((product) => (
          <Link
            href={`/product_page/${product._id}`}
            key={product._id}
            className="product-card-link"
          >
            <div className="product-card glass-panel">
              
              <div className="card-image-container">
                {product.discount && (
                  <span className="badge-discount">{product.discount}</span>
                )}
                
                <Image
                  src={mainImages[product._id] || "/placeholder.png"}
                  alt={product.name}
                  width={280}
                  height={280}
                  className="main-product-image"
                  priority={true}
                />

                <button
                  className={`wishlist-fab ${liked[product._id] ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleLike(product._id);
                  }}
                >
                  {liked[product._id] ? <MdFavorite /> : <MdOutlineFavoriteBorder />}
                </button>
              </div>

              {product.productImageurls && product.productImageurls.length > 1 && (
                <div className="thumbnails-row">
                  {product.productImageurls?.slice(0, 4).map((img, idx) => (
                    <div
                      key={idx}
                      className={`thumb-dot ${mainImages[product._id] === img.url ? "active" : ""}`}
                      onMouseEnter={(e) => handleThumbnailHover(e, product._id, img.url)}
                    >
                      <Image 
                        src={img.url} 
                        alt="thumb" 
                        width={30} 
                        height={30} 
                        className="thumb-img"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="card-details">
                <div className="card-header">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="rating-pill">
                     ⭐ {product.rating?.toFixed(1) || 4.5}
                  </div>
                </div>

                <p className="product-desc-short">
                  {product.description?.substring(0, 60) || "Premium quality item..."}...
                </p>

                <div className="card-footer">
                  <div className="price-block">
                    <span className="price-current">₹{product.price.toLocaleString()}</span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="price-old">₹{product.compareAtPrice.toLocaleString()}</span>
                    )}
                  </div>
                  
                  {product.stock > 0 ? (
                     <button className="btn-shop">Shop</button>
                  ) : (
                     <span className="out-of-stock-text" style={{color: '#ef4444', fontSize: '0.9rem', fontWeight: 'bold'}}>Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* --- Infinite Scroll Loader --- */}
      <div ref={loaderRef} className="loader-container">
        {loading && hasMore && <div className="spinner"></div>}
        {!hasMore && products.length > 0 && (
          <span className="end-text">🎉 You've reached the end</span>
        )}
      </div>
    </div>
  );
}