import { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import EngineDropdown from './EngineDropdown';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import { MessageSquarePlus } from 'lucide-react';
import './ChatPanel.css';

export default function ChatPanel() {
  const { activeChat, isGenerating, selectedEngine, createNewChat } = useChat();
  const bottomRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages?.length, isGenerating]);

  const hasMessages = activeChat?.messages?.length > 0;

  return (
    <div className="chat-panel">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-left">
          <h2 className="chat-panel-title">
            {activeChat ? activeChat.title : 'DaivAI'}
          </h2>
          {activeChat && (
            <span className="chat-msg-count">
              {activeChat.messages.length} message{activeChat.messages.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="chat-header-right">
          <EngineDropdown />
          <button className="header-new-chat-btn" onClick={createNewChat} title="New chat">
            <MessageSquarePlus size={16} />
          </button>
        </div>
      </header>

      {/* Messages area */}
      <div className="chat-messages-area">
        {!activeChat || !hasMessages ? (
          <WelcomeScreen />
        ) : (
          <div className="messages-list">
            {activeChat.messages.map(msg => (
              <MessageBubble
                key={msg.id}
                message={msg}
                chatId={activeChat.id}
              />
            ))}
            {isGenerating && <TypingIndicator engine={selectedEngine.label} />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  );
}
