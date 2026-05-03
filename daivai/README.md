# DaivAI – AI Chat Interface

A ChatGPT-style AI chat web application built with React, created as a frontend developer task for Daiwak Technologies.

---

## Quick Start

```bash
npm install
npm run dev    # http://localhost:5173
npm run build  # production build
```

---

## Features Implemented

### Layout
- Left Sidebar — logo, "+ New Chat" button, chat history grouped by time (Today / Yesterday / Past 7 days / Older)
- Right Chat Panel — header with AI engine dropdown, scrollable message area, input box

### Chat Management
- Create new chat sessions from the sidebar or header button
- Switch between chats by clicking sidebar items
- Rename chats inline (pencil icon → Enter to save, Escape to cancel)
- Delete chats with a confirmation popup
- Auto-generated chat titles from the first message
- Full chat state persisted to `localStorage` — survives page refresh

### Messaging
- User and AI messages rendered as distinct left/right bubbles
- Simulated AI responses with a realistic typing delay (900–1700ms)
- Animated typing indicator while the AI responds
- Timestamps on every message
- "Edited" label shown after a user edits a message

### Message Actions (hover on user messages)
- **Edit** — modal popup; Cmd/Ctrl + Enter or Save Changes button
- **Delete** — confirmation popup before removal

### AI Engine Selector
- Four engines: Neural Nexus, Cerebral Prime, Synapse Ultra, Logic Core
- Engine name shown in each AI message attribution

### UI / UX
- Clean white theme with subtle borders and shadows
- Sora + DM Mono font pairing
- Fade/slide-in animations on messages and modals
- Keyboard shortcuts: Enter to send, Shift+Enter for newline, Escape to close modals
- Welcome screen with quick-start suggestion cards
- Markdown rendering in AI messages (bold, lists, code blocks)
- Basic responsive layout

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 (Vite) |
| State management | Context API |
| Markdown | react-markdown + remark-gfm |
| Icons | lucide-react |
| Persistence | localStorage |

---

## Project Structure

```
src/
  context/ChatContext.jsx        Global state (chats, messages, engine)
  components/
    Sidebar.jsx/.css             Left sidebar
    ChatPanel.jsx/.css           Right panel shell
    ChatInput.jsx/.css           Message input
    MessageBubble.jsx/.css       Message with hover actions
    TypingIndicator.jsx/.css     Animated typing dots
    EngineDropdown.jsx/.css      AI engine selector
    WelcomeScreen.jsx/.css       Empty state
    ConfirmModal.jsx             Delete confirmation dialog
    EditModal.jsx                Message edit dialog
    Modal.css                    Shared modal styles
  App.jsx / App.css              Root layout
  index.css                      Global styles + CSS variables
```

---

## Assumptions

- **AI responses are simulated** — no API key needed. Swapping in a real OpenAI/Gemini key is a straightforward change in `ChatContext.jsx`.
- **No auth** — single anonymous user session.
- Pixel-perfect Figma replication was not the goal; structure, layout and interactions match the spec.

---

## Submission

GitHub repository: *(add link here)*  
Email: career@daivtech.com
