"use client";

import { useState } from "react";
import Input from "../ui/Input";

function MessageInput({ name }: { name: string }) {
  const [message, setMessage] = useState<string>("");

  return (
    <Input
      placeholder={`Message ${name}`}
      value={message}
      setValue={(m) => setMessage(m)}
      styles="w-full"
    />
  );
}

export default MessageInput;
