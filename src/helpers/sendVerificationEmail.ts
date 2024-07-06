// here in helpers we will create helpers to make our code clean

import resend from "@/lib/resend";
import shadowTalkVerifyEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Shadow Talk <onboarding@resend.dev>",
      to: email,
      subject: "Shadow Talk | Verification code",
      react: shadowTalkVerifyEmail({ verifyCode }),
    });

    return { success: true, message: "Verification email send successfully" };
  } catch (error) {
    console.error("Failed to send verification email", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
