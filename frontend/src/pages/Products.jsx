import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setShoes(data));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending data:', form); // Log what's being sent
      
      const res = await fetch('http://localhost:3000/api/shoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add shoe');
      
      console.log('Response:', data); // Log server response
      setShoes([...shoes, data]);
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
    } catch (error) {
      console.error('Error adding shoe:', error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <form onSubmit={handleSubmit}>
        <input 
          name="brand" 
          placeholder="Brand" 
          value={form.brand} 
          onChange={handleChange} 
          required 
        />
        <input 
          name="model" 
          placeholder="Model" 
          value={form.model} 
          onChange={handleChange} 
          required 
        />
        <input 
          name="colorway" 
          placeholder="Colorway" 
          value={form.colorway} 
          onChange={handleChange} 
        />
        <input 
          name="size" 
          placeholder="Size" 
          value={form.size} 
          onChange={handleChange} 
        />
        <input 
          name="condition" 
          placeholder="Condition" 
          value={form.condition} 
          onChange={handleChange} 
        />
        <input 
          name="purchasePrice" 
          placeholder="Purchase Price" 
          type="number" 
          value={form.purchasePrice} 
          onChange={handleChange} 
        />
        <input 
          name="price" 
          placeholder="Selling Price" 
          type="number" 
          value={form.price} 
          onChange={handleChange} 
          required 
        />
        <input 
          name="currentStock" 
          placeholder="Current Stock" 
          type="number" 
          value={form.currentStock} 
          onChange={handleChange} 
        />
        <button type="submit">Add Shoe</button>
      </form>
      <ul>
        {shoes.map(shoe => (
          <li key={shoe.id}>
            {shoe.brand} {shoe.model} - {shoe.colorway} - Size: {shoe.size} - ₱{shoe.price} - Stock: {shoe.currentStock}
          </li>
        ))}
      </ul>
    </div>
  );
}
