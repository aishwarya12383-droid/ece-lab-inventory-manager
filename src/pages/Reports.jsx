import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Package,
  Boxes,
  AlertTriangle,
  CheckCircle,
  Wrench,
  TrendingUp,
} from 'lucide-react';
import { getAllComponents } from '../services/api.js';
import StatCard from '../components/StatCard.jsx';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Reports() {
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

  const stats = useMemo(() => {
    const totalQty = components.reduce((s, c) => s + Number(c.quantity), 0);
    const lowStock = components.filter((c) => Number(c.quantity) <= Number(c.minStock)).length;
    const available = components.filter((c) => c.status === 'Available').length;
    const inUse = components.filter((c) => c.status === 'In Use').length;
    const maintenance = components.filter((c) => c.status === 'Under Maintenance').length;
    const damaged = components.filter((c) => c.status === 'Damaged').length;

    const byCategory = components.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {});

    const byLab = components.reduce((acc, c) => {
      acc[c.laboratory] = (acc[c.laboratory] || 0) + 1;
      return acc;
    }, {});

    return {
      totalQty,
      lowStock,
      available,
      inUse,
      maintenance,
      damaged,
      byCategory,
      byLab,
      total: components.length,
    };
  }, [components]);

  const categoryEntries = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]);
  const labEntries = Object.entries(stats.byLab).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...categoryEntries.map((e) => e[1]), 1);
  const maxLab = Math.max(...labEntries.map((e) => e[1]), 1);

  const statusData = [
    { label: 'Available', count: stats.available, color: 'green' },
    { label: 'In Use', count: stats.inUse, color: 'orange' },
    { label: 'Under Maintenance', count: stats.maintenance, color: 'gray' },
    { label: 'Damaged', count: stats.damaged, color: 'red' },
  ];
  const maxStatus = Math.max(...statusData.map((s) => s.count), 1);

  if (loading) return <Loading message="Generating reports..." />;

  if (components.length === 0) {
    return (
      <div className="page-content">
        <div className="card">
          <EmptyState title="No data for reports" message="Add components to see reports" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Reports & Analytics</h2>
          <p className="page-subtitle">Visual summary of laboratory inventory</p>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="stat-cards-grid">
        <StatCard icon={Boxes} label="Total Components" value={stats.total} color="blue" />
        <StatCard icon={Package} label="Total Quantity" value={stats.totalQty} color="cyan" />
        <StatCard icon={AlertTriangle} label="Low Stock Items" value={stats.lowStock} color="red" />
        <StatCard icon={TrendingUp} label="Available" value={stats.available} color="green" />
      </div>

      <div className="reports-grid">
        {/* Components by Category */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Components by Category</h3>
          </div>
          <div className="bar-chart">
            {categoryEntries.map(([label, count]) => (
              <div className="bar-chart-row" key={label}>
                <div className="bar-chart-label">
                  <span>{label}</span>
                  <span className="bar-chart-count">{count}</span>
                </div>
                <div className="bar-chart-track">
                  <div
                    className="bar-chart-fill bar-chart-fill-blue"
                    style={{ width: `${(count / maxCat) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Components by Laboratory */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Components by Laboratory</h3>
          </div>
          <div className="bar-chart">
            {labEntries.map(([label, count]) => (
              <div className="bar-chart-row" key={label}>
                <div className="bar-chart-label">
                  <span>{label}</span>
                  <span className="bar-chart-count">{count}</span>
                </div>
                <div className="bar-chart-track">
                  <div
                    className="bar-chart-fill bar-chart-fill-cyan"
                    style={{ width: `${(count / maxLab) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status distribution */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Status Distribution</h3>
        </div>
        <div className="status-chart">
          {statusData.map((item) => (
            <div className="status-chart-item" key={item.label}>
              <div className="status-chart-bar-container">
                <div
                  className={`status-chart-bar status-chart-bar-${item.color}`}
                  style={{ height: `${(item.count / maxStatus) * 100}%` }}
                >
                  <span className="status-chart-value">{item.count}</span>
                </div>
              </div>
              <span className="status-chart-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed summary table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Inventory Summary</h3>
        </div>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-item-label">Total Components</span>
            <span className="summary-item-value">{stats.total}</span>
          </div>
          <div className="summary-item">
            <span className="summary-item-label">Total Quantity</span>
            <span className="summary-item-value">{stats.totalQty}</span>
          </div>
          <div className="summary-item">
            <span className="summary-item-label">Available</span>
            <span className="summary-item-value summary-value-green">{stats.available}</span>
          </div>
          <div className="summary-item">
            <span className="summary-item-label">In Use</span>
            <span className="summary-item-value summary-value-orange">{stats.inUse}</span>
          </div>
          <div className="summary-item">
            <span className="summary-item-label">Under Maintenance</span>
            <span className="summary-item-value summary-value-gray">{stats.maintenance}</span>
          </div>
          <div className="summary-item">
            <span className="summary-item-label">Damaged</span>
            <span className="summary-item-value summary-value-red">{stats.damaged}</span>
          </div>
          <div className="summary-item">
            <span className="summary-item-label">Low Stock Items</span>
            <span className="summary-item-value summary-value-red">{stats.lowStock}</span>
          </div>
          <div className="summary-item">
            <span className="summary-item-label">Categories</span>
            <span className="summary-item-value">{categoryEntries.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
