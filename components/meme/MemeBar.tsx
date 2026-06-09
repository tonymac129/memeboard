"use client";

import type { Meme, User } from "@/app/generated/prisma/client";
import {
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from "react-icons/bi";
import { FaRegBookmark, FaShare } from "react-icons/fa";
import { useState, useEffect } from "react";
import { vote } from "@/app/memes/[id]/actions";

const optionStyles =
  "border-2 border-zinc-700 rounded cursor-pointer px-3 py-1.5 flex items-center gap-x-2 text-sm text-zinc-300 font-bold";

type MemeType = Meme & {
  upvotes: User[];
  downvotes: User[];
};

interface MemeBarProps {
  meme: MemeType;
  userId?: string;
}

function MemeBar({ meme, userId }: MemeBarProps) {
  const [upvoted, setUpvoted] = useState<boolean | null>(
    userId
      ? meme.upvotes.find((u) => u.id === userId)
        ? true
        : meme.downvotes.find((u) => u.id === userId)
          ? false
          : null
      : null,
  );
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
      <div className={optionStyles + " hover:bg-zinc-900 "}>
        <FaRegBookmark size={18} />
        Save
      </div>
      <div className={optionStyles + " hover:bg-zinc-900 "}>
        <FaShare size={18} />
        Share
      </div>
    </div>
  );
}

export default MemeBar;
