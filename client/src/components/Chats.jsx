import React, { useState, useRef, useEffect } from "react";
import Edit from "./icons/Edit";
import Bot from "./icons/Bot";
import Speak from "./icons/Speak";
import TypingEffect from "./effects/TypingEffect";
import ThinkingLoader from "./ThinkingLoader";
import { useChat } from "../contexts/ChatContext";
import { Loader2 } from "lucide-react";

export default function Chats({ messages, isLoading }) {
  const [copiedToClipboard, setCopiedToClipboard] = useState(null);
  const targetTextRef = useRef(null);
  const [loadingImages, setLoadingImages] = useState(true);
  const { pendingRequests } = useChat();

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
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center min-h-[60vh]">
              <div className="w-20 h-20 mb-6 rounded-full bg-blue-100 dark:bg-gray-800 flex items-center justify-center">
                <img src="image.webp" className="w-16 h-16 rounded-full" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Hi, there 👋
              </h1>
              <p className="text-gray-500 dark:text-gray-500">
                Tell us what you need, and we'll handle the rest.
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div key={index} className="mb-6">
                  {msg.type === "user" ? (
                    <div className="flex justify-end">
                      <div className="max-w-[70%] px-4 py-2 bg-black dark:bg-gray-700 text-white dark:text-gray-100 rounded-2xl">
                        <p className="text-sm">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center">
                    <img src="image.webp" className="w-6 h-6 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-900 dark:text-gray-100">
                      {msg.content?.data?.refined_results ? (
                        <TypingEffect
                          text={msg.content.data.refined_results}
                          speed={1}
                          className="text-gray-900 dark:text-gray-100"
                        />
                      ) : typeof msg.content === 'string' ? (
                        <p className="text-gray-900 dark:text-gray-100">{msg.content}</p>
                      ) : null}
                    </div>

                    <div className="mt-2 flex items-center gap-1">
                      <button
                        className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
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
                            className="w-4 h-4 fill-green-500"
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
                            className="w-4 h-4"
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
                        className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                        title="Read Aloud"
                        aria-label="Read Aloud"
                        onClick={() =>
                          readAloud(msg.content?.data?.refined_results)
                        }
                      >
                        <Speak />
                      </button>
                    </div>
                    {msg.content?.resources &&
                      Object.keys(msg.content.resources).length > 0 && (
                        <div className="mt-4">
                          {(() => {
                            // Filter out resources with empty arrays
                            const resourcesWithData = Object.fromEntries(
                              Object.entries(msg.content.resources).filter(([key, value]) => value && value.length > 0)
                            );

                            if (Object.keys(resourcesWithData).length === 0) {
                              return null;
                            }

                            return Object.keys(resourcesWithData).length > 1 ? (
                              <Tabs resources={msg.content.resources} />
                            ) : (
                              <ResourceDisplay
                                resource={
                                  resourcesWithData[
                                    Object.keys(resourcesWithData)[0]
                                  ]
                                }
                                activeTab={Object.keys(resourcesWithData)[0]}
                              />
                            );
                          })()}
                        </div>
                      )}
                  </div>
                </div>
              )}
                </div>
              ))}
              
              {/* Show loader for any pending requests */}
              {pendingRequests.size > 0 && (
                <div className="mb-6">
                  <ThinkingLoader />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const Tabs = ({ resources }) => {
  // Filter out resources with empty arrays
  const resourcesWithData = Object.fromEntries(
    Object.entries(resources).filter(([key, value]) => value && value.length > 0)
  );

  const [activeTab, setActiveTab] = useState(Object.keys(resourcesWithData)[0]);

  return (
    <div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-500 dark:border-gray-800">
        <ul className="flex flex-wrap -mb-px">
          {Object.keys(resourcesWithData).map((key) => (
            <li key={key} className="mr-2">
              <button
                className={`inline-block p-3 border-b-2 rounded-t-lg transition-colors ${
                  activeTab === key
                    ? "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-400"
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
      <ResourceDisplay resource={resourcesWithData[activeTab]} activeTab={activeTab} />
    </div>
  );
};

const ResourceDisplay = ({ resource, activeTab }) => {
  if (activeTab === "Images" && resource.length > 0) {
    console.log(resource["Images"]);
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        {resource.map((image, index) => (
          <div key={index} className="group relative">
            <img
              className="w-full h-48 object-cover rounded-lg"
              src={image.murl}
              alt={image.image_name}
            />
            <a
              role="button"
              href={image.data}
              download={image.image_name}
              className="absolute right-2 top-2 rounded-md bg-white/80 dark:bg-black/80 p-1.5 text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="sr-only">download variation 1</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
      <div className="p-4 space-y-3">
        {resource.map((news, index) => (
          <div
            key={index}
            className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <a
              href={news.news_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {news.title}
            </a>
            <p className="text-gray-600 dark:text-gray-500 text-sm mt-1">{news.summary}</p>
          </div>
        ))}
      </div>
    );
  }
  if (activeTab === "Videos" && resource.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {resource.map((video, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-sm border border-gray-200 dark:border-gray-800"
          >
            <iframe
              className="w-full h-48"
              src={video.url}
              title={video.title}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        ))}
      </div>
    );
  }
  if (activeTab === "Finance" && resource.length > 0) {
    return (
      <div className="p-4 space-y-2">
        {resource.map((item, index) => (
          <div
            key={index}
            className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
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
      <div className="p-4 space-y-2">
        {resource.map((item, index) => (
          <div
            key={index}
            className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
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
      <div className="p-4 space-y-2">
        {resource.map((item, index) => (
          <div
            key={index}
            className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
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
      <div className="p-4 space-y-2">
        {resource.map((item, index) => (
          <div
            key={index}
            className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
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
