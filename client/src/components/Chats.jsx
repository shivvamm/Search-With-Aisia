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
    <div className="flex-grow flex-shrink-0 lg:w-[60%] h-full  w-full p-4 ">
      {messages.map((msg, index) => (
        <div key={index}>
          {msg.type === "user" ? (
            <div className="w-full flex justify-end mb-4">
              <div className="max-w-xs lg:max-w-lg border-neutral-300 bg-[#f4f4f4] px-5 py-3 text-left dark:border-neutral-700 dark:bg-[#2F2F2F] rounded-3xl min-w-fit">
                <p className="text-justify text-sm text-[#0D0D0D] dark:text-white">
                  {msg.content}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-start mb-4 text-sm">
              <span className="flex  mt-3 w-10 h-10 items-center justify-center rounded-full">
                <img src="image.webp" />
              </span>
              <div className="w-full py-6 px-2 text-left rounded-md">
                <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                  <div className="flex-grow">
                    {msg.content?.data?.refined_results && (
                      <TypingEffect
                        text={msg.content.data.refined_results}
                        speed={5}
                      />
                    )}
                  </div>
                </div>

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
                {msg.content.resources &&
                  Object.keys(msg.content.resources).length > 0 && (
                    <div className="pt-2">
                      {Object.keys(msg.content.resources).length > 1 ? (
                        <Tabs resources={msg.content.resources} />
                      ) : (
                        <ResourceDisplay
                          resource={
                            msg.content.resources[
                              Object.keys(msg.content.resources)[0]
                            ]
                          }
                          activeTab={Object.keys(msg.content.resources)[0]}
                        />
                      )}
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

const Tabs = ({ resources }) => {
  const [activeTab, setActiveTab] = useState(Object.keys(resources)[0]);

  return (
    <div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap mb-px">
          {Object.keys(resources).map((key) => (
            <li key={key} className="me-2">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === key
                    ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab(key)}
                aria-current={activeTab === key ? "page" : undefined}
              >
                {key}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ResourceDisplay resource={resources[activeTab]} activeTab={activeTab} />
    </div>
  );
};

const ResourceDisplay = ({ resource, activeTab }) => {
  if (activeTab === "Images" && resource.length > 0) {
    console.log(resource["Images"]);
    return (
      <div className="sm:grid-cols-2 grid-cols-1 grid md:grid-cols-3 lg:grid-cols-4 w-full gap-6 border-neutral-300 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900 mt-2 rounded-md border">
        {resource.map((image, index) => (
          <div key={index} className="group relative">
            <img
              className="w-full h-48 object-cover rounded-md"
              src={image.murl}
              alt={image.image_name}
            />
            <a
              role="button"
              href={image.data}
              download={image.image_name}
              class="absolute right-2.5 top-2.5 rounded-md z-10 bg-neutral-50/75 p-1 text-neutral-600 dark:bg-neutral-900/75 dark:text-neutral-300"
            >
              <span class="sr-only">download variation 1</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </a>
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === "News" && resource.length > 0) {
    return (
      <div className="mt-2">
        {resource.map((video, index) => (
          <div
            key={index}
            className="flex justify-between p-2 border-b border-gray-200"
          >
            <a
              href={video.news_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {video.title}
            </a>
            <p className="text-gray-500">{video.summary}</p>
          </div>
        ))}
      </div>
    );
  }
  if (activeTab === "Videos" && resource.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {resource.map((video, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-md shadow-md"
          >
            <iframe
              className="w-full h-48"
              src={video.url}
              title={video.title}
              frameBorder="0"
              allowFullScreen
            />
            {/* <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 bg-white rounded-md p-1 text-blue-600 hover:underline"
            >
              Watch
            </a> */}
          </div>
        ))}
      </div>
    );
  }
  if (activeTab === "Finance" && resource.length > 0) {
    return (
      <div className="mt-2">
        {resource.map((item, index) => (
          <div
            key={index}
            className="flex justify-between p-2 border-b border-gray-200"
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {item.title}
            </a>
          </div>
        ))}
      </div>
    );
  }
  if (activeTab === "Shopping" && resource.length > 0) {
    return (
      <div className="mt-2">
        {resource.map((item, index) => (
          <div
            key={index}
            className="flex justify-between p-2 border-b border-gray-200"
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {item.title}
            </a>
          </div>
        ))}
      </div>
    );
  }
  if (activeTab === "Books" && resource.length > 0) {
    return (
      <div className="mt-2">
        {resource.map((item, index) => (
          <div
            key={index}
            className="flex justify-between p-2 border-b border-gray-200"
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {item.title}
            </a>
          </div>
        ))}
      </div>
    );
  }
  if (activeTab === "Flights" && resource.length > 0) {
    return (
      <div className="mt-2">
        {resource.map((item, index) => (
          <div
            key={index}
            className="flex justify-between p-2 border-b border-gray-200"
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {item.title}
            </a>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
