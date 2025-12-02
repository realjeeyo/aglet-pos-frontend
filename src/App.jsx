import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./context/ThemeContext";

import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import Checkout from './pages/Checkout';

function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: "/", name: "Dashboard", icon: HomeIcon },
    { path: "/checkout", name: "Checkout", icon: ShoppingCartIcon },
    { path: "/products", name: "Products", icon: CubeIcon },
    { path: "/sales", name: "Sales", icon: ChartBarIcon },
    { path: "/settings", name: "Settings", icon: Cog6ToothIcon },
  ];

  return (
    <Router>
      <div className="flex min-h-screen" style={{ background: 'var(--background)' }}>
        {/* Sidebar with fixed position */}
        <nav 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: isExpanded ? '256px' : '64px',
            background: 'var(--primary)',
            transition: 'all 0.3s ease',
            borderRight: '1px solid var(--border-color)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column'
          }}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <div 
              style={{ 
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isExpanded ? 'space-between' : 'center',
                borderBottom: '1px solid var(--border-color)'
              }}
            >
              {isExpanded && (
                <span style={{ 
                  background: 'var(--accent-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600,
                  fontSize: '1.25rem'
                }}>
                  Aglet POS
                </span>
              )}
              <ChevronRightIcon 
                style={{
                  width: '20px',
                  height: '20px',
                  color: 'var(--accent)',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              {navItems.map(({ path, name, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-secondary)',
                    gap: isExpanded ? '0.75rem' : '0',
                    justifyContent: isExpanded ? 'flex-start' : 'center',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                    e.currentTarget.style.color = 'var(--accent)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Icon style={{ width: '20px', height: '20px' }} />
                  {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>{name}</span>}
                </Link>
              ))}
            </div>

            {/* Theme Toggle Button */}
            <div style={{ 
              marginTop: 'auto', 
              padding: '1rem',
              borderTop: '1px solid var(--border-color)'
            }}>
              <button
                onClick={toggleTheme}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isExpanded ? 'flex-start' : 'center',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  borderRadius: '0.5rem',
                  gap: isExpanded ? '0.75rem' : '0',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {theme === 'light' ? (
                  <Moon size={20} />
                ) : (
                  <Sun size={20} />
                )}
                {isExpanded && (
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content with offset */}
        <main style={{ 
          flex: 1,
          padding: '1rem',
          marginLeft: isExpanded ? '256px' : '64px',
          transition: 'margin-left 0.3s ease',
          width: '100%'
        }}>
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
