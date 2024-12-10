import { Connect } from "@/db/DbConnection";
import User from "@/models/user";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
Connect();
export async function POST(request: NextRequest): Promise<any> {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    const existingUser: any = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "user already Exists",
          success: true,
        },
        { status: 400 }
      );
    }

    const hashedPassword: string = await hash(password, 10);
    const newUser: any = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return NextResponse.json(
      {
        message: "User created Successfully",
        success: true,
        body: newUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        msesage:
          "Didn't connect  or Network problem , please try again sometime later",
        success: true,
      },
      { status: 500 }
    );
  }
}
