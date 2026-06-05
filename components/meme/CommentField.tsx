"use client";

import type { CommentType } from "@/types/Meme";
import { useState } from "react";
import Btn from "../ui/Btn";

interface CommentFieldProps {
  userId: string;
  memeId: number;
  postComment: (comment: CommentType) => Promise<void>;
}

function CommentField({ userId, memeId, postComment }: CommentFieldProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<CommentType>({
    id: 0,
    content: "",
    createdAt: new Date(),
    userId,
    memeId,
  });

  async function handlePost() {
    setLoading(true);
    await postComment(newComment);
    setNewComment((prev) => {
      return { ...prev, content: "" };
    });
    setLoading(false);
  }

  return (
    <div className="w-120 flex flex-col gap-y-3">
      <h2 className="text-lg font-bold text-white">New comment</h2>
      <textarea
        className="text-base border-2 border-zinc-700 rounded px-4 py-2 text-zinc-300 outline-none resize-none h-30"
        placeholder="What do you think of this meme?"
        value={newComment.content}
        onChange={(e) =>
          setNewComment({ ...newComment, content: e.target.value })
        }
      ></textarea>
      <Btn
        text={loading ? "Loading..." : "Post"}
        styles="w-fit"
        onclick={handlePost}
        primary
      />
    </div>
  );
}

export default CommentField;
