// Message types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface MessageWithMetadata {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatResponse {
  message: MessageWithMetadata;
  suggestions?: string[];
  crisis?: boolean;
}

/**
 * Sends a chat message with streaming support
 */
export const sendChatMessageStream = async (
  messages: MessageWithMetadata[],
  onDelta: (text: string) => void,
  onDone: () => void,
  onError?: (error: string) => void
): Promise<void> => {
  try {
    const apiMessages: ChatMessage[] = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await fetch('/api/chat', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: apiMessages }),
    });

    if (!response.ok) {
      console.error("Response not OK:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      const errorData = await response.json().catch(() => ({ error: 'Connection error' }));
      console.error("Error response body:", errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6);

        if (data === '[DONE]') {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(data);
          // If server sent an error event in-stream, surface it to UI
          if (parsed && typeof parsed === 'object' && parsed.error) {
            if (onError) {
              onError(String(parsed.error));
            } else {
              onDelta(`\n\n_Error: ${String(parsed.error)}_`);
            }
            onDone();
            return;
          }

          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            onDelta(content);
          }
        } catch (e) {
          console.error('Error parsing SSE data:', e);
        }
      }
    }

    onDone();
  } catch (error) {
    console.error('Error in streaming chat:', error);
    const errorMessage = error instanceof Error ? error.message : "Connection error. Please try again.";

    // Enhanced logging for debugging
    if (error instanceof TypeError) {
      console.error("Network or CORS error:", error.message);
    } else if (error instanceof SyntaxError) {
      console.error("Response parsing error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }

    if (onError) {
      onError(errorMessage);
    } else {
      onDelta(`\n\n_I'm having trouble connecting right now. ${errorMessage}_`);
      onDone();
    }
  }
};

/**
 * Function to be used in server components for direct OpenAI API calls
 * This is a placeholder for future implementation when needed
 */
export const directAICall = async () => {
  // This would be implemented for server components or API routes
  // that need to make direct calls to the OpenAI API
  return {
    content: "This is a placeholder response. Server-side AI functionality needs implementation."
  };
};
