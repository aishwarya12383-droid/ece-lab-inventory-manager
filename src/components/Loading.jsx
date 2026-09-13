import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="loading-state">
      <Loader2 size={32} className="spinner-spin" />
      <span>{message}</span>
    </div>
  );
}
