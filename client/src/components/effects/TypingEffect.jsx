import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const TypingEffect = ({ text, speed, className = "", animate = false }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // If animate is false or we've already animated, show full text immediately
    if (!animate || hasAnimated) {
      setCurrentText(text);
      setCurrentIndex(text.length);
      return;
    }

    // Start animation only if animate is true and we haven't animated yet
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentIndex >= text.length && animate) {
      // Mark as animated when finished
      setHasAnimated(true);
    }
  }, [currentIndex, speed, text, animate, hasAnimated]);

  // Reset animation state when text changes (new response)
  useEffect(() => {
    if (animate) {
      setCurrentText("");
      setCurrentIndex(0);
      setHasAnimated(false);
    } else {
      setCurrentText(text);
    }
  }, [text, animate]);

  return (
    <>
      <span className={`text-pretty mt-4 text-sm text-gray-900 dark:text-gray-100 ${className}`}>
        <ReactMarkdown>{currentText}</ReactMarkdown>
      </span>
    </>
  );
};

export default TypingEffect;
