import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";

const API_URL = "http://localhost:3000/api";

export default function Products() {
  const [shoes, setShoes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    brand: "",
    model: "",
    size: "",
    price: "",
    currentStock: "",
    purchasePrice: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShoes();
  }, []);

  const fetchShoes = async () => {
    try {
      const res = await fetch(`${API_URL}/shoes`);
      const data = await res.json();
      setShoes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/shoes/${editingId}` : `${API_URL}/shoes`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save product");

      await fetchShoes();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (shoe) => {
    setEditingId(shoe.id);
    setForm(shoe);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${API_URL}/shoes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      await fetchShoes();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      brand: "",
      model: "",
      size: "",
      price: "",
      currentStock: "",
      purchasePrice: "",
    });
  };

  if (error) return <div className="p-6 text-[var(--color-destructive)]">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[var(--color-primary)]">Product Management</h1>

      {/* Product Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Product' : 'Add New Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Input
                  type="text"
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <Input
                  type="number"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Current Stock</label>
                <Input
                  type="number"
                  name="currentStock"
                  value={form.currentStock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Purchase Price</label>
                <Input
                  type="number"
                  name="purchasePrice"
                  value={form.purchasePrice}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit">
                {editingId ? 'Update Product' : 'Add Product'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shoes.map(shoe => (
          <Card key={shoe.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{shoe.brand}</h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{shoe.model}</p>
                  <p className="text-sm">Size: {shoe.size}</p>
                  <p className="text-2xl font-bold text-[var(--color-primary)]">₱{shoe.price}</p>
                  <p className={`text-sm font-semibold ${shoe.currentStock < 5 ? 'text-[var(--color-destructive)]' : 'text-[var(--color-primary)]'}`}>
                    Stock: {shoe.currentStock}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(shoe)}>
                    <Edit size={16} />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(shoe.id)}>
                    <Trash2 size={16} className="text-[var(--color-destructive)]" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
