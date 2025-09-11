import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        {/* Sidebar Navigation */}
        <nav style={{ padding: "1rem", width: "200px", background: "#f4f4f4" }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/sales">Sales</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/reports">Reports</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </nav>

        {/* Main Content */}
        <main style={{ padding: "1rem", flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
