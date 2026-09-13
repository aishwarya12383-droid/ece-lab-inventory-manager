import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';
import { getAllComponents } from '../services/api.js';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';

function getStockStatus(quantity, minStock) {
  if (quantity <= 0) return 'critical';
  if (quantity <= minStock) return 'low';
  return 'sufficient';
}

export default function LowStock() {
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

  if (loading) return <Loading message="Loading low stock items..." />;

  const lowStockItems = components
    .filter((c) => Number(c.quantity) <= Number(c.minStock))
    .sort((a, b) => Number(a.quantity) - Number(b.quantity));

  const criticalCount = lowStockItems.filter((c) => Number(c.quantity) <= 0).length;
  const lowCount = lowStockItems.filter(
    (c) => Number(c.quantity) > 0 && Number(c.quantity) <= Number(c.minStock)
  ).length;

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Low Stock Items</h2>
          <p className="page-subtitle">
            {lowStockItems.length} items need restocking
          </p>
        </div>
      </div>

      {/* Summary badges */}
      <div className="low-stock-summary">
        <div className="low-stock-summary-badge low-stock-summary-critical">
          <XCircle size={20} />
          <span>{criticalCount} Critical</span>
        </div>
        <div className="low-stock-summary-badge low-stock-summary-low">
          <AlertTriangle size={20} />
          <span>{lowCount} Low Stock</span>
        </div>
        <div className="low-stock-summary-badge low-stock-summary-sufficient">
          <CheckCircle size={20} />
          <span>{components.length - lowStockItems.length} Sufficient</span>
        </div>
      </div>

      {lowStockItems.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={CheckCircle}
            title="All stock levels are healthy"
            message="No components are below their minimum stock level"
          />
        </div>
      ) : (
        <div className="card table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Component Name</th>
                  <th>Current Quantity</th>
                  <th>Minimum Required</th>
                  <th>Laboratory</th>
                  <th>Stock Status</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((comp) => {
                  const status = getStockStatus(Number(comp.quantity), Number(comp.minStock));
                  return (
                    <tr key={comp.id}>
                      <td className="td-name">
                        <Link to={`/components/${comp.id}`} className="td-link">
                          {comp.name}
                        </Link>
                        <span className="td-subtext">{comp.id}</span>
                      </td>
                      <td>
                        <span className="qty-cell qty-low">{comp.quantity}</span>
                      </td>
                      <td>{comp.minStock}</td>
                      <td>{comp.laboratory}</td>
                      <td>
                        <span className={`stock-badge stock-badge-${status}`}>
                          {status === 'critical' && <XCircle size={14} />}
                          {status === 'low' && <AlertTriangle size={14} />}
                          {status === 'sufficient' && <CheckCircle size={14} />}
                          {status === 'critical' ? 'Critical' : status === 'low' ? 'Low Stock' : 'Sufficient'}
                        </span>
                      </td>
                      <td className="td-actions">
                        <Link
                          to={`/components/${comp.id}`}
                          className="action-btn action-btn-view"
                          title="View"
                        >
                          <Eye size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
