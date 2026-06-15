"use client";

import type { MessageType } from "@/types/Chat";
import { useRealtime } from "@/lib/realtime-client";
import { useState, useEffect, useRef } from "react";

function Messages({ messages }: { messages: MessageType[] }) {
  const [allMessages, setAllMessages] = useState<MessageType[]>(messages);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [allMessages]);

  useRealtime({
    events: ["chat.message"],
    onData: (data) => {
      setAllMessages((prev) => [
        ...prev,
        { created: new Date(), message: data.data },
      ]);
    },
  });

  return (
    <div className="flex flex-col gap-y-3 w-full px-5">
      {allMessages.map((message, i) => (
        <div key={i} className="text-zinc-300 flex flex-col gap-y-1">
          <div className="text-sm">
            {new Date(message.created).toLocaleDateString()}
          </div>
          <div className="bg-zinc-900 rounded px-4 py-2 w-fit">
            {message.message}
          </div>
        </div>
      ))}
      <div ref={messageRef} />
    </div>
  );
}

export default Messages;
