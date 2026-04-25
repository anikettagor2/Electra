import { NextRequest } from 'next/server';
import { generateSimpleAIResponseStream } from '@/lib/vertex-ai';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const systemInstruction = "You are an expert Election Simulation AI specializing in the Indian electoral process under the Election Commission of India (ECI). Generate highly detailed, realistic simulation results that respect the Model Code of Conduct (MCC). Analyze the impact of VVPAT verification and EVM security on public trust. Output must be in strict JSON format.";

    const prompt = `
Based on the following inputs:
Country: ${payload.country}
Election Type: ${payload.electionType}
Budget: Digital ${payload.budgetSplit.digital}%, Ground ${payload.budgetSplit.ground}%, Traditional ${payload.budgetSplit.traditional}%
Key Decisions: ${payload.keyDecisions?.join(', ') || 'None'}

The JSON must follow this exact schema:
{
  "scenario": { "summary": "string", "context": "string" },
  "publicReaction": { "urban": "string", "rural": "string", "youth": "string", "media": "string" },
  "result": { "winner": "string", "voteShare": { "Party A": 40, "Party B": 30, "NOTA": 30 }, "turnout": 65, "swingFactor": "string" },
  "impact": { "worked": ["string"], "failed": ["string"], "missed": ["string"] },
  "aiInsight": "string",
  "whatIf": ["string", "string", "string"]
}
Only output the JSON object, nothing else. Do not include markdown code blocks.`;

    const stream = await generateSimpleAIResponseStream(prompt, systemInstruction);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    console.error('[Electra] Final Simulation error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to run simulation via Vertex AI.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
