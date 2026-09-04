"use client";

import type { Meme, User } from "@/app/generated/prisma/client";
import { displayTime } from "@/lib/calc";
import { authClient } from "@/lib/auth-client";
import Voting from "./Voting";
import Link from "next/link";
import Image from "next/image";

export type MemeType = Meme & {
  user: User;
  upvotes: User[];
  downvotes: User[];
};

function MemeCard({ meme }: { meme: MemeType }) {
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;
  const upvoted = userId
    ? meme.upvotes.find((u) => u.id === userId)
      ? true
      : meme.downvotes.find((u) => u.id === userId)
        ? false
        : null
    : null;

  return (
    <Link
      href={`/memes/${meme.id}`}
      className="flex flex-col gap-y-3 px-5 py-3 w-65 border-zinc-700 border-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-900 has-[.voting:hover]:bg-zinc-100 dark:has-[.voting:hover]:bg-zinc-950"
    >
      <div className="flex items-center gap-x-3 text-black dark:text-zinc-300">
        <div
          onClick={(e) => {
            e.preventDefault();
            window.open(`/users/${meme.user.username}`, "_top");
          }}
          className="flex items-center gap-x-3 font-bold hover:text-green-600 dark:hover:text-green-500"
        >
          <Image
            src={meme.user.image || "/icons/default-avatar.svg"}
            alt="Avatar"
            width={35}
            height={35}
            className="rounded-full"
          />
          {meme.user.name}
        </div>{" "}
        •{" "}
        <span className="text-sm" title={meme.createdAt.toISOString()}>
          {displayTime(meme.createdAt.getTime()) ||
            meme.createdAt.toLocaleDateString()}
        </span>
      </div>
      <h2 className="text-black dark:text-white text-xl font-bold">
        {meme.title}
      </h2>
      <Image
        src={meme.image}
        alt="Meme image"
        width={400}
        height={400}
        className="w-auto h-50 rounded object-contain"
      />
      <div
        onClick={(e) => {
          e.preventDefault();
        }}
        className="voting"
      >
        <Voting meme={meme} upvoted={upvoted} />
      </div>
    </Link>
  );
}

export default MemeCard;
