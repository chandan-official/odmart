"use client";
import { useState } from "react";
import "./adminproduct.css";

interface Product {
  _id?: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      _id: "1",
      name: "Wireless Mouse",
      price: 599,
      stock: 25,
      category: "Electronics",
      image: "/dummy-mouse.jpg",
    },
    {
      _id: "2",
      name: "T-Shirt",
      price: 299,
      stock: 40,
      category: "Fashion",
      image: "/dummy-shirt.jpg",
    },
  ]);

  const [form, setForm] = useState<Product>({
    name: "",
    price: 0,
    stock: 0,
    category: "",
    image: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      // 🔧 Later: Upload to backend and replace with real image URL
      setForm({ ...form, image: url });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editing) {
      setProducts((prev) =>
        prev.map((p) => (p._id === editing ? { ...form, _id: editing } : p))
      );
      setEditing(null);
    } else {
      setProducts([...products, { ...form, _id: Date.now().toString() }]);
    }

    setForm({ name: "", price: 0, stock: 0, category: "", image: "" });
    setPreview(null);
  };

  const handleEdit = (id: string) => {
    const p = products.find((x) => x._id === id);
    if (p) {
      setForm(p);
      setEditing(id);
      setPreview(p.image || null);
    }
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div className="products-container">
      <h2>Product Management 🧾</h2>

      <form onSubmit={handleSubmit} className="product-form">
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <div className="preview-box">
            <img src={preview} alt="preview" />
          </div>
        )}

        <button type="submit" className="btn-primary">
          {editing ? "Update" : "Add"} Product
        </button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="table-img" />
                  ) : (
                    "—"
                  )}
                </td>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>{p.category}</td>
                <td>
                  <button onClick={() => handleEdit(p._id!)}>✏️</button>
                  <button onClick={() => handleDelete(p._id!)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
