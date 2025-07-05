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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function MainApp() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uuid_session_id, setUuidSessionId] = useState("");
  const [hasStartedChat, setHasStartedChat] = useState(false);

  // Get user's display name
  const getUserName = () => {
    if (currentUser) {
      return currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User';
    }
    return 'User';
  };
  
  useEffect(() => {
    const initialSessionId = uuidv4();
    setUuidSessionId(initialSessionId);
    console.log(initialSessionId);
  }, []);

  const addMessage = (type, content) => {
    if (content) {
      setMessages((prevMessages) => [...prevMessages, { type, content }]);
      if (type === "user" && !hasStartedChat) {
        setHasStartedChat(true);
      }
    } else {
      console.error("Content is undefined or null");
    }
  };

  return (
    <div className="h-screen w-screen flex bg-white dark:bg-[#0D0D0D] overflow-hidden fixed inset-0">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {!hasStartedChat ? (
          // Homepage layout - centered
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center mb-8">
              <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Hi there, <span className="text-purple-600 dark:text-purple-400">{getUserName()}</span>
              </h1>
              <h2 className="text-3xl font-medium text-gray-700 dark:text-gray-300 mb-8">
                What would <span className="text-blue-600 dark:text-blue-400">you like to know?</span>
              </h2>
            </div>
            
            <Search
              addMessage={addMessage}
              setIsLoading={setIsLoading}
              uuid_session_id={uuid_session_id}
              isHomepage={true}
            />
          </div>
        ) : (
          // Chat layout - messages at top, input at bottom
          <>
            <div className="flex-1 min-h-0 overflow-hidden">
              <Chats messages={messages} isLoading={isLoading} />
            </div>
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0D0D0D]">
              <div className="max-w-3xl mx-auto">
                <Search
                  addMessage={addMessage}
                  setIsLoading={setIsLoading}
                  uuid_session_id={uuid_session_id}
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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
