import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generateAIResponseStream } from '@/lib/vertex-ai';

const chatSchema = z.object({
  prompt: z.string().min(1),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() })),
  })),
  userProfile: z.object({
    age: z.number(),
    state: z.string(),
    registrationStatus: z.string(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = chatSchema.safeParse(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid chat payload', details: validation.error.format() }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, history, userProfile } = validation.data;

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
  } catch (error: any) {
    console.error('[Chat] Final error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to chat via Vertex AI.',
        details: error?.message || 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
