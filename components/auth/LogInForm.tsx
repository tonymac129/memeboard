"use client";

import type { User } from "@/types/User";
import { useState } from "react";
import Input from "../ui/Input";
import Btn from "../ui/Btn";
import Provider from "./Provider";

const providers = ["Google", "GitHub"];
const tabBtnStyles =
  "w-[50%] text-zinc-300 text-center py-2 cursor-pointer border-b-2 border-zinc-700";
const labelStyles = "flex flex-col gap-y-1 text-zinc-300 text-sm";

interface LogInFormProps {
  isLogIn: boolean;
  setIsLogIn: React.Dispatch<React.SetStateAction<boolean>>;
}

function LogInForm({ isLogIn, setIsLogIn }: LogInFormProps) {
  const [provider, setProvider] = useState<string>("");
  const [userData, setUserData] = useState<User>({
    id: crypto.randomUUID(),
    username: "",
    display: "",
  });

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    alert("submitted");
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
        <label className={labelStyles}>
          Username
          <Input
            placeholder="tonymac129"
            value={userData.username}
            setValue={(username) => setUserData({ ...userData, username })}
          />
        </label>
        {!isLogIn && (
          <label className={labelStyles}>
            Display Name
            <Input
              placeholder="Tony Hsu"
              value={userData.display}
              setValue={(display) => setUserData({ ...userData, display })}
            />
          </label>
        )}
        <label className={labelStyles}>
          Password
          <Input
            placeholder="password123"
            value={userData.password || ""}
            setValue={(password) => setUserData({ ...userData, password })}
          />
        </label>
        <Btn text="Log in" type="submit" primary />
        <div className="bg-zinc-700 relative h-0.5 my-2 flex items-center">
          <div className="absolute left-[50%] translate-x-[-50%] px-5 py-1 bg-zinc-950 text-zinc-300">
            or
          </div>
        </div>
        {providers.map((p, i) => (
          <Provider
            key={i}
            text={p}
            provider={provider}
            setProvider={setProvider}
          />
        ))}
      </form>
    </div>
  );
}

export default LogInForm;
