/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/index.ts
import axios, { InternalAxiosRequestConfig } from "axios";

// =============================
// 1. Axios Instance
// =============================
export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // e.g. http://localhost:4000/api
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔒 Auto-attach token (if exists)
API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Prevent caching for GET requests
  if (config.method === "get") {
    config.headers["Cache-Control"] = "no-store";
    config.headers["Pragma"] = "no-cache"; // for older browsers
  }

  return config;
});

// =============================
// 2. All API Pathnames Here
// =============================
export const apiRoutes = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
  },

  profile: {
    get: "/profile/",
    update: "/profile/",
  },

  products: {
    list: "/products/getProducts", // GET all products
    single: (id: string) => `/products/getProduct/${id}`, // GET one product
    create: "/products/createProduct", // POST new product
  },

  orders: {
    list: "/orders/user/orders",
    single: (id: string) => `/orders/${id}`,
    create: "/orders/create",
    cancel: (id: string) => `/orders/${id}/cancel`,
    all: "/orders/users",
    getById: (id: string) => `/orders/${id}`,
  },

  users: {
    list: "/users",
    single: (id: string) => `/users/${id}`,
    create: "/users/create",
  },
  address: {
    list: "profile/address/get",
    create: "profile/address/add",
    default: "profile/address/default/:id",
    update: (id: string) => `profile/address/update/${id}`,
    delete: (id: string) => `profile/address/delete/${id}`,
  },
  cart: {
    remove: (id: string) => `/cart/clear/${id}`,
  },
};

// =============================
// 3. API Functions (Optional)
// =============================
export const api = {
  login: (data: any) => API.post(apiRoutes.auth.login, data),

  getProfile: () => API.get(apiRoutes.profile.get),

  getProducts: (page: number, limit: number) =>
    API.get(`${apiRoutes.products.list}?page=${page}&limit=${limit}`),

  getProductById: (id: string) => API.get(apiRoutes.products.single(id)),

  createProduct: (data: any) => API.post(apiRoutes.products.create, data),
  removeCartItem: (cartItemId: string) =>
    API.delete(apiRoutes.cart.remove(cartItemId)),
};
