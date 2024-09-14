import React from "react";
import reactLogo from "./../assets/react.svg";
import viteLogo from "/vite.svg";
import Edit from "./icons/Edit";
import Bot from "./icons/Bot";
import Speak from "./icons/Speak";
import TypingEffect from "./effects/TypingEffect";

// Todo TO refactor the whole code for modulation and dry

export default function Chats({ messages }) {
  const readAloud = (text) => {
    // Check if the SpeechSynthesis API is supported
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.voice = speechSynthesis
        .getVoices()
        .find((voice) => voice.name === "Google US English"); // Example voice
      utterance.rate = 1; // Speed of the speech
      utterance.pitch = 1; // Pitch of the speech

      // Speak the text
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("SpeechSynthesis API is not supported in this browser.");
    }
  };

  return (
    <div className="flex-grow flex-shrink-0 lg:w-[80%] w-full p-4">
      {messages.map((msg, index) => (
        <div key={index}>
          {msg.type === "user" ? (
            <div className="w-full flex justify-end mb-4">
              <div className="w-full max-w-xs lg:max-w-lg border-neutral-300 bg-neutral-50 p-6 text-left dark:border-neutral-700 dark:bg-neutral-900 rounded-md">
                <p className="text-justify mt-4 text-sm text-neutral-600 dark:text-neutral-300">
                  {msg.content}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    className="rounded-full p-1 text-neutral-600/75 hover:bg-neutral-950/10 hover:text-neutral-600 focus:outline-none dark:text-neutral-300/75 dark:hover:bg-white/10 dark:hover:text-neutral-300"
                    title="Edit"
                    aria-label="Edit your input"
                  >
                    <Edit />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-start mb-4">
              <div className="w-full   p-6 text-left rounded-md ">
                <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                  <span className="flex w-8 h-8 items-center justify-center rounded-full bg-black text-neutral-100 dark:bg-white dark:text-black">
                    <Bot />
                  </span>
                  <span className="text-sm font-bold">Alisia AI</span>
                </div>

                <TypingEffect
                  text={msg.content.data.refined_results}
                  speed={5} // Adjust typing speed here
                />

                <div className="mt-2 flex items-center gap-2">
                  <button
                    className="rounded-full p-1 text-neutral-600/75 hover:bg-neutral-950/10 hover:text-neutral-600 focus:outline-none dark:text-neutral-300/75 dark:hover:bg-white/10 dark:hover:text-neutral-300"
                    title="Read Aloud"
                    aria-label="Read Aloud"
                    onClick={() => readAloud(msg.content.data.refined_results)}
                  >
                    <Speak />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="" style={{ marginTop: "170px" }}></div>
    </div>
  );
}
