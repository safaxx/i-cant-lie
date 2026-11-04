import VerificationEmail from "@/emails/verification";
import ApiResponse from "@/types/ApiResponse";
import nodemailer from "nodemailer";
import { render } from "react-email";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string,
): Promise<ApiResponse> {
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
      throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be configured.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword.replace(/\s/g, ""),
      },
    });

    await transporter.sendMail({
      from: `icl <${gmailUser}>`,
      to: email,
      subject: "icl | Verify your email",
      html: await render(VerificationEmail({ username, otp })),
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email", error);
    return { success: false, message: "Failed to send verification email" };
  }
}

/*
import { resend } from "@/lib/resend";

export async function sendVerificationEmailWithResend(
  email: string,
  username: string,
  otp: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "for real | Verify Your Email",
      react: VerificationEmail({ username, otp }),
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
*/
