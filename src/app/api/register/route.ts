import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUsername) {
      return Response.json(
        { success: false, message: "Username already exists" },
        { status: 400 },
      );
    }

    const existingUserEmail = await UserModel.findOne({
      email,
    });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserEmail) {
      if (existingUserEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 },
        );
      } else {
        const hashedPswrd = await bcrypt.hash(password, 10);
        existingUserEmail.password = hashedPswrd;
        existingUserEmail.verificationCode = otp;
        existingUserEmail.verificationCodeExpiry = new Date(Date.now()+3600000);
        await existingUserEmail.save();
      }
    } else {
      const hashedPswrd = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPswrd,
        verificationCode: otp,
        verificationCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    const emailResponse = await sendVerificationEmail(email, username, otp);
    console.log(emailResponse);
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "Registered successfully! Please verify your email.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      { success: false, message: "Failed to register user" },
      { status: 500 },
    );
  }
}
