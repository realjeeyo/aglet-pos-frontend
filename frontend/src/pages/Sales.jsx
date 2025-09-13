import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api';

export default function Reports() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_URL}/sales/report`);
      if (!res.ok) throw new Error('Failed to fetch sales data');
      
      const data = await res.json();
      console.log('Fetched sales data:', data); // Debug log
      setSales(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!sales?.length) return <div className="p-4">No sales records found.</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Sales Reports</h2>
      
      <div className="space-y-4">
        {sales.map(sale => (
          <div key={sale.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">
                Transaction #{sale.id}
              </h3>
              <span className="text-gray-600">
                {formatDate(sale.transactionDateTime)} {/* Changed from sale.date */}
              </span>
            </div>
            
            <table className="w-full mb-2">
              <thead>
                <tr className="border-b">
                  <th className="text-left">Item</th>
                  <th className="text-right">Quantity</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {sale.details?.map(detail => (
                  <tr key={detail.id}>
                    <td>{detail.Shoe?.brand} {detail.Shoe?.model}</td>
                    <td className="text-right">{detail.quantity}</td>
                    <td className="text-right">₱{detail.priceAtSale}</td>
                    <td className="text-right">₱{detail.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="text-right text-lg font-bold">
              Total: ₱{sale.totalAmount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
