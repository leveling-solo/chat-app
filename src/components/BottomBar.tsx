"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { MdLogout } from "react-icons/md";

export default function BottomBar() {
  const pathname: string = usePathname();

  async function handleLogout() {
    signOut({ callbackUrl: "/" });
  }

  const { data: session } = useSession();
  const user: any = session?.user;
  return (
    <div className="bottom-bar">
      <Link
        href="/chats"
        className={`${
          pathname === "/chats" ? "text-red-1" : ""
        } text-heading4-bold`}
      >
        Chats
      </Link>

      <Link
        href="/contacts"
        className={`${
          pathname === "/contacts" ? "text-red-1" : ""
        } text-heading4-bold`}
      >
        Contacts
      </Link>
      <MdLogout
        onClick={handleLogout}
        className="cursor-pointer text-[#737373] text-[1.2rem]"
      />
      <Link href="/profile">
        <Image
          src={user?.proifleImage || "/assets/person.jpg"}
          alt="person profile"
          className="profilePhoto"
          width={200}
          height={200}
        />
      </Link>
    </div>
  );
}
