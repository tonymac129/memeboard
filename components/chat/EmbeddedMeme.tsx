"use client";

import type { Comment, Meme, User } from "@/app/generated/prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

type MemeType = Meme & {
  user: User;
  comments: Comment[];
  upvotes: User[];
  downvotes: User[];
};

function EmbeddedMeme({ memeId }: { memeId: number }) {
  const [meme, setMeme] = useState<MemeType | null>(null);

  useEffect(() => {
    async function fetchMeme() {
      const res = await fetch(`/api/meme?memeId=${memeId}`).then((res) =>
        res.json(),
      );
      setMeme(res);
    }
    fetchMeme();
  }, [memeId]);

  return (
    <>
      {meme ? (
        <Link
          href={`/memes/${memeId}`}
          className="rounded flex flex-col gap-y-3 border-2 border-zinc-700 p-2 w-70 backdrop-brightness-50"
        >
          <div className="text-sm">Created by {meme.user.name}</div>
          <h2 className="text-xl font-bold text-white">{meme.title}</h2>
          <Image
            src={meme.image}
            alt="Meme image"
            width={150}
            height={150}
            className="rounded w-full"
          />
          <div className="text-sm flex gap-x-2">
            <span>{meme.upvotes.length - meme.downvotes.length} votes</span>•
            <span>{meme.comments.length} comments</span>•
            <span>{meme.shares} shares</span>
          </div>
        </Link>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default EmbeddedMeme;
