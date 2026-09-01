"use client";

import type { Comment, User } from "@/app/generated/prisma/client";
import { useState, useEffect } from "react";
import Link from "next/link";

type CommentType = Comment & {
  user: User;
  likedBy: User[];
};

function EmbeddedComment({ commentId }: { commentId: number }) {
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
      {comment ? (
        <Link
          href={`/memes/${comment.memeId}#${comment.id}`}
          className="rounded flex flex-col gap-y-3 border-2 border-zinc-700 p-2 w-70 backdrop-brightness-50"
        >
          <div className="text-sm">
            Comment by {comment.user.name} •{" "}
            {new Date(comment.createdAt).toLocaleDateString()}
          </div>
          <div className="text-white">{comment.content}</div>
          <div className="text-sm flex gap-x-2">
            <span>
              {comment.likedBy.length} like
              {comment.likedBy.length == 1 ? "" : "s"}
            </span>
          </div>
        </Link>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default EmbeddedComment;
