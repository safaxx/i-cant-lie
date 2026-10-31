import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../../auth/[...nextauth]/options";
import { apiResponse } from "@/lib/apiResponse";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ messageid: string }> },
) {
  const { messageid: messageId } = await params;
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return apiResponse(
      {
        success: false,
        message: "Not Authenticated",
      },
      401,
    );
  }
  const user = session.user;
  if (!session?.user?._id) {
    return apiResponse({ success: false, message: "Not Authenticated" }, 401);
  }
  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } },
    );
    if (updatedResult.modifiedCount == 0) {
      return apiResponse(
        { success: false, message: "Message not found or already deleted" },
        401,
      );
    }
    return apiResponse(
      { success: true, message: "Message deleted successfully!" },
      200,
    );
  } catch (error) {
    console.error("Error deleting message", error);
    return apiResponse(
      { success: false, message: "Error deleting message" },
      500,
    );
  }
}
