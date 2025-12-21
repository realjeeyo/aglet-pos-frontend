import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2, ShoppingCart, RefreshCw, Grid3x3, List } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const API_URL = "http://localhost:3000/api";
const WS_URL = "ws://localhost:3000/ws";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);

/**
 * Checkout component handles product selection and cart management
 * Processes sales transactions
 * @returns {JSX.Element} Checkout page with product grid and cart
 */
export default function Checkout() {
  const [shoes, setShoes] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'error' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const { theme } = useTheme();

  const getConditionBadgeClass = (condition) => {
    const isDark = theme === 'dark';
    if (condition === 'New') {
      return isDark 
        ? 'bg-green-900/30 text-green-400' 
        : 'bg-green-400 text-white';
    } else if (condition === 'Like New') {
      return isDark 
        ? 'bg-blue-900/30 text-blue-400' 
        : 'bg-blue-400 text-white';
    } else {
      return isDark 
        ? 'bg-yellow-900/30 text-yellow-400' 
        : 'bg-yellow-400 text-white';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/shoes`);
        if (!res.ok) throw new Error(`Failed to load products`);
        const data = await res.json();
        setShoes(data);
      } catch (err) {
        setNotification({ show: true, message: err.message || 'Failed to load products', type: 'error' });
        setTimeout(() => setNotification({ show: false, message: '', type: 'error' }), 5000);
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
    const websocket = connectWebSocket();

    return () => {
      if (websocket) websocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWebSocket = () => {
    const websocket = new WebSocket(WS_URL);

    websocket.onopen = () => {
      console.log('[WS-Checkout] Connected to inventory updates');
    };

    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('[WS-Checkout] Received:', message);
        
        if (message.type === 'stock_changed' || message.type === 'stock_updated' || message.type === 'shoe_added' || message.type === 'shoe_updated') {
          fetchShoes(false);
        }
      } catch (error) {
        console.error('[WS-Checkout] Error parsing message:', error);
      }
    };

    websocket.onerror = (error) => {
      console.error('[WS-Checkout] Error:', error);
    };

    websocket.onclose = () => {
      console.log('[WS-Checkout] Disconnected, reconnecting in 5s...');
      setTimeout(connectWebSocket, 5000);
    };

    return websocket;
  };

  const showNotification = (message, type = 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'error' });
    }, 5000);
  };

  const fetchShoes = async (initialLoad = false) => {
    try {
      const res = await fetch(`${API_URL}/shoes`);
      if (!res.ok) {
        throw new Error(`Failed to load products: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setShoes(data);
    } catch (err) {
      showNotification(err.message || 'Failed to load products', 'error');
    } finally {
      if (initialLoad) {
        setPageLoading(false);
      }
    }
  };

  const addToCart = (shoe) => {
    const existing = cart.find(item => item.shoeId === shoe.id);
    const totalQuantity = existing ? existing.quantity + 1 : 1;

    if (totalQuantity > shoe.currentStock) {
      showNotification(`Not enough stock for ${shoe.brand} ${shoe.model}`, 'error');
      return;
    }

    if (existing) {
      setCart(cart.map(item => 
        item.shoeId === shoe.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        shoeId: shoe.id,
        name: `${shoe.brand} ${shoe.model} - ${shoe.colorway}`,
        size: shoe.size,
        condition: shoe.condition,
        price: shoe.price,
        quantity: 1,
        maxStock: shoe.currentStock
      }]);
    }
  };

  const updateQuantity = (shoeId, quantity) => {
    const shoe = shoes.find(s => s.id === shoeId);
    const newQuantity = parseInt(quantity) || 0;

    if (newQuantity > shoe.currentStock) {
      showNotification(`Cannot exceed available stock (${shoe.currentStock} units)`, 'error');
      return;
    }

    setCart(cart.map(item => 
      item.shoeId === shoeId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (shoeId) => {
    setCart(cart.filter(item => item.shoeId !== shoeId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showNotification('Cart is empty', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
      });

      if (!res.ok) {
        throw new Error(`Checkout failed: ${res.status} ${res.statusText}`);
      }

      await fetchShoes(false);
      setCart([]);
      showNotification('Sale completed successfully!', 'success');
    } catch (err) {
      showNotification(err.message || 'An unexpected error occurred during checkout', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
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
              : 'bg-red-500 text-white'
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

      <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2">
          {/* View Toggle */}
          <div className="flex justify-end mb-4 gap-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="hover:cursor-pointer"
            >
              <Grid3x3 size={16} className="mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="hover:cursor-pointer"
            >
              <List size={16} className="mr-2" />
              List
            </Button>
          </div>

          {/* Products Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
            {shoes.map((shoe) => (
              <Card 
                key={shoe.id} 
                className={`hover:shadow-md transition-shadow duration-200 ${viewMode === 'list' ? 'flex flex-row' : ''}`}
              >
                <CardContent className={`pt-6 ${viewMode === 'list' ? 'flex-1 flex items-center justify-between' : ''}`}>
                  {viewMode === 'grid' ? (
                    <>
                      <h3 className="font-bold text-lg mb-2 text-[var(--color-foreground)]">
                        {shoe.brand} {shoe.model}
                      </h3>
                      <p className="text-sm text-[var(--color-muted-foreground)] mb-1">{shoe.colorway}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm">Size: {shoe.size}</p>
                        <span className="text-[var(--color-muted-foreground)]">|</span>
                        <span className={`inline-block px-2 py-1 rounded-sm text-xs font-medium ${getConditionBadgeClass(shoe.condition)}`}>
                          {shoe.condition}
                        </span>
                      </div>
                      <p className="text-xl font-bold mb-2 text-[var(--color-primary)]">
                        {formatCurrency(shoe.price)}
                      </p>
                      <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                        Stock: <span className={shoe.currentStock < 5 ? 'text-red-500 font-semibold' : 'text-green-600 font-semibold'}>
                          {shoe.currentStock}
                        </span>
                      </p>
                      <Button 
                        onClick={() => addToCart(shoe)}
                        disabled={shoe.currentStock === 0}
                        className={`w-full ${
                          shoe.currentStock === 0 
                            ? 'bg-transparent outline-1 border-red-500 text-red-500 hover:bg-transparent' 
                            : 'hover:cursor-pointer'
                        }`}
                      >
                        <Plus size={16} className="mr-2" />
                        Add to Cart
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-6 flex-1">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-[var(--color-foreground)]">
                            {shoe.brand} {shoe.model}
                          </h3>
                          <p className="text-sm text-[var(--color-muted-foreground)]">{shoe.colorway}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm">Size: {shoe.size}</p>
                          <span className="text-[var(--color-muted-foreground)]">|</span>
                          <span className={`inline-block px-2 py-1 rounded-sm text-xs font-medium ${getConditionBadgeClass(shoe.condition)}`}>
                            {shoe.condition}
                          </span>
                        </div>
                        <p className="text-xl font-bold text-[var(--color-primary)] min-w-[120px] text-right">
                          {formatCurrency(shoe.price)}
                        </p>
                        <p className="text-sm text-[var(--color-muted-foreground)] min-w-[80px] text-right">
                          Stock: <span className={shoe.currentStock < 5 ? 'text-red-500 font-semibold' : 'text-green-600 font-semibold'}>
                            {shoe.currentStock}
                          </span>
                        </p>
                        <Button 
                          onClick={() => addToCart(shoe)}
                          disabled={shoe.currentStock === 0}
                          className={`min-w-[140px] ${
                            shoe.currentStock === 0 
                              ? 'bg-transparent outline-1 border-red-500 text-red-500 hover:bg-transparent cursor-not-allowed' 
                              : 'hover:cursor-pointer'
                          }`}
                        >
                          <Plus size={16} className="mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader className="border-b border-[var(--color-border)]">
              <CardTitle className="flex items-center gap-2 text-[var(--color-foreground)]">
                <ShoppingCart size={20} />
                Shopping Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {cart.length === 0 ? (
                <p className="text-center py-8 text-[var(--color-muted-foreground)]">
                  <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
                  <span className="block font-medium">Your cart is empty</span>
                  <span className="block text-sm mt-1">Add products to get started</span>
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.shoeId} className="pb-3 border-b border-[var(--color-border)]">
                        <div className="mb-2">
                          <p className="font-medium text-sm">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-[var(--color-muted-foreground)">
                              Size: {item.size}
                            </p>
                            <span className="text-[var(--color-muted-foreground)] text-xs">|</span>
                            <span className={`inline-block px-2 py-0.5 rounded-sm text-xs font-medium ${getConditionBadgeClass(item.condition)}`}>
                              {item.condition}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-[var(--color-primary)] mt-1">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.shoeId, Math.max(1, item.quantity - 1))}
                            className="hover:cursor-pointer"
                          >
                            <Minus size={16} />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            max={item.maxStock}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.shoeId, parseInt(e.target.value))}
                            className="w-16 text-center"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.shoeId, Math.min(item.maxStock, item.quantity + 1))}
                            className="hover:cursor-pointer"
                          >
                            <Plus size={16} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFromCart(item.shoeId)}
                            className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[var(--color-border)]">
                    <div className="flex justify-between items-center mb-4 p-3 bg-[var(--color-secondary)] rounded-lg">
                      <span className="font-medium">Total:</span>
                      <span className="text-2xl font-bold text-[var(--color-primary)]">
                        {formatCurrency(cart.reduce((sum, item) => sum + (item.quantity * item.price), 0))}
                      </span>
                    </div>
                    <Button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white hover:cursor-pointer"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw size={18} className="animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        'Complete Checkout'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
