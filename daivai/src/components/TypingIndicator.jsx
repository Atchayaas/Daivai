import { BotMessageSquare } from 'lucide-react';
import './TypingIndicator.css';

export default function TypingIndicator({ engine }) {
  return (
    <div className="typing-row fade-in">
      <div className="typing-avatar">
        <BotMessageSquare size={14} strokeWidth={1.8} />
      </div>
      <div className="typing-content">
        <div className="typing-meta">
          <span>{engine || 'DaivAI'}</span>
          <span className="typing-label">is thinking</span>
        </div>
        <div className="typing-bubble">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    </div>
  );
}
