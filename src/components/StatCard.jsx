import { Boxes, Package, CheckCircle, Wrench, AlertTriangle } from 'lucide-react';

export default function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-icon">
        <Icon size={24} />
      </div>
      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
      </div>
    </div>
  );
}
