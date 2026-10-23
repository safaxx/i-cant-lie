import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { success, z } from "zod";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const user = await UserModel.findOne({username});
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const isCodeValid = user.verificationCode === code;
    const isCodeNotExpired = new Date(user.verificationCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 },
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired. Please try again.",
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code. Please try again.",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 },
    );
  }
}
