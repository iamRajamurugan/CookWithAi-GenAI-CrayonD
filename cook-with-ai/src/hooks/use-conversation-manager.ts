
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { 
  loadConversation, 
  loadOrCreateConversation,
  createConversation,
  updateConversationTitle,
  generateConversationTitle
} from '@/services/conversationService';
import { ChatMessage } from '@/types/chat';
import { createWelcomeMessage } from '@/utils/messageUtils';

export const useConversationManager = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentConversationTitle, setCurrentConversationTitle] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const hasInitializedRef = useRef<boolean>(false);

  const setWelcomeMessage = () => {
    setMessages([createWelcomeMessage()]);
  };

  const fetchAndSetConversation = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('title')
        .eq('id', conversationId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setCurrentConversationTitle(data.title);
      }
      
      const loadedMessages = await loadConversation(conversationId);
      
      if (loadedMessages && loadedMessages.length > 0) {
        setMessages(loadedMessages);
      } else {
        setWelcomeMessage();
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation. Please try again.",
        variant: "destructive",
      });
      setWelcomeMessage();
    }
  };

  const initializeConversation = async () => {
    if (!user) return;
    
    try {
      const { conversationId, title } = await loadOrCreateConversation(user.id);
      if (conversationId) {
        setCurrentConversationId(conversationId);
        setCurrentConversationTitle(title);
      }
    } catch (error) {
      console.error("Error initializing conversation:", error);
      setWelcomeMessage();
    }
  };

  const clearMessages = async () => {
    setMessages([]);
    setCurrentConversationId(null);
    setCurrentConversationTitle(null);
    
    if (user) {
      const defaultTitle = "New Conversation";
      const newConversationId = await createConversation(user.id, defaultTitle);
      if (newConversationId) {
        setCurrentConversationId(newConversationId);
        setCurrentConversationTitle(defaultTitle);
      }
    } else {
      setWelcomeMessage();
    }
  };

  // Initialize conversation only once when user is loaded
  useEffect(() => {
    if (user && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      initializeConversation();
    } else if (!user) {
      hasInitializedRef.current = false;
      setWelcomeMessage();
    }
  }, [user]);

  // Fetch conversation when ID changes
  useEffect(() => {
    if (currentConversationId && user) {
      fetchAndSetConversation(currentConversationId);
    }
  }, [currentConversationId]);

  return {
    messages,
    setMessages,
    currentConversationId,
    setCurrentConversationId,
    currentConversationTitle,
    setCurrentConversationTitle,
    clearMessages,
    initializeConversation,
    updateConversationTitle,
    generateConversationTitle
  };
};
