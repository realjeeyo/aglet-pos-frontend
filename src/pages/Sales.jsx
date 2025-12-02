import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
      <div className="p-6">
        <div className="text-center text-[var(--color-muted-foreground)]">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-[var(--color-destructive)]">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[var(--color-primary)]">Sales History</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
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
              {sales.map(sale => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium text-[var(--color-primary)]">#{sale.id}</TableCell>
                  <TableCell className="text-[var(--color-muted-foreground)]">
                    {new Date(sale.transactionDateTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {sale.details.map(detail => (
                        <div key={detail.id} className="text-sm">
                          {detail.quantity}x {detail.Shoe.brand} {detail.Shoe.model}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-[var(--color-primary)]">
                    {formatCurrency(sale.totalAmount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
