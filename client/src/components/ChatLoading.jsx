import React from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';

export default function ChatLoading() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#F4F4F4] dark:bg-[#0D0D0D]">
      <div className="text-center">
        <div className="w-16 h-16 mb-6 rounded-full bg-blue-100 dark:bg-gray-800 flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Loading Chat
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Please wait while we load your conversation...
        </p>
      </div>
    </div>
  );
}