import React, { useState } from "react";

export default function Search() {
  // State to manage the content of the prompt
  const [promptText, setPromptText] = useState("");

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

  return (
    <div className="flex w-full flex-col overflow-hidden border-neutral-300 bg-neutral-50 text-neutral-600 rounded-md border dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
      <div className="bg-neutral-50 border-neutral-300 py-4 dark:border-neutral-700 dark:bg-neutral-900 rounded-md border">
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
      </div>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm13.5 3a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM10 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            className="rounded-full p-1 text-neutral-600/75 hover:bg-neutral-950/10 hover:text-neutral-600 focus:outline-none focus-visible:text-neutral-600 focus-visible:outline focus-visible:outline-offset-0 focus-visible:outline-black active:bg-neutral-950/5 active:-outline-offset-2 dark:text-neutral-300/75 dark:hover:bg-white/10 dark:hover:text-neutral-300 dark:focus-visible:text-neutral-300 dark:focus-visible:outline-white dark:active:bg-white/5"
            title="Upload Image"
            aria-label="Upload Image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            className="rounded-full p-1 text-neutral-600/75 hover:bg-neutral-950/10 hover:text-neutral-600 focus:outline-none focus-visible:text-neutral-600 focus-visible:outline focus-visible:outline-offset-0 focus-visible:outline-black active:bg-neutral-950/5 active:-outline-offset-2 dark:text-neutral-300/75 dark:hover:bg-white/10 dark:hover:text-neutral-300 dark:focus-visible:text-neutral-300 dark:focus-visible:outline-white dark:active:bg-white/5"
            title="Use Voice"
            aria-label="Use Voice"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
              aria-hidden="true"
            >
              <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" />
              <path d="M5.5 9.643a.75.75 0 0 0-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5v-1.546A6.001 6.001 0 0 0 16 10v-.357a.75.75 0 0 0-1.5 0V10a4.5 4.5 0 0 1-9 0v-.357Z" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 whitespace-nowrap bg-black px-4 py-2 text-center text-xs font-medium tracking-wide text-neutral-100 transition hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:opacity-100 active:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-75 dark:bg-white dark:text-black  dark:bg-white dark:text-black dark:focus-visible:outline-white rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-3"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 1a.75.75 0 0 1 .721.544l.195.682c.118.415.443.74.858.858l.682.195a.75.75 0 0 1 0 1.442l-.682.195a1.25 1.25 0 0 0-.858.858l-.195.682a.75.75 0 0 1-1.442 0l-.195-.682a1.25 1.25 0 0 0-.858-.858l-.682-.195a.75.75 0 0 1 0-1.442l.682-.195a1.25 1.25 0 0 0 .858-.858l.195-.682A.75.75 0 0 1 12 1ZM10 11a.75.75 0 0 1 .728.568.968.968 0 0 0 .704.704.75.75 0 0 1 0 1.456.968.968 0 0 0-.704.704.75.75 0 0 1-1.456 0 .968.968 0 0 0-.704-.704.75.75 0 0 1 0-1.456.968.968 0 0 0 .704-.704A.75.75 0 0 1 10 11Z"
              clipRule="evenodd"
            />
          </svg>
          Generate
        </button>
      </div>
    </div>
  );
}
