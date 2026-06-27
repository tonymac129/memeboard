"use client";

import type { User } from "@/app/generated/prisma/client";
import type { PreviewType } from "@/app/chat/layout";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useRealtime } from "@/lib/realtime-client";
import Image from "next/image";
import Link from "next/link";

interface FriendProps {
  friend: User;
  prev: PreviewType | null;
}

function Friend({ friend, prev }: FriendProps) {
  const [preview, setPreview] = useState<PreviewType | null>(prev);
  const { username } = useParams();

  useRealtime({
    events: ["chat.message"],
    onData: (data) => {
      const newMessage = JSON.parse(data.data);
      if (newMessage.chatId === preview?.channel) {
        setPreview({
          userId: newMessage.from,
          from: newMessage.from === friend.id ? friend.name : "You",
          channel: newMessage.chatId,
          message: newMessage.message,
        });
      }
    },
  });

  return (
    <Link
      href={`/chat/${friend.username}`}
      key={friend.id}
      className={`flex gap-x-3 items-center px-4 py-2 rounded hover:bg-zinc-900 text-zinc-300 ${username === friend.username && "font-bold text-green-500! bg-zinc-900"}`}
    >
      <Image
        src={friend.image || "/icons/default-avatar.svg"}
        alt="Avatar"
        width={45}
        height={45}
        className="rounded-full"
      />
      <div className="flex flex-col gap-y-1">
        <h2>{friend.name}</h2>
        {preview && (
          <p className="text-xs font-normal">
            {preview.from}:{" "}
            {preview.message.slice(0, 20) +
              (preview.message.length > 20 ? "..." : "")}
          </p>
        )}
      </div>
    </Link>
  );
}

export default Friend;
