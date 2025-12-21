import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
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
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [ws, setWs] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchShoes();
    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
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
        
        // Refresh inventory when stock changes
        if (message.type === 'stock_changed' || message.type === 'shoe_added') {
          fetchShoes();
          if (message.type === 'shoe_added') {
            showNotification('New product added to inventory', 'success');
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

    setWs(websocket);
  };

  const fetchShoes = async (showLoading = false) => {
    try {
      if (showLoading) setIsRefreshing(true);
      const res = await fetch(`${API_URL}/shoes`);
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setShoes(data);
      if (showLoading) showNotification('Inventory refreshed', 'success');
    } catch (err) {
      showNotification(err.message || 'Failed to load products', 'error');
    } finally {
      if (showLoading) setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchShoes(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Notification Badge */}
      {notification.show && (
        <div 
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg transition-opacity duration-500 ${
            notification.type === 'success' 
              ? 'bg-green-600 text-white' 
              : notification.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-blue-600 text-white'
          }`}
          style={{ animation: 'slideIn 0.3s ease-out' }}
        >
          <p className="font-medium">{notification.message}</p>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Product Inventory</h1>
          <p className="text-[var(--color-muted-foreground)]">
            Data fetched from Inventory Management System (IMS) via WebSocket.
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products ({shoes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Colorway</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Selling Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-[var(--color-muted-foreground)]">
                    No products available
                  </TableCell>
                </TableRow>
              ) : (
                shoes.map(shoe => (
                  <TableRow key={shoe.id}>
                    <TableCell className="font-medium">{shoe.brand}</TableCell>
                    <TableCell>{shoe.model}</TableCell>
                    <TableCell>{shoe.colorway}</TableCell>
                    <TableCell>{shoe.size}</TableCell>
                    <TableCell>{shoe.condition}</TableCell>
                    <TableCell className="text-right">₱{Number(shoe.purchasePrice).toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">₱{Number(shoe.price).toFixed(2)}</TableCell>
                    <TableCell className={`text-right font-semibold ${
                      shoe.currentStock < 5 ? 'text-[var(--color-destructive)]' : 'text-[var(--color-primary)]'
                    }`}>
                      {shoe.currentStock}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
