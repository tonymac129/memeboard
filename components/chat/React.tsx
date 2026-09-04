"use client";

import type { Emoji } from "@emoji-mart/data";
import { useRef, useState, useEffect } from "react";
import { GrEmoji } from "react-icons/gr";
import { reactMessage } from "@/app/chat/[username]/actions";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

type EmojiType = Emoji & {
  native: string;
};

interface ReactProps {
  chatId: string;
  messageId: string;
}

function React({ chatId, messageId }: ReactProps) {
  const [reacting, setReacting] = useState<boolean>(false);
  const reactionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickListener = (e: Event) => {
      if (!reactionRef.current?.contains(e.target as Node)) {
        setReacting(false);
      }
    };
    document.addEventListener("click", clickListener);
    return () => {
      document.removeEventListener("click", clickListener);
    };
  }, []);

  async function handleReact(emoji: EmojiType) {
    await reactMessage(chatId, messageId, emoji.native);
    setReacting(false);
  }

  return (
    <div className="relative" ref={reactionRef}>
      <div
        onClick={() => setReacting(true)}
        className="flex rounded text-sm items-center bg-zinc-200 dark:bg-zinc-900 w-fit gap-x-2 cursor-pointer px-1.5 py-0.5"
      >
        <GrEmoji size={18} />
        <span className="hidden md:block">React</span>
      </div>
      {reacting && (
        <div className="absolute bottom-8">
          <Picker
            data={data}
            onEmojiSelect={handleReact}
            previewPosition="none"
          />
        </div>
      )}
    </div>
  );
}

export default React;
