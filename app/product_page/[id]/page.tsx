"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import "../../../styles/product-details.css"; // Ensure this matches your CSS filename
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
  productImageurls?: ProductImage[];
}

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  // Safe access to ID (handling if it comes as string or array)
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  // --- RESTORED: FETCH PRODUCT FROM API ---
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const res = await API.get(`/products/getProductById/${id}`);
        const prod: Product = res.data.product;
        
        setProduct(prod);
        
        // Set the first image as selected by default
        if (prod.productImageurls && prod.productImageurls.length > 0) {
            setSelectedImage(prod.productImageurls[0].url);
        } else {
            setSelectedImage("/placeholder.png");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  // --- RESTORED: ADD TO CART API ---
  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        // Redirect to register/login if not logged in
        router.push("/register"); 
        return;
      }

      await API.post("/cart/add", 
        { productId: product._id, quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(`${product.name} added to cart!`);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart. Please try again.");
    }
  };

  // --- BUY NOW LOGIC (No API, passes data to checkout) ---
  const handleBuyNow = () => {
    if (!product) return;
    
    const query = new URLSearchParams({
      id: product._id,
      name: product.name,
      price: product.price.toString(),
      image: selectedImage || "",
      quantity: qty.toString(),
    }).toString();

    router.push(`/checkout_client?${query}`);
  };

  if (loading) return <div className="p-10 text-center text-white" style={{padding: '40px'}}>Loading product details...</div>;
  if (!product) return <div className="p-10 text-center text-white" style={{padding: '40px'}}>Product not found.</div>;

  return (
    <div className="product-page-container">
      <div className="product-wrapper">
        
        {/* --- LEFT: GALLERY --- */}
        <div className="product-gallery">
          <div className="main-image-frame">
            <Image
              src={selectedImage || "/placeholder.png"}
              width={500}
              height={500}
              alt={product.name}
              className="main-img"
              priority
            />
          </div>

          <div className="thumbnail-list">
            {product.productImageurls?.map((imgObj, i) => (
              <div
                key={i}
                className={`thumb-item ${selectedImage === imgObj.url ? "selected active" : ""}`}
                onClick={() => setSelectedImage(imgObj.url)}
              >
                <Image
                  src={imgObj.url}
                  width={70}
                  height={70}
                  alt={`thumb ${i}`}
                  style={{ objectFit: "contain", width: '100%', height: '100%' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT: DETAILS --- */}
        <div className="product-info-panel">
          <h1 className="prod-title">{product.name}</h1>
          
          <div className="prod-meta">
            <span className="rating-badge">⭐ {product.rating || 4.5}</span>
            <span className={`stock-badge ${(product.stock ?? 0) > 0 ? "in-stock" : "out-stock"}`}>
              {(product.stock ?? 0) > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="prod-price-block">
             <span className="prod-price">₹{product.price.toLocaleString()}</span>
             {product.oldPrice && (
               <span className="pd-old-price" style={{textDecoration: 'line-through', color: 'var(--text-muted)', marginLeft: '10px', fontSize: '1.2rem'}}>
                 ₹{product.oldPrice.toLocaleString()}
               </span>
             )}
             {product.discount && (
               <span className="stock-badge in-stock" style={{marginLeft: '10px'}}>{product.discount}</span>
             )}
          </div>
          
          <p className="prod-desc">{product.description || "No description available for this premium item."}</p>

          <div className="action-area">
             {/* Quantity Control */}
             <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}>+</button>
             </div>

             <div className="pd-btn-group" style={{display: 'flex', gap: '16px', flex: 1}}>
                <button 
                  className="add-cart-btn" 
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                >
                  {product.stock ? "Add to Cart" : "Out of Stock"}
                </button>
                
                <button 
                  className="add-cart-btn" 
                  style={{background: 'white', color: 'black'}} 
                  onClick={handleBuyNow}
                  disabled={!product.stock}
                >
                  Buy Now
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}