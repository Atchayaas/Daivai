import { useState, useRef, useEffect } from 'react';
import { PlusIcon, MessageSquare, Pencil, Trash2, Check, X, BotMessageSquare } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import ConfirmModal from './ConfirmModal';
import './Sidebar.css';

function ChatItem({ chat, isActive, onSelect, onRename, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(chat.title);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  function handleRenameSubmit() {
    if (editValue.trim()) onRename(chat.id, editValue);
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleRenameSubmit();
    if (e.key === 'Escape') {
      setEditValue(chat.title);
      setIsEditing(false);
    }
  }

  const timeLabel = formatChatTime(chat.createdAt);

  return (
    <>
      <div
        className={`chat-item ${isActive ? 'active' : ''}`}
        onClick={() => !isEditing && onSelect(chat.id)}
        title={chat.title}
      >
        <div className="chat-item-icon">
          <MessageSquare size={14} />
        </div>

        <div className="chat-item-body">
          {isEditing ? (
            <input
              ref={inputRef}
              className="chat-item-rename-input"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleRenameSubmit}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <>
              <span className="chat-item-title">{chat.title}</span>
              <span className="chat-item-time">{timeLabel}</span>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="chat-item-actions" onClick={e => e.stopPropagation()}>
            <button
              className="chat-action-btn"
              onClick={() => { setEditValue(chat.title); setIsEditing(true); }}
              title="Rename chat"
            >
              <Pencil size={13} />
            </button>
            <button
              className="chat-action-btn danger"
              onClick={() => setShowDeleteModal(true)}
              title="Delete chat"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}

        {isEditing && (
          <div className="chat-item-actions" onClick={e => e.stopPropagation()}>
            <button className="chat-action-btn success" onClick={handleRenameSubmit} title="Save">
              <Check size={13} />
            </button>
            <button className="chat-action-btn" onClick={() => { setEditValue(chat.title); setIsEditing(false); }} title="Cancel">
              <X size={13} />
            </button>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <ConfirmModal
          title="Delete this chat?"
          description={`"${chat.title}" will be permanently removed.`}
          confirmLabel="Delete"
          danger
          onConfirm={() => { onDelete(chat.id); setShowDeleteModal(false); }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}

function formatChatTime(ts) {
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Group chats by rough time period
function groupChats(chats) {
  const now = Date.now();
  const groups = { Today: [], Yesterday: [], 'Past 7 days': [], Older: [] };
  chats.forEach(chat => {
    const diff = now - chat.createdAt;
    if (diff < 86_400_000) groups['Today'].push(chat);
    else if (diff < 172_800_000) groups['Yesterday'].push(chat);
    else if (diff < 604_800_000) groups['Past 7 days'].push(chat);
    else groups['Older'].push(chat);
  });
  return groups;
}

export default function Sidebar() {
  const { chats, activeChatId, setActiveChatId, createNewChat, deleteChat, updateChatTitle } = useChat();

  const grouped = groupChats(chats);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <BotMessageSquare size={20} strokeWidth={1.8} />
          </div>
          <span className="logo-text">DaivAI</span>
        </div>

        <button className="new-chat-btn" onClick={createNewChat} title="New chat">
          <PlusIcon size={16} strokeWidth={2.2} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat history */}
      <div className="sidebar-content">
        {chats.length === 0 ? (
          <div className="sidebar-empty">
            <MessageSquare size={28} strokeWidth={1.2} />
            <p>No chats yet</p>
            <span>Start a new conversation</span>
          </div>
        ) : (
          Object.entries(grouped).map(([label, items]) =>
            items.length === 0 ? null : (
              <div key={label} className="chat-group">
                <p className="chat-group-label">{label}</p>
                {items.map(chat => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={chat.id === activeChatId}
                    onSelect={setActiveChatId}
                    onRename={updateChatTitle}
                    onDelete={deleteChat}
                  />
                ))}
              </div>
            )
          )
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">U</div>
          <div className="user-info">
            <span className="user-name">You</span>
            <span className="user-plan">Free plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
