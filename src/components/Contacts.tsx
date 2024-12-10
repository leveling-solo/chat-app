"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Loader from "./Loader";
import { useSession } from "next-auth/react";
import { IoIosRadioButtonOff } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Contacts() {
  const [lodaing, setLoading] = useState<boolean>(true);
  const [contacts, setContacts] = useState<[]>([]);
  const [serach, setSearch] = useState<string>("");
  const { data: session } = useSession();
  const currentUser: any = session?.user;
  async function getContacts() {
    try {
      const res: Response = await fetch(
        serach !== "" ? `/api/users/searchContact/${serach}` : "/api/users"
      );
      const data = await res.json();
      const userdata = data?.data;
      const filterData: [] = userdata.filter(
        (contact: any): boolean => contact._id !== currentUser._id
      );
      setContacts(filterData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (currentUser) {
      getContacts();
    }
  }, [currentUser, serach]);

  // SELECT THE CONTACT
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const isGroup: boolean = selectedContacts.length > 1;

  function handleSelected(contact: any): void {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts((prevSelectedContacts: any) =>
        prevSelectedContacts.filter((item: any): boolean => item !== contact)
      );
    } else {
      setSelectedContacts((prevSelectedContacts: any) => [
        ...prevSelectedContacts,
        contact,
      ]);
    }
  }
  // ADD GROUP CHAT NAME
  const [name, setName] = useState("");
  const router = useRouter();
  // CREATE CHAT
  async function createChat() {
    const res: Response = await fetch("/api/chats", {
      method: "POST",

      body: JSON.stringify({
        currentUserId: currentUser._id,
        members: selectedContacts.map((contact) => contact._id),
        isGroup,
        name,
      }),
    });
    const chat = await res.json();
    console.log("chat", chat.data);
    if (res.ok) {
      router.push(`/chats/${chat.data._id}`);
    }
  }
  return lodaing ? (
    <Loader />
  ) : (
    <div className="create-chat-container">
      <input
        placeholder="Search contact...."
        className="input-search"
        value={serach}
        onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
          setSearch(event.target.value)
        }
      />
      <div className="contact-bar  ">
        <div className="contact-list  ">
          <p className="text-body-bold">select or Deselect</p>
          <div className="flex flex-col flex-1 gap-5 overflow-y-scroll custom-scrollbar">
            {contacts.map((user: any, index: number) => (
              <div
                key={index}
                className="contact"
                onClick={() => handleSelected(user)}
              >
                {selectedContacts.find((item) => item === user) ? (
                  <FaCircleCheck color="red" />
                ) : (
                  <IoIosRadioButtonOff />
                )}

                <Image
                  src={user.profileImage || "/assets/person.jpg"}
                  alt="user profile"
                  width={50}
                  height={50}
                  className="profilePhoto"
                />
                <p className="text-base-bold"> {user.username}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="create-chat">
          {isGroup && (
            <>
              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Group Chat Name</p>
                <input
                  placeholder="Enter group chat name...."
                  className="input-group-name"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Members</p>
                <div className="flex flex-wrap gap-3">
                  {selectedContacts.map((contact, index: number) => (
                    <p className="selected-contact" key={index}>
                      {contact.username}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
          <button
            className="btn"
            onClick={createChat}
            disabled={selectedContacts.length === 0}
          >
            FIND OR START A NEW CHAT
          </button>
        </div>
      </div>
    </div>
  );
}
