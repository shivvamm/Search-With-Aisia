import React, { useState } from "react";
import Generate from "./icons/Generate";
import Voice from "./icons/Voice";
import Image from "./icons/Image";
import Camera from "./icons/Camera";
export default function Search({ addMessage, session_id }) {
  // State to manage the content of the prompt
  const [promptText, setPromptText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [userPrompt, setUserPrompt] = useState("");

  // List items
  const items = [
    "a penguin swimming in the ocean",
    "a penguin fishing under the water",
    "a penguin walking slowly on the snow",
    "a penguin hugging another penguin",
  ];

  const handleItemClick = (text) => {
    // Append the selected text to the existing promptText
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
    const response = await fetch(`${meta.env.BACKEND_URL}search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: promptText,
        session_id: toString(session_id),
      }), // Send the user input to the API
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    addMessage("ai", data);
    // setAiResponse(
    //   "The penguin is a fascinating bird perfectly adapted to life in the cold Antarctic regions. With its distinctive black and white plumage, streamlined body, and flipper-like wings, the penguin is an agile swimmer and expert diver, hunting for fish, krill, and squid underwater. Penguins are highly social animals, often gathering in large colonies for breeding and protection. They have a unique waddling gait on land but are graceful and swift in the water, using their flippers to propel themselves through the icy seas. Known for their resilience in harsh environments, penguins evoke a sense of curiosity and admiration for their ability to thrive in one of Earth's most extreme habitats."
    // );

    // Clear the prompt after generating response
    setPromptText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Insert a new line when Shift+Enter is pressed
        e.preventDefault();
        setPromptText((prev) => prev + "\n");
      } else {
        // Handle Enter key press
        e.preventDefault();

        // Check if promptText is empty
        if (promptText.trim() === "") {
          // Just add a new line if the prompt is empty
          setPromptText((prev) => prev + "\n");
        } else {
          // Otherwise, generate the response
          handleGenerate();
        }
      }
    }
  };

  return (
    <div className="flex w-full flex-col overflow-hidden border-neutral-300 bg-neutral-50 text-neutral-600 rounded-md border dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
      {/* <div className="bg-neutral-50 border-neutral-300 py-4 dark:border-neutral-700 dark:bg-neutral-900 rounded-md border">
        <ul className="text-neutral-600 dark:text-neutral-300 text-sm">
          {items.map((item, index) => (
            <li
              key={index}
              className="cursor-pointer px-4 py-1 hover:bg-neutral-950/5 dark:hover:bg-white/5"
              onClick={() => handleItemClick(item)}
            >
              <button className="text-left">{item}</button>
            </li>
          ))}
        </ul>
      </div> */}
      <div className="p-2">
        <p
          id="promptLabel"
          className="pb-1 pl-2 text-sm font-bold text-neutral-600 opacity-60 dark:text-neutral-300"
        >
          Prompt
        </p>
        <textarea
          className="scroll-on max-h-44 w-full overflow-y-auto px-2 py-1 focus:outline-none"
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
  );
}
