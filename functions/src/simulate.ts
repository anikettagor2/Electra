import { onRequest } from "firebase-functions/v2/https";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI SDK
// The API key should be stored in Firebase Secret Manager or Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const simulate = onRequest({ cors: true, timeoutSeconds: 300, memory: "1GiB" }, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const payload = req.body;
    
    const prompt = `
You are an Election Simulation AI. Based on the following inputs:
Country: ${payload.country}
Election Type: ${payload.electionType}
Budget: Digital ${payload.budgetSplit.digital}%, Ground ${payload.budgetSplit.ground}%, Traditional ${payload.budgetSplit.traditional}%
Key Decisions: ${payload.keyDecisions.join(", ")}

Generate a highly detailed, realistic simulation result in strict JSON format.
The JSON must follow this exact schema:
{
  "scenario": { "summary": "string", "context": "string" },
  "publicReaction": { "urban": "string", "rural": "string", "youth": "string", "media": "string" },
  "result": { "winner": "string", "voteShare": { "Party A": 40, "Party B": 30, "NOTA": 30 }, "turnout": 65, "swingFactor": "string" },
  "impact": { "worked": ["string"], "failed": ["string"], "missed": ["string"] },
  "aiInsight": "string",
  "whatIf": ["string", "string", "string"]
}
Only output the JSON object, nothing else.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // We use generateContentStream to stream the response
    const resultStream = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of resultStream.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }
    
    res.end();
  } catch (error) {
    console.error("Simulation error:", error);
    res.status(500).send({ error: "Failed to simulate election." });
  }
});
