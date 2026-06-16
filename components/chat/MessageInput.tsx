"use client";

import { useState } from "react";
import { sendMessage } from "@/app/chat/[username]/actions";
import Input from "../ui/Input";

interface MessageInputProps {
  name: string;
  id: string;
}

function MessageInput({ name, id }: MessageInputProps) {
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (message.trim().length > 0) {
      await sendMessage(message, id);
      setMessage("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Input
        placeholder={`Message ${name}`}
        value={message}
        setValue={(m) => setMessage(m)}
        styles="w-full"
      />
      <button type="submit" className="hidden" />
    </form>
  );
}

export default MessageInput;
