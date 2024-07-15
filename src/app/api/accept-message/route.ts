import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

// yahan par hum getServersSession me authOptions pass kar rahe
// aur wo hume session de raha he jisme hum user ko inject kar chuke he
// isi se hum ab logged in user ki details lenge

//updating user message accepting status
export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  console.log("post.....................", session);
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  try {
    const { isAcceptingMessage } = await request.json();
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Error in updating message accepting status",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message Accepting status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to update the message accepting status",
      },
      { status: 500 }
    );
  }
}

// getting status whether user accepting message or not

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  console.log("geeeeeeetttttttttttttt...........................", user);

  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const existedUser = await UserModel.findOne({ _id: userId });
    console.log("existeduserrrrrrrrrrrrrr.", existedUser);
    if (!existedUser) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }

    return Response.json({
      success: true,
      message: "User Message accepted status fetched successfully",
      isAcceptingMessage: existedUser.isAcceptingMessage,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch user messaging status",
      },
      { status: 404 }
    );
  }
}
