import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  Package,
  BarChart3,
  Settings as SettingsIcon,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "./context/ThemeContext";

import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import Checkout from './pages/Checkout';

/**
 * Main App component with routing and sidebar navigation
 * Manages theme state and navigation menu
 * @returns {JSX.Element} Main application layout
 */
function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: "/", name: "Dashboard", icon: Home },
    { path: "/checkout", name: "Checkout", icon: ShoppingCart },
    { path: "/products", name: "Products", icon: Package },
    { path: "/sales", name: "Sales", icon: BarChart3 },
    { path: "/settings", name: "Settings", icon: SettingsIcon },
  ];

  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar with fixed position - no animations */}
        <nav 
          className={`fixed top-0 left-0 bottom-0 ${isExpanded ? 'w-64' : 'w-16'} bg-[var(--color-card)] border-r border-[var(--color-border)] z-50 flex flex-col`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div className="h-full overflow-y-auto">
            <div className={`p-4 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} border-b border-[var(--color-border)]`}>
              {isExpanded && (
                <span className="text-[var(--color-primary)] font-semibold text-xl">
                  Aglet POS
                </span>
              )}
              <ChevronRight 
                size={20}
                className={`text-[var(--color-primary)] ${isExpanded ? 'rotate-180' : ''}`}
              />
            </div>

            <div className="mt-6 flex-1">
              {/* eslint-disable-next-line no-unused-vars */}
              {navItems.map(({ path, name, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center px-4 py-3 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-primary)] ${isExpanded ? 'gap-3' : 'justify-center'} no-underline`}
                >
                  <Icon size={20} />
                  {isExpanded && <span className="whitespace-nowrap">{name}</span>}
                </Link>
              ))}
            </div>

            {/* Theme Toggle Button - Always visible at bottom */}
            <div className="p-4 border-t border-[var(--color-border)]">
              <button
                onClick={toggleTheme}
                className={`flex items-center ${isExpanded ? 'justify-start' : 'justify-center'} w-full px-4 py-3 bg-transparent border-none text-[var(--color-muted-foreground)] cursor-pointer rounded-md hover:bg-[var(--color-muted)] hover:text-[var(--color-primary)] ${isExpanded ? 'gap-3' : ''}`}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? (
                  <Moon size={20} />
                ) : (
                  <Sun size={20} />
                )}
                {isExpanded && (
                  <span className="whitespace-nowrap">
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content with offset - no animation */}
        <main className={`flex-1 p-4 ${isExpanded ? 'ml-64' : 'ml-16'} w-full`}>
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
