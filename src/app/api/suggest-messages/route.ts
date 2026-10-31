import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const suggestionsSchema = z.array(z.string().trim().min(1)).length(3);

export async function POST() {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      {
        success: false,
        message: "Message suggestions are temporarily unavailable.",
      },
      { status: 500 },
    );
  }

  try {
    const prompt =
      "Write exactly three short, natural message suggestions for an anonymous social messaging app. Include a kind or specific compliment, a lighthearted personal confession or secret (such as admitting a past crush), and an engaging question. Suggestions should sound like something a real person would send and can begin with 'icl'. Keep them warm, positive, respectful, and suitable for a broad audience; avoid pressure, cruelty, sexual content, and sensitive personal topics. Return only the three suggestions as a single string separated by '||', with no numbering, labels, or extra explanation. Example format: 'icl, your paintings always make my day||icl, I had a little crush on you back in school||What is something you wish more people knew about you?'.";

    const { text } = await generateText({
      model: google("gemini-3.5-flash-lite"),
      maxOutputTokens: 200,
      prompt,
    });

    const suggestionsResult = suggestionsSchema.safeParse(
      text
        .split("||")
        .map((suggestion) => suggestion.replace(/^[\s"'`]+|[\s"'`]+$/g, "")),
    );

    if (!suggestionsResult.success) {
      console.error("AI returned an invalid message-suggestion format.");
      return Response.json(
        {
          success: false,
          message: "Couldn’t prepare suggestions. Please try again.",
        },
        { status: 502 },
      );
    }

    return Response.json({
      success: true,
      message: "Suggestions generated successfully.",
      suggestions: suggestionsResult.data,
    });
  } catch (error) {
    console.error("Error generating message suggestions:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to generate suggestions. Please try again.",
      },
      { status: 500 },
    );
  }
}
