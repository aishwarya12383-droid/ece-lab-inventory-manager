import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  Package,
  CheckCircle,
  Wrench,
  AlertTriangle,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { getAllComponents } from '../services/api.js';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Dashboard() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const data = await getAllComponents();
      setComponents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loading message="Loading dashboard..." />;

  const totalComponents = components.length;
  const totalQuantity = components.reduce((sum, c) => sum + Number(c.quantity), 0);
  const available = components.filter((c) => c.status === 'Available').length;
  const inUse = components.filter((c) => c.status === 'In Use').length;
  const lowStockItems = components.filter((c) => Number(c.quantity) <= Number(c.minStock));

  const recentComponents = [...components]
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 5);

  const categorySummary = components.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});
  const categoryEntries = Object.entries(categorySummary).sort((a, b) => b[1] - a[1]);
  const maxCategoryCount = Math.max(...categoryEntries.map((e) => e[1]), 1);

  return (
    <div className="page-content">
      {/* Stat cards */}
      <div className="stat-cards-grid">
        <StatCard icon={Boxes} label="Total Components" value={totalComponents} color="blue" />
        <StatCard icon={Package} label="Total Quantity" value={totalQuantity} color="cyan" />
        <StatCard icon={CheckCircle} label="Available" value={available} color="green" />
        <StatCard icon={Wrench} label="In Use" value={inUse} color="orange" />
        <StatCard icon={AlertTriangle} label="Low Stock Items" value={lowStockItems.length} color="red" />
      </div>

      <div className="dashboard-grid">
        {/* Recent components */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Clock size={18} />
              Recent Components
            </h3>
            <Link to="/components" className="card-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {recentComponents.length === 0 ? (
            <EmptyState title="No components yet" message="Add components to see them here" />
          ) : (
            <div className="recent-list">
              {recentComponents.map((comp) => (
                <Link
                  to={`/components/${comp.id}`}
                  key={comp.id}
                  className="recent-item"
                >
                  <div className="recent-item-info">
                    <span className="recent-item-name">{comp.name}</span>
                    <span className="recent-item-id">{comp.id} · {comp.category}</span>
                  </div>
                  <StatusBadge status={comp.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Low stock items */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <AlertTriangle size={18} />
              Low Stock Alerts
            </h3>
            <Link to="/low-stock" className="card-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {lowStockItems.length === 0 ? (
            <EmptyState icon={CheckCircle} title="All stock levels are healthy" message="No low stock items" />
          ) : (
            <div className="recent-list">
              {lowStockItems.slice(0, 5).map((comp) => (
                <Link
                  to={`/components/${comp.id}`}
                  key={comp.id}
                  className="recent-item"
                >
                  <div className="recent-item-info">
                    <span className="recent-item-name">{comp.name}</span>
                    <span className="recent-item-id">
                      {comp.quantity} / {comp.minStock} min · {comp.laboratory}
                    </span>
                  </div>
                  <span className="mini-badge mini-badge-warning">
                    {comp.quantity === 0 ? 'Out of Stock' : 'Low'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category summary */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Component Category Summary</h3>
        </div>
        {categoryEntries.length === 0 ? (
          <EmptyState title="No data" message="Add components to see category summary" />
        ) : (
          <div className="category-bars">
            {categoryEntries.map(([category, count]) => (
              <div className="category-bar-row" key={category}>
                <div className="category-bar-label">
                  <span>{category}</span>
                  <span className="category-bar-count">{count}</span>
                </div>
                <div className="category-bar-track">
                  <div
                    className="category-bar-fill"
                    style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
