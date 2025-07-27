import "./App.css";
import Search from "./components/Search";
import Chats from "./components/Chats";
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
    getCurrentSession 
  } = useChat();
  const [isLoading, setIsLoading] = useState(false);

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

  const hasStartedChat = currentMessages.length > 0;

  return (
    <div className="h-screen w-screen flex bg-white dark:bg-[#0D0D0D] overflow-hidden fixed inset-0">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {!hasStartedChat ? (
          // Homepage layout - centered
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center mb-8">
              <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {currentUser ? (
                  <>Hi there, <span className="text-purple-600 dark:text-purple-400">{getUserName()}</span></>
                ) : (
                  'Hi there'
                )}
              </h1>
              <h2 className="text-3xl font-medium text-gray-700 dark:text-gray-300 mb-8">
                What would <span className="text-blue-600 dark:text-blue-400">you like to know?</span>
              </h2>
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
            <div className="flex-1 min-h-0 overflow-hidden">
              <Chats messages={currentMessages} isLoading={isLoading} />
            </div>
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0D0D0D]">
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
    <div className="h-screen w-screen flex bg-white dark:bg-[#0D0D0D] overflow-hidden fixed inset-0">
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
