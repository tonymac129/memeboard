"use client";

import type { MessageType } from "@/types/Chat";
import type { User } from "@/app/generated/prisma/client";
import { useRealtime } from "@/lib/realtime-client";
import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";

interface MessagesProps {
  messages: MessageType[];
  name: string;
  userData: User;
  id: string;
}

function Messages({ messages, name, userData, id }: MessagesProps) {
  const [allMessages, setAllMessages] = useState<MessageType[]>(messages);
  const messageRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [allMessages]);

  useRealtime({
    events: ["chat.message"],
    onData: (data) => {
      const newMessage = JSON.parse(data.data);
      if (newMessage.chatId === id) {
        setAllMessages((prev) => [...prev, newMessage]);
      }
    },
  });

  return (
    <div className="flex flex-col gap-y-3 w-full px-5">
      {allMessages.map((message, i) => {
        const fromMe = message.from === session?.user.id;
        const created = new Date(message.created);
        return (
          <div
            key={i}
            className={`flex gap-x-3 w-full ${fromMe && "justify-end"}`}
          >
            {!fromMe && (
              <Link href={`/users/${userData.username}`}>
                <Image
                  src={userData.image || "/icons/default-avatar.svg"}
                  alt="Avatar"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </Link>
            )}
            <div className="text-zinc-300 flex flex-col gap-y-1 flex-1">
              <div className={`flex gap-x-2 text-sm ${fromMe && "self-end"}`}>
                <span className="font-bold text-base">
                  {fromMe ? "You" : name}
                </span>
                •
                <span title={created.toISOString()}>
                  {new Date().getTime() - created.getTime() < 86400000
                    ? created.toTimeString().slice(0, 5)
                    : created.toLocaleDateString()}
                </span>
              </div>
              <div
                className={`bg-zinc-900 rounded px-4 py-2 max-w-[70%] w-fit ${fromMe && "bg-green-800! self-end"}`}
              >
                {message.message}
              </div>
            </div>
            {fromMe && (
              <Link
                href={`/users/${(session.user as typeof session.user & { username: string }).username}`}
              >
                <Image
                  src={session.user.image || "/icons/default-avatar.svg"}
                  alt="Avatar"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </Link>
            )}
          </div>
        );
      })}
      <div ref={messageRef} />
    </div>
  );
}

export default Messages;
