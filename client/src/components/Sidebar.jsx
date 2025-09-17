import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';
import ChatList from './ChatList';
import {
  Plus,
  Clock,
  Settings,
  User,
  Home
} from 'lucide-react';


export default function Sidebar({ onShowHistory, onGoHome }) {
  const { currentUser, logout } = useAuth();
  const { createNewChat } = useChat();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleNewChat = () => {
    createNewChat();
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      createNewChat();
      navigate('/');
    }
  };

  return (
    <div className="w-[68px] h-screen bg-white dark:bg-gray-900 border-r border-[#E5E5E5] dark:border-gray-800 flex flex-col">
      {/* Logo/AI button */}
      <div className="h-[68px] flex items-center justify-center border-b border-[#E5E5E5] dark:border-gray-800">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
          </svg>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="flex items-center justify-center py-4">
        <button
          onClick={handleNewChat}
          className="w-9 h-9 rounded-lg border border-[#E5E5E5] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center"
        >
          <Plus className="w-4 h-4 text-[#666666] dark:text-gray-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center py-4 space-y-3">
        <button
          onClick={handleHome}
          className="w-9 h-9 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center"
        >
          <Home className="w-4 h-4 text-[#666666] dark:text-gray-400" />
        </button>
        
        <button
          onClick={onShowHistory}
          className="w-9 h-9 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center"
        >
          <Clock className="w-4 h-4 text-[#666666] dark:text-gray-400" />
        </button>
      </nav>

      {/* Settings */}
      <div className="pb-4">
        <div className="flex items-center justify-center">
          <button
            onClick={() => navigate('/settings')}
            className="w-9 h-9 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center"
          >
            <Settings className="w-4 h-4 text-[#666666] dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-[#E5E5E5] dark:border-gray-800 py-4">
        <div className="flex items-center justify-center">
          {currentUser ? (
            <button
              onClick={handleProfile}
              className="relative"
            >
              <div className="w-9 h-9 bg-[#E5E5E5] dark:bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-[#666666] dark:text-gray-400" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-9 h-9 bg-[#E5E5E5] dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#D4D4D4] dark:hover:bg-gray-600"
            >
              <User className="w-4 h-4 text-[#666666] dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}