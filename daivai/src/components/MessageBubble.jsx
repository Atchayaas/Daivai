import { useState } from 'react';
import { Pencil, Trash2, User, BotMessageSquare, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChat } from '../context/ChatContext';
import ConfirmModal from './ConfirmModal';
import EditModal from './EditModal';
import './MessageBubble.css';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function MessageBubble({ message, chatId }) {
  const { editMessage, deleteMessage } = useChat();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isUser = message.role === 'user';

  function handleSaveEdit(newContent) {
    editMessage(chatId, message.id, newContent);
    setShowEditModal(false);
  }

  function handleDelete() {
    deleteMessage(chatId, message.id);
    setShowDeleteModal(false);
  }

  return (
    <>
      <div className={`message-row ${isUser ? 'user' : 'ai'} fade-in`}>
        {/* Avatar */}
        <div className={`message-avatar ${isUser ? 'user' : 'ai'}`}>
          {isUser ? <User size={14} strokeWidth={2} /> : <BotMessageSquare size={14} strokeWidth={1.8} />}
        </div>

        {/* Content */}
        <div className="message-content-wrap">
          <div className="message-meta">
            <span className="message-sender">{isUser ? 'You' : (message.engine || 'DaivAI')}</span>
            <span className="message-time">
              <Clock size={10} />
              {formatTime(message.timestamp)}
            </span>
            {message.edited && <span className="message-edited">edited</span>}
          </div>

          <div className={`message-bubble ${isUser ? 'user' : 'ai'}`}>
            {isUser ? (
              <p>{message.content}</p>
            ) : (
              <div className="ai-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              </div>
            )}

            {/* Hover actions — only for user messages */}
            {isUser && (
              <div className="message-actions">
                <button
                  className="msg-action-btn"
                  onClick={() => setShowEditModal(true)}
                  title="Edit message"
                >
                  <Pencil size={12} />
                </button>
                <button
                  className="msg-action-btn danger"
                  onClick={() => setShowDeleteModal(true)}
                  title="Delete message"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditModal
          initialValue={message.content}
          onSave={handleSaveEdit}
          onCancel={() => setShowEditModal(false)}
        />
      )}

      {showDeleteModal && (
        <ConfirmModal
          title="Delete this message?"
          description="This message will be permanently removed from the conversation."
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
