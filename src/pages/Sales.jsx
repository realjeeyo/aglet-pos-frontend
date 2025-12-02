import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "http://localhost:3000/api";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [customPageSize, setCustomPageSize] = useState("");

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

  // Pagination calculations
  const totalPages = Math.ceil(sales.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSales = sales.slice(startIndex, endIndex);

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    setCustomPageSize("");
  };

  const handleCustomPageSize = () => {
    const size = parseInt(customPageSize);
    if (size > 0 && size <= 100) {
      setPageSize(size);
      setCurrentPage(1);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">Sales History</h1>
        
        {/* Pagination Controls */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--color-muted-foreground)]">Items per page:</span>
          <div className="flex gap-2">
            <Button
              variant={pageSize === 5 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageSizeChange(5)}
            >
              5
            </Button>
            <Button
              variant={pageSize === 10 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageSizeChange(10)}
            >
              10
            </Button>
            <div className="flex gap-1">
              <Input
                type="number"
                placeholder="Custom"
                value={customPageSize}
                onChange={(e) => setCustomPageSize(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomPageSize()}
                className="w-20 h-9"
                min="1"
                max="100"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCustomPageSize}
                disabled={!customPageSize}
              >
                Set
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Transactions</CardTitle>
            <span className="text-sm text-[var(--color-muted-foreground)]">
              Showing {startIndex + 1}-{Math.min(endIndex, sales.length)} of {sales.length}
            </span>
          </div>
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
              {paginatedSales.map(sale => (
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

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--color-border)]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-muted-foreground)]">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
