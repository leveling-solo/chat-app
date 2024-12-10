import { Connect } from "@/db/DbConnection";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
Connect();
interface Body {
  username: string;
  profileImage: string;
  id: string;
}
export async function POST(request: NextRequest): Promise<any> {
  try {
    const body: Body = await request.json();

    const { username, profileImage, id } = body;

    const updatedUser: any = await User.findByIdAndUpdate(
      id,
      {
        username,
        profileImage,
      },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "user updated successfully ",
        success: true,
        body: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `failed to update user profile , ${error}`,
        sucess: false,
      },
      { status: 500 }
    );
  }
}
