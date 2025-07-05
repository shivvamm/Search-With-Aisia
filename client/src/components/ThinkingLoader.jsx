import React, { useState, useEffect } from 'react';
import { Loader2, Brain, Search, Sparkles, Zap } from 'lucide-react';

export default function ThinkingLoader() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [startTime] = useState(Date.now());

  const messages = [
    { text: "Thinking...", icon: Brain, duration: 0 },
    { text: "Searching the web...", icon: Search, duration: 3000 },
    { text: "Analyzing results...", icon: Sparkles, duration: 8000 },
    { text: "Synthesizing response...", icon: Zap, duration: 15000 },
    { text: "Almost there...", icon: Loader2, duration: 25000 },
    { text: "Just a moment more...", icon: Loader2, duration: 35000 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      // Find the appropriate message based on elapsed time
      for (let i = messages.length - 1; i >= 0; i--) {
        if (elapsed >= messages[i].duration) {
          setCurrentMessageIndex(i);
          break;
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const currentMessage = messages[currentMessageIndex];
  const IconComponent = currentMessage.icon;

  return (
    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 py-3">
      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center">
        <img src="image.webp" className="w-6 h-6 rounded-full" />
      </div>
      <div className="flex items-center gap-2">
        <IconComponent className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">{currentMessage.text}</span>
      </div>
    </div>
  );
}