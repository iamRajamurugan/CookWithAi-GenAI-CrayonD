
import React, { createContext, useContext, ReactNode } from 'react';
import { ChatContextType, ChatMessage, MessageRole } from '@/types/chat';
import { useAuth } from './AuthContext';
import { useConversationManager } from '@/hooks/use-conversation-manager';
import { useMessageHandler } from '@/hooks/use-message-handler';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { user } = useAuth();
  const {
    messages,
    setMessages,
    currentConversationId,
    setCurrentConversationId,
    currentConversationTitle,
    setCurrentConversationTitle,
    clearMessages
  } = useConversationManager();

  const { isProcessing, sendMessage } = useMessageHandler({
    messages,
    setMessages,
    currentConversationId,
    setCurrentConversationId,
    currentConversationTitle,
    setCurrentConversationTitle,
    userId: user?.id || null
  });

  return (
    <ChatContext.Provider value={{ 
      messages, 
      isProcessing, 
      sendMessage, 
      clearMessages,
      currentConversationId,
      setCurrentConversationId,
      currentConversationTitle
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
