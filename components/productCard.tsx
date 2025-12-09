"use client";
import React from "react";
import "../styles/productcard.css";
import { Product } from "../app/products/page";
import { addToCart } from "../utils/localCart";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p className="price">₹{(product.price * 80).toFixed(2)}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
}
