
import React, { useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import ChatMessage from './ChatMessage';
import UserInput from './UserInput';
import { ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const ChatInterface: React.FC = () => {
  const { messages, isProcessing, currentConversationTitle } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { preferences } = useUserPreferences();
  
  // Enhanced auto-scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end' 
        });
      }
    };
    
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isProcessing]);

  // Get font size class based on preference
  const getFontSizeClass = () => {
    switch(preferences.fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };
  
  return (
    <div className="flex flex-col h-full relative bg-background">
      {/* Chat header showing current conversation title */}
      {currentConversationTitle && (
        <div className="border-b border-border py-3 px-4 bg-muted/20">
          <h2 className="text-lg font-medium truncate">{currentConversationTitle}</h2>
        </div>
      )}
      
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12 px-6 bg-accent/10 rounded-2xl border border-accent/20"
            >
              <ChefHat size={56} className="mx-auto text-primary mb-6 opacity-90 float-animation" />
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                Welcome to your Recipe Assistant
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                Ask about recipes, meal plans, or cooking tips. I'm here to help!
              </p>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <ChatMessage 
                    message={message} 
                    showTimestamp={preferences.showTimestamps}
                    enableMarkdown={preferences.enableMarkdown}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="border-t border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto w-full">
          <UserInput />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
