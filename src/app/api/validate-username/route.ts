import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  console.log(request.method)
  
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = { username: searchParams.get("username") };
    const result = UsernameQuerySchema.safeParse(queryParam);
    //console.log(result);
    if (!result.success) {
      const errors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            errors?.length > 0 ? errors.join(", ") : "Invalid query parameters",
        },
        { status: 400 },
      );
    }
    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        { success: false, message: "Username already exists" },
        { status: 400 },
      );
    }
    return Response.json(
      { success: true, message: "This username is available" },
      { status: 200 },
    );

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
