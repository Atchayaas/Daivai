import { useState, useRef, useEffect } from 'react';
import { SendHorizonal, Square } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import './ChatInput.css';

export default function ChatInput() {
  const { sendMessage, isGenerating } = useChat();
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
  }, [value]);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || isGenerating) return;
    setValue('');
    sendMessage(trimmed);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-input-area">
      <div className={`chat-input-box ${isGenerating ? 'generating' : ''}`}>
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask DaivAI anything…"
          rows={1}
          disabled={isGenerating}
        />
        <button
          className={`send-btn ${isGenerating ? 'stop' : ''}`}
          onClick={handleSend}
          disabled={isGenerating ? false : !value.trim()}
          title={isGenerating ? 'Generating…' : 'Send message'}
        >
          {isGenerating ? <Square size={15} fill="currentColor" /> : <SendHorizonal size={15} />}
        </button>
      </div>
      <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
    </div>
  );
}
