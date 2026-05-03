import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ChatContext = createContext(null);

const AI_ENGINES = [
  { id: 'neural-nexus', label: 'Neural Nexus' },
  { id: 'cerebral-prime', label: 'Cerebral Prime' },
  { id: 'synapse-ultra', label: 'Synapse Ultra' },
  { id: 'logic-core', label: 'Logic Core' },
];

// Simulated AI responses pool
const AI_RESPONSES = [
  "That's an interesting question! Let me think through this carefully. Based on what you've shared, I'd say there are a few important dimensions to consider here. First, the conceptual framing matters — how you define the problem often shapes what solutions become visible. Second, context is everything; the same question can have very different answers depending on circumstances.",
  "Great point! Here's how I see it:\n\n**Key considerations:**\n- The foundational principles are well-established in this domain\n- There's nuance in how different approaches scale\n- Practical implementation often reveals edge cases not obvious in theory\n\nI'd recommend starting with a minimal viable approach and iterating from there based on real feedback.",
  "This is something I find genuinely fascinating. The short answer is yes, but the longer answer involves understanding *why* — and that why is where the real insight lives. Let me walk you through the reasoning step by step so you can evaluate it yourself.",
  "Excellent! To give you the most useful response, I want to make sure I understand your goal correctly. Assuming you're looking for a practical, actionable answer: the best path forward usually involves breaking the problem into smaller, testable pieces and validating each assumption along the way.",
  "Here's a concise breakdown:\n\n1. **Start with the fundamentals** — don't skip the basics even if they seem obvious\n2. **Iterate quickly** — small loops beat long planning cycles\n3. **Measure outcomes** — define what success looks like before you begin\n4. **Adapt as you learn** — your first model of the problem will be wrong in interesting ways\n\nDoes this help clarify the approach?",
  "I appreciate you sharing that context. Based on what you've described, the core challenge seems to be balancing competing priorities — which is genuinely hard. There's no perfect answer, but there are better and worse framings. The key is to make the trade-offs explicit rather than letting them remain hidden assumptions.",
  "Absolutely! This is one of those areas where the conventional wisdom and the actual evidence diverge quite a bit. The research suggests that the most effective approach is often counterintuitive — focusing less on the obvious intervention and more on the underlying system dynamics that generate the problem in the first place.",
];

function getSimulatedResponse(prompt) {
  // Rotate through responses based on prompt length for some variety
  const index = prompt.length % AI_RESPONSES.length;
  return AI_RESPONSES[index];
}

function generateChatTitle(firstMessage) {
  const words = firstMessage.trim().split(/\s+/);
  return words.slice(0, 5).join(' ') + (words.length > 5 ? '…' : '');
}

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(() => {
    try {
      const stored = localStorage.getItem('daivai_chats');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    try {
      return localStorage.getItem('daivai_active_chat') || null;
    } catch {
      return null;
    }
  });

  const [selectedEngine, setSelectedEngine] = useState(AI_ENGINES[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Persist to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('daivai_chats', JSON.stringify(chats));
    } catch { /* quota exceeded — fail silently */ }
  }, [chats]);

  useEffect(() => {
    try {
      if (activeChatId) localStorage.setItem('daivai_active_chat', activeChatId);
    } catch { /* fail silently */ }
  }, [activeChatId]);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const createNewChat = useCallback(() => {
    const newChat = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      engine: selectedEngine.id,
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat.id;
  }, [selectedEngine]);

  const deleteChat = useCallback((chatId) => {
    setChats(prev => {
      const remaining = prev.filter(c => c.id !== chatId);
      return remaining;
    });
    setActiveChatId(prev => {
      if (prev !== chatId) return prev;
      const remaining = chats.filter(c => c.id !== chatId);
      return remaining.length > 0 ? remaining[0].id : null;
    });
  }, [chats]);

  const updateChatTitle = useCallback((chatId, newTitle) => {
    setChats(prev => prev.map(c =>
      c.id === chatId ? { ...c, title: newTitle.trim() || 'Untitled Chat' } : c
    ));
  }, []);

  const sendMessage = useCallback(async (content) => {
    let chatId = activeChatId;

    // Create a new chat if none is active
    if (!chatId) {
      const newChat = {
        id: uuidv4(),
        title: generateChatTitle(content),
        messages: [],
        createdAt: Date.now(),
        engine: selectedEngine.id,
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      chatId = newChat.id;
    }

    const userMsg = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // Add user message and auto-title on first message
    setChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      const isFirst = c.messages.length === 0;
      return {
        ...c,
        title: isFirst ? generateChatTitle(content) : c.title,
        messages: [...c.messages, userMsg],
      };
    }));

    setIsGenerating(true);

    // Simulate network delay for AI response
    const delay = 900 + Math.random() * 800;
    await new Promise(r => setTimeout(r, delay));

    const aiMsg = {
      id: uuidv4(),
      role: 'assistant',
      content: getSimulatedResponse(content),
      timestamp: Date.now(),
      engine: selectedEngine.label,
    };

    setChats(prev => prev.map(c =>
      c.id === chatId
        ? { ...c, messages: [...c.messages, aiMsg] }
        : c
    ));

    setIsGenerating(false);
  }, [activeChatId, selectedEngine]);

  const editMessage = useCallback((chatId, messageId, newContent) => {
    setChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      return {
        ...c,
        messages: c.messages.map(m =>
          m.id === messageId ? { ...m, content: newContent, edited: true } : m
        ),
      };
    }));
  }, []);

  const deleteMessage = useCallback((chatId, messageId) => {
    setChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      return { ...c, messages: c.messages.filter(m => m.id !== messageId) };
    }));
  }, []);

  return (
    <ChatContext.Provider value={{
      chats,
      activeChat,
      activeChatId,
      setActiveChatId,
      selectedEngine,
      setSelectedEngine,
      isGenerating,
      AI_ENGINES,
      createNewChat,
      deleteChat,
      updateChatTitle,
      sendMessage,
      editMessage,
      deleteMessage,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
}
