"use client";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { FaLock, FaUnlock, FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useState } from "react";
interface Inputs {
  username: string;
  email: string;
  password: string;
}
export default function Form({ type }: { type: string }): any {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const route = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  async function onSubmit(data: Inputs) {
    if (type === "register") {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          route.push("/");
        }

        if (res.status === 400) {
          toast.error("Email id  Already Existed ");
        }
      } catch (error: string | any) {
        console.log("Error From Frontend", error);
        toast.error(error);
      }
    }

    if (type === "login") {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (res?.ok) {
        route.push("/chats");
      }
      if (res?.error) {
        toast.error("Invalid email or password");
      }
    }
  }
  return (
    <div className={`auth`}>
      <div className={`content`}>
        <Image
          src="/assets/logo.png"
          height={200}
          width={200}
          alt="logo"
          className="logo"
          priority
        />
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          {type === "register" && (
            <div>
              <div className="input">
                <input
                  defaultValue=""
                  {...register("username", {
                    required: "username is required",
                    validate: (value: string): string | undefined => {
                      if (value.length < 3) {
                        return "username must be at least 3 characters";
                      }
                    },
                  })}
                  type="text"
                  placeholder="username"
                  className="input-field"
                />
                <FaUserAlt />
              </div>
              {errors.username && (
                <p className="text-red-500 mr-4 ml-4 mt-2">
                  {typeof errors.username.message === "string"
                    ? errors.username.message
                    : "Invalid Error Message"}
                </p>
              )}
            </div>
          )}
          <div>
            <div className="input">
              <input
                defaultValue=""
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Email"
                className="input-field"
              />
              <MdEmail />
            </div>
            {errors.email && (
              <p className="text-red-500 mr-4 ml-4 mt-2">
                {typeof errors.email.message === "string"
                  ? errors.email.message
                  : "Invalid Error Message"}
              </p>
            )}
          </div>
          <div>
            <div className="input">
              <input
                defaultValue=""
                {...register("password", {
                  required: "password  is required ",
                  validate: (value: string): string | undefined => {
                    if (
                      value.length < 5 ||
                      !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
                    ) {
                      return "character contain in the password should be more than 5 and also include a special characters";
                    }
                  },
                })}
                type={showPassword ? `text` : `password`}
                placeholder="password"
                className="input-field"
              />
              <p
                onClick={(): void =>
                  setShowPassword((prev: boolean): boolean => !prev)
                }
              >
                {showPassword ? <FaUnlock /> : <FaLock />}
              </p>
            </div>
            {errors.password && (
              <p className="text-red-500 mr-4 ml-4 mt-2">
                {typeof errors.password.message === "string"
                  ? errors.password.message
                  : "Invalid Error Message"}
              </p>
            )}
          </div>
          <button className="button" type="submit">
            {type === "register" ? "Join Free" : "Let's Chat"}
          </button>
        </form>

        {type === "register" ? (
          <Link href="/">Already have an account ? Sign in Here</Link>
        ) : (
          <Link href="/register">
            don&apos;t have an account? Register Here
          </Link>
        )}
      </div>
    </div>
  );
}
