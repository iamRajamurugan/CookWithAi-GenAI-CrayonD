
import React from 'react';
import { Loader2, User as UserIcon, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: ChatMessageType;
  showTimestamp?: boolean;
  enableMarkdown?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  showTimestamp = true, 
  enableMarkdown = true 
}) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      className={cn(
        "flex w-full mb-4 items-start",
        isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={cn(
          "relative flex items-start max-w-[85%] md:max-w-[75%] group",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1",
            isUser ? "ml-2 bg-primary text-primary-foreground" : "mr-2 bg-muted"
          )}
        >
          {isUser ? <UserIcon size={16} /> : <Bot size={16} />}
        </div>
        
        <div
          className={cn(
            "px-4 py-2.5 rounded-xl shadow-sm",
            isUser 
              ? "bg-primary text-primary-foreground rounded-tr-none" 
              : "bg-accent/50 text-foreground rounded-tl-none",
            message.isLoading && "animate-pulse"
          )}
        >
          {message.isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin opacity-70" />
              <span className="text-sm opacity-70">AI is thinking...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Message content with optional Markdown */}
              <div className="leading-relaxed break-words">
                {enableMarkdown ? (
                  <ReactMarkdown className="prose dark:prose-invert prose-sm max-w-none">
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
              
              {/* Timestamp - conditionally rendered based on preference */}
              {showTimestamp && message.timestamp && (
                <div className="text-[11px] opacity-60 pt-1">
                  {format(new Date(message.timestamp), 'h:mm a, MMM d')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
