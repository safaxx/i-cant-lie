import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { apiResponse } from "@/lib/apiResponse";
import mongoose from "mongoose";

export async function GET(req: Request) {
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
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    //aggregation pipelines
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!user || user.length === 0) {
      return apiResponse({ success: false, message: "User not found" }, 404);
    }
    console.log(user);
    return apiResponse({ success: true, message: user[0].messages }, 200);
  } catch (error) {
    console.error("Error getting messages", error);
    return apiResponse(
      { success: false, message: "Error getting messages" },
      500,
    );
  }
}
