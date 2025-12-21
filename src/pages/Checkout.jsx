import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2 } from "lucide-react";

const API_URL = "http://localhost:3000/api";

/**
 * Checkout component handles product selection and cart management
 * Processes sales transactions
 * @returns {JSX.Element} Checkout page with product grid and cart
 */
export default function Checkout() {
  const [shoes, setShoes] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShoes();
  }, []);

  const fetchShoes = async () => {
    try {
      const res = await fetch(`${API_URL}/shoes`);
      if (!res.ok) {
        throw new Error(`Failed to load products: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setShoes(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    }
  };

  const addToCart = (shoe) => {
    const existing = cart.find(item => item.shoeId === shoe.id);
    const totalQuantity = existing ? existing.quantity + 1 : 1;

    if (totalQuantity > shoe.currentStock) {
      setError(`Not enough stock for ${shoe.brand} ${shoe.model}`);
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
    setError(null);
  };

  const updateQuantity = (shoeId, quantity) => {
    const shoe = shoes.find(s => s.id === shoeId);
    const newQuantity = parseInt(quantity) || 0;

    if (newQuantity > shoe.currentStock) {
      setError(`Cannot exceed available stock (${shoe.currentStock} units)`);
      return;
    }

    setCart(cart.map(item => 
      item.shoeId === shoeId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
    setError(null);
  };

  const removeFromCart = (shoeId) => {
    setCart(cart.filter(item => item.shoeId !== shoeId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Cart is empty');
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

      await fetchShoes();
      setCart([]);
      setError(null);
      window.alert('Sale completed successfully!');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-[var(--color-destructive)]">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[var(--color-primary)]">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {shoes.map(shoe => (
            <Card key={shoe.id}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold">{shoe.brand} {shoe.model}</h3>
                <p className="text-sm text-[var(--color-muted-foreground)]">{shoe.colorway}</p>
                <p className="text-sm mt-1">Size: {shoe.size} | {shoe.condition}</p>
                <p className="text-2xl font-bold text-[var(--color-primary)] mt-2">₱{shoe.price}</p>
                <p className={`text-sm mt-2 font-semibold ${shoe.currentStock < 5 ? 'text-[var(--color-destructive)]' : 'text-[var(--color-primary)]'}`}>
                  Stock: {shoe.currentStock}
                </p>
                <Button
                  onClick={() => addToCart(shoe)}
                  disabled={shoe.currentStock < 1 || loading}
                  className="w-full mt-4"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Cart</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-center py-8 text-[var(--color-muted-foreground)]">
                  Your cart is empty
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.shoeId} className="pb-4 border-b border-border">
                        <div className="mb-2">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-[var(--color-muted-foreground)]">Size: {item.size} | {item.condition}</p>
                          <p className="text-sm text-[var(--color-primary)]">₱{item.price} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.shoeId, Math.max(1, item.quantity - 1))}
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
                          >
                            <Plus size={16} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFromCart(item.shoeId)}
                            className="ml-auto"
                          >
                            <Trash2 size={16} className="text-[var(--color-destructive)]" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-[var(--color-primary)]">
                        ₱{cart.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                      </span>
                    </div>
                    <Button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? 'Processing...' : 'Checkout'}
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
