import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 404 }
    );
  }
  // const userId = user?._id;
  // when doing pipelining it is good to use or recommended
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    // pipeline return type is array
    const foundUser = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!foundUser || foundUser.length == 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: foundUser[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch messages",
      },
      { status: 404 }
    );
  }
}
