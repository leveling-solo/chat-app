import { Connect } from "@/db/DbConnection";
import { pusherServer } from "@/lib/pusher";
import Chat, { Chats } from "@/models/chats";
import User from "@/models/user";
import { Document, Model } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
Connect();

interface GroupQuery {
  isGroup: boolean;
  name: string;
  groupPhoto: string;
  members: string[];
}

interface PersonalQuery {
  members: {
    $all: string[];
    $size: number;
  };
}
export async function POST(request: NextRequest): Promise<any> {
  try {
    const body = await request.json();
    const { currentUserId, members, isGroup, name, groupPhoto } = body;

    // Define "query" to find the chat

    const query: GroupQuery | PersonalQuery = isGroup
      ? { isGroup, name, groupPhoto, members: [currentUserId, ...members] }
      : { members: { $all: [currentUserId, ...members], $size: 2 } };

    let chat: any = await Chat.findOne(query);

    if (!chat) {
      chat = new Chat(
        isGroup ? query : { members: [currentUserId, ...members] }
      );

      await chat.save();
      const updateAllMembers: any = chat.members.map(
        async (memberId: string): Promise<void> => {
          await User.findByIdAndUpdate(
            memberId,
            {
              $addToSet: { chats: chat._id },
            },
            { new: true }
          );
        }
      );
      Promise.all(updateAllMembers);

      // Trigger a Pusher event for each memeber to notify a new Chat

      chat.members.map(async (member: any): Promise<any> => {
        await pusherServer.trigger(member._id.toString(), "new-chat", chat);
      });
    }

    return NextResponse.json(
      {
        message: isGroup ? "Group Created Successfuly" : "User Chat Created",
        success: true,
        data: chat,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to create a new  Chat",
        sucess: false,
      },
      { status: 500 }
    );
  }
}
