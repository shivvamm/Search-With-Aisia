import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  FolderOpen, 
  Clock, 
  Settings,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Tooltip component for collapsed sidebar
const TooltipButton = ({ onClick, icon: Icon, label, className = "", isCollapsed }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-left text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${className}`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {!isCollapsed && <span className="text-sm">{label}</span>}
    </button>
    {isCollapsed && (
      <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {label}
        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800 dark:border-r-gray-700"></div>
      </div>
    )}
  </div>
);

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleNewChat = () => {
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-gray-50 dark:bg-[#1A1A1A] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <img 
            src="/alisia.svg" 
            alt="Alisia Logo" 
            className="w-8 h-8 rounded-lg"
          />
          {!isCollapsed && (
            <span className="font-semibold text-gray-900 dark:text-white">
              Alisia
            </span>
          )}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
        {isCollapsed && (
          <div className="mt-2 flex justify-center">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

{currentUser && (
        <>
          {/* New Chat Button */}
          <div className="p-4">
            <div className="relative group">
              <button
                onClick={handleNewChat}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-left bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors`}
              >
                <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    New Chat
                  </span>
                )}
              </button>
              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  New Chat
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800 dark:border-r-gray-700"></div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4">
            <div className="space-y-1">
              <TooltipButton
                onClick={() => navigate('/library')}
                icon={FolderOpen}
                label="Library"
                isCollapsed={isCollapsed}
              />
              
              <TooltipButton
                onClick={() => navigate('/history')}
                icon={Clock}
                label="History"
                isCollapsed={isCollapsed}
              />
            </div>
          </nav>

          {/* Settings */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <TooltipButton
              onClick={() => navigate('/settings')}
              icon={Settings}
              label="Settings"
              isCollapsed={isCollapsed}
            />
          </div>
        </>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        {currentUser ? (
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="relative group">
              <button
                onClick={handleProfile}
                className="flex items-center"
              >
                {currentUser.user_metadata?.avatar_url ? (
                  <img
                    src={currentUser.user_metadata.avatar_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </button>
              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {currentUser.user_metadata?.full_name || currentUser.email}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800 dark:border-r-gray-700"></div>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <button
                  onClick={handleProfile}
                  className="text-left w-full"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {currentUser.user_metadata?.full_name || currentUser.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {currentUser.email}
                  </p>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative group">
            <button
              onClick={() => navigate('/login')}
              className={`w-full ${isCollapsed ? 'px-2' : 'px-3'} py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors`}
            >
              {isCollapsed ? <User className="w-4 h-4 mx-auto" /> : "Sign In"}
            </button>
            {isCollapsed && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Sign In
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800 dark:border-r-gray-700"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}