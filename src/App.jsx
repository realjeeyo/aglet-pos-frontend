import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  Package,
  BarChart3,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "./context/ThemeContext";

import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
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
  ];

  return (
    <Router>
      <div className="flex min-h-screen bg-[var(--color-background)]">
        {/* Sidebar */}
        <nav 
          className={`fixed top-0 left-0 bottom-0 ${isExpanded ? 'w-64' : 'w-16'} bg-[var(--color-card)] border-r border-[var(--color-border)] shadow-sm z-50 flex flex-col transition-all duration-300 ease-in-out`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          style={{
            willChange: 'width',
            transform: 'translateZ(0)',
          }}
        >
          <div className="h-full overflow-y-auto overflow-x-hidden">
            <div className={`p-4 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} border-b border-[var(--color-border)]`}>
              <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                <span className="text-[var(--color-primary)] font-bold text-xl whitespace-nowrap">
                  Aglet POS
                </span>
              </div>
              <ChevronRight 
                size={20}
                className={`text-[var(--color-primary)] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </div>

            <div className="mt-6 flex-1">
              {navItems.map(({ path, name, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`group flex items-center px-4 py-3 text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] ${isExpanded ? 'gap-3' : 'justify-center'} no-underline transition-all duration-200`}
                  style={{ transform: 'translateZ(0)' }}
                >
                  <Icon size={20} className="transition-transform duration-200 group-hover:scale-110" />
                  <span className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'}`}>
                    {name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Theme Toggle Button */}
            <div className="p-4 border-t border-[var(--color-border)]">
              <button
                onClick={toggleTheme}
                className={`group flex items-center ${isExpanded ? 'justify-start' : 'justify-center'} w-full px-4 py-3 bg-transparent border-none text-[var(--color-muted-foreground)] cursor-pointer rounded-md hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] ${isExpanded ? 'gap-3' : ''} transition-all duration-200`}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? (
                  <Moon size={20} className="transition-transform duration-200 group-hover:scale-110" />
                ) : (
                  <Sun size={20} className="transition-transform duration-200 group-hover:scale-110" />
                )}
                <span className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'}`}>
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className={`flex-1 ${isExpanded ? 'ml-64' : 'ml-16'} w-full transition-all duration-300 ease-in-out`} style={{ willChange: 'margin-left' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/sales" element={<Sales />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
