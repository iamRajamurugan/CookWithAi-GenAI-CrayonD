
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

export const createUserMessage = (content: string): ChatMessage => ({
  id: uuidv4(),
  role: 'user',
  content,
  timestamp: new Date(),
});

export const createAssistantMessage = (content: string = '', isLoading: boolean = true): ChatMessage => ({
  id: uuidv4(),
  role: 'assistant',
  content,
  timestamp: new Date(),
  isLoading,
});

export const createWelcomeMessage = (): ChatMessage => ({
  id: 'welcome',
  role: 'assistant',
  content: "Hi there! I'm your Recipe & Meal Planning Assistant. How can I help you today? You can ask for recipes, meal plans, or cooking tips!",
  timestamp: new Date(),
});

export const extractDateFromMessage = (content: string): Date | null => {
  const datePattern = /(?:for|on)\s+([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)/i;
  const match = content.match(datePattern);
  
  if (match) {
    const dateStr = match[1];
    const parsedDate = new Date(dateStr);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
  
  return null;
};
