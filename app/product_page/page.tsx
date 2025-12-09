"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; // ✅ Added
import "../../styles/product-details.css";

export default function ProductDetailsPage() {
  const router = useRouter(); // ✅ Router instance

  // SAMPLE PRODUCT — replace with real API data later
  const product = {
    id: 1,
    name: "Running Shoes Pro",
    images: ["/shoe.jpeg", "/shoe.jpeg", "/shoe.jpeg"],
    price: 1299,
    oldPrice: 1999,
    discount: "-35%",
    rating: 4.3,
    reviews: 2180,
    stock: "In Stock",
    description:
      "Premium running shoes built for speed, comfort, and long-lasting durability.",
    features: [
      "Breathable mesh upper",
      "Soft cushioned insole",
      "Anti-slip rubber sole",
      "Ultra lightweight build",
      "Available in multiple colors",
    ],
  };

  // ✅ BUY NOW → Move to Cart Page with product details
  const handleBuyNow = () => {
    const query = new URLSearchParams({
      id: product.id.toString(),
      name: product.name,
      price: product.price.toString(),
      image: product.images[0],
    }).toString();

    router.push(`/cart?${query}`);
  };

  return (
    <div className="pd-container">
      {/* LEFT: IMAGE GALLERY */}
      <div className="pd-gallery">
        <div className="pd-main-img">
          <Image
            src={product.images[0]}
            width={450}
            height={450}
            alt="product"
          />
        </div>

        <div className="pd-thumbnails">
          {product.images.map((img, i) => (
            <div key={i} className="pd-thumb">
              <Image src={img} width={80} height={80} alt="thumb" />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: PRODUCT DETAILS */}
      <div className="pd-details">
        <h1 className="pd-title">{product.name}</h1>

        <p className="pd-rating">
          ⭐ {product.rating} <span>({product.reviews} ratings)</span>
        </p>

        <p className="pd-stock">{product.stock}</p>

        <p className="pd-price">
          ₹{product.price}
          <span className="pd-old-price">₹{product.oldPrice}</span>
          <span className="pd-discount">{product.discount}</span>
        </p>

        <p className="pd-desc">{product.description}</p>

        <ul className="pd-features">
          {product.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>

        <div className="pd-btn-group">
          <button className="pd-buy-now" onClick={handleBuyNow}>
            Buy Now
          </button>

          <button className="pd-add-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
