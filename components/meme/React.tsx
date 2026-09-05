"use client";

import type { Emoji } from "@emoji-mart/data";
import { useRef, useState, useEffect } from "react";
import { FaFaceGrin } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { react } from "@/app/memes/[id]/actions";

type EmojiType = Emoji & {
  native: string;
};

function React({ memeId }: { memeId: number }) {
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
    await react(memeId, emoji.native);
    setReacting(false);
  }

  return (
    <div className="relative" ref={reactionRef}>
      <div
        onClick={() => setReacting(true)}
        className="border-2 border-zinc-700 rounded cursor-pointer px-3 py-1.5 flex items-center gap-x-2 text-sm text-black dark:text-zinc-300 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-900"
      >
        <FaFaceGrin size={18} />
        <span className="hidden md:block">React</span>
      </div>
      <AnimatePresence>
        {reacting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute bottom-8 origin-bottom-left"
          >
            <Picker
              data={data}
              onEmojiSelect={handleReact}
              previewPosition="none"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default React;
