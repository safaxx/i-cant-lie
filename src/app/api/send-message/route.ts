import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import MessageModel, { Message } from "@/model/Message";
import { apiResponse } from "@/lib/apiResponse";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
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
