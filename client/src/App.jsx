import "./App.css";
import Search from "./components/Search";
import Chats from "./components/Chats";
import ChatHistory from "./components/ChatHistory";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ChatProvider, useChat } from "./contexts/ChatContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function MainApp() {
  const { currentUser } = useAuth();
  const {
    currentSessionId,
    currentMessages,
    saveQuery,
    updateResponse,
    createNewChat,
    getCurrentSession,
    chatSessions,
    switchToChat,
    deleteChat,
    loadUserSessions
  } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Get user's display name
  const getUserName = () => {
    if (currentUser) {
      return currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User';
    }
    return 'User';
  };

  // Create initial chat session if none exists
  useEffect(() => {
    if (!currentSessionId) {
      createNewChat();
    }
  }, [currentSessionId, createNewChat]);

  const addMessage = async (type, content) => {
    if (content) {
      if (type === 'user') {
        return await saveQuery(content);
      }
    } else {
      console.error("Content is undefined or null");
      return null;
    }
  };

  // Handle history navigation
  const handleShowHistory = () => {
    setShowHistory(true);
  };

  const handleBackToChat = () => {
    setShowHistory(false);
  };

  const handleSelectChat = (session) => {
    switchToChat(session.id);
    setShowHistory(false);
  };

  const hasStartedChat = currentMessages.length > 0;

  return (
    <div className="h-screen w-screen flex bg-[#F4F4F4] dark:bg-[#0D0D0D] overflow-hidden fixed inset-0">
      <Sidebar onShowHistory={handleShowHistory} />
      <div className="flex-1 flex flex-col">
        {showHistory ? (
          // History view
          <ChatHistory
            onBackToChat={handleBackToChat}
            onSelectChat={handleSelectChat}
          />
        ) : !hasStartedChat ? (
          // Homepage layout - centered
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <div className="max-w-[800px] w-full">
              <h1 className="text-[48px] leading-[56px] font-normal text-[#1a1a1a] dark:text-gray-100 mb-2">
                {currentUser ? (
                  <>Hi there, <span className="text-[#9333EA]">{getUserName()}</span></>
                ) : (
                  'Hi there'
                )}
              </h1>
              <h2 className="text-[48px] leading-[56px] font-normal text-[#1a1a1a] dark:text-gray-100 mb-1">
                What would <span className="text-[#3B82F6]">like to know?</span>
              </h2>
              <p className="text-[#666666] dark:text-gray-400 text-base font-normal mt-3 mb-12">
                Use one of the most common prompts<br />below or use your own to begin
              </p>
            </div>

            <Search
              addMessage={addMessage}
              updateMessage={updateResponse}
              setIsLoading={setIsLoading}
              uuid_session_id={currentSessionId}
              isHomepage={true}
            />
          </div>
        ) : (
          // Chat layout - messages at top, input at bottom
          <>
            <div className="flex-1 min-h-0 overflow-hidden bg-[#F4F4F4] dark:bg-[#0D0D0D]">
              <Chats messages={currentMessages} isLoading={isLoading} />
            </div>
            <div className="flex-shrink-0 border-t border-[#E5E5E5] dark:border-gray-800 bg-white dark:bg-[#1A1A1A]">
              <div className="max-w-3xl mx-auto">
                <Search
                  addMessage={addMessage}
                  updateMessage={updateResponse}
                  setIsLoading={setIsLoading}
                  uuid_session_id={currentSessionId}
                  isHomepage={false}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Layout wrapper for pages that need sidebar
function LayoutWithSidebar({ children }) {
  return (
    <div className="h-screen w-screen flex bg-[#F4F4F4] dark:bg-[#0D0D0D] overflow-hidden fixed inset-0">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainApp />} />
              <Route path="/profile" element={
                <LayoutWithSidebar>
                  <Profile />
                </LayoutWithSidebar>
              } />
              <Route path="/settings" element={
                <LayoutWithSidebar>
                  <Settings />
                </LayoutWithSidebar>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Router>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
