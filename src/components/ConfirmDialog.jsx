import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  open,
  title = 'Confirm Deletion',
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-icon-wrapper">
          <AlertTriangle size={32} className="dialog-icon" />
        </div>
        <h3 className="dialog-title">{title}</h3>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
