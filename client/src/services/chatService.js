import { supabase } from '../supabase';

export const chatService = {
  // Save a new query to Supabase
  async saveQuery(sessionId, query) {
    try {
      console.log('Attempting to save query:', { sessionId, query });

      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);

      if (!user) {
        // Return a mock message ID for unauthenticated users
        console.log('User not authenticated - skipping database save');
        return { id: `temp_${Date.now()}`, session_id: sessionId, query, response: null };
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert([
          {
            session_id: sessionId,
            user_id: user.id,
            query: query,
            response: null
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Query saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error saving query:', error);
      throw error;
    }
  },

  // Update the response for a specific query
  async updateResponse(messageId, response) {
    try {
      // Skip database update for temporary message IDs (unauthenticated users)
      if (messageId.startsWith('temp_')) {
        console.log('Skipping database update for temporary message ID');
        return { id: messageId, response };
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .update({
          response: response,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating response:', error);
      throw error;
    }
  },

  // Get all messages for a session
  async getSessionMessages(sessionId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error getting session messages:', error);
      throw error;
    }
  },

  // Get all unique sessions for a user
  async getUserSessions() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .select('session_id, query, created_at, updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Group by session_id and get the first query as title, latest update as lastUpdated
      const sessionsMap = new Map();
      data.forEach(message => {
        if (!sessionsMap.has(message.session_id)) {
          sessionsMap.set(message.session_id, {
            id: message.session_id,
            title: message.query.length > 50 ? message.query.substring(0, 50) + '...' : message.query,
            lastUpdated: message.updated_at || message.created_at,
            createdAt: message.created_at
          });
        } else {
          // Update lastUpdated if this message is newer
          const existing = sessionsMap.get(message.session_id);
          const messageDate = new Date(message.updated_at || message.created_at);
          const existingDate = new Date(existing.lastUpdated);
          if (messageDate > existingDate) {
            existing.lastUpdated = message.updated_at || message.created_at;
          }
        }
      });

      // Sort by lastUpdated descending
      return Array.from(sessionsMap.values()).sort((a, b) =>
        new Date(b.lastUpdated) - new Date(a.lastUpdated)
      );
    } catch (error) {
      console.error('Error getting user sessions:', error);
      throw error;
    }
  },

  // Delete a session and all its messages
  async deleteSession(sessionId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }
};