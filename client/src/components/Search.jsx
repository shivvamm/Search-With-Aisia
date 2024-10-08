import React, { useState, useRef } from "react";
import Generate from "./icons/Generate";
import Voice from "./icons/Voice";
import Image from "./icons/Image";
import Camera from "./icons/Camera";

export default function Search({ addMessage, uuid_session_id, setIsLoading }) {
  const [promptText, setPromptText] = useState("");
  const [activeButtons, setActiveButtons] = useState([]);
  const [lineCount, setLineCount] = useState(1);
  const promptTextInputRef = useRef(null);
  const promptTextRef = useRef(null);
  // List items
  const items = [
    // "a penguin swimming in the ocean",
    // "a penguin fishing under the water",
    // "a penguin walking slowly on the snow",
    // "a penguin hugging another penguin",
  ];

  const handleItemClick = (text) => {
    setPromptText((prevPromptText) => `${prevPromptText} ${text}`);
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
    addMessage("user", promptText);
    setIsLoading(true);
    if (promptTextInputRef.current) {
      promptTextInputRef.current.innerText = "";
    }
    setPromptText("");
    const backendUrl = import.meta.env.VITE_LOCAL_BACKEND_URL;
    console.log(backendUrl);
    console.log(uuid_session_id);
    console.log(activeButtons.length);
    const searchType = activeButtons.length === 0 ? "text" : "other";
    console.log(searchType);
    console.log("This is the parameters searchtype ", searchType);
    const body = JSON.stringify({
      query: promptText,
      session_id: uuid_session_id,
      search_type_resources: activeButtons,
    });
    console.log(body);
    const response = await fetch(
      `http://localhost:8000/searchnew?search_type=${searchType}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: promptText,
          session_id: uuid_session_id,
          search_type_resources: activeButtons,
        }),
      }
    );

    if (!response.ok) {
      setIsLoading(false);
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    addMessage("ai", data);
    setIsLoading(false);
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

  return (
    <div className="flex w-full flex-col gap-2">
      {items.length > 0 ? (
        <div className="bg-neutral-50 border-neutral-300 py-4 dark:border-neutral-700 dark:bg-neutral-900 rounded-md border">
          <ul className="text-neutral-600 dark:text-neutral-300 text-sm">
            {items.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer px-4 py-1 hover:bg-neutral-950/5 dark:hover:bg-white/5"
              >
                <button className="text-left">{item}</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <></>
      )}
      <div className="flex w-full flex-col overflow-hidden border-neutral-300 bg-neutral-50 text-neutral-600 has-[p:focus]:outline has-[p:focus]:outline-2 has-[p:focus]:outline-offset-2 has-[p:focus]:outline-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:has-[p:focus]:outline-white rounded-md border">
        <div className="p-2">
          <p
            id="promptLabel"
            className="pb-1 pl-2 text-sm font-bold text-neutral-600 opacity-60 dark:text-neutral-300"
          >
            Message
          </p>
          <p
            className="scroll-on max-h-36 w-full overflow-y-auto px-2 py-1 focus:outline-none"
            role="textbox"
            aria-labelledby="promptLabel"
            contentEditable
            onInput={handleChange}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            ref={promptTextInputRef}
          />
          <textarea name="promptText" ref={promptTextRef} hidden />
        </div>
        <div className="flex w-full items-center justify-end gap-4 px-2.5 py-2">
          <div className="flex items-center gap-2">
            <button
              className="rounded-full p-1 text-neutral-600/75 hover:bg-neutral-950/10 hover:text-neutral-600 focus:outline-none focus-visible:text-neutral-600 focus-visible:outline focus-visible:outline-offset-0 focus-visible:outline-black active:bg-neutral-950/5 active:-outline-offset-2 dark:text-neutral-300/75 dark:hover:bg-white/10 dark:hover:text-neutral-300 dark:focus-visible:text-neutral-300 dark:focus-visible:outline-white dark:active:bg-white/5"
              title="Use Camera"
              aria-label="Use Camera"
            >
              <Camera />
            </button>

            <button
              className="rounded-full p-1 text-neutral-600/75 hover:bg-neutral-950/10 hover:text-neutral-600 focus:outline-none focus-visible:text-neutral-600 focus-visible:outline focus-visible:outline-offset-0 focus-visible:outline-black active:bg-neutral-950/5 active:-outline-offset-2 dark:text-neutral-300/75 dark:hover:bg-white/10 dark:hover:text-neutral-300 dark:focus-visible:text-neutral-300 dark:focus-visible:outline-white dark:active:bg-white/5"
              title="Upload Image"
              aria-label="Upload Image"
            >
              <Image />
            </button>

            <button
              className="rounded-full p-1 text-neutral-600/75 hover:bg-neutral-950/10 hover:text-neutral-600 focus:outline-none focus-visible:text-neutral-600 focus-visible:outline focus-visible:outline-offset-0 focus-visible:outline-black active:bg-neutral-950/5 active:-outline-offset-2 dark:text-neutral-300/75 dark:hover:bg-white/10 dark:hover:text-neutral-300 dark:focus-visible:text-neutral-300 dark:focus-visible:outline-white dark:active:bg-white/5"
              title="Use Voice"
              aria-label="Use Voice"
            >
              <Voice />
            </button>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="flex cursor-pointer items-center gap-2 whitespace-nowrap bg-black px-4 py-2 text-center text-xs font-medium tracking-wide text-neutral-100 transition hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:opacity-100 active:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-75 dark:bg-white dark:text-black  dark:bg-white dark:text-black dark:focus-visible:outline-white rounded-md"
          >
            <Generate />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
