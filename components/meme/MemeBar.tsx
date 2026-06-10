"use client";

import type { Collection, Meme, User } from "@/app/generated/prisma/client";
import {
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from "react-icons/bi";
import { FaBookmark, FaRegBookmark, FaShare } from "react-icons/fa";
import { useState, useEffect, useMemo } from "react";
import { vote } from "@/app/memes/[id]/actions";
import { AnimatePresence } from "framer-motion";
import CollectionModal from "./CollectionModal";

const optionStyles =
  "border-2 border-zinc-700 rounded cursor-pointer px-3 py-1.5 flex items-center gap-x-2 text-sm text-zinc-300 font-bold";

type MemeType = Meme & {
  upvotes: User[];
  downvotes: User[];
};

export type CollectionType = Collection & {
  memes: Meme[];
};

interface MemeBarProps {
  meme: MemeType;
  userId?: string;
  collections: CollectionType[];
}

function MemeBar({ meme, userId, collections }: MemeBarProps) {
  const [collection, setCollection] = useState<boolean>(false);
  const [upvoted, setUpvoted] = useState<boolean | null>(
    userId
      ? meme.upvotes.find((u) => u.id === userId)
        ? true
        : meme.downvotes.find((u) => u.id === userId)
          ? false
          : null
      : null,
  );
  const savedCollections = useMemo(() => {
    return collections.filter(
      (c) => c.memes.filter((m) => m.id === meme.id).length > 0,
    );
  }, [collections, meme.id]);

  //TODO: make unauthenticated users unable to interact with the things
  useEffect(() => {
    async function castVote() {
      await vote(meme.id, upvoted);
    }
    castVote();
  }, [upvoted, meme.id]);

  return (
    <div className="flex gap-x-5 items-center">
      <div
        className={
          optionStyles +
          ` p-0! text-base! ${upvoted ? "bg-green-700" : upvoted === false ? "bg-red-900" : ""}`
        }
      >
        <div
          onClick={() => setUpvoted(upvoted ? null : true)}
          className={upvoted === null ? "hover:bg-zinc-900" : ""}
        >
          {upvoted ? (
            <BiSolidUpvote size={33} className="p-2" />
          ) : (
            <BiUpvote size={33} className="p-2" />
          )}
        </div>
        {meme.upvotes.length - meme.downvotes.length}
        <div
          onClick={() => setUpvoted(upvoted === false ? null : false)}
          className={upvoted === null ? "hover:bg-zinc-900" : ""}
        >
          {upvoted === false ? (
            <BiSolidDownvote size={33} className="p-2" />
          ) : (
            <BiDownvote size={33} className="p-2" />
          )}
        </div>
      </div>
      <div
        className={optionStyles + " hover:bg-zinc-900"}
        onClick={() => setCollection(true)}
      >
        {savedCollections.length > 0 ? (
          <FaBookmark className="text-yellow-500" size={18} />
        ) : (
          <FaRegBookmark size={18} />
        )}
        Save
        {savedCollections.length > 0 ? `d (${savedCollections.length})` : ""}
      </div>
      <div className={optionStyles + " hover:bg-zinc-900"}>
        <FaShare size={18} />
        Share
      </div>
      <AnimatePresence>
        {collection && (
          <CollectionModal
            userId={userId as string}
            memeId={meme.id}
            collections={collections}
            setCollection={setCollection}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default MemeBar;
