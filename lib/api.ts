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
    list: "/orders",
    single: (id: string) => `/orders/${id}`,
  },

  users: {
    list: "/users",
    single: (id: string) => `/users/${id}`,
    create: "/users/create",
  },
  address: {
    list: "/addresses/get",
    create: "/addresses/add",
    default: "/addresses/default/:id",
    update: (id: string) => `/addresses/update/${id}`,
    delete: (id: string) => `/addresses/delete/${id}`,
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
};
