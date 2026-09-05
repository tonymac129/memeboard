"use client";

import type { Comment, User } from "@/app/generated/prisma/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFaceFrown } from "react-icons/fa6";

type CommentType = Comment & {
  user: User;
  likedBy: User[];
};

interface EmbeddedCommentProps {
  commentId: number;
  profile?: boolean;
}

function EmbeddedComment({ commentId, profile }: EmbeddedCommentProps) {
  const [comment, setComment] = useState<CommentType | null>(null);

  useEffect(() => {
    async function fetchMeme() {
      const res = await fetch(`/api/comment?commentId=${commentId}`).then(
        (res) => res.json(),
      );
      setComment(res);
    }
    fetchMeme();
  }, [commentId]);

  return (
    <>
      {comment && comment.user ? (
        <Link
          href={`/memes/${comment.memeId}#${comment.id}`}
          className={`rounded flex flex-col gap-y-3 border-2 border-zinc-700 p-2 w-70 backdrop-brightness-70 dark:backdrop-brightness-50 ${profile && "bg-zinc-100 dark:bg-zinc-950 text-black dark:text-zinc-300 w-full p-4 hover:bg-zinc-200 dark:hover:bg-zinc-900"}`}
        >
          <div className="text-sm">
            {!profile && "Comment by "}
            {comment.user.name} •{" "}
            {new Date(comment.createdAt).toLocaleDateString()}
          </div>
          <div className="text-black dark:text-white">{comment.content}</div>
          <div className="text-sm flex gap-x-2">
            <span>
              {comment.likedBy.length} like
              {comment.likedBy.length == 1 ? "" : "s"}
            </span>
          </div>
        </Link>
      ) : comment ? (
        <div className="rounded flex flex-col items-center gap-y-5 border-2 border-zinc-700 py-10 w-70 backdrop-brightness-70 dark:backdrop-brightness-50">
          <FaFaceFrown size={35} />
          Comment not found
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default EmbeddedComment;
