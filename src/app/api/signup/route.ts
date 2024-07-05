// this is the way to make routes in nextjs /app/api/routedir/routename

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      // here both field will do and operation kinda
      username,
      isVerified: true,
    });

    const verifyCode = Math.floor(1000000 + Math.random() * 900000).toString();
    console.log(verifyCode);

    //user exist and verified
    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email already exist",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 10000);

        await existingUserByEmail.save();
      }
    } else {
      // new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + 10);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    //send verification email
    const verifyEmailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!verifyEmailResponse.success) {
      return Response.json(
        {
          success: false,
          message: verifyEmailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully.Please verify your email",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error in registering user", error);
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
