import React, { useState, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import {
  MessageSquare,
  Trash2,
  Search,
  Clock,
  ArrowLeft
} from 'lucide-react';

export default function ChatHistory({ onBackToChat, onSelectChat }) {
  const { currentUser } = useAuth();
  const {
    chatSessions,
    deleteChat,
    loadUserSessions
  } = useChat();

  const [searchTerm, setSearchTerm] = useState('');

  // Load sessions when component mounts
  useEffect(() => {
    if (currentUser) {
      loadUserSessions();
    }
  }, [currentUser, loadUserSessions]);

  // Filter sessions based on search term
  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle session deletion
  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation(); // Prevent session selection
    if (confirm('Are you sure you want to delete this chat?')) {
      await deleteChat(sessionId);
    }
  };

  // Handle session selection
  const handleSessionClick = (session) => {
    onSelectChat(session);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (!currentUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#F4F4F4] dark:bg-[#0D0D0D]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Please log in to view your chat history
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#F4F4F4] dark:bg-[#0D0D0D]">
      <div className="max-w-4xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBackToChat}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chat History</h1>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Chat Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No chats found' : 'No chat history yet'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Start a conversation to see your chat history here'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md dark:hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-relaxed">
                      {session.title}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(session.lastUpdated)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}