import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, confirmText = 'Confirm', onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-badge">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <button onClick={onCancel} className="modal-close-btn" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <h3 className="modal-title">{title}</h3>
          <p className="modal-text">{message}</p>
        </div>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
