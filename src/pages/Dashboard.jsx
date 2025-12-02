import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
      <div className="p-6">
        <div className="flex items-center justify-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center text-[var(--color-destructive)]">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">Dashboard Overview</h1>
        <div className="text-sm text-[var(--color-muted-foreground)]">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[var(--color-muted-foreground)]">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[var(--color-primary)]">{formatCurrency(stats.totalSales)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[var(--color-muted-foreground)]">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[var(--color-primary)]">{formatCurrency(stats.revenue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[var(--color-muted-foreground)]">Top Product</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topProduct ? (
              <div className="space-y-1">
                <p className="text-2xl font-bold text-[var(--color-primary)]">{stats.topProduct.brand}</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">{stats.topProduct.model}</p>
                <p className="text-xs text-[var(--color-accent)] font-semibold">
                  {stats.topProduct.totalSold} units sold
                </p>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-muted-foreground)]">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-[var(--color-muted-foreground)]">
              <p>No transactions available</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentTransactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>#{t.id}</TableCell>
                    <TableCell>{new Date(t.transactionDateTime).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {t.details.map((d) => (
                          <div key={d.id} className="text-sm">
                            {d.quantity}x {d.Shoe.brand} {d.Shoe.model}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-[var(--color-primary)]">
                      {formatCurrency(t.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
