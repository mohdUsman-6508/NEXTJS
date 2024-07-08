import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";

// TODO: VERIFY OTP SCHEMA

export async function POST(request: Request) {
  dbConnect();
  try {
    const { username, verifyCode } = await request.json();
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User does not exist",
        },
        {
          status: 400,
        }
      );
    }

    const isVerified = user.verifyCode == verifyCode;
    const isNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isVerified && isNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User verified Successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isNotExpired) {
      return Response.json(
        {
          success: false,
          message: "OTP expired, please signup again",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in verifying:", error);
    return Response.json(
      {
        success: false,
        message: "Error Verifying OTP",
      },
      {
        status: 400,
      }
    );
  }
}
