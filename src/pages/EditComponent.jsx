import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { getComponentById, updateComponent } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import Loading from '../components/Loading.jsx';

const CATEGORIES = [
  'Microcontroller',
  'Sensor',
  'Communication Module',
  'Electronic Component',
  'Testing Equipment',
  'Power Supply',
  'Development Board',
  'Other',
];

const LABORATORIES = [
  'Embedded Systems Lab',
  'Communication Lab',
  'Digital Electronics Lab',
  'Analog Electronics Lab',
  'IoT Lab',
  'VLSI Lab',
];

const STATUSES = ['Available', 'In Use', 'Under Maintenance', 'Damaged'];

export default function EditComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [values, setValues] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchComponent = useCallback(async () => {
    try {
      const data = await getComponentById(id);
      setValues({
        ...data,
        quantity: String(data.quantity),
        minStock: String(data.minStock),
      });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!values.name.trim()) errs.name = 'Component name is required';
    if (!values.category) errs.category = 'Category is required';
    if (!values.laboratory) errs.laboratory = 'Laboratory is required';
    if (!values.status) errs.status = 'Status is required';
    if (values.quantity === '' || values.quantity === null) errs.quantity = 'Quantity is required';
    else if (Number(values.quantity) < 0) errs.quantity = 'Quantity cannot be negative';
    if (values.minStock === '' || values.minStock === null) errs.minStock = 'Minimum stock is required';
    else if (Number(values.minStock) < 0) errs.minStock = 'Minimum stock cannot be negative';
    if (!values.dateAdded) errs.dateAdded = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the form errors', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateComponent(id, {
        name: values.name.trim(),
        category: values.category,
        quantity: Number(values.quantity),
        minStock: Number(values.minStock),
        laboratory: values.laboratory,
        status: values.status,
        manufacturer: values.manufacturer.trim(),
        dateAdded: values.dateAdded,
        description: values.description.trim(),
      });
      showToast('Component updated successfully!', 'success');
      navigate(`/components/${id}`);
    } catch (err) {
      showToast('Failed to update component', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading component..." />;
  if (!values) return null;

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Edit Component</h2>
          <p className="page-subtitle">ID: {id}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(`/components/${id}`)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Component Name <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              className={`form-input ${errors.name ? 'form-input-error' : ''}`}
              value={values.name}
              onChange={handleChange}
            />
            {errors.name && <span className="form-error"><AlertCircle size={14} /> {errors.name}</span>}
          </div>

          <div className="form-field">
            <label className="form-label">Component ID</label>
            <input type="text" className="form-input form-input-readonly" value={values.id} readOnly />
          </div>

          <div className="form-field">
            <label className="form-label">Category <span className="required">*</span></label>
            <select
              name="category"
              className={`form-input ${errors.category ? 'form-input-error' : ''}`}
              value={values.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <span className="form-error"><AlertCircle size={14} /> {errors.category}</span>}
          </div>

          <div className="form-field">
            <label className="form-label">Status <span className="required">*</span></label>
            <select
              name="status"
              className={`form-input ${errors.status ? 'form-input-error' : ''}`}
              value={values.status}
              onChange={handleChange}
            >
              <option value="">Select status</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.status && <span className="form-error"><AlertCircle size={14} /> {errors.status}</span>}
          </div>

          <div className="form-field">
            <label className="form-label">Quantity <span className="required">*</span></label>
            <input
              type="number"
              name="quantity"
              min="0"
              className={`form-input ${errors.quantity ? 'form-input-error' : ''}`}
              value={values.quantity}
              onChange={handleChange}
            />
            {errors.quantity && <span className="form-error"><AlertCircle size={14} /> {errors.quantity}</span>}
          </div>

          <div className="form-field">
            <label className="form-label">Minimum Stock Level <span className="required">*</span></label>
            <input
              type="number"
              name="minStock"
              min="0"
              className={`form-input ${errors.minStock ? 'form-input-error' : ''}`}
              value={values.minStock}
              onChange={handleChange}
            />
            {errors.minStock && <span className="form-error"><AlertCircle size={14} /> {errors.minStock}</span>}
          </div>

          <div className="form-field">
            <label className="form-label">Laboratory <span className="required">*</span></label>
            <select
              name="laboratory"
              className={`form-input ${errors.laboratory ? 'form-input-error' : ''}`}
              value={values.laboratory}
              onChange={handleChange}
            >
              <option value="">Select laboratory</option>
              {LABORATORIES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            {errors.laboratory && <span className="form-error"><AlertCircle size={14} /> {errors.laboratory}</span>}
          </div>

          <div className="form-field">
            <label className="form-label">Manufacturer</label>
            <input
              type="text"
              name="manufacturer"
              className="form-input"
              value={values.manufacturer || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Date Added <span className="required">*</span></label>
            <input
              type="date"
              name="dateAdded"
              className={`form-input ${errors.dateAdded ? 'form-input-error' : ''}`}
              value={values.dateAdded}
              onChange={handleChange}
            />
            {errors.dateAdded && <span className="form-error"><AlertCircle size={14} /> {errors.dateAdded}</span>}
          </div>

          <div className="form-field form-field-full">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="3"
              value={values.description || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(`/components/${id}`)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? (
              <span className="btn-spinner" />
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
