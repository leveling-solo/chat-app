import { Connect } from "@/db/DbConnection";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
Connect();
export async function GET(request: NextRequest): Promise<any> {
  try {
    const allUser: any = await User.find();
    return NextResponse.json(
      {
        message: "user data",
        success: true,
        data: allUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch user data", success: false },
      { status: 500 }
    );
  }
}
