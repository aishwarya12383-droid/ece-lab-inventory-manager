import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { createComponent, getAllComponents } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

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

const initialValues = {
  name: '',
  id: '',
  category: '',
  quantity: '',
  minStock: '',
  laboratory: '',
  status: '',
  manufacturer: '',
  dateAdded: new Date().toISOString().split('T')[0],
  description: '',
};

export default function AddComponent() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [existingIds, setExistingIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!values.name.trim()) errs.name = 'Component name is required';
    if (!values.id.trim()) errs.id = 'Component ID is required';
    else if (existingIds.includes(values.id.trim())) errs.id = 'Component ID must be unique';
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

    // Fetch latest IDs for uniqueness check
    try {
      const all = await getAllComponents();
      const ids = all.map((c) => c.id);
      setExistingIds(ids);
      if (ids.includes(values.id.trim())) {
        setErrors((prev) => ({ ...prev, id: 'Component ID must be unique' }));
        showToast('Component ID already exists', 'error');
        return;
      }
    } catch (err) {
      // proceed
    }

    if (!validate()) {
      showToast('Please fix the form errors', 'error');
      return;
    }

    setLoading(true);
    try {
      await createComponent({
        ...values,
        id: values.id.trim(),
        name: values.name.trim(),
        quantity: Number(values.quantity),
        minStock: Number(values.minStock),
        manufacturer: values.manufacturer.trim(),
        description: values.description.trim(),
      });
      showToast('Component added successfully!', 'success');
      navigate('/components');
    } catch (err) {
      showToast(err.message || 'Failed to add component', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Add New Component</h2>
          <p className="page-subtitle">Enter the details of the new lab component</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/components')}>
          <ArrowLeft size={18} />
          <span>Back to Components</span>
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
              placeholder="e.g., ESP32 Development Board"
              value={values.name}
              onChange={handleChange}
            />
            {errors.name && <span className="form-error"><AlertCircle size={14} /> {errors.name}</span>}
          </div>

          <div className="form-field">
            <label className="form-label">Component ID <span className="required">*</span></label>
            <input
              type="text"
              name="id"
              className={`form-input ${errors.id ? 'form-input-error' : ''}`}
              placeholder="e.g., ECE013"
              value={values.id}
              onChange={handleChange}
            />
            {errors.id && <span className="form-error"><AlertCircle size={14} /> {errors.id}</span>}
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
              placeholder="e.g., 10"
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
              placeholder="e.g., 5"
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
              placeholder="e.g., Espressif"
              value={values.manufacturer}
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
              placeholder="Brief description of the component..."
              value={values.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/components')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span className="btn-spinner" />
            ) : (
              <>
                <PlusCircle size={18} />
                <span>Add Component</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
