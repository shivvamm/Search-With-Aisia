import "./App.css";
import Search from "./components/Search";
import Chats from "./components/Chats";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uuid_session_id, setUuidSessionId] = useState("");
  const [showToast, setShowToast] = useState(true);
  useEffect(() => {
    const initialSessionId = uuidv4();
    setUuidSessionId(initialSessionId);
    console.log(initialSessionId);
  }, []);

  const addMessage = (type, content) => {
    if (content) {
      setMessages((prevMessages) => [...prevMessages, { type, content }]);
    } else {
      console.error("Content is undefined or null");
    }
  };

  const closeToast = () => {
    setShowToast(false);
  };
  return (
    <div className="flex flex-col  items-center overflow-hidden dark:bg-[#212121]">
      {showToast && (
        <div className="toast toast-top toast-center pt-4">
          <div className="alert alert-info">
            <span>
              Welcome to the chat! 🎉 the server may spin down so refresh the
              page after a chat and wait for the response the loader is yet to
              added{" "}
            </span>
            <button
              className="btn btn-sm btn-ghost ml-4"
              onClick={closeToast}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <Chats messages={messages} />
      <div className="w-full p-4 fixed bottom-0">
        <Search
          addMessage={addMessage}
          setIsLoading={setIsLoading}
          uuid_session_id={uuid_session_id}
        />
      </div>
    </div>
  );
}

export default App;
