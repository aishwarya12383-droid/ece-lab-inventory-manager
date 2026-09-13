import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  PlusCircle,
  AlertTriangle,
  BarChart3,
  Info,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  CircuitBoard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/components', label: 'Components', icon: Boxes },
  { path: '/add', label: 'Add Component', icon: PlusCircle },
  { path: '/low-stock', label: 'Low Stock', icon: AlertTriangle },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/about', label: 'About', icon: Info },
];

export default function Layout({ children })  {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const pageTitle = menuItems.find((item) => {
    if (item.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.path);
  });

  return (
    <div className="app-layout">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <CircuitBoard size={28} className="sidebar-logo" />
          <div className="sidebar-title-group">
            <h1 className="sidebar-title">ECE Lab</h1>
            <span className="sidebar-subtitle">Inventory Manager</span>
          </div>
          <button className="sidebar-close-mobile" onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
                onClick={closeSidebar}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name || 'Admin'}</span>
              <span className="sidebar-user-email">{user?.email}</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-area">
        <header className="topbar">
          <button
            className="topbar-menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h2 className="topbar-title">
            {pageTitle?.label || 'Dashboard'}
          </h2>
          <div className="topbar-actions">
            <button
              className="topbar-theme-btn"
              onClick={toggleTheme}
              title="Toggle dark mode"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </header>

        <main className="main-content">
  {children}
</main>
      </div>
    </div>
  );
}
