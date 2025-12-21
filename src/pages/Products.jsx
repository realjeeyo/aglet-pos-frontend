import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL = "http://localhost:3000/api";
const WS_URL = "ws://localhost:3000/ws";

/**
 * Products component displays shoe inventory from IMS (read-only)
 * @returns {JSX.Element} Product display page
 */
export default function Products() {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/shoes`);
        if (!res.ok) throw new Error(`Failed to fetch products`);
        const data = await res.json();
        setShoes(data);
      } catch (err) {
        setNotification({ show: true, message: err.message || 'Failed to load products', type: 'error' });
        setTimeout(() => setNotification({ show: false, message: '', type: 'info' }), 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const websocket = connectWebSocket();

    return () => {
      if (websocket) websocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'info' });
    }, 5000);
  };

  const connectWebSocket = () => {
    const websocket = new WebSocket(WS_URL);

    websocket.onopen = () => {
      console.log('[WS] Connected to inventory updates');
    };

    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('[WS] Received:', message);
        
        if (message.type === 'stock_changed' || message.type === 'stock_updated' || message.type === 'shoe_added' || message.type === 'shoe_updated') {
          fetchShoes(false);
          if (message.type === 'shoe_added') {
            showNotification('New product added to inventory', 'success');
          } else if (message.type === 'shoe_updated') {
            showNotification('Product updated', 'info');
          } else if (message.type === 'stock_changed') {
            showNotification('Stock levels updated', 'info');
          }
        }
      } catch (error) {
        console.error('[WS] Error parsing message:', error);
      }
    };

    websocket.onerror = (error) => {
      console.error('[WS] Error:', error);
    };

    websocket.onclose = () => {
      console.log('[WS] Disconnected, reconnecting in 5s...');
      setTimeout(connectWebSocket, 5000);
    };

    return websocket;
  };

  const fetchShoes = async (initialLoad = false) => {
    try {
      if (!initialLoad) {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      const res = await fetch(`${API_URL}/shoes`);
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setShoes(data);
      if (!initialLoad) showNotification('Inventory refreshed successfully', 'success');
    } catch (err) {
      showNotification(err.message || 'Failed to load products', 'error');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchShoes(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw size={48} className="mx-auto mb-4 animate-spin text-[var(--color-primary)]" />
          <p className="text-[var(--color-muted-foreground)]">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Notification Badge */}
      {notification.show && (
        <div 
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : notification.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-[var(--color-primary)] text-white'
          }`}
          style={{ animation: 'slideIn 0.3s ease-out' }}
        >
          <p className="font-medium">{notification.message}</p>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            Product Inventory
          </h1>
          <p className="text-[var(--color-muted-foreground)] text-sm mt-1">
            Real-time data from Inventory Management System
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          variant="outline"
          className="flex items-center gap-2 hover:cursor-pointer"
        >
          <RefreshCw 
            size={16} 
            className={isRefreshing ? 'animate-spin' : ''}
          />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader className="border-b border-[var(--color-border)]">
          <CardTitle className="text-[var(--color-foreground)]">
            All Products ({shoes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Brand</TableHead>
                  <TableHead className="font-semibold">Model</TableHead>
                  <TableHead className="font-semibold">Colorway</TableHead>
                  <TableHead className="font-semibold">Size</TableHead>
                  <TableHead className="font-semibold">Condition</TableHead>
                  <TableHead className="text-right font-semibold">Unit Price</TableHead>
                  <TableHead className="text-right font-semibold">Selling Price</TableHead>
                  <TableHead className="text-right font-semibold">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-[var(--color-muted-foreground)]">
                      <Package size={48} className="mx-auto mb-3 opacity-30" />
                      <p className="text-lg font-medium">No products available</p>
                      <p className="text-sm mt-1">Products will appear here when added to IMS</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  shoes.map((shoe) => (
                    <TableRow key={shoe.id} className="hover:bg-[var(--color-secondary)] transition-colors">
                      <TableCell className="font-medium">{shoe.brand}</TableCell>
                      <TableCell>{shoe.model}</TableCell>
                      <TableCell className="text-[var(--color-muted-foreground)]">{shoe.colorway}</TableCell>
                      <TableCell>{shoe.size}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          shoe.condition === 'New' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : shoe.condition === 'Like New'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {shoe.condition}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-[var(--color-muted-foreground)]">
                        ₱{Number(shoe.purchasePrice).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-[var(--color-primary)]">
                        ₱{Number(shoe.price).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${
                          shoe.currentStock < 5 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {shoe.currentStock}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
