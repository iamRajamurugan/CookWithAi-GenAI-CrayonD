
import { useState } from 'react';
import { useToast } from './use-toast';
import { useChatAPI } from './use-chat-api';
import { useMealPlanning } from './use-meal-planning';
import { ChatMessage } from '@/types/chat';
import { saveMessage, updateConversationTimestamp, updateConversationTitle, createConversation } from '@/services/conversationService';
import { createUserMessage, createAssistantMessage, extractDateFromMessage } from '@/utils/messageUtils';
import { v4 as uuidv4 } from 'uuid';

interface UseMessageHandlerProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;
  currentConversationTitle: string | null;
  setCurrentConversationTitle: (title: string | null) => void;
  userId: string | null;
}

export const useMessageHandler = ({
  messages,
  setMessages,
  currentConversationId,
  setCurrentConversationId,
  currentConversationTitle,
  setCurrentConversationTitle,
  userId
}: UseMessageHandlerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { getAIResponse } = useChatAPI();
  const { planMeal } = useMealPlanning();

  const handleMealPlanning = async (content: string, aiResponse: string) => {
    if (content.toLowerCase().includes('plan') && aiResponse.includes('recipe')) {
      const date = extractDateFromMessage(content);
      
      if (date) {
        const recipeMatch = aiResponse.match(/recipe for ([^.:\n]+)/i);
        if (recipeMatch) {
          const recipeName = recipeMatch[1].trim();
          await planMeal(recipeName, date);
        }
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: uuidv4(),
            role: 'assistant' as const,
            content: "I notice you want to plan a meal, but I couldn't detect a specific date. Please specify when you'd like to plan this meal (e.g., 'Plan this for April 20th').",
            timestamp: new Date()
          }
        ]);
      }
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !userId) return;

    const userMessage = createUserMessage(content);
    const loadingMessage = createAssistantMessage();

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsProcessing(true);

    try {
      let conversationId = currentConversationId;
      
      if (!conversationId || conversationId === 'welcome') {
        const title = content;
        const newConversationId = await createConversation(userId, title);
        
        if (newConversationId) {
          conversationId = newConversationId;
          setCurrentConversationId(conversationId);
          setCurrentConversationTitle(title);
        }
      }

      if (!conversationId) {
        throw new Error("Couldn't create or retrieve conversation ID");
      }
      
      await updateConversationTimestamp(conversationId);
      await saveMessage(userMessage.id, conversationId, 'user', content);

      const messageHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const aiResponse = await getAIResponse(messageHistory, conversationId);
      
      if (!aiResponse) {
        throw new Error("Failed to get AI response");
      }

      await saveMessage(loadingMessage.id, conversationId, 'assistant', aiResponse);

      if (!currentConversationTitle) {
        const title = content;
        await updateConversationTitle(conversationId, title);
        setCurrentConversationTitle(title);
      }

      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, content: aiResponse, isLoading: false }
            : msg
        )
      );

      await handleMealPlanning(content, aiResponse);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    sendMessage
  };
};
