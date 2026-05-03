import { BotMessageSquare, Sparkles, MessageSquare, Zap } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import './WelcomeScreen.css';

const SUGGESTIONS = [
  { icon: '✍️', text: 'Help me write a professional email to my team' },
  { icon: '🔍', text: 'Explain machine learning in simple terms' },
  { icon: '💡', text: 'Give me 5 creative startup ideas for 2025' },
  { icon: '🧪', text: 'Write a Python function to sort a list of dicts' },
];

export default function WelcomeScreen() {
  const { sendMessage } = useChat();

  return (
    <div className="welcome-screen">
      <div className="welcome-hero">
        <div className="welcome-logo">
          <BotMessageSquare size={36} strokeWidth={1.5} />
        </div>
        <h1 className="welcome-title">How can I help you today?</h1>
        <p className="welcome-subtitle">
          DaivAI is your intelligent assistant — ask anything, explore ideas, and get things done.
        </p>
      </div>

      <div className="suggestion-grid">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            className="suggestion-card"
            onClick={() => sendMessage(s.text)}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <span className="suggestion-emoji">{s.icon}</span>
            <span className="suggestion-text">{s.text}</span>
          </button>
        ))}
      </div>

      <div className="welcome-features">
        <div className="feature-pill"><Sparkles size={12} /> Smart Responses</div>
        <div className="feature-pill"><MessageSquare size={12} /> Multi-chat</div>
        <div className="feature-pill"><Zap size={12} /> Fast & Reliable</div>
      </div>
    </div>
  );
}
