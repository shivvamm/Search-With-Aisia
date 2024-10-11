import React, { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";

const TypingEffect = ({ text, speed }) => {
  const [displayedText, setDisplayedText] = useState("");
  const textRef = useRef(null);

  useEffect(() => {
    let index = 0;

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index += 1;
      } else {
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
