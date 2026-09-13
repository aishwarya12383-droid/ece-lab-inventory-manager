import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Boxes,
  Filter,
} from 'lucide-react';
import { getAllComponents, deleteComponent } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

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

export default function Components() {
  const { showToast } = useToast();
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [labFilter, setLabFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await getAllComponents();
      setComponents(data);
    } catch (err) {
      showToast('Failed to load components', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let result = [...components];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.manufacturer.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) result = result.filter((c) => c.category === categoryFilter);
    if (labFilter) result = result.filter((c) => c.laboratory === labFilter);
    if (statusFilter) result = result.filter((c) => c.status === statusFilter);

    if (sortField) {
      result.sort((a, b) => {
        let av = a[sortField];
        let bv = b[sortField];
        if (sortField === 'name') {
          av = av.toLowerCase();
          bv = bv.toLowerCase();
        }
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortDir === 'asc' ? av - bv : bv - av;
        }
        return sortDir === 'asc'
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }

    return result;
  }, [components, search, categoryFilter, labFilter, statusFilter, sortField, sortDir]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteComponent(deleteTarget.id);
      setComponents(components.filter((c) => c.id !== deleteTarget.id));
      showToast(`"${deleteTarget.name}" deleted successfully`, 'success');
    } catch (err) {
      showToast('Failed to delete component', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setLabFilter('');
    setStatusFilter('');
    setSortField('');
    setSortDir('asc');
  };

  const hasActiveFilters = search || categoryFilter || labFilter || statusFilter;

  if (loading) return <Loading message="Loading components..." />;

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2 className="page-title">All Components</h2>
          <p className="page-subtitle">{filtered.length} of {components.length} components</p>
        </div>
        <Link to="/add" className="btn btn-primary">
          <Plus size={18} />
          <span>Add Component</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card filter-card">
        <div className="filter-row">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, ID, or manufacturer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={labFilter}
            onChange={(e) => setLabFilter(e.target.value)}
          >
            <option value="">All Laboratories</option>
            {LABORATORIES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {hasActiveFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={hasActiveFilters ? Filter : Boxes}
            title={hasActiveFilters ? 'No matching components' : 'No components yet'}
            message={hasActiveFilters ? 'Try adjusting your filters' : 'Click "Add Component" to get started'}
          />
        </div>
      ) : (
        <div className="card table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Component ID</th>
                  <th>
                    <button className="th-sort-btn" onClick={() => handleSort('name')}>
                      Component Name
                      {sortField === 'name' && (sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                      {sortField !== 'name' && <ArrowUpDown size={14} className="th-sort-icon" />}
                    </button>
                  </th>
                  <th>Category</th>
                  <th>
                    <button className="th-sort-btn" onClick={() => handleSort('quantity')}>
                      Quantity
                      {sortField === 'quantity' && (sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                      {sortField !== 'quantity' && <ArrowUpDown size={14} className="th-sort-icon" />}
                    </button>
                  </th>
                  <th>Laboratory</th>
                  <th>Status</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((comp) => (
                  <tr key={comp.id}>
                    <td className="td-id">{comp.id}</td>
                    <td className="td-name">
                      <Link to={`/components/${comp.id}`} className="td-link">
                        {comp.name}
                      </Link>
                    </td>
                    <td>{comp.category}</td>
                    <td>
                      <span className={`qty-cell ${Number(comp.quantity) <= Number(comp.minStock) ? 'qty-low' : ''}`}>
                        {comp.quantity}
                        {Number(comp.quantity) <= Number(comp.minStock) && (
                          <span className="qty-low-dot" />
                        )}
                      </span>
                    </td>
                    <td>{comp.laboratory}</td>
                    <td><StatusBadge status={comp.status} /></td>
                    <td className="td-actions">
                      <Link to={`/components/${comp.id}`} className="action-btn action-btn-view" title="View">
                        <Eye size={16} />
                      </Link>
                      <Link to={`/edit/${comp.id}`} className="action-btn action-btn-edit" title="Edit">
                        <Pencil size={16} />
                      </Link>
                      <button
                        className="action-btn action-btn-delete"
                        title="Delete"
                        onClick={() => setDeleteTarget(comp)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        message={
          deleting
            ? 'Deleting...'
            : `Are you sure you want to delete "${deleteTarget?.name}" (${deleteTarget?.id})? This action cannot be undone.`
        }
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </div>
  );
}
