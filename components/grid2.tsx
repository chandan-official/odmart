/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import "../styles/grid2.css";
import { MdOutlineFavoriteBorder, MdFavorite } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: number;
  stock: string;
  image: string;
}

interface Category {
  id: number;
  name?: string;
  products: Product[];
}

export default function Grid2() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const handleProduct = (id: number) => {
    router.push(`/product_page?id=${id}`);
  };

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // ❗ Prevents navigation on clicking wishlist
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const data = [
      {
        id: 1,
        name: "Shoes",
        products: [
          {
            id: 101,
            name: "US Polo Assn.",
            desc: "Unisex-Adult Court Shoes",
            price: 499.99,
            oldPrice: 999.99,
            discount: "50% off",
            rating: 4.1,
            stock: "Only 2 left",
            image: "/shoe.jpeg",
          },
          {
            id: 102,
            name: "Nike Air Zoom",
            desc: "Men’s Running Shoes",
            price: 899.99,
            oldPrice: 1599.99,
            discount: "40% off",
            rating: 4.5,
            stock: "In Stock",
            image: "/shoe.jpeg",
          },
          {
            id: 103,
            name: "Adidas Ultraboost",
            desc: "Women’s Running Shoes",
            price: 799.99,
            oldPrice: 1399.99,
            discount: "43% off",
            rating: 4.7,
            stock: "In Stock",
            image: "/shoe.jpeg",
          },
        ],
      },
      {
        id: 2,
        name: "Watches",
        products: [
          {
            id: 201,
            name: "Titan Edge",
            desc: "Analog Men Watch",
            price: 1199.99,
            oldPrice: 1999.99,
            discount: "40% off",
            rating: 4.2,
            stock: "Limited Stock",
            image: "/shoe.jpeg",
          },
        ],
      },
    ];

    setCategories(data);
  }, []);

  return (
    <div className="grid2-container">
      {categories.map((cat) => (
        <div key={cat.id} className="category">
          <h2 className="category-title">{cat.name}</h2>

          <div className="category-products-row">
            {cat.products.map((product) => (
              <div
                key={product.id}
                className="products-cards"
                onClick={() => handleProduct(product.id)}
              >
                {/* IMAGE */}
                <div className="product-img">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
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

                  <p>
                    ⭐ {product.rating} ({Math.floor(product.rating * 1000)})
                  </p>

                  <p className="stock">{product.stock}</p>

                  <div className="btn-grp">
                    <button className="add-to-cart">Shop Now</button>

                    <button
                      className={`wishlist-btn ${
                        liked[product.id] ? "liked" : ""
                      }`}
                      onClick={(e) => toggleLike(e, product.id)}
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
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
