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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Products Section */}
        <div className="lg:w-2/3">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {shoes.map(shoe => (
              <div key={shoe.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{shoe.brand} {shoe.model}</h3>
                  <p className="mt-2 text-2xl font-bold text-gray-900">₱{shoe.price}</p>
                  <p className={`mt-1 text-sm ${
                    shoe.currentStock < 5 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    Stock: {shoe.currentStock}
                  </p>
                  <button
                    onClick={() => addToCart(shoe)}
                    disabled={shoe.currentStock < 1 || loading}
                    className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Cart</h2>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-6">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.shoeId} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">₱{item.price} each</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.shoeId, Math.max(1, item.quantity - 1))}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={item.maxStock}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.shoeId, parseInt(e.target.value))}
                          className="w-16 text-center border-gray-300 rounded-md"
                        />
                        <button
                          onClick={() => updateQuantity(item.shoeId, Math.min(item.maxStock, item.quantity + 1))}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.shoeId)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold mb-6">
                    <span>Total:</span>
                    <span>₱{cart.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
