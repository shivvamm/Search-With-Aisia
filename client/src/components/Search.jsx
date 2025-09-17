import React, { useState, useRef, useEffect } from "react";
import { UserCircle, Mail, FileText, Sparkles, RefreshCw, Send } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../contexts/AuthContext";

export default function Search({ addMessage, updateMessage, uuid_session_id, setIsLoading, isHomepage = false }) {
  const [promptText, setPromptText] = useState("");
  const [activeButtons, setActiveButtons] = useState([]);
  const [promptSuggestions, setPromptSuggestions] = useState([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const promptTextInputRef = useRef(null);
  const promptTextRef = useRef(null);
  const { currentUser } = useAuth();

  // Default prompt suggestions
  const defaultPrompts = [
    {
      title: "Write a to-do list for a personal project or task",
      icon: UserCircle,
      category: "Personal"
    },
    {
      title: "Generate an email to reply to a job offer",
      icon: Mail,
      category: "Professional"
    },
    {
      title: "Summarise this article or text for me in one paragraph",
      icon: FileText,
      category: "Summary"
    },
    {
      title: "How does AI work in a technical capacity",
      icon: Sparkles,
      category: "Technical"
    }
  ];

  // Icon mapping for categories
  const categoryIcons = {
    Personal: UserCircle,
    Professional: Mail,
    Summary: FileText,
    Technical: Sparkles,
    Creative: Sparkles,
    Learning: FileText,
    Health: UserCircle,
    Finance: Mail,
    Travel: UserCircle,
    Entertainment: Sparkles
  };

  // Fetch prompts for the current user
  const fetchPrompts = async () => {
    if (!currentUser) {
      setPromptSuggestions(defaultPrompts);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_LOCAL_BACKEND_URL;
      const response = await fetch(`${apiUrl}/prompts/${currentUser.id}`);

      if (response.ok) {
        const data = await response.json();

        // Add icons to the prompts
        const promptsWithIcons = data.prompts.map(prompt => ({
          ...prompt,
          icon: categoryIcons[prompt.category] || Sparkles
        }));

        setPromptSuggestions(promptsWithIcons);
        setIsPersonalized(data.is_personalized);
      } else {
        setPromptSuggestions(defaultPrompts);
      }
    } catch (error) {
      console.error('Error fetching prompts:', error);
      setPromptSuggestions(defaultPrompts);
    }
  };

  // Refresh prompts
  const handleRefreshPrompts = async () => {
    if (!currentUser) {
      setPromptSuggestions(defaultPrompts);
      return;
    }

    setIsLoadingPrompts(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_LOCAL_BACKEND_URL;
      const response = await fetch(`${apiUrl}/prompts/refresh/${currentUser.id}`, {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();

        // Add icons to the prompts
        const promptsWithIcons = data.prompts.map(prompt => ({
          ...prompt,
          icon: categoryIcons[prompt.category] || Sparkles
        }));

        setPromptSuggestions(promptsWithIcons);
        setIsPersonalized(data.is_personalized);
      } else {
        console.error('Failed to refresh prompts');
      }
    } catch (error) {
      console.error('Error refreshing prompts:', error);
    } finally {
      setIsLoadingPrompts(false);
    }
  };

  // Load prompts when component mounts or user changes
  useEffect(() => {
    fetchPrompts();
  }, [currentUser]);

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
      <div className="w-full max-w-[800px]">
        {/* Prompt Suggestions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {promptSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-5 text-left bg-white dark:bg-gray-800 border border-[#E5E5E5] dark:border-gray-700 rounded-xl hover:border-[#D4D4D4] dark:hover:border-gray-600 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F4F4F4] flex items-center justify-center flex-shrink-0">
                  <suggestion.icon className="w-4 h-4 text-[#666666] dark:text-gray-400" />
                </div>
                <h3 className="text-sm font-normal text-[#1A1A1A] dark:text-gray-100 leading-relaxed">
                  {suggestion.title}
                </h3>
              </div>
            </button>
          ))}
        </div>


        {/* Refresh Prompts Button */}
        <div className="flex flex-col items-center mb-12">
          <button
            onClick={handleRefreshPrompts}
            disabled={isLoadingPrompts}
            className="flex items-center gap-2 text-sm text-[#666666] dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-gray-100 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingPrompts ? 'animate-spin' : ''}`} />
            {isLoadingPrompts ? 'Refreshing...' : 'Refresh Prompts'}
          </button>
          {isPersonalized && (
            <span className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              ✨ Personalized for you
            </span>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={promptText}
            onChange={(e) => {
              if (e.target.value.length <= 1000) {
                setPromptText(e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (promptText.trim() !== "") {
                  handleGenerate();
                }
              }
            }}
            placeholder="Ask whatever you want...."
            className="w-full h-[56px] px-5 pr-16 text-base bg-white dark:bg-gray-800 border border-[#E5E5E5] dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#D4D4D4] dark:focus:border-gray-600 placeholder:text-[#999999] dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!promptText.trim()}
              className="p-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Character Counter */}
        <div className="mt-3 text-right">
          <span className={`text-sm ${
            promptText.length > 1000
              ? 'text-red-500'
              : 'text-[#999999] dark:text-gray-500'
          }`}>
            {promptText.length}/1000
          </span>
        </div>

        <textarea name="promptText" ref={promptTextRef} hidden />
      </div>
    );
  }

  // Chat mode layout (bottom input)
  return (
    <div className="p-4">
      <div className="relative">
        <input
          type="text"
          value={promptText}
          onChange={(e) => {
            if (e.target.value.length <= 1000) {
              setPromptText(e.target.value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (promptText.trim() !== "") {
                handleGenerate();
              }
            }
          }}
          placeholder="Ask me anything..."
          className="w-full h-[48px] px-4 pr-12 text-sm bg-white dark:bg-gray-800 border border-[#E5E5E5] dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#D4D4D4] dark:focus:border-gray-600 placeholder:text-[#999999] dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!promptText.trim()}
            className="p-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      <textarea name="promptText" ref={promptTextRef} hidden />
    </div>
  );
}
