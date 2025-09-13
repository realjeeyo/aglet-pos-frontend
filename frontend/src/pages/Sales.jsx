import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/api";

export default function Sales() {
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
      setSales(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Sales History</h1>

      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Items</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale.id}>
              <td>#{sale.id}</td>
              <td>{new Date(sale.transactionDateTime).toLocaleString()}</td>
              <td>
                {sale.details.map(detail => (
                  <div key={detail.id}>
                    {detail.quantity}x {detail.Shoe.brand} {detail.Shoe.model}
                  </div>
                ))}
              </td>
              <td>{formatCurrency(sale.totalAmount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}