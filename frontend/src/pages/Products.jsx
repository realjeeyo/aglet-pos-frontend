import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/api";

export default function Products() {
  const [shoes, setShoes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    brand: "",
    model: "",
    size: "",
    price: "",
    currentStock: "",
    purchasePrice: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShoes();
  }, []);

  const fetchShoes = async () => {
    try {
      const res = await fetch(`${API_URL}/shoes`);
      const data = await res.json();
      setShoes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/shoes/${editingId}` : `${API_URL}/shoes`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save product");

      await fetchShoes();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (shoe) => {
    setEditingId(shoe.id);
    setForm(shoe);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${API_URL}/shoes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      await fetchShoes();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      brand: "",
      model: "",
      size: "",
      price: "",
      currentStock: "",
      purchasePrice: "",
    });
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Product Management</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Brand:</label>
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Model:</label>
          <input
            type="text"
            name="model"
            value={form.model}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Size:</label>
          <input
            type="number"
            name="size"
            value={form.size}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Current Stock:</label>
          <input
            type="number"
            name="currentStock"
            value={form.currentStock}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Purchase Price:</label>
          <input
            type="number"
            name="purchasePrice"
            value={form.purchasePrice}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editingId ? "Update" : "Add"} Product</button>
        {editingId && (
          <button type="button" onClick={resetForm}>Cancel</button>
        )}
      </form>

      <div>
        {shoes.map((shoe) => (
          <div key={shoe.id}>
            <h3>{shoe.brand} {shoe.model}</h3>
            <p>Size: {shoe.size}</p>
            <p>Price: ₱{shoe.price}</p>
            <p>Stock: {shoe.currentStock}</p>
            <button onClick={() => handleEdit(shoe)}>Edit</button>
            <button onClick={() => handleDelete(shoe.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}