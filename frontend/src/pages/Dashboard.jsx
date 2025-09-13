import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiBox, FiActivity } from 'react-icons/fi';

const API_URL = 'http://localhost:3000/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    revenue: 0,
    topProduct: null,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(`${API_URL}/sales/dashboard-stats`);
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      
      const data = await res.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Sales Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSales)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiDollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiTrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Top Product Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Product</p>
              {stats.topProduct ? (
                <>
                  <p className="text-lg font-bold text-gray-900">{stats.topProduct.brand}</p>
                  <p className="text-sm text-gray-600">{stats.topProduct.model}</p>
                  <p className="text-xs text-gray-500">{stats.topProduct.totalSold} units sold</p>
                </>
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiBox className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <FiActivity className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.transactionDateTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-1">
                      {transaction.details.map((detail) => (
                        <div key={detail.id}>
                          {detail.quantity}x {detail.Shoe.brand} {detail.Shoe.model}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {formatCurrency(transaction.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
