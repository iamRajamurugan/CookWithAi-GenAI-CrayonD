import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChat } from '@/contexts/ChatContext';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const UserInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isProcessing } = useChat();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimeoutRef = useRef<NodeJS.Timeout>();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent duplicate submissions and empty messages
    if (!input.trim() || isProcessing || isSubmitting) return;
    
    // Clear any pending submit timeout
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }
    
    setIsSubmitting(true);
    try {
      await sendMessage(input.trim());
      setInput(''); // Clear input only after successful send
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      // Reset submission state after a slight delay
      submitTimeoutRef.current = setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is a text file
    if (file.type !== 'text/plain') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a text file containing ingredients.',
        variant: 'destructive',
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInput(prev => `${prev ? prev + '\n\n' : ''}Here are my ingredients:\n${content}`);
        
        // Adjust textarea height after content is added
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
          }
        }, 0);
      }
    };
    reader.readAsText(file);
    
    // Reset the input so the same file can be uploaded again
    e.target.value = '';
  };
  
  // Auto-resize textarea and focus management
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
      
      // If input is emptied through sending, reset height appropriately
      if (!input) {
        textarea.style.height = 'auto';
      }
    }
  }, [input]);
  
  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <form onSubmit={handleSubmit} className="px-4 py-3 md:py-4">
      <div className={cn(
        "flex items-end gap-2 bg-background rounded-xl shadow-sm transition-all duration-300",
        isFocused ? "ring-2 ring-primary/30 border-primary/50" : "border border-border",
        "hover:border-primary/30"
      )}>
        <div className="flex gap-1 pl-3 py-2">
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
              isProcessing || isSubmitting
                ? "bg-muted/40 text-muted-foreground/50 cursor-not-allowed" 
                : "bg-muted/60 hover:bg-muted group"
            )}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(
                isProcessing || isSubmitting
                  ? "text-muted-foreground/50" 
                  : "text-muted-foreground group-hover:text-foreground transition-colors"
              )}>
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </div>
            <input 
              id="file-upload" 
              type="file" 
              accept=".txt"
              className="sr-only" 
              onChange={handleFileUpload}
              disabled={isProcessing || isSubmitting}
            />
          </label>
        </div>
        
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isProcessing ? "Chef is preparing..." : "Ask about recipes, meal plans, or cooking tips..."}
            className={cn(
              "w-full resize-none border-0 bg-transparent px-4 py-3 pr-14",
              "outline-none focus:ring-0",
              "min-h-[50px] max-h-[200px] text-base",
              (isProcessing || isSubmitting) && "text-muted-foreground/70"
            )}
            rows={1}
            disabled={isProcessing || isSubmitting}
          />
          
          <AnimatePresence mode="wait">
            {(input.trim() || isProcessing) && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                key="send-button"
              >
                <Button 
                  type="submit" 
                  size="icon"
                  className={cn(
                    "absolute right-3 bottom-3 rounded-full w-10 h-10",
                    "transition-all duration-300",
                    input.trim() 
                      ? (isProcessing || isSubmitting)
                        ? "bg-muted/40 text-muted-foreground/50 cursor-not-allowed" 
                        : "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "bg-muted/70 text-muted-foreground cursor-not-allowed"
                  )}
                  disabled={!input.trim() || isProcessing || isSubmitting}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
};

export default UserInput;
