import React, { useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import { MessageSquare, Trash2 } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function ChatList({ isCollapsed }) {
  const { chatSessions, currentSessionId, switchToChat, deleteChat } = useChat();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, sessionId: null, title: '' });

  const handleDeleteChat = (e, sessionId, sessionTitle) => {
    e.stopPropagation();
    setDeleteModal({ 
      isOpen: true, 
      sessionId, 
      title: sessionTitle 
    });
  };

  const confirmDelete = () => {
    if (deleteModal.sessionId) {
      deleteChat(deleteModal.sessionId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  if (chatSessions.length === 0) {
    return (
      <div className={`px-4 ${isCollapsed ? 'hidden' : ''}`}>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
          No chat sessions yet
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="px-4">
        {!isCollapsed && (
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Recent Chats
          </h4>
        )}
        
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {chatSessions.slice(0, 10).map((session) => (
            <div key={session.id} className="relative group">
              <button
                onClick={() => switchToChat(session.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-left rounded-lg transition-colors ${
                  currentSessionId === session.id
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title={isCollapsed ? session.title : ''}
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {session.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(session.lastUpdated)}
                    </p>
                  </div>
                )}
              </button>
              
              {!isCollapsed && (
                <button
                  onClick={(e) => handleDeleteChat(e, session.id, session.title)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                  title="Delete chat"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              
              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {session.title}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800 dark:border-r-gray-700"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, sessionId: null, title: '' })}
        onConfirm={confirmDelete}
        title="Delete Chat?"
        message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
      />
    </>
  );
}