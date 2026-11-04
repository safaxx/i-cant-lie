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
      "Write exactly three short, funny, natural message suggestions for an anonymous social messaging app. Make exactly one suggestion casual spoken Hinglish in Roman script (a natural mix of English, Hindi, and Urdu), and write the other two in natural English. Include one playful, harmless roast or teasing observation in Hinglish, like 'icl, aapki chai peene layak nahi thi bilkul'; one funny personal confession in English; and one engaging question in English. Keep the teasing light, never genuinely mean or hurtful. Keep all suggestions respectful and suitable for a broad audience; avoid bullying, appearance or identity-based insults, sexual content, and sensitive personal topics. Return only the three suggestions as a single string separated by '||', with no numbering, labels, or extra explanation. Example format: 'icl, aapki chai peene layak nahi thi bilkul||icl, I had a huge crush on you back in school||What is your pet peeve?'.";

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
