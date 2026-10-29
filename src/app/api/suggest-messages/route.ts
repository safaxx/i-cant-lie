import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST() {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      { error: "GOOGLE_GENERATIVE_AI_API_KEY is not configured." },
      { status: 500 },
    );
  }

  try {
    const prompt =
      "Write exactly three short, natural message suggestions for an anonymous social messaging app. Mix the styles: include a kind or specific compliment, a lighthearted personal confession or secret (such as admitting a past crush), and an engaging question. Suggestions should sound like something a real person would send, can begin with 'icl', and should not all be questions. Keep them warm, positive, respectful, and suitable for a broad audience; avoid pressure, cruelty, sexual content, and sensitive personal topics. Return only the three suggestions as a single string separated by '||', with no numbering, labels, or extra explanation. Example format: 'icl, your paintings always make my day||icl, I had a little crush on you back in school||What is something you wish more people knew about you?'.";

    const result = streamText({
      model: google("gemini-3.5-flash-lite"),
      maxOutputTokens: 500,
      prompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error generating message suggestions:", error);
    return Response.json(
      { error: "Failed to generate message suggestions." },
      { status: 500 },
    );
  }
}
