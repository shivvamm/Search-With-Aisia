import React, { useState, useRef } from "react";
import Generate from "./icons/Generate";
import Voice from "./icons/Voice";
import Image from "./icons/Image";
import Camera from "./icons/Camera";
import ToggleButtonGroup from "./effects/ToggleButtonGroup";

export default function Search({ addMessage, uuid_session_id }) {
  const [promptText, setPromptText] = useState("");
  const [activeButtons, setActiveButtons] = useState([]);
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

  const handleChange = (e) => {
    setPromptText(e.target.value);
  };

  const handleGenerate = async () => {
    if (promptText.trim() === "") {
      alert("Please enter a something");
      return;
    }
    addMessage("user", promptText);
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
      `${
        import.meta.env.VITE_LOCAL_BACKEND_URL
      }/searchnew?search_type=${searchType}`,
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
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    addMessage("ai", data);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        setPromptText((prev) => prev + "\n");
      } else {
        e.preventDefault();

        if (promptText.trim() === "") {
          setPromptText((prev) => prev + "\n");
        } else {
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
      <div className="bg-neutral-50 border-neutral-300 py-4 dark:border-neutral-700 dark:bg-neutral-900 rounded-md border">
        <div className="p-2">
          <p
            id="promptLabel"
            className="pb-1 pl-2 text-sm font-bold text-neutral-600 opacity-60 dark:text-neutral-300"
          >
            Prompt
          </p>
          <textarea
            className="bg-transparent border-none text-current placeholder-current p-2 overflow-y-auto max-h-44 w-full focus:outline-none"
            role="textbox"
            aria-labelledby="promptLabel"
            value={promptText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type here..."
          />
        </div>
        <div className="flex w-full items-center justify-end gap-4 px-2.5 py-2">
          <div className="flex items-center gap-2">
            {/* Your buttons */}
            {/* <button
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
          </button> */}
          </div>

         {/* <ToggleButtonGroup
            activeButtons={activeButtons}
            setActiveButtons={setActiveButtons}
          />*/}
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
