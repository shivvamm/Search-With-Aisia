import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { chatService } from '../services/chatService';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }) {
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(new Set());
  const { currentUser } = useAuth();

  // Load chat sessions from Supabase when user is authenticated
  useEffect(() => {
    if (currentUser) {
      loadUserSessions();
    } else {
      setChatSessions([]);
      setCurrentSessionId(null);
      setCurrentMessages([]);
    }
  }, [currentUser]);

  // Load current session messages when session changes
  useEffect(() => {
    if (currentSessionId && currentUser) {
      loadSessionMessages(currentSessionId);
    }
  }, [currentSessionId, currentUser]);

  const loadUserSessions = async () => {
    try {
      setIsLoading(true);
      const sessions = await chatService.getUserSessions();
      setChatSessions(sessions);
    } catch (error) {
      console.error('Error loading user sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessionMessages = async (sessionId) => {
    try {
      const messages = await chatService.getSessionMessages(sessionId);
      // Convert Supabase format to app format
      const formattedMessages = messages.flatMap(msg => {
        const result = [];
        // Add user message
        result.push({
          id: msg.id + '_user',
          type: 'user',
          content: msg.query,
          timestamp: msg.created_at
        });
        // Add AI response if it exists
        if (msg.response) {
          result.push({
            id: msg.id + '_ai',
            type: 'ai',
            content: msg.response,
            timestamp: msg.updated_at || msg.created_at
          });
        }
        return result;
      });
      setCurrentMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading session messages:', error);
    }
  };

  // Create a new chat session
  const createNewChat = () => {
    const newSessionId = uuidv4();
    setCurrentSessionId(newSessionId);
    setCurrentMessages([]);
    return newSessionId;
  };

  // Switch to an existing chat session
  const switchToChat = async (sessionId) => {
    setCurrentSessionId(sessionId);
    // Wait for messages to be loaded
    await loadSessionMessages(sessionId);
  };

  // Save query to Supabase and return message ID
  const saveQuery = async (query) => {
    if (!currentSessionId || !query) return null;

    try {
      const message = await chatService.saveQuery(currentSessionId, query);
      // Add to pending requests
      setPendingRequests(prev => new Set(prev).add(message.id));
      // Reload messages to show the new query
      loadSessionMessages(currentSessionId);
      return message.id;
    } catch (error) {
      console.error('Error saving query:', error);
      
      // Check if it's a table doesn't exist error
      if (error.message?.includes('relation "chat_messages" does not exist')) {
        alert('Database table not created yet. Please create the chat_messages table in Supabase first.');
      }
      
      return null;
    }
  };

  // Update response in Supabase
  const updateResponse = async (messageId, response) => {
    if (!messageId || !response) return;

    try {
      await chatService.updateResponse(messageId, response);
      // Remove from pending requests
      setPendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
      // Reload messages to show the updated response
      loadSessionMessages(currentSessionId);
      // Refresh sessions list to update last activity
      loadUserSessions();
    } catch (error) {
      console.error('Error updating response:', error);
      // Remove from pending even on error
      setPendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  // Check if a message is pending
  const isMessagePending = (messageId) => {
    return pendingRequests.has(messageId);
  };

  // Delete a chat session
  const deleteChat = async (sessionId) => {
    try {
      await chatService.deleteSession(sessionId);
      setChatSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setCurrentMessages([]);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  // Get current session info
  const getCurrentSession = () => {
    return chatSessions.find(s => s.id === currentSessionId);
  };

  // Clear all chats
  const clearAllChats = async () => {
    try {
      // Delete all sessions for the user
      for (const session of chatSessions) {
        await chatService.deleteSession(session.id);
      }
      setChatSessions([]);
      setCurrentSessionId(null);
      setCurrentMessages([]);
    } catch (error) {
      console.error('Error clearing all chats:', error);
    }
  };

  const value = {
    chatSessions,
    currentSessionId,
    currentMessages,
    isLoading,
    pendingRequests,
    createNewChat,
    switchToChat,
    saveQuery,
    updateResponse,
    deleteChat,
    getCurrentSession,
    clearAllChats,
    loadUserSessions,
    loadSessionMessages,
    isMessagePending
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}