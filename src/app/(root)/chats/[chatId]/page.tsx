"use client";
import ChatDetails from "@/components/ChatDetails";
import ChatList from "@/components/ChatList";
import { useSession } from "next-auth/react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useParams } from "next/navigation";
import React from "react";

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const chatId: Params = useParams();
  const { data: session } = useSession();
  const currentUser: any = session?.user;

  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:hidden">
        <ChatList currentChatId={chatId} />
      </div>
      <div className="w-2/3 max-lg:w-full">
        <ChatDetails chatId={chatId} />
      </div>
    </div>
  );
}
