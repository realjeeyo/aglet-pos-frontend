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
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Product Management</h1>
        </div>

        {/* Product Form Card */}
        <div className="stat-card" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              <div className="form-group">
                <label className="stat-label">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--surface)',
                    border: '1px solid rgba(255, 215, 0, 0.1)',
                    borderRadius: '0.5rem',
                    color: 'var(--text-primary)',
                    marginTop: '0.5rem'
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="stat-label">Model</label>
                <input
                  type="text"
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--surface)',
                    border: '1px solid rgba(255, 215, 0, 0.1)',
                    borderRadius: '0.5rem',
                    color: 'var(--text-primary)',
                    marginTop: '0.5rem'
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="stat-label">Size</label>
                <input
                  type="number"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--surface)',
                    border: '1px solid rgba(255, 215, 0, 0.1)',
                    borderRadius: '0.5rem',
                    color: 'var(--text-primary)',
                    marginTop: '0.5rem'
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="stat-label">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--surface)',
                    border: '1px solid rgba(255, 215, 0, 0.1)',
                    borderRadius: '0.5rem',
                    color: 'var(--text-primary)',
                    marginTop: '0.5rem'
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="stat-label">Current Stock</label>
                <input
                  type="number"
                  name="currentStock"
                  value={form.currentStock}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--surface)',
                    border: '1px solid rgba(255, 215, 0, 0.1)',
                    borderRadius: '0.5rem',
                    color: 'var(--text-primary)',
                    marginTop: '0.5rem'
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="stat-label">Purchase Price</label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={form.purchasePrice}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--surface)',
                    border: '1px solid rgba(255, 215, 0, 0.1)',
                    borderRadius: '0.5rem',
                    color: 'var(--text-primary)',
                    marginTop: '0.5rem'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ 
              marginTop: '2rem',
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                type="submit"
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'var(--primary)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'var(--surface)',
                    border: '1px solid var(--accent)',
                    borderRadius: '0.5rem',
                    color: 'var(--accent)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products Grid */}
        <div className="stats-grid">
          {shoes.map(shoe => (
            <div key={shoe.id} className="stat-card">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <h3 className="stat-value">{shoe.brand}</h3>
                  <p className="stat-label">{shoe.model}</p>
                  <p className="stat-label" style={{ marginTop: '1rem' }}>
                    Size: {shoe.size}
                  </p>
                  <p className="stat-value" style={{ marginTop: '0.5rem' }}>
                    ₱{shoe.price}
                  </p>
                  <p className="stat-label" style={{ 
                    marginTop: '0.5rem',
                    color: shoe.currentStock < 5 ? 'var(--error-gradient)' : 'var(--success-gradient)'
                  }}>
                    Stock: {shoe.currentStock}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(shoe)}
                    style={{
                      padding: '0.5rem',
                      background: 'var(--accent)',
                      border: 'none',
                      borderRadius: '0.25rem',
                      color: 'var(--primary)',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(shoe.id)}
                    style={{
                      padding: '0.5rem',
                      background: 'var(--error-gradient)',
                      border: 'none',
                      borderRadius: '0.25rem',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}