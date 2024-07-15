import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  const messageid = params.messageId;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 404 }
    );
  }

  const userId = user?._id;
  try {
    const updatedMessage = await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: { messages: { _id: messageid } },
      }
    );
    if (updatedMessage.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.log("Failed to delete message");
    return Response.json(
      {
        success: false,
        message: "Error deleting messages",
      },
      { status: 500 }
    );
  }
}
