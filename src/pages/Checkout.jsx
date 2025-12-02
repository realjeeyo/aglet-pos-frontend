import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/api";

export default function Checkout() {
  const [shoes, setShoes] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShoes();
  }, []);

  const fetchShoes = async () => {
    try {
      const res = await fetch(`${API_URL}/shoes`);
      const data = await res.json();
      setShoes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const addToCart = (shoe) => {
    const existing = cart.find(item => item.shoeId === shoe.id);
    const totalQuantity = existing ? existing.quantity + 1 : 1;

    if (totalQuantity > shoe.currentStock) {
      setError(`Not enough stock for ${shoe.brand} ${shoe.model}`);
      return;
    }

    if (existing) {
      setCart(cart.map(item => 
        item.shoeId === shoe.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        shoeId: shoe.id,
        name: `${shoe.brand} ${shoe.model}`,
        price: shoe.price,
        quantity: 1,
        maxStock: shoe.currentStock
      }]);
    }
    setError(null);
  };

  const updateQuantity = (shoeId, quantity) => {
    const shoe = shoes.find(s => s.id === shoeId);
    const newQuantity = parseInt(quantity) || 0;

    if (newQuantity > shoe.currentStock) {
      setError(`Cannot exceed available stock (${shoe.currentStock} units)`);
      return;
    }

    setCart(cart.map(item => 
      item.shoeId === shoeId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
    setError(null);
  };

  const removeFromCart = (shoeId) => {
    setCart(cart.filter(item => item.shoeId !== shoeId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
      });

      if (!res.ok) throw new Error('Checkout failed');

      await fetchShoes();
      setCart([]);
      setError(null);
      alert('Sale completed successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-wrapper">Loading...</div>;
  if (error) return <div className="dashboard-wrapper" style={{ color: 'var(--error-gradient)' }}>Error: {error}</div>;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Checkout</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Products Section */}
          <div>
            <div className="stats-grid">
              {shoes.map(shoe => (
                <div key={shoe.id} className="stat-card">
                  <h3 className="stat-value">{shoe.brand} {shoe.model}</h3>
                  <p className="stat-label" style={{ marginTop: '0.5rem' }}>₱{shoe.price}</p>
                  <p className="stat-label" style={{ 
                    color: shoe.currentStock < 5 ? 'var(--error-gradient)' : 'var(--accent)',
                    marginTop: '0.5rem'
                  }}>
                    Stock: {shoe.currentStock}
                  </p>
                  <button
                    onClick={() => addToCart(shoe)}
                    disabled={shoe.currentStock < 1 || loading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      marginTop: '1rem',
                      background: shoe.currentStock < 1 ? 'var(--surface)' : 'var(--accent-gradient)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: shoe.currentStock < 1 ? 'var(--text-secondary)' : 'var(--primary)',
                      fontWeight: 'bold',
                      cursor: shoe.currentStock < 1 ? 'not-allowed' : 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="stat-card" style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
            <h2 className="stat-value" style={{ marginBottom: '1.5rem' }}>Cart</h2>

            {cart.length === 0 ? (
              <p className="stat-label" style={{ textAlign: 'center', padding: '2rem 0' }}>
                Your cart is empty
              </p>
            ) : (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  {cart.map(item => (
                    <div key={item.shoeId} style={{ 
                      padding: '1rem 0',
                      borderBottom: '1px solid rgba(255, 215, 0, 0.1)'
                    }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <p className="stat-label">{item.name}</p>
                        <p style={{ color: 'var(--accent)' }}>₱{item.price} each</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => updateQuantity(item.shoeId, Math.max(1, item.quantity - 1))}
                          style={{
                            padding: '0.5rem',
                            background: 'var(--surface)',
                            border: '1px solid var(--accent)',
                            borderRadius: '0.25rem',
                            color: 'var(--accent)',
                            cursor: 'pointer'
                          }}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={item.maxStock}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.shoeId, parseInt(e.target.value))}
                          style={{
                            width: '4rem',
                            padding: '0.5rem',
                            background: 'var(--surface)',
                            border: '1px solid rgba(255, 215, 0, 0.1)',
                            borderRadius: '0.25rem',
                            color: 'var(--text-primary)',
                            textAlign: 'center'
                          }}
                        />
                        <button
                          onClick={() => updateQuantity(item.shoeId, Math.min(item.maxStock, item.quantity + 1))}
                          style={{
                            padding: '0.5rem',
                            background: 'var(--surface)',
                            border: '1px solid var(--accent)',
                            borderRadius: '0.25rem',
                            color: 'var(--accent)',
                            cursor: 'pointer'
                          }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.shoeId)}
                          style={{
                            padding: '0.5rem',
                            background: 'var(--error-gradient)',
                            border: 'none',
                            borderRadius: '0.25rem',
                            color: 'var(--text-primary)',
                            marginLeft: 'auto',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ 
                  borderTop: '1px solid rgba(255, 215, 0, 0.1)',
                  paddingTop: '1rem'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem'
                  }}>
                    <span className="stat-label">Total:</span>
                    <span className="stat-value">
                      ₱{cart.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: loading ? 'var(--surface)' : 'var(--accent-gradient)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: loading ? 'var(--text-secondary)' : 'var(--primary)',
                      fontWeight: 'bold',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    {loading ? 'Processing...' : 'Checkout'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
