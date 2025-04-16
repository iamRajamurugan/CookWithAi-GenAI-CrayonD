
// Follow Deno deploy requirements
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

// Define Gemini API types
interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
    role: string;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
      role: string;
    };
    finishReason: string;
    index: number;
  }>;
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Get the request body
    const body = await req.json();
    const { messages, conversationId } = body;
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request format. Messages array is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format messages for Gemini
    const formattedMessages = messages.map(msg => ({
      parts: [{ text: msg.content }],
      role: msg.role === "assistant" ? "model" : "user"
    }));

    // Create Gemini API request
    const geminiRequest: GeminiRequest = {
      contents: formattedMessages
    };

    // Get API key from environment
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      console.error("GEMINI_API_KEY not found");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Gemini API
    console.log("Calling Gemini API...");
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(geminiRequest),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get response from Gemini API", details: errorText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse Gemini response
    const data: GeminiResponse = await geminiResponse.json();
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts[0].text) {
      return new Response(
        JSON.stringify({ error: "Invalid response from Gemini API" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract the response text
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Initialize Supabase client if there's a conversation to store
    if (conversationId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Store the user message and assistant response in Supabase
        const userMessage = messages[messages.length - 1];
        const assistantResponse = {
          conversation_id: conversationId,
          content: userMessage.content,
          role: "user",
        };
        
        await supabase.from("messages").insert(assistantResponse);
        
        const assistantMessage = {
          conversation_id: conversationId,
          content: responseText,
          role: "assistant",
        };
        
        await supabase.from("messages").insert(assistantMessage);
      }
    }

    return new Response(
      JSON.stringify({ 
        response: responseText,
        message: "Gemini API request successful"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
