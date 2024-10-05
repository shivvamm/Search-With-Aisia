import React, { useState, useRef, useEffect } from "react";
import Edit from "./icons/Edit";
import Bot from "./icons/Bot";
import Speak from "./icons/Speak";
import TypingEffect from "./effects/TypingEffect";

export default function Chats({ messages }) {
  const [copiedToClipboard, setCopiedToClipboard] = useState(null);
  const targetTextRef = useRef(null);
  const [loadingImages, setLoadingImages] = useState(true);

  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedToClipboard(text);
          setTimeout(() => setCopiedToClipboard(null), 2000);
        })
        .catch(() => {
          setCopiedToClipboard(null);
        });
    }
  };

  const readAloud = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = speechSynthesis
        .getVoices()
        .find((voice) => voice.name === "Google US English");
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("SpeechSynthesis API is not supported in this browser.");
    }
  };

  return (
    <div className="flex-grow flex-shrink-0 lg:w-[60%] h-full  w-full p-4">
      {messages.map((msg, index) => (
        <div key={index}>
          {msg.type === "user" ? (
            <div className="w-full flex justify-end mb-4">
              <div className="w-full max-w-xs lg:max-w-lg border-neutral-300 bg-neutral-50 p-6 text-left dark:border-neutral-700 dark:bg-neutral-900 rounded-full">
                <p className="text-justify text-sm text-neutral-600 dark:text-neutral-300">
                  {msg.content}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-start mb-4">
              <div className="w-full p-6 text-left rounded-md  dark:bg-neutral-900">
                <div className="flex items-center gap-2 text-neutral-900 dark:text-white pb-2">
                  <span className="flex w-8 h-8 items-center justify-center rounded-full bg-black text-neutral-100 dark:bg-white dark:text-black">
                    <Bot />
                  </span>
                  <span className="text-sm font-bold">Alisia AI</span>
                </div>

                {msg.content?.data?.refined_results && (
                  <TypingEffect
                    text={msg.content.data.refined_results}
                    speed={5}
                  />
                )}

                <div className="mt-2 flex items-center gap-2">
                  <button
                    className="rounded-full w-fit p-1 text-neutral-600/75 hover:bg-neutral-950/10 hover:text-neutral-600 focus:outline-none dark:text-neutral-300/75 dark:hover:bg-white/10 dark:hover:text-neutral-300"
                    title="Copy"
                    aria-label="Copy"
                    onClick={() =>
                      copyToClipboard(msg.content?.data?.refined_results)
                    }
                  >
                    <span className="sr-only">
                      {copiedToClipboard === msg.content?.data?.refined_results
                        ? "Copied"
                        : "Copy the response to clipboard"}
                    </span>
                    {copiedToClipboard ===
                    msg.content?.data?.refined_results ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="size-4 fill-green-500"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.986 3H12a2 2 0 0 1 2 2v6a2 2 0 0 1-1.5 1.937V7A2.5 2.5 0 0 0 10 4.5H4.063A2 2 0 0 1 6 3h.014A2.25 2.25 0 0 1 8.25 1h1.5a2.25 2.25 0 0 1 2.236 2ZM10.5 4v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4h3Z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M2 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7Zm6.585 1.08a.75.75 0 0 1 .336 1.005l-1.75 3.5a.75.75 0 0 1-1.16.234l-1.75-1.5a.75.75 0 0 1 .977-1.139l1.02.875 1.321-2.64a.75.75 0 0 1 1.006-.336Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="size-4"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M13.887 3.182c.396.037.79.08 1.183.128C16.194 3.45 17 4.414 17 5.517V16.75A2.25 2.25 0 0 1 14.75 19h-9.5A2.25 2.25 0 0 1 3 16.75V5.517c0-1.103.806-2.068 1.93-2.207.393-.048.787-.09 1.183-.128A3.001 3.001 0 0 1 9 1h2c1.373 0 2.531.923 2.887 2.182ZM7.5 4A1.5 1.5 0 0 1 9 2.5h2A1.5 1.5 0 0 1 12.5 4v.5h-5V4Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                  <button
                    className="rounded-full p-1 text-neutral-600/75 hover:bg-neutral-950/10 hover:text-neutral-600 focus:outline-none dark:text-neutral-300/75 dark:hover:bg-white/10 dark:hover:text-neutral-300"
                    title="Read Aloud"
                    aria-label="Read Aloud"
                    onClick={() =>
                      readAloud(msg.content?.data?.refined_results)
                    }
                  >
                    <Speak />
                  </button>
                </div>
                {msg.content.resources?.Images &&
                  msg.content.resources.Images.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
                      {msg.content.resources.Images.map((image, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
                        >
                          <img
                            className="w-full h-48 object-cover"
                            src={image.murl}
                            alt={image.image_name}
                          />
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="" style={{ marginTop: "180px" }}></div>
    </div>
  );
}
