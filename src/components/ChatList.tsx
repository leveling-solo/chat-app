"use client";
import React, { ReactElement, useEffect, useState } from "react";
import Loader from "./Loader";
import { useSession } from "next-auth/react";
import ChatBox from "./ChatBox";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { pusherClient } from "@/lib/pusher";

export default function ChatList({ currentChatId }: { currentChatId: Params }) {
  const [loading, setLodaing] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [chats, setChats] = useState<any[]>([]);

  const { data: session } = useSession();
  const currentUser: any = session?.user;

  async function getChats() {
    try {
      const res: Response = await fetch(
        search !== ""
          ? `/api/users/${currentUser._id}/searchChat/${search}`
          : `/api/users/${currentUser._id}`
      );
      const data = await res.json();
      setChats(data.data);
      setLodaing(false);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (currentUser) {
      getChats();
    }
  }, [currentUser, search]);

  useEffect(() => {
    if (currentUser) {
      pusherClient.subscribe(currentUser._id);

      const handleChatUpdate: (updatedChat: any) => void = (
        updatedChat: any
      ): void => {
        setChats((prevChats: any[]): any[] =>
          prevChats.map((chat) => {
            if (chat._id === updatedChat.id) {
              return { ...chat, messages: updatedChat.messages };
            } else {
              return chat;
            }
          })
        );
      };
      const handleNewChat: (newChat: any) => void = (newChat: any): void => {
        setChats((prevChats: any[]): any[] => [...prevChats, newChat]);
      };

      pusherClient.bind("update-chat", handleChatUpdate);
      pusherClient.bind("new-chat", handleNewChat);

      return () => {
        pusherClient.unsubscribe(currentUser._id);
        pusherClient.unbind("update-chat", handleChatUpdate);
        pusherClient.unbind("new-chat", handleNewChat);
      };
    }
  }, [currentUser]);

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-list">
      <input
        placeholder="Search Chat..."
        className="input-search"
        value={search}
        onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
          setSearch(event.target.value)
        }
      />
      <div className="chats">
        {chats?.map(
          (chat: any, index: number): ReactElement => (
            <ChatBox
              chat={chat}
              key={index}
              currentUser={currentUser}
              currentChatId={currentChatId}
            />
          )
        )}
      </div>
    </div>
  );
}
