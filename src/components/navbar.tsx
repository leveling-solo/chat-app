"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { MdLogout } from "react-icons/md";

export default function Navbar() {
  const pathname: string = usePathname();
  const { data: session } = useSession();
  const user: any = session?.user;
  async function handleLogout() {
    signOut({ callbackUrl: "/" });
  }

  return (
    <div className="topbar">
      <Link href="/chats">
        <Image
          src="/assets/logo.png"
          alt="logo image"
          width={150}
          height={100}
        />
      </Link>
      <div className="menu">
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
          }text-heading4-bold`}
        >
          Contacts
        </Link>

        <MdLogout
          className="text-grey-1 cursor-pointer text-[1.2rem]"
          onClick={handleLogout}
        />
        <Link href="/profile">
          <Image
            src={user?.profileImage || "/assets/person.jpg"}
            alt="user profile image"
            className="profilePhoto"
            width={100}
            height={100}
          />
        </Link>
      </div>
    </div>
  );
}
