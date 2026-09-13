import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Components from './pages/Components.jsx';
import AddComponent from './pages/AddComponent.jsx';
import LowStock from './pages/LowStock.jsx';
import Reports from './pages/Reports.jsx';
import About from './pages/About.jsx';
import ViewComponent from './pages/ViewComponent.jsx';
import EditComponent from './pages/EditComponent.jsx';

function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner-large"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/components" element={<Components />} />
        <Route path="/components/:id" element={<ViewComponent />} />
        <Route path="/add" element={<AddComponent />} />
        <Route path="/edit/:id" element={<EditComponent />} />
        <Route path="/low-stock" element={<LowStock />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner-large"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}
