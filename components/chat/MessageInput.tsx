"use client";

import type { ReplyType } from "@/types/Chat";
import { useState } from "react";
import { sendMessage } from "@/app/chat/[username]/actions";
import { FaXmark } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import Input from "../ui/Input";
import Link from "next/link";

interface MessageInputProps {
  name: string;
  id: string;
  replying: ReplyType | null;
  setReplying: React.Dispatch<React.SetStateAction<ReplyType | null>>;
}

function MessageInput({ name, id, replying, setReplying }: MessageInputProps) {
  const [message, setMessage] = useState<string>("");
  const { data: session } = authClient.useSession();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (message.trim().length > 0) {
      await sendMessage(message, id, replying);
      setMessage("");
      setReplying(null);
    }
  }

  return session ? (
    <form onSubmit={handleSubmit} className="w-full relative">
      {replying && (
        <div
          className="absolute w-full rounded-t px-4 py-2 text-sm border-2 border-b-0 border-zinc-700
         text-black dark:text-zinc-300 bottom-[calc(100%-4px)] bg-zinc-200 dark:bg-zinc-900 flex items-center justify-between"
        >
          Replying to message: {replying.message}
          <FaXmark
            size={20}
            className="cursor-pointer"
            title="Cancel"
            onClick={() => setReplying(null)}
          />
        </div>
      )}
      <Input
        placeholder={`Message ${name}`}
        value={message}
        setValue={(m) => setMessage(m)}
        styles="w-full py-3"
      />
      <button type="submit" className="hidden" />
    </form>
  ) : (
    <div className="bg-zinc-200 dark:bg-zinc-900 rounded text-center py-3 text-black dark:text-zinc-300 w-full relative">
      <Link
        href="/login"
        className="hover:text-green-600 dark:hover:text-green-500"
      >
        Log in
      </Link>{" "}
      to unlock chatting, posting, commenting, and other features!
    </div>
  );
}

export default MessageInput;
