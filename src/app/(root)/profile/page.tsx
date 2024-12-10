"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdPerson } from "react-icons/md";
import { CldUploadButton } from "next-cloudinary";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
export default function Profilepage() {
  const { data: session } = useSession();
  const user: any = session?.user;
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        profileImage: user?.profileImage,
      });
    }
    setLoading(false);
  }, [user]);

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
    setValue("profileImage", result?.info?.secure_url);
    setProfileImage(result?.info?.secure_url);
  };

  async function update(data: any) {
    setLoading(true);
    try {
      const res: Response = await fetch(`/api/users/${user._id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, id: user._id }),
      });
      if (res.ok) {
        toast.success("profile updated ");
      }
      if (!res.ok || res.status === 500) {
        toast.error("Failed to update the user data");
      }
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }
  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <h1 className="text-heading3-bold">Edit your profile</h1>
      <form className="edit-profile" onSubmit={handleSubmit(update)}>
        <div className="input">
          <input
            {...register("username", {
              required: "username is required",
              validate: (value: string): string | undefined => {
                if (value.length < 3) {
                  return "username must be at least 3 character";
                }
              },
            })}
            type="text"
            placeholder="username"
            className="input-field"
          />
          <MdPerson className="text-grey-1" />
        </div>
        {errors.username && (
          <p className="text-red-500 mr-4 ml-4 mt-2">
            {typeof errors.username.message === "string"
              ? errors.username.message
              : "Invalid Error Message"}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Image
            src={
              profileImage ||
              watch("profileImage") ||
              user?.profileImage ||
              "/assets/person.jpg"
            }
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

        <button className="btn" type="submit">
          Save changes
        </button>
      </form>
    </div>
  );
}
