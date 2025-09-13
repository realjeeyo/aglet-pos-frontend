import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import Checkout from "./pages/Checkout";

function App() {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { path: "/", name: "Dashboard", icon: HomeIcon },
    { path: "/checkout", name: "Checkout", icon: ShoppingCartIcon },
    { path: "/products", name: "Products", icon: CubeIcon },
    { path: "/sales", name: "Sales", icon: ChartBarIcon },
    { path: "/settings", name: "Settings", icon: Cog6ToothIcon },
  ];

  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar Navigation */}
        <nav
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          style={{
            width: isExpanded ? "200px" : "60px",
            background: "#1f2937",
            color: "white",
            transition: "width 0.3s ease-in-out",
            overflow: "hidden",
          }}
        >
          {/* Brand / Logo */}
          <div
            style={{
              padding: "1rem",
              fontWeight: "bold",
              fontSize: isExpanded ? "16px" : "12px",
              whiteSpace: "nowrap",
              textAlign: isExpanded ? "left" : "center",
            }}
          >
            {isExpanded ? "Aglet POS" : "A"}
          </div>

          {/* Menu */}
          <ul style={{ listStyle: "none", padding: "1rem", margin: 0 }}>
            {navItems.map(({ path, name, icon: Icon }) => (
              <li key={path} style={{ marginBottom: "1rem" }}>
                <Link
                  to={path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: isExpanded ? "10px" : "0",
                    color: "white",
                    textDecoration: "none",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Icon style={{ height: "20px", width: "20px", flexShrink: 0 }} />
                  {isExpanded && <span>{name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main
          style={{ flex: 1, padding: "1rem" }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;
