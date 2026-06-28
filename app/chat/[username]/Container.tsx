"use client";

import type { Chat, User } from "@/app/generated/prisma/client";
import type { MessageType, ReplyType } from "@/types/Chat";
import { useState } from "react";
import Messages from "./Messages";
import MessageInput from "@/components/chat/MessageInput";
import Link from "next/link";
import Image from "next/image";

type UserType = User & {
  followers: User[];
  following: User[];
};

interface ContainerProps {
  userData?: UserType;
  messages: MessageType[];
  chat: Chat | null;
}

function Container({ userData, messages, chat }: ContainerProps) {
  const [replying, setReplying] = useState<ReplyType | null>(null);

  return (
    <div className="w-full h-full">
      <div className="h-[calc(100%-80px)] flex flex-col items-center gap-y-5 py-5 overflow-auto scrollbar-none">
        <div className="flex flex-col gap-y-3 items-center text-zinc-300">
          <Image
            src={
              userData
                ? userData?.image || "/icons/default-avatar.svg"
                : "/icons/memebot.png"
            }
            alt="Avatar"
            width={100}
            height={100}
            className="rounded-full"
          />
          {userData ? (
            <Link
              href={`/users/${userData.username}`}
              className="text-lg font-bold hover:text-green-500"
            >
              {userData.name}
            </Link>
          ) : (
            <div className="text-lg font-bold hover:text-green-500">
              MemeBot
            </div>
          )}
          {userData && (
            <div className="text-sm">
              {userData.followers.length} followers •{" "}
              {userData.following.length} following
            </div>
          )}
        </div>
        <Messages
          messages={messages}
          name={userData?.name || "MemeBot"}
          userData={userData}
          id={chat?.id || ""}
          setReplying={setReplying}
        />
      </div>
      <div className="h-20 w-full flex items-center justify-center px-5">
        <MessageInput
          name={userData?.name || "MemeBot"}
          id={userData?.id || "memebot"}
          replying={replying}
          setReplying={setReplying}
        />
      </div>
    </div>
  );
}

export default Container;
