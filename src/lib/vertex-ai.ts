import { VertexAI } from '@google-cloud/vertexai';

/**
 * Reusable function to generate AI response using Google Cloud Vertex AI.
 */
export async function generateAIResponseStream(
  message: string,
  userProfile: { age: number; state: string; registrationStatus: string },
  history: { role: string; parts: { text: string }[] }[]
): Promise<ReadableStream> {
  const project = process.env.GOOGLE_CLOUD_PROJECT || 'electra-254006836219';
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  
  const vertexAi = new VertexAI({ project, location });

  try {
    const model = vertexAi.getGenerativeModel({
      model: 'gemini-1.5-flash', 
      systemInstruction: "You are an Election Guide AI for India. Explain processes step-by-step in simple language. Ask follow-up questions if needed. Use Hinglish (Hindi + English mix). Avoid political bias."
    });

    const sanitizedHistory = history.map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: m.parts.map(p => ({ text: p.text }))
    }));

    const firstUserIndex = sanitizedHistory.findIndex(m => m.role === 'user');
    const validHistory = firstUserIndex !== -1 ? sanitizedHistory.slice(firstUserIndex) : [];

    const chat = model.startChat({
      history: validHistory,
    });

    const profileContext = `[User Context: Age: ${userProfile.age}, State: ${userProfile.state}, Voter Registration: ${userProfile.registrationStatus}]`;
    const fullPrompt = `${profileContext}\n\nUser Query: ${message}`;

    const result = await chat.sendMessageStream(fullPrompt);
    
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
        } catch (streamErr: unknown) {
          console.error('[GoogleAI] Stream error:', streamErr);
          const errorMsg = streamErr instanceof Error ? streamErr.message : 'Unknown error';
          controller.enqueue(new TextEncoder().encode(`\n\n[Error during streaming: ${errorMsg}]`));
        } finally {
          controller.close();
        }
      },
    });
  } catch (error: unknown) {
    console.error('[GoogleAI] Initialization/Start error:', error);
    // Provide a friendly fallback if API key is invalid/leaked
    const fallbackText = "Hello! My AI features are currently undergoing maintenance (API Key leaked/invalid), but I'm still here to help you navigate the Indian electoral process. Please try again later once the system administrator updates the API key!";
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(fallbackText));
        controller.close();
      }
    });
  }
}

/**
 * Simpler generation function for non-chat interactions (e.g. simulation results).
 */
export async function generateSimpleAIResponseStream(
  prompt: string,
  systemInstruction?: string
): Promise<ReadableStream> {
  const project = process.env.GOOGLE_CLOUD_PROJECT || 'electra-254006836219';
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  
  const vertexAi = new VertexAI({ project, location });

  try {
    const model = vertexAi.getGenerativeModel({
      model: 'gemini-1.5-flash', 
      systemInstruction: systemInstruction || undefined
    });

    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
        } catch (streamErr: unknown) {
          console.error('[GoogleAI] Simple Stream error:', streamErr);
          const errorMsg = streamErr instanceof Error ? streamErr.message : 'Unknown error';
          controller.enqueue(new TextEncoder().encode(`\n\n[Error during streaming: ${errorMsg}]`));
        } finally {
          controller.close();
        }
      },
    });
  } catch (error: unknown) {
    console.error('[GoogleAI] Simple Generation error:', error);
    
    // Fallback JSON if API key fails
    const mockJson = {
      scenario: { summary: "Simulated Election Outcome", context: "Generated as fallback due to AI service disruption." },
      publicReaction: { urban: "Mixed reactions", rural: "Strong support for welfare schemes", youth: "Demanding more employment opportunities", media: "Focusing on key battleground states" },
      result: { winner: "Progressive Alliance", voteShare: { "Progressive Alliance": 42, "National Democratic Front": 38, "Others": 15, "NOTA": 5 }, turnout: 68, swingFactor: "Youth Voter Turnout" },
      impact: { worked: ["Targeted digital outreach", "Grassroots mobilization"], failed: ["Over-reliance on traditional media"], missed: ["Urban swing voters"] },
      aiInsight: "In the absence of live AI generation, historical data suggests that balanced campaigns connecting with both rural welfare needs and urban aspirations tend to secure decisive mandates.",
      whatIf: ["What if you increased digital spending by 20%?", "What if voter turnout dropped by 5%?", "What if a key alliance partner withdrew?"]
    };

    return new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(JSON.stringify(mockJson)));
        controller.close();
      }
    });
  }
}
