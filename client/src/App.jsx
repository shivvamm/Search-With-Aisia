import "./App.css";
import Search from "./components/Search";
import Chats from "./components/Chats";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [messages, setMessages] = useState([]);
  const [uuid_session_id, setUuidSessionId] = useState("");

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

  return (
    <div className="flex flex-col  items-center overflow-hidden dark:bg-[#212121]">
      <Chats messages={messages} />
      <div className="w-full p-4 fixed bottom-0">
        <Search addMessage={addMessage} uuid_session_id={uuid_session_id} />
      </div>
    </div>
  );
}

export default App;
