"use client";
import { useSession } from "next-auth/react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React, {
  ChangeEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import Loader from "./Loader";
import Link from "next/link";
import Image from "next/image";
import { LuImagePlus } from "react-icons/lu";
import { CldUploadButton } from "next-cloudinary";
import MessageBox from "./messageBox";
import { pusherClient } from "@/lib/pusher";

export default function ChatDetails({ chatId }: { chatId: Params }) {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState<any>({});
  const [otherMembers, setOtherMembers] = useState<any[]>([]);
  const [text, setText] = useState("");

  const { data: session } = useSession();
  const currentUser: any = session?.user;
  async function getChatDetails() {
    try {
      const res = await fetch(`/api/chats/${chatId.chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setChat(data.data);
      setOtherMembers(
        data.data?.members.filter(
          (member: { _id: any }): boolean => member._id !== currentUser._id
        )
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (currentUser && chatId) getChatDetails();
  }, [currentUser, chatId]);

  async function sendText(): Promise<any> {
    try {
      const res = await fetch("/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: chatId.chatId,
          currentUserId: currentUser._id,
          text,
        }),
      });
      if (res.ok) {
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function sendImage(result: any): Promise<any> {
    try {
      const res = await fetch("/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: chatId.chatId,
          currentUserId: currentUser._id,
          photo: result?.info?.secure_url,
        }),
      });
    } catch (error) {
      console.log("Error : ", error);
    }
  }
  useEffect((): (() => void) => {
    pusherClient.subscribe(chatId.chatId);

    const handleMessage: (newMessage: any) => Promise<any> = async (
      newMessage: any
    ): Promise<any> => {
      setChat((prevChat: any) => {
        return {
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        };
      });
    };

    pusherClient.bind("new-message", handleMessage);

    return () => {
      pusherClient.unsubscribe(chatId.chatId);
      pusherClient.unbind("new-message", handleMessage);
    };
  }, [chatId.chatId]);

  // Scrolling down to the bottom when having the new message

  const bottomRef: MutableRefObject<any | null> = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat.messages]);

  return loading ? (
    <Loader />
  ) : (
    <div className="pb-20">
      <div className="chat-details ">
        <div className="chat-header ">
          {chat?.isGroup ? (
            <>
              <Link
                href={`/chats/${chatId.chatId}/group-info`}
                className="cursor-pointer"
              >
                <Image
                  src={chat?.groupPhoto || "/assets/group.png"}
                  width={200}
                  alt="group image"
                  height={200}
                  className="profilePhoto"
                />
              </Link>
              <div className="text">
                <p>
                  {chat?.name} : {chat?.members?.length} members
                </p>
              </div>
            </>
          ) : (
            <>
              <Image
                src={otherMembers[0].profileImage || "/assets/person.jpg"}
                alt="profile phtoto"
                width={300}
                height={300}
                className="profilePhoto"
              />
              <div className="text">
                <p>{otherMembers[0].username}</p>
              </div>
            </>
          )}
        </div>
        <div className="chat-body  ">
          {chat?.messages?.map((message: any, index: number) => (
            <MessageBox
              key={index}
              message={message}
              currentUser={currentUser}
            />
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="send-message">
          <div className="prepare-message">
            <CldUploadButton
              options={{ maxFiles: 1 }}
              onSuccess={sendImage}
              uploadPreset="dgfv6pr8"
            >
              <LuImagePlus className="text-[1.8rem] hover:text-[red] cursor-pointer" />
            </CldUploadButton>
            <input
              type="text"
              className="input-field"
              placeholder="write a message..."
              value={text}
              onChange={(event: ChangeEvent<HTMLInputElement>): void =>
                setText(event.target.value)
              }
              required
            />
          </div>
          <div onClick={sendText}>
            <Image
              src="/assets/send.jpg"
              alt="send"
              width={100}
              height={100}
              className="send-icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
