import { Connect } from "@/db/DbConnection";
import Chat from "@/models/chats";
import Message from "@/models/message";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
Connect();
export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
): Promise<any> {
  try {
    const { chatId } = params;
    const chat: any = await Chat.findById(chatId)
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
        message: "fetching chats successfully",
        data: chat,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch the chats",
        success: false,
      },
      { status: 200 }
    );
  }
}
