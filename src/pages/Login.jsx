import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CircuitBoard, Mail, Lock, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        showToast('Login successful! Welcome back.', 'success');
        navigate('/');
      } else {
        setError('Invalid credentials. Use admin@vsb.edu / admin123');
        setLoading(false);
      }
    }, 500);
  };

  const fillDemo = () => {
    setEmail('admin@vsb.edu');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-bg-pattern" />
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-wrapper">
            <CircuitBoard size={40} className="login-logo" />
          </div>
          <h1 className="login-title">ECE Lab Inventory Manager</h1>
          <p className="login-subtitle">Sign in to manage your laboratory inventory</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-field">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="admin@vsb.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner" />
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>

          <div className="login-demo-hint">
            <p>Demo credentials:</p>
            <button type="button" onClick={fillDemo} className="login-demo-btn">
              admin@vsb.edu / admin123 — Click to fill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
