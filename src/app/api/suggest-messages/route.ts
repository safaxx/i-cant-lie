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
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Oooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

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
