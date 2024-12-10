import { Connect } from "@/db/DbConnection";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
Connect();
export async function GET(
  request: NextRequest,
  { params }: { params: { query: string } }
): Promise<any> {
  try {
    const { query } = params;
    const searchedContact: any = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    return NextResponse.json(
      {
        message: "serached Result",
        sucess: true,
        data: searchedContact,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Doesn't find the username or email ",
        success: false,
      },
      { status: 500 }
    );
  }
}
