"use client";

import type { MessageType, ReplyType } from "@/types/Chat";
import type { User } from "@/app/generated/prisma/client";
import { useRealtime } from "@/lib/realtime-client";
import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { FaReply } from "react-icons/fa";
import { HiOutlineReply } from "react-icons/hi";
import EmbeddedMeme from "@/components/chat/EmbeddedMeme";
import Link from "next/link";
import Image from "next/image";

interface MessagesProps {
  messages: MessageType[];
  name: string;
  userData: User;
  id: string;
  setReplying: React.Dispatch<React.SetStateAction<ReplyType | null>>;
}

function Messages({
  messages,
  name,
  userData,
  id,
  setReplying,
}: MessagesProps) {
  const [allMessages, setAllMessages] = useState<MessageType[]>(messages);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const highlightedRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [allMessages]);

  useEffect(() => {
    console.log(highlightedRef.current);
    if (highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlighted]);

  useRealtime({
    events: ["chat.message"],
    onData: (data) => {
      const newMessage = JSON.parse(data.data);
      if (newMessage.chatId === id) {
        setAllMessages((prev) => [...prev, newMessage]);
      }
    },
  });

  function handleReply(replying: string) {
    setHighlighted(replying);
    setTimeout(() => {
      setHighlighted(null);
    }, 1500);
  }

  return (
    <div className="flex flex-col gap-y-3 w-full px-5">
      {allMessages.map((message, i) => {
        const fromMe = message.from === session?.user.id;
        const firstMessage =
          i == 0
            ? true
            : message.replying
              ? true
              : new Date(message.created).getTime() -
                    new Date(allMessages[i - 1].created).getTime() >
                  1000 * 60 * 5
                ? true
                : allMessages[i - 1].from !== message.from;
        const created = new Date(message.created);

        return (
          <div
            key={message.id}
            className={`flex flex-col gap-y-1 ${highlighted === message.id && "bg-zinc-900"}`}
            ref={highlighted === message.id ? highlightedRef : null}
          >
            {message.replying && (
              <div
                className={`relative flex items-center mx-15 mt-5 text-zinc-300 cursor-pointer text-sm ${fromMe && "self-end"}`}
                onClick={() => handleReply(message.replying!.id)}
              >
                <HiOutlineReply
                  size={20}
                  className={`absolute ${!fromMe ? "scale-x-[-1] -left-7" : "-right-7"}`}
                />
                Replying to: {message.replying.message}
              </div>
            )}
            <div
              className={`flex gap-x-3 w-[calc(100%-120px)] relative mx-15 ${fromMe && "justify-end"}`}
            >
              {!fromMe && firstMessage && (
                <Link
                  href={`/users/${userData.username}`}
                  className="absolute -left-15 top-0"
                >
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
                {firstMessage && (
                  <div
                    className={`flex gap-x-2 items-center text-sm ${fromMe && "self-end"}`}
                  >
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
                )}
                <div
                  className={`flex gap-x-3 items-center ${fromMe && "justify-end"}`}
                >
                  <div
                    className={`bg-zinc-900 rounded px-4 flex flex-col gap-y-3 py-2 max-w-[70%] w-fit ${fromMe && "bg-green-800! self-end"}`}
                  >
                    {message.memeId && <EmbeddedMeme memeId={message.memeId} />}
                    {message.message}
                  </div>
                  {!fromMe && (
                    <div
                      onClick={() =>
                        setReplying({
                          id: message.id,
                          message:
                            message.message.slice(0, 80) +
                            (message.message.length > 80 ? "..." : ""),
                        })
                      }
                      className="flex rounded text-sm items-center bg-zinc-900 w-fit gap-x-2 cursor-pointer px-1.5 py-0.5"
                    >
                      <FaReply size={15} />
                      Reply
                    </div>
                  )}
                </div>
              </div>
              {fromMe && firstMessage && (
                <Link
                  href={`/users/${(session.user as typeof session.user & { username: string }).username}`}
                  className="absolute -right-15 top-0"
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
          </div>
        );
      })}
      <div ref={messageRef} />
    </div>
  );
}

export default Messages;
