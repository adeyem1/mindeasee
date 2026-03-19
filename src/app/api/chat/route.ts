import { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini (Google GenAI) client using server-side API key.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY_ALT;
if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY / GOOGLE_API_KEY is not set. The /api/chat endpoint will return 500 until it is configured.');
}
const client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Ensure we run on the Node.js runtime for stable streaming behavior
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Server misconfiguration: GEMINI_API_KEY / GOOGLE_API_KEY is not set.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { messages } = body as { messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> };

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid request. Messages array is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemMessage =
      'You are a supportive and empathetic mental health assistant. Provide thoughtful and non-judgmental responses to help users with their mental health concerns. If a user mentions a crisis, encourage them to seek immediate professional help and provide resources if possible.';

    // Choose Gemini model (configurable)
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash-001';

    // Create a ReadableStream to forward Gemini streaming chunks as Server-Sent Events (SSE)
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          // Build a single prompt string combining system and conversation messages
          const prompt = [systemMessage, ...messages.map((m) => `${m.role}: ${m.content}`)].join('\n\n');

          // Start streaming from Gemini
          const responseStream = await client.models.generateContentStream({
            model,
            contents: prompt,
            // small temperature for helpfulness
            config: { temperature: 0.7 },
          });

          for await (const chunk of responseStream as AsyncIterable<any>) {
            const text = typeof chunk?.text === 'string' ? chunk.text : chunk?.delta?.text || '';
            if (text) {
              const payload = `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`;
              controller.enqueue(encoder.encode(payload));
            }
          }

          // Signal stream completion
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown streaming error from Gemini';
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`));
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          } finally {
            controller.close();
          }
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
