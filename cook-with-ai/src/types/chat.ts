
export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatContextType {
  messages: ChatMessage[];
  isProcessing: boolean;
  sendMessage: (message: string) => void;
  clearMessages: () => void;
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;
  currentConversationTitle: string | null;
}
