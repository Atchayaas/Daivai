import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import './Modal.css';

export default function ConfirmModal({ title, description, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onConfirm, onCancel]);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box scale-in" onClick={e => e.stopPropagation()}>
        <div className={`modal-icon-wrap ${danger ? 'danger' : ''}`}>
          <AlertTriangle size={20} />
        </div>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-desc">{description}</p>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
          <button className={`modal-btn confirm ${danger ? 'danger' : ''}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
