import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const API_URL = 'http://localhost:3000/api/shoes';

export default function Products() {
  const [shoes, setShoes] = useState([]);
  const [form, setForm] = useState({
    brand: '',
    model: '',
    colorway: '',
    size: '',
    condition: '',
    purchasePrice: '',
    price: '',
    currentStock: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchShoes();
  }, []);

  const fetchShoes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setShoes(data);
    } catch (err) {
      console.error('Error fetching shoes:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Failed to save shoe');

      await fetchShoes();
      resetForm();
    } catch (err) {
      console.error('Error saving shoe:', err);
      alert(err.message);
    }
  };

  const handleEdit = (shoe) => {
    setForm(shoe);
    setEditingId(shoe.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this shoe?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete shoe');

      await fetchShoes();
    } catch (err) {
      console.error('Error deleting shoe:', err);
      alert(err.message);
    }
  };

  const resetForm = () => {
    setForm({
      brand: '',
      model: '',
      colorway: '',
      size: '',
      condition: '',
      purchasePrice: '',
      price: '',
      currentStock: ''
    });
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <button
          onClick={() => setEditingId(null)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" />
          Add New Product
        </button>
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <input
              type="text"
              name="model"
              value={form.model}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Colorway</label>
            <input
              type="text"
              name="colorway"
              value={form.colorway}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Size</label>
            <input
              type="text"
              name="size"
              value={form.size}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Condition</label>
            <input
              type="text"
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
            <input
              type="number"
              name="purchasePrice"
              value={form.purchasePrice}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Selling Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Stock</label>
            <input
              type="number"
              name="currentStock"
              value={form.currentStock}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-6 flex items-center">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-3 inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {shoes.map(shoe => (
          <div key={shoe.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">{shoe.brand} {shoe.model}</h3>
              <p className="text-sm text-gray-500 mt-1">Size: {shoe.size}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">₱{shoe.price}</span>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  shoe.currentStock < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  Stock: {shoe.currentStock}
                </span>
              </div>
              <div className="mt-6 flex items-center justify-end space-x-3">
                <button
                  onClick={() => handleEdit(shoe)}
                  className="inline-flex items-center p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <FiEdit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(shoe.id)}
                  className="inline-flex items-center p-2 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
