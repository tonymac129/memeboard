"use client";

import type { ReactionType } from "@/types/Chat";

interface ReactionProps {
  reaction: ReactionType;
  reacted: boolean;
  messageId: string;
  handleReact: (messageId: string, emoji: string) => Promise<void>;
}

function Reaction({
  reaction,
  reacted,
  messageId,
  handleReact,
}: ReactionProps) {
  return (
    <div
      className={`border border-zinc-700 rounded px-2 py-0.5 flex gap-x-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900 ${reacted && "border-green-600! dark:border-green-500! bg-zinc-200 dark:bg-zinc-900"}`}
      onClick={() => handleReact(messageId, reaction.emoji)}
    >
      <span>{reaction.emoji}</span>
      {reaction.count.length}
    </div>
  );
}

export default Reaction;
