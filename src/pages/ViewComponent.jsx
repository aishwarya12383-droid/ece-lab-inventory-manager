import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Package,
  Tag,
  Hash,
  Layers,
  Building,
  Activity,
  Factory,
  Calendar,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { getComponentById } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Loading from '../components/Loading.jsx';

export default function ViewComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchComponent = useCallback(async () => {
    try {
      const data = await getComponentById(id);
      setComponent(data);
    } catch (err) {
      showToast('Component not found', 'error');
      navigate('/components');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, showToast]);

  useEffect(() => {
    fetchComponent();
  }, [fetchComponent]);

  if (loading) return <Loading message="Loading component details..." />;
  if (!component) return null;

  const isLowStock = Number(component.quantity) <= Number(component.minStock);

  const fields = [
    { icon: Tag, label: 'Component Name', value: component.name },
    { icon: Hash, label: 'Component ID', value: component.id },
    { icon: Layers, label: 'Category', value: component.category },
    { icon: Package, label: 'Quantity', value: component.quantity },
    { icon: AlertTriangle, label: 'Minimum Stock Level', value: component.minStock },
    { icon: Building, label: 'Laboratory', value: component.laboratory },
    { icon: Activity, label: 'Status', value: <StatusBadge status={component.status} /> },
    { icon: Factory, label: 'Manufacturer', value: component.manufacturer || 'N/A' },
    { icon: Calendar, label: 'Date Added', value: component.dateAdded },
  ];

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2 className="page-title">{component.name}</h2>
          <p className="page-subtitle">Component ID: {component.id}</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/components')}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <Link to={`/edit/${component.id}`} className="btn btn-primary">
            <Pencil size={18} />
            <span>Edit</span>
          </Link>
        </div>
      </div>

      {isLowStock && (
        <div className="low-stock-banner">
          <AlertTriangle size={20} />
          <span>This component is at or below minimum stock level ({component.quantity}/{component.minStock})</span>
        </div>
      )}

      <div className="card detail-card">
        <div className="detail-grid">
          {fields.map((field, i) => {
            const Icon = field.icon;
            return (
              <div className="detail-item" key={i}>
                <div className="detail-item-icon">
                  <Icon size={18} />
                </div>
                <div className="detail-item-body">
                  <span className="detail-item-label">{field.label}</span>
                  <span className="detail-item-value">{field.value}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="detail-description">
          <div className="detail-desc-header">
            <FileText size={18} />
            <span>Description</span>
          </div>
          <p className="detail-desc-text">
            {component.description || 'No description provided.'}
          </p>
        </div>
      </div>
    </div>
  );
}
