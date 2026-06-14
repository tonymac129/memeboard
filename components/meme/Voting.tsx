"use client";

import type { MemeType } from "./MemeBar";
import {
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from "react-icons/bi";
import { vote } from "@/app/memes/[id]/actions";

interface VotingProps {
  meme: MemeType;
  upvoted: boolean | null;
}

function Voting({ meme, upvoted }: VotingProps) {
  async function handleVote(state: boolean | null) {
    await vote(meme.id, state);
  }

  return (
    <div
      className={`w-fit border-2 border-zinc-700 rounded cursor-pointer flex items-center gap-x-2 text-zinc-300 font-bold text-base ${upvoted ? "bg-green-700" : upvoted === false ? "bg-red-900" : ""}`}
    >
      <div
        onClick={() => handleVote(upvoted ? null : true)}
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
        onClick={() => handleVote(upvoted === false ? null : false)}
        className={upvoted === null ? "hover:bg-zinc-900" : ""}
      >
        {upvoted === false ? (
          <BiSolidDownvote size={33} className="p-2" />
        ) : (
          <BiDownvote size={33} className="p-2" />
        )}
      </div>
    </div>
  );
}

export default Voting;
