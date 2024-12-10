import { Connect } from "@/db/DbConnection";
import Chat from "@/models/chats";
import { NextRequest, NextResponse } from "next/server";

Connect();
export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params;
    const body = await request.json();
    const { name, groupPhoto } = body;

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      { name, groupPhoto },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "profile updated successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "failed to update the group profile",
        success: false,
      },
      { status: 404 }
    );
  }
}
