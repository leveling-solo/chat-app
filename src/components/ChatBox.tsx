"use client";
import Image from "next/image";
import React from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
export default function ChatBox({
  chat,

  currentUser,
  currentChatId,
}: {
  chat: any;
  currentUser: any;
  currentChatId: Params;
}) {
  const route = useRouter();
  const othermembers: any = chat?.members
    ? chat.members.filter(
        (member: any): boolean => member._id !== currentUser._id
      )
    : [];

  const lastMessage: any =
    chat?.messages?.length > 0 && chat?.messages[chat?.messages?.length - 1];

  const seen: any = lastMessage?.seenBy?.find(
    (member: any): boolean => member._id === currentUser._id
  );

  return (
    <div
      className={`chat-box ${
        chat._id === currentChatId?.chatId ? "bg-blue-2" : ""
      }`}
      onClick={() => route.push(`/chats/${chat?._id}`)}
    >
      <div className="chat-info">
        {chat?.isGroup ? (
          <Image
            src={chat?.groupPhoto || "/assets/group.png"}
            alt="group-photo"
            width={50}
            height={50}
            className="profilePhoto"
          />
        ) : (
          <Image
            src={othermembers[0]?.profileImage || "/assets/person.jpg"}
            alt="indiviual-photo"
            width={50}
            height={50}
            className="profilePhoto"
          />
        )}
        <div className="flex flex-col gap-1 ">
          {chat?.isGroup ? (
            <p className="text-base-bold capitalize">{chat?.name}</p>
          ) : (
            <p className="text-base-bold capitalize">
              {othermembers[0]?.username || ""}
            </p>
          )}
          {!lastMessage && <p className="text-small-bold">Started a Chat</p>}

          {lastMessage?.photo ? (
            lastMessage?.sender?._id === currentUser._id ? (
              <p className="text-small-medium text-grey-3">You sent a photo</p>
            ) : (
              <p
                className={`${
                  seen ? "text-small-medium text-grey-3" : "text-small-bold"
                }`}
              >
                {" "}
                Recieved a photo
              </p>
            )
          ) : (
            <p
              className={`last-message ${
                seen ? "text-small-medium text-grey-3" : "text-small-bold"
              }`}
            >
              {lastMessage?.text}
            </p>
          )}
        </div>
      </div>
      <div>
        <p className="text-base-light text-grey-3">
          {!lastMessage
            ? format(new Date(chat?.createdAt), "p")
            : format(new Date(chat?.updatedAt), "p")}
        </p>
      </div>
    </div>
  );
}
