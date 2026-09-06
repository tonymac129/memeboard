"use client";

import { react, removeReaction } from "@/app/memes/[id]/actions";
import { useRouter } from "next/navigation";

interface EmojiProps {
  emoji: string;
  users: string[];
  userId?: string;
  memeId: number;
}

function Emoji({ emoji, users, userId, memeId }: EmojiProps) {
  const router = useRouter();

  async function handleReact() {
    if (userId) {
      if (users.includes(userId)) {
        await removeReaction(memeId);
      } else {
        await react(memeId, emoji);
      }
    } else {
      router.push("/login");
    }
  }

  return (
    <div
      onClick={handleReact}
      className={`border border-zinc-700 rounded px-3 flex gap-x-3 items-center py-1 w-fit cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900 ${users.includes(userId || "") && "bg-green-200! dark:bg-green-950! border-green-600! dark:border-green-500!"}`}
    >
      {emoji}
      <span>{users.length}</span>
    </div>
  );
}

export default Emoji;
