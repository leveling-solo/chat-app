"use client";
import React, { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdGroup, MdPerson } from "react-icons/md";
import { CldUploadButton } from "next-cloudinary";
import Loader from "@/components/Loader";
import { useParams, useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
export default function GroupInfo() {
  const [loading, setLoading] = useState<boolean>(true);
  const [chat, setChat] = useState<any>({});

  const { chatId } = useParams();

  console.log("id from group-info", chatId);
  async function getChatDetails() {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
      setChat(data.data);
      setLoading(false);
      reset({
        name: data.data?.name,
        groupPhoto: data.data?.groupPhoto,
      });
    } catch (error) {
      console.log(error);
    }
  }

  console.log("chat from group", chat);

  useEffect(() => {
    if (chatId) {
      getChatDetails();
    }
  }, [chatId]);
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const uploadPhoto: (result: string | any) => void = (
    result: string | any
  ): void => {
    setValue("groupPhoto", result?.info?.secure_url);
  };

  const router: AppRouterInstance = useRouter();

  async function updateGroupChat(data: any) {
    setLoading(true);
    try {
      const res = await fetch(`/api/chats/${chatId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLoading(false);

      if (res.ok) {
        router.push(`/chats/${chatId}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <h1 className="text-heading3-bold">Edit Group Info</h1>

      <form className="edit-profile" onSubmit={handleSubmit(updateGroupChat)}>
        <div className="input">
          <input
            {...register("name", {
              required: "Group chat name is required",
            })}
            type="text"
            placeholder="Group chat name "
            className="input-field"
          />
          <MdGroup className="text-grey-1" />
        </div>
        {errors.name && (
          <p className="text-red-500 mr-4 ml-4 mt-2">
            {typeof errors.name.message === "string"
              ? errors.name.message
              : "Invalid Error Message"}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Image
            src={watch("groupPhoto") || "/assets/group.png"}
            alt="profile image"
            width={100}
            height={100}
            className="w-40 h-40 rounded-full"
          />

          <CldUploadButton
            options={{ maxFiles: 1 }}
            onSuccess={uploadPhoto}
            uploadPreset="dgfv6pr8"
          >
            <p className="text-body-bold">Upload new photo</p>
          </CldUploadButton>
        </div>
        <div className="flex flex-wrap gap-3">
          {chat?.members?.map(
            (member: any, index: number): ReactElement => (
              <p key={index} className="selected-contact">
                {member.username}
              </p>
            )
          )}
        </div>
        <button className="btn" type="submit">
          Save changes
        </button>
      </form>
    </div>
  );
}
