/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Link from "next/link";
import "../styles/productcard.css";
import { Product } from "../app/products/page";
import { addToCart } from "../utils/localCart";

interface Props {
  product: Product;
}

// REMOVE the truncateText function, as we'll use CSS truncation.

export default function ProductCard({ product }: Props) {
  // Use a reasonable minimum length to decide if "Read More" is necessary.
  // E.g., if the text is longer than 3 lines of typical content (around 120-150 chars), show "Read More".
  const MIN_LENGTH_FOR_READ_MORE = 150;

  const description = product.description || "";

  // Show "Read More" only if the description is long enough to overflow the 3 lines defined in CSS.
  const showReadMore = description.length > MIN_LENGTH_FOR_READ_MORE;

  return (
    <Link href={`/products_page/${product.id}`} className="product-link">
      <div className="products-cards">
        {/* Container for the image */}
        <div className="product-img">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="product-info">
          {/* Product Title */}
          <h3>{product.title}</h3>

          {/* Product Description - PASS THE FULL TEXT HERE */}
          <p className="description-text">
            {description}
            {/* The ... ellipsis will be added by CSS, but we keep the Read More span */}
          </p>

          {/* Render the Read More link separately, immediately after the description, 
              or visually near the price/button if space is tight. 
              Placing it here often works better for visibility.
          */}
          {showReadMore && (
            <p className="read-more-container">
              <span className="read-more">Read More...</span>
            </p>
          )}

          {/* Product Price */}
          <p className="price">₹{(product.price * 80).toFixed(2)}</p>

          <div className="btn-grp">
            <button
              className="add-to-cart"
              onClick={(e) => {
                e.preventDefault(); // Prevents navigating when clicking the button
                addToCart(product);
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
