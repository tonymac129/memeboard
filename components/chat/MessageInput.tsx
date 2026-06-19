"use client";

import type { ReplyType } from "@/types/Chat";
import { useState } from "react";
import { sendMessage } from "@/app/chat/[username]/actions";
import { FaXmark } from "react-icons/fa6";
import Input from "../ui/Input";

interface MessageInputProps {
  name: string;
  id: string;
  replying: ReplyType | null;
  setReplying: React.Dispatch<React.SetStateAction<ReplyType | null>>;
}

function MessageInput({ name, id, replying, setReplying }: MessageInputProps) {
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (message.trim().length > 0) {
      await sendMessage(message, id, replying);
      setMessage("");
      setReplying(null);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      {replying && (
        <div
          className="absolute w-full rounded-t px-4 py-2 text-sm border-2 border-b-0 border-zinc-700
         text-zinc-300 bottom-[calc(100%-4px)] bg-zinc-900 flex items-center justify-between"
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
  );
}

export default MessageInput;
