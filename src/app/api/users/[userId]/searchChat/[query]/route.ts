import { Connect } from "@/db/DbConnection";
import Chat from "@/models/chats";
import Message from "@/models/message";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
Connect();
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; query: string };
  }
): Promise<any> {
  try {
    const { userId, query } = params;
    const searchContact: any = await Chat.find({
      members: userId,
      name: { $regex: query, $options: "i" },
    })
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender  seenBy",
          model: User,
        },
      })
      .exec();

    return NextResponse.json(
      {
        message: "search Results",
        sucess: true,
        data: searchContact,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to search",
        success: false,
      },
      { status: 500 }
    );
  }
}
