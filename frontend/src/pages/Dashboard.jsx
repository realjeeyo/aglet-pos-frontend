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
    return (
      <div className="dashboard-wrapper">
        <div className="flex-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <div className="flex-center" style={{ color: "var(--error)" }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <div className="dashboard-date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Sales</p>
            <p className="stat-value">{formatCurrency(stats.totalSales)}</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Revenue</p>
            <p className="stat-value">{formatCurrency(stats.revenue)}</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Top Product</p>
            {stats.topProduct ? (
              <div>
                <p className="stat-value">{stats.topProduct.brand}</p>
                <p className="stat-label">{stats.topProduct.model}</p>
                <p className="stat-highlight">
                  {stats.topProduct.totalSold} units sold
                </p>
              </div>
            ) : (
              <p className="stat-label">No data available</p>
            )}
          </div>
        </div>

        <div className="transactions-container">
          <div className="transactions-header">
            <h2>Recent Transactions</h2>
          </div>
          {stats.recentTransactions.length === 0 ? (
            <div className="transactions-empty">
              <p>No transactions available</p>
            </div>
          ) : (
            <div className="transactions-table-wrapper">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions.map((t) => (
                    <tr key={t.id}>
                      <td>#{t.id}</td>
                      <td>{new Date(t.transactionDateTime).toLocaleString()}</td>
                      <td>
                        <div className="transaction-items">
                          {t.details.map((d) => (
                            <div key={d.id} className="transaction-item">
                              {d.quantity}x {d.Shoe.brand} {d.Shoe.model}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span className="amount">
                          {formatCurrency(t.totalAmount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}