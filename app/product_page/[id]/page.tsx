"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import "../../../styles/product-details.css";
import { API } from "../../../lib/api";

interface ProductImage {
  url: string;
  public_id?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  rating?: number;
  stock?: number;
  description?: string;
  productImageurls?: ProductImage[]; // <-- use same field as products page
}

export default function ProductDetailsPage() {
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("/shoe.jpeg");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/getProductById/${id}`);
        const prod: Product = res.data.product;
        setProduct(prod);

        // Set the first image as selected
        setSelectedImage(prod.productImageurls?.[0]?.url || "/shoe.jpeg");
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadProduct();
  }, [id]);

  if (loading || !product)
    return <p style={{ padding: 20 }}>Loading product...</p>;

  const handleAddToCart = async () => {
    try {
      await API.post("/cart/add", { productId: product._id, quantity: 1 });
      alert(`${product.name} added to cart`);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };
  const handleBuyNow = () => {
    const query = new URLSearchParams({
      id: product._id,
      name: product.name,
      price: product.price.toString(),
      image: selectedImage || "",
      quantity: "1",
    }).toString();

    router.push(`/checkout?${query}`);
  };

  return (
    <div className="pd-container">
      <div className="pd-gallery">
        {/* Main Image */}
        <div className="pd-main-img">
          <Image
            src={selectedImage}
            width={450}
            height={450}
            alt={product.name}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Thumbnails */}
        <div className="pd-thumbnails">
          {product.productImageurls?.map((imgObj, i) => (
            <div
              key={i}
              className={`pd-thumb ${
                selectedImage === imgObj.url ? "selected" : ""
              }`}
              onClick={() => setSelectedImage(imgObj.url)}
            >
              <Image
                src={imgObj.url}
                width={80}
                height={80}
                alt={`${product.name} thumbnail ${i + 1}`}
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pd-details">
        <h1 className="pd-title">{product.name}</h1>
        <p className="pd-rating">⭐ {product.rating || 4.3}</p>
        <p className="pd-stock">
          {(product.stock ?? 0) > 0 ? "In Stock" : "Out of Stock"}
        </p>
        <p className="pd-price">
          ₹{product.price}{" "}
          <span className="pd-old-price">
            ₹{product.oldPrice || product.price + 300}
          </span>
          <span className="pd-discount">{product.discount || "-30%"}</span>
        </p>
        <p className="pd-desc">{product.description}</p>

        <div className="pd-btn-group">
          <button className="pd-buy-now" onClick={handleBuyNow}>
            Buy Now
          </button>
          <button className="pd-add-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
