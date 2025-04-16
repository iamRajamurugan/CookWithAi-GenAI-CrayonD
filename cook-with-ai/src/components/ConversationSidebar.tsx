
import React, { useState, useEffect } from 'react';
import { ChefHat, Plus, MessageSquare, X, MoreVertical, Trash2, Edit, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useChat } from '@/contexts/ChatContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

interface ConversationSidebarProps {
  onClose?: () => void;
  onNewChat?: () => void;
}

interface Conversation {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({ 
  onClose,
  onNewChat
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { user } = useAuth();
  const { currentConversationId, setCurrentConversationId, clearMessages } = useChat();
  const { toast } = useToast();

  // Fetch conversations when the component loads or when user changes
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Failed to load conversations",
        description: "There was an error loading your chat history.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationClick = async (id: string) => {
    try {
      setCurrentConversationId(id);
      // Close sidebar on mobile when selecting a conversation
      if (onClose) onClose();
    } catch (error) {
      console.error('Error selecting conversation:', error);
      toast({
        title: "Failed to load chat",
        description: "There was an error loading this conversation.",
        variant: "destructive",
      });
    }
  };

  const handleStartNewChat = () => {
    clearMessages();
    if (onNewChat) {
      onNewChat();
      if (onClose) onClose();
    }
    
    // Refetch conversations after starting a new chat
    setTimeout(() => {
      fetchConversations();
    }, 500);
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from UI
      setConversations(conversations.filter(conv => conv.id !== id));
      
      // If the current conversation was deleted, start a new one
      if (id === currentConversationId) {
        clearMessages();
        onNewChat?.();
      }

      toast({
        title: "Chat deleted",
        description: "The conversation has been removed.",
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting this conversation.",
        variant: "destructive",
      });
    }
  };

  const startEditingTitle = (id: string, currentTitle: string | null, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle || 'Untitled chat');
  };

  const saveTitle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ title: editTitle.trim() || 'Untitled chat' })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setConversations(conversations.map(conv => 
        conv.id === id ? {...conv, title: editTitle.trim() || 'Untitled chat'} : conv
      ));
      
      setEditingId(null);
    } catch (error) {
      console.error('Error updating title:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating the title.",
        variant: "destructive",
      });
    }
  };

  // Format conversation title or use default
  const formatTitle = (conversation: Conversation) => {
    if (conversation.title) return conversation.title;
    
    // Format date
    const date = new Date(conversation.created_at);
    return `Chat on ${date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })}`;
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Chat History</h2>
        </div>
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {/* New Chat Button */}
      <div className="p-3 border-b border-border/50">
        <Button 
          onClick={handleStartNewChat} 
          className="w-full gap-2 bg-primary/90 hover:bg-primary text-primary-foreground"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Chat</span>
        </Button>
      </div>
      
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          // Loading skeletons
          <div className="p-3 space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 flex-1" />
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          // Empty state
          <div className="p-6 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No conversation history yet.</p>
            <p className="text-sm mt-1">Start a new chat to begin!</p>
          </div>
        ) : (
          // Conversations list
          <div className="p-2 space-y-1">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg cursor-pointer",
                  "transition-colors duration-200 group relative",
                  currentConversationId === conversation.id 
                    ? "bg-accent text-accent-foreground" 
                    : "hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  
                  {/* Editable title */}
                  {editingId === conversation.id ? (
                    <div className="flex items-center flex-1" onClick={e => e.stopPropagation()}>
                      <Input
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="h-7 text-sm py-1"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveTitle(conversation.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 ml-1"
                        onClick={() => saveTitle(conversation.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm truncate">
                      {formatTitle(conversation)}
                    </span>
                  )}
                </div>
                
                {/* Actions menu (only if not editing) */}
                {editingId !== conversation.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        onClick={e => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem 
                        onClick={(e) => startEditingTitle(conversation.id, conversation.title, e)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300"
                        onClick={(e) => handleDeleteConversation(conversation.id, e)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer with user info */}
      <div className="mt-auto p-3 border-t border-border text-xs text-muted-foreground bg-muted/30">
        <p className="truncate flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {user?.email || 'User'}
        </p>
      </div>
    </div>
  );
};

export default ConversationSidebar;
