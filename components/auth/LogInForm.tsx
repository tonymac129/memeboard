"use client";

import type { UserType } from "@/types/User";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Input from "../ui/Input";
import Btn from "../ui/Btn";
import Provider from "./Provider";
import { addUsername } from "./actions";

const providers = ["Google", "GitHub"];
const tabBtnStyles =
  "w-[50%] text-zinc-300 text-center py-2 cursor-pointer border-b-2 border-zinc-700";
const labelStyles = "flex flex-col gap-y-1 text-zinc-300 text-sm";

interface LogInFormProps {
  isLogIn: boolean;
  setIsLogIn: React.Dispatch<React.SetStateAction<boolean>>;
}

function LogInForm({ isLogIn, setIsLogIn }: LogInFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserType>({
    id: crypto.randomUUID(),
    username: "",
    email: "",
    display: "",
    password: "",
  });

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (isLogIn) {
      setLoading(true);
      await authClient.signIn.email(
        {
          email: userData.email,
          password: userData.password as string,
        },
        {
          onSuccess: () => window.location.reload(),
          onError: (ctx) => {
            const msg = ctx.error.message;
            setError(msg);
            setLoading(false);
          },
        },
      );
    } else {
      if (
        userData.display.trim().length > 0 &&
        userData.username.trim().length > 0
      ) {
        setLoading(true);
        await authClient.signUp.email(
          {
            email: userData.email,
            password: userData.password as string,
            name: userData.display,
          },
          {
            onSuccess: async () => {
              await addUsername(userData);
              window.location.reload();
            },
            onError: (ctx) => {
              const msg = ctx.error.message;
              setError(msg.includes("too short") ? msg : "Invalid inputs");
              setLoading(false);
            },
          },
        );
      } else {
        setError("Invalid inputs");
      }
    }
  }

  async function signIn(provider: string) {
    await authClient.signIn.social({
      provider: provider.toLowerCase(),
      callbackURL: "/profile",
    });
  }

  return (
    <div className="rounded border-2 border-zinc-700 flex flex-col w-100">
      <div className="flex">
        <div
          onClick={() => setIsLogIn(true)}
          className={
            tabBtnStyles +
            ` ${isLogIn ? "border-b-zinc-950" : "hover:bg-zinc-900"} border-r-2`
          }
        >
          Log in
        </div>
        <div
          onClick={() => setIsLogIn(false)}
          className={
            tabBtnStyles +
            ` ${!isLogIn ? "border-b-zinc-950" : "hover:bg-zinc-900"}`
          }
        >
          Sign up
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-y-3">
        {!isLogIn && (
          <label className={labelStyles}>
            Username
            <Input
              placeholder="triplet67"
              value={userData.username}
              setValue={(username) => setUserData({ ...userData, username })}
            />
          </label>
        )}
        <label className={labelStyles}>
          Email
          <Input
            placeholder="tungtung@gmail.com"
            value={userData.email}
            setValue={(email) => setUserData({ ...userData, email })}
          />
        </label>
        {!isLogIn && (
          <label className={labelStyles}>
            Display Name
            <Input
              placeholder="Tung Tung Tung Sahur"
              value={userData.display}
              setValue={(display) => setUserData({ ...userData, display })}
            />
          </label>
        )}
        <label className={labelStyles}>
          Password
          <Input
            placeholder="password123"
            type="password"
            value={userData.password || ""}
            setValue={(password) => setUserData({ ...userData, password })}
          />
        </label>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <Btn
          text={loading ? "Loading..." : isLogIn ? "Log in" : "Sign up"}
          type="submit"
          primary
        />
        <div className="bg-zinc-700 relative h-0.5 my-2 flex items-center">
          <div className="absolute left-[50%] translate-x-[-50%] px-5 py-1 bg-zinc-950 text-zinc-300">
            or
          </div>
        </div>
        {providers.map((p, i) => (
          <Provider key={i} text={p} signIn={signIn} />
        ))}
      </form>
    </div>
  );
}

export default LogInForm;
