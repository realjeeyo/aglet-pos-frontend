import React, { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiBox,
  FiActivity,
} from "react-icons/fi";

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
      console.error("Error fetching dashboard stats:", err);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 font-medium">
          Failed to load dashboard: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        Dashboard Overview
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Total Sales */}
        <div className="bg-gray-900 rounded-2xl shadow-md p-6 hover:shadow-xl hover:scale-[1.02] transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Sales</p>
              <p className="text-2xl font-bold mt-2 text-white">
                {formatCurrency(stats.totalSales)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiDollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-gray-900 rounded-2xl shadow-md p-6 hover:shadow-xl hover:scale-[1.02] transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Revenue</p>
              <p className="text-2xl font-bold mt-2 text-white">
                {formatCurrency(stats.revenue)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiTrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Top Product */}
        <div className="bg-gray-900 rounded-2xl shadow-md p-6 hover:shadow-xl hover:scale-[1.02] transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Top Product</p>
              {stats.topProduct ? (
                <div className="mt-2">
                  <p className="text-lg font-bold text-white">
                    {stats.topProduct.brand}
                  </p>
                  <p className="text-sm text-gray-300">
                    {stats.topProduct.model}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {stats.topProduct.totalSold} units sold
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 mt-2">No data available</p>
              )}
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiBox className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-900 rounded-2xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Recent Transactions
          </h2>
          <FiActivity className="h-5 w-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          {stats.recentTransactions.length === 0 ? (
            <p className="p-6 text-gray-400 text-center">
              No transactions available
            </p>
          ) : (
            <table className="w-full text-sm text-gray-300">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-400">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-400">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-400">
                    Items
                  </th>
                  <th className="px-6 py-3 text-right font-medium uppercase tracking-wider text-gray-400">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {stats.recentTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                      #{transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(
                        transaction.transactionDateTime
                      ).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {transaction.details.map((detail) => (
                          <div key={detail.id}>
                            {detail.quantity}x {detail.Shoe.brand}{" "}
                            {detail.Shoe.model}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-white">
                      {formatCurrency(transaction.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
