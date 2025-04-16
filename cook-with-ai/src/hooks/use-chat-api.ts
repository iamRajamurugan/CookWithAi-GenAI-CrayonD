
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";
import { useToast } from "./use-toast";

export function useChatAPI() {
  const { toast } = useToast();

  /**
   * Call the Gemini API to get a response
   */
  const getAIResponse = async (
    messageHistory: { role: string; content: string }[],
    conversationId: string
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-gemini', {
        body: { 
          messages: messageHistory,
          conversationId
        }
      });

      if (error) {
        throw new Error(`Error calling chat function: ${error.message}`);
      }

      return data.response;
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return { getAIResponse };
}
