import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, MessageRole } from "@/types/chat";
import { v4 as uuidv4 } from 'uuid';

// Load messages for a specific conversation
export const loadConversation = async (conversationId: string) => {
  try {
    // Load messages for this conversation
    const { data: messageData, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      return null;
    }
    
    if (messageData && messageData.length > 0) {
      // Format messages from database
      return messageData.map(msg => ({
        id: msg.id,
        role: msg.role as MessageRole,
        content: msg.content,
        timestamp: new Date(msg.created_at),
      }));
    }
    
    return null;
  } catch (error) {
    console.error("Error loading conversation:", error);
    return null;
  }
};

// Load existing conversation or create a new one
export const loadOrCreateConversation = async (userId: string) => {
  try {
    if (!userId) return { conversationId: null, title: null };
    
    // Try to get the most recent conversation
    const { data: existingConversations, error: fetchError } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1);
    
    if (fetchError) {
      console.error("Error fetching conversations:", fetchError);
      return { conversationId: null, title: null };
    }
    
    // If no conversation exists or if we want to always create a new one
    if (!existingConversations || existingConversations.length === 0) {
      const currentDate = new Date();
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }).format(currentDate);
      
      const defaultTitle = `Chat on ${formattedDate}`;
      const newConversationId = await createConversation(userId, defaultTitle);
      return { 
        conversationId: newConversationId, 
        title: defaultTitle 
      };
    } else {
      // Use the most recent conversation
      return { 
        conversationId: existingConversations[0].id,
        title: existingConversations[0].title
      };
    }
  } catch (error) {
    console.error("Error in loadOrCreateConversation:", error);
    return { conversationId: null, title: null };
  }
};

// Create a new conversation in Supabase
export const createConversation = async (userId: string, title?: string) => {
  try {
    if (!userId) {
      console.log("User not authenticated, skipping conversation creation");
      return null;
    }
    
    // Create default title if none provided
    const conversationTitle = title || (() => {
      const currentDate = new Date();
      return `Chat on ${new Intl.DateTimeFormat('en-US', {
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }).format(currentDate)}`;
    })();
    
    const { data, error } = await supabase
      .from('conversations')
      .insert({ 
        user_id: userId,
        title: conversationTitle
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating conversation:", error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error("Error in createConversation:", error);
    return null;
  }
};

// Save a message to the database
export const saveMessage = async (
  messageId: string,
  conversationId: string,
  role: MessageRole,
  content: string
) => {
  try {
    const { error } = await supabase.from('messages').insert({
      id: messageId,
      conversation_id: conversationId,
      role,
      content
    });

    if (error) {
      console.error("Error saving message:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in saveMessage:", error);
    return false;
  }
};

// Update conversation's timestamp
export const updateConversationTimestamp = async (conversationId: string) => {
  try {
    const { error } = await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    if (error) {
      console.error("Error updating conversation timestamp:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateConversationTimestamp:", error);
    return false;
  }
};

// Update conversation title
export const updateConversationTitle = async (conversationId: string, title: string) => {
  try {
    const { error } = await supabase
      .from('conversations')
      .update({ title })
      .eq('id', conversationId);

    if (error) {
      console.error("Error updating conversation title:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateConversationTitle:", error);
    return false;
  }
};

// Helper function to generate a title from the first user message
export const generateConversationTitle = (message: string): string => {
  const currentDate = new Date();
  const dateStr = new Intl.DateTimeFormat('en-US', {
    month: 'short', 
    day: 'numeric'
  }).format(currentDate);
  
  // Try to extract a meaningful title from the message
  let titleFromMessage = "";
  
  // If message contains a question, use that
  if (message.includes("?")) {
    const questionParts = message.split("?")[0].split(" ");
    if (questionParts.length > 3) {
      titleFromMessage = questionParts.slice(0, Math.min(5, questionParts.length)).join(" ") + "?";
    } else if (message.length < 40) {
      titleFromMessage = message;
    }
  } 
  // Otherwise use first few words if not too long
  else if (message.length < 60) {
    titleFromMessage = message;
  } 
  // If message is long, take first few words
  else {
    const words = message.split(" ");
    titleFromMessage = words.slice(0, Math.min(5, words.length)).join(" ") + "...";
  }
  
  // Limit length and trim
  titleFromMessage = titleFromMessage.trim().substring(0, 40);
  if (titleFromMessage.length === 40) {
    titleFromMessage += '...';
  }
  
  // If we have a meaningful title, use it, otherwise use date
  return titleFromMessage || `Chat on ${dateStr}`;
};
