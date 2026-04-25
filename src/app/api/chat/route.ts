import { NextRequest } from 'next/server';
import { generateAIResponseStream } from '@/lib/vertex-ai';

export async function POST(req: NextRequest) {
  try {
    const { prompt, history, userProfile } = await req.json();

    // Default profile if not provided
    const profile = userProfile || {
      age: 25,
      state: 'Unknown',
      registrationStatus: 'Unknown'
    };

    const stream = await generateAIResponseStream(prompt, profile, history);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    console.error('[Chat] Final error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to chat via Vertex AI.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
