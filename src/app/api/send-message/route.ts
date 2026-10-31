import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/Message";
import { apiResponse } from "@/lib/apiResponse";
import { messageSchema } from "@/schemas/messageSchema";
import { usernameValidation } from "@/schemas/signupSchema";
import z from "zod";

const SendMessageRequestSchema = z.object({
  username: usernameValidation,
  content: messageSchema.shape.content.trim(),
});

export async function GET(request: Request) {
  const usernameResult = usernameValidation.safeParse(
    new URL(request.url).searchParams.get("username"),
  );

  if (!usernameResult.success) {
    return apiResponse(
      { success: false, message: "Invalid username." },
      400,
    );
  }

  try {
    await dbConnect();
    const user = await UserModel.findOne({
      username: usernameResult.data,
      isVerified: true,
    }).select("username isAcceptingMessages");

    if (!user) {
      return apiResponse({ success: false, message: "Profile not found." }, 404);
    }

    return apiResponse(
      {
        success: true,
        message: "Profile loaded.",
        username: user.username,
        isAcceptingMessages: user.isAcceptingMessages,
      },
      200,
    );
  } catch (error) {
    console.error("Error loading public profile", error);
    return apiResponse(
      { success: false, message: "Unable to load this profile." },
      500,
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiResponse({ success: false, message: "Invalid request body." }, 400);
  }

  const parsedBody = SendMessageRequestSchema.safeParse(body);
  if (!parsedBody.success) {
    return apiResponse(
      {
        success: false,
        message:
          parsedBody.error.issues[0]?.message ?? "Invalid message details.",
      },
      400,
    );
  }

  try {
    await dbConnect();
    const { username, content } = parsedBody.data;
    const user = await UserModel.findOne({ username, isVerified: true });
    if (!user) {
      return apiResponse({ success: false, message: "User not found" }, 404);
    }
    if (!user.isAcceptingMessages) {
      return apiResponse(
        { success: false, message: "User is not accepting messages" },
        403,
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return apiResponse(
      { success: true, message: "Message sent successfully" },
      200,
    );
  } catch (error) {
    console.error("Error sending message", error);
    return apiResponse(
      { success: false, message: "Error sending messages" },
      500,
    );
  }
}
