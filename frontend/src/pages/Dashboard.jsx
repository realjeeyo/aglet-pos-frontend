import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    revenue: 0,
    topProduct: null,
    recentTransactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(`${API_URL}/sales/dashboard-stats`);
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      setStats(data);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Dashboard Overview</h1>

      <div>
        {/* Total Sales */}
        <div>
          <div>
            <div>
              <p>Total Sales</p>
              <p>{formatCurrency(stats.totalSales)}</p>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div>
          <div>
            <div>
              <p>Revenue</p>
              <p>{formatCurrency(stats.revenue)}</p>
            </div>
          </div>
        </div>

        {/* Top Product */}
        <div>
          <div>
            <div>
              <p>Top Product</p>
              {stats.topProduct ? (
                <div>
                  <p>{stats.topProduct.brand}</p>
                  <p>{stats.topProduct.model}</p>
                  <p>{stats.topProduct.totalSold} units sold</p>
                </div>
              ) : (
                <p>No data</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div>
          <h2>Recent Transactions</h2>
        </div>
        {stats.recentTransactions.length === 0 ? (
          <p>No transactions available</p>
        ) : (
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
              {stats.recentTransactions.map((t) => (
                <tr key={t.id}>
                  <td>#{t.id}</td>
                  <td>{new Date(t.transactionDateTime).toLocaleString()}</td>
                  <td>
                    <div>
                      {t.details.map((d) => (
                        <div key={d.id}>
                          {d.quantity}x {d.Shoe.brand} {d.Shoe.model}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>{formatCurrency(t.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}