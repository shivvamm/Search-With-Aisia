import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const TypingEffect = ({ text, speed }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, speed, text]);

  return (
    <>
      <span className="text-pretty mt-4 text-sm text-neutral-600 dark:text-neutral-300">
        <ReactMarkdown>{currentText}</ReactMarkdown>
      </span>
    </>
  );
};

export default TypingEffect;
