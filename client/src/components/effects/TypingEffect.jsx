import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";

const TypingEffect = ({ text, speed }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index += 1;
      if (index === text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <>
      <span className="text-pretty mt-4 text-sm text-neutral-600 dark:text-neutral-300">
        <Markdown>{displayedText}</Markdown>
      </span>
    </>
  );
};

export default TypingEffect;
