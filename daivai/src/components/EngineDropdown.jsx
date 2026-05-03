import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Cpu, Check } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import './EngineDropdown.css';

export default function EngineDropdown() {
  const { selectedEngine, setSelectedEngine, AI_ENGINES } = useChat();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (!ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="engine-dropdown" ref={ref}>
      <button
        className={`engine-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(v => !v)}
      >
        <Cpu size={14} strokeWidth={2} />
        <span>{selectedEngine.label}</span>
        <ChevronDown size={13} className={`engine-chevron ${open ? 'flipped' : ''}`} />
      </button>

      {open && (
        <div className="engine-menu scale-in">
          <p className="engine-menu-label">Select AI Engine</p>
          {AI_ENGINES.map(engine => (
            <button
              key={engine.id}
              className={`engine-option ${engine.id === selectedEngine.id ? 'selected' : ''}`}
              onClick={() => { setSelectedEngine(engine); setOpen(false); }}
            >
              <span>{engine.label}</span>
              {engine.id === selectedEngine.id && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
