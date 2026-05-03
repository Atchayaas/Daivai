import { ChatProvider } from './context/ChatContext';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import './App.css';

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <ChatPanel />
    </div>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <AppLayout />
    </ChatProvider>
  );
}
