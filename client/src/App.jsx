import "./App.css";
import Search from "./components/Search";
import Chats from "./components/Chats";
import { useState, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);

  const [sessionId, setSessionId] = useState(""); // State for session ID

  useEffect(() => {
    const initialSessionId = Math.random().toString(36).substr(2, 9);
    setSessionId(initialSessionId);
    console.log(initialSessionId);
  }, []);

  const addMessage = (type, content) => {
    setMessages((prevMessages) => [...prevMessages, { type, content }]);
  };
  return (
    <div className="flex flex-col h-screen items-center bg-gray-100 overflow-y-auto dark:bg-gray-900">
      {/* Main content */}
      <Chats messages={messages} />
      <div className="fixed bottom-0 w-full p-4">
        <Search addMessage={addMessage} sessionId={sessionId} />
      </div>
    </div>
  );
}

export default App;
