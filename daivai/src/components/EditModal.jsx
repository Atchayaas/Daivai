import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export default function EditModal({ initialValue, onSave, onCancel }) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
    // Move cursor to end
    const len = textareaRef.current?.value.length || 0;
    textareaRef.current?.setSelectionRange(len, len);
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  function handleSave() {
    const trimmed = value.trim();
    if (trimmed) onSave(trimmed);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave();
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box edit-modal scale-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Message</h3>
          <button className="modal-close-btn" onClick={onCancel}><X size={16} /></button>
        </div>
        <textarea
          ref={textareaRef}
          className="edit-textarea"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={4}
          placeholder="Edit your message..."
        />
        <p className="edit-hint">Press ⌘ + Enter to save</p>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-btn confirm" onClick={handleSave} disabled={!value.trim()}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
