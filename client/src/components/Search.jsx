import React, { useState, useRef } from "react";
import { BookOpen, GraduationCap, Lightbulb, TrendingUp, RefreshCw, Paperclip, ImageIcon, Send } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function Search({ addMessage, updateMessage, uuid_session_id, setIsLoading, isHomepage = false }) {
  const [promptText, setPromptText] = useState("");
  const [activeButtons, setActiveButtons] = useState([]);
  const promptTextInputRef = useRef(null);
  const promptTextRef = useRef(null);

  // Prompt suggestions
  const promptSuggestions = [
    {
      title: "Explain quantum mechanics principles and their applications in modern technology",
      icon: BookOpen,
      category: "Academic"
    },
    {
      title: "Compare and contrast different learning theories in educational psychology",
      icon: GraduationCap,
      category: "Educational"
    },
    {
      title: "Analyze the impact of climate change on global economic systems",
      icon: TrendingUp,
      category: "Research"
    },
    {
      title: "Break down complex mathematical concepts into simple, understandable steps",
      icon: Lightbulb,
      category: "Learning"
    }
  ];

  const handleSuggestionClick = (suggestion) => {
    setPromptText(suggestion.title);
  };


  const handleChange = () => {
    if (promptTextInputRef.current) {
      setPromptText(promptTextInputRef.current.innerText);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const handleGenerate = async () => {
    if (promptText.trim() === "") {
      alert("Please enter a something");
      return;
    }
    
    const queryText = promptText;
    
    // Clear input immediately
    if (promptTextInputRef.current) {
      promptTextInputRef.current.innerText = "";
    }
    setPromptText("");
    setIsLoading(true);
    
    let messageId = null;
    
    try {
      // Save user query to Supabase and get message ID
      messageId = await addMessage("user", queryText);
      
      if (!messageId) {
        throw new Error("Failed to save query");
      }
      
      const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_LOCAL_BACKEND_URL;
      console.log("Using API URL:", apiUrl);
      console.log("Session ID:", uuid_session_id);
      console.log("Message ID:", messageId);
      console.log("Active buttons:", activeButtons.length);
      
      const body = JSON.stringify({
        query: queryText,
        session_id: uuid_session_id,
        search_type_resources: activeButtons,
      });
      console.log("Request body:", body);
      
      const response = await fetch(
        `${apiUrl}/searchnew`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("API Response:", data);
      
      // Save the response to Supabase
      await updateMessage(messageId, data);
      
    } catch (error) {
      console.error("Error fetching response:", error);
      
      // If we have a messageId, update it with error message
      if (messageId) {
        await updateMessage(messageId, "Sorry, I encountered an error while processing your request. Please try again.");
      } else {
        alert("Sorry, I encountered an error while processing your request. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (e.shiftKey) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(promptTextInputRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("insertHTML", false, "<br><br>"); // Add a new line
      } else {
        if (promptText.trim() !== "") {
          handleGenerate();
        }
      }
    }
  };

  if (isHomepage) {
    return (
      <div className="w-full max-w-2xl">
        {/* Prompt Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {promptSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
            >
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {suggestion.title}
              </h3>
            </button>
          ))}
        </div>


        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (promptText.trim() !== "") {
                  handleGenerate();
                }
              }
            }}
            placeholder="Ask whatever you want...."
            className="w-full px-4 py-4 pr-16 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 rounded transition-colors"
              title="Add Attachment"
            >
              <Paperclip size={18} />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 rounded transition-colors"
              title="Use Image"
            >
              <ImageIcon size={18} />
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!promptText.trim()}
              className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        <textarea name="promptText" ref={promptTextRef} hidden />
      </div>
    );
  }

  // Chat mode layout (bottom input)
  return (
    <div className="p-4">
      <div className="relative flex items-center">
        <input
          type="text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (promptText.trim() !== "") {
                handleGenerate();
              }
            }
          }}
          placeholder="Ask me anything..."
          className="flex-1 px-4 py-3 pr-24 text-sm bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500"
        />
        <div className="absolute right-2 flex items-center gap-2">
          <button
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            title="Attach"
            aria-label="Attach"
          >
            <Paperclip size={18} />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            title="Use Image"
            aria-label="Use Image"
          >
            <ImageIcon size={18} />
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!promptText.trim()}
            className="p-2 text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
      <textarea name="promptText" ref={promptTextRef} hidden />
    </div>
  );
}
