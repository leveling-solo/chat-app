import { Connect } from "@/db/DbConnection";
import Chat from "@/models/chats";
import Message from "@/models/message";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
Connect();
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<any> {
  try {
    const { userId } = params;
    const allChat: any = await Chat.find({ members: userId })
      .sort({ updatedAt: -1 })
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })
      .exec();
    return NextResponse.json(
      {
        message: "user data fetched",
        sucess: true,
        data: allChat,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch the data",
        sucess: false,
      },
      { status: 500 }
    );
  }
}
