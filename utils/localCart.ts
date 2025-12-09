/* eslint-disable prefer-const */
import { Product } from "../app/products/page";

export const addToCart = (product: Product): void => {
  let cart: (Product & { quantity: number })[] = JSON.parse(
    localStorage.getItem("cart") || "[]"
  );

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
};
