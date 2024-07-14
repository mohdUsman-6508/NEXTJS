import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    console.log("url:", url);
    const username = url.searchParams.get("username");
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }
    if (!user.isAcceptingMessage) {
      return Response.json({
        success: false,
        message: "User is not accepting messages",
        isAcceptingMessage: user?.isAcceptingMessage,
      });
    }

    return Response.json({
      success: true,
      message: "User is accepting messages",
      isAcceptingMessage: user?.isAcceptingMessage,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to get user message accepting status",
      },
      {
        status: 500,
      }
    );
  }
}
