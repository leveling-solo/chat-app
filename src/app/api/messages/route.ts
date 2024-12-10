import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/db/DbConnection";
import User from "@/models/user";
import Message from "@/models/message";
import Chat from "@/models/chats";
import { pusherServer } from "@/lib/pusher";

Connect();

export async function POST(request: NextRequest): Promise<any> {
  try {
    const body = await request.json();

    const { chatId, currentUserId, text, photo } = body;

    const curretntUser: any = await User.findById(currentUserId);

    const newMessage: any = await Message.create({
      chat: chatId,
      sender: {
        _id: curretntUser._id,
        username: curretntUser.username,
        email: curretntUser.email,
        profileImage: curretntUser.profileImage,
      },
      text,
      photo,
      seenBy: currentUserId,
    });

    const udpatedChat: any = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: { updatedAt: newMessage.createdAt },
      },
      { new: true }
    )
      .populate({
        path: "messages",
        model: Message,
        populate: { path: "sender seenBy", model: User },
      })
      .populate({
        path: "members",
        model: User,
      })
      .exec();

    // Trigger a Pusher event for a specific chat about the new Message

    await pusherServer.trigger(chatId, "new-message", newMessage);

    // Triggers a Pusher event for each member of the chat about the chat update with the latest message
    const lastMessage: any =
      udpatedChat.messages[udpatedChat.messages.length - 1];

    udpatedChat.members.forEach(async (member: any): Promise<any> => {
      try {
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          messages: [lastMessage],
        });
      } catch (error) {
        console.error(`Failed to trigger update-chat event`);
      }
    });

    return NextResponse.json(
      {
        message: "chat upload successfully",
        success: true,
        data: newMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to create new Message",
        success: false,
      },
      { status: 500 }
    );
  }
}
