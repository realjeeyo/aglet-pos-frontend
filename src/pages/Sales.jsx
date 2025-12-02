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

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <div style={{ textAlign: 'center', color: 'var(--error-gradient)' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Sales History</h1>
        </div>

        <div className="stat-card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
              <thead>
                <tr>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: 'var(--text-secondary)',
                    borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
                    fontWeight: '500'
                  }}>ID</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: 'var(--text-secondary)',
                    borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
                    fontWeight: '500'
                  }}>Date</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: 'var(--text-secondary)',
                    borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
                    fontWeight: '500'
                  }}>Items</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'right',
                    color: 'var(--text-secondary)',
                    borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
                    fontWeight: '500'
                  }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr 
                    key={sale.id}
                    style={{
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{
                      padding: '1rem',
                      borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
                      color: 'var(--accent)'
                    }}>
                      #{sale.id}
                    </td>
                    <td style={{
                      padding: '1rem',
                      borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
                      color: 'var(--text-secondary)'
                    }}>
                      {new Date(sale.transactionDateTime).toLocaleString()}
                    </td>
                    <td style={{
                      padding: '1rem',
                      borderBottom: '1px solid rgba(255, 215, 0, 0.1)'
                    }}>
                      {sale.details.map(detail => (
                        <div 
                          key={detail.id}
                          style={{
                            color: 'var(--text-primary)',
                            marginBottom: '0.25rem'
                          }}
                        >
                          {detail.quantity}x {detail.Shoe.brand} {detail.Shoe.model}
                        </div>
                      ))}
                    </td>
                    <td style={{
                      padding: '1rem',
                      borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
                      textAlign: 'right',
                      color: 'var(--accent)',
                      fontWeight: '500'
                    }}>
                      {formatCurrency(sale.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}