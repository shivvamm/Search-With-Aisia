import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const TypingEffect = ({ text, speed, className = "" }) => {
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
      <span className={`text-pretty mt-4 text-sm text-gray-900 dark:text-gray-100 ${className}`}>
        <ReactMarkdown>{currentText}</ReactMarkdown>
      </span>
    </>
  );
};

export default TypingEffect;
