import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

// GET is recommended for retreiving data
export async function GET(request: Request) {
  await dbConnect();
  try {
    // when you use GET, parameters come in query parameter
    const url = new URL(request.url);
    const username = url.searchParams.get("username");

    //when you use POST, parameters come in json body
    // const { username } = await request.json();
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error while fetching user",
      },
      { status: 500 }
    );
  }
}
