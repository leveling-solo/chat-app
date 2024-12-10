import { format } from "date-fns";
import Image from "next/image";
import React from "react";

export default function MessageBox({
  message,
  currentUser,
}: {
  message: any;
  currentUser: any;
}) {
  return message?.sender?._id !== currentUser._id ? (
    <div className="message-box">
      <Image
        src={message?.sender.profileImage || "/assets/person.jpg"}
        alt="person image"
        width={400}
        height={400}
        className="message-profilePhoto"
      />
      <div className="message-info">
        <p className="text-small-bold">
          {message?.sender?.username}&#160; &#183; &#160;
          {format(new Date(message?.createdAt), "p")}
        </p>
        {message?.text ? (
          <p className="message-text">{message?.text}</p>
        ) : (
          <Image
            src={message?.photo}
            alt="message"
            className="message-photo"
            width={300}
            height={300}
          />
        )}
      </div>
    </div>
  ) : (
    <div className="message-box justify-end">
      <div className="message-info items-end">
        <p className="text-small-bold">
          {format(new Date(message?.createdAt), "p")}
        </p>
        {message?.text ? (
          <p className="message-text-sender">{message?.text}</p>
        ) : (
          <Image
            src={message?.photo}
            alt="message"
            className="message-photo"
            width={200}
            height={300}
          />
        )}
      </div>
    </div>
  );
}
