import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { apiResponse } from "@/lib/apiResponse";

export async function POST(request: Request) {
  await dbConnect();

  //to get currently logged in user thru session
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
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true },
    );
    if (!updatedUser) {
      return apiResponse(
        {
          success: false,
          message: "Error updating user status",
        },
        400,
      );
    }

    return apiResponse(
      {
        success: true,
        message: "User status updated successfully",
        user: updatedUser,
      },
      200,
    );
  } catch (error) {
    console.error("failed to update user status to accept messages");
    return apiResponse(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      500,
    );
  }
}

export async function GET(request: Request) {
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
  const userId = user._id;
  try {
    const dbUser = await UserModel.findById(userId);

    if (!dbUser) {
      return apiResponse({ success: false, message: "User not found" }, 404);
    }
    return apiResponse(
      {
        success: true,
        message: "",
        isAcceptingMessages: dbUser.isAcceptingMessages,
      },
      200,
    );
  } catch (error) {
     console.error("failed to get accept messages status");
    return apiResponse(
      {
        success: false,
        message: "failed to get accept messages status",
      },
      500,
    );
  }
}
