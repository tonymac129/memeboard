"use client";

import type { CommentType as NewCommentType } from "@/types/Meme";
import type { CommentType } from "../meme/Comment";
import { useState } from "react";
import { likeComment, postComment } from "@/app/memes/[id]/actions";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Input from "../ui/Input";
import Btn from "../ui/Btn";

interface ReplyProps {
  comment: CommentType;
  likedComment: boolean;
  userId: string;
  memeId: number;
}

function Reply({ comment, likedComment, userId, memeId }: ReplyProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [replying, setReplying] = useState<boolean>(false);
  const [newReply, setNewReply] = useState<NewCommentType>({
    id: 0,
    content: "",
    createdAt: new Date(),
    userId,
    memeId,
  });

  async function handleLike() {
    await likeComment(!likedComment, comment.id, memeId);
  }

  async function handlePost() {
    setLoading(true);
    await postComment(newReply, comment.id);
    setLoading(false);
    setReplying(false);
  }

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex gap-x-5 text-zinc-300 text-sm">
        <div
          className="cursor-pointer flex items-center gap-x-2"
          title="Like comment"
          onClick={handleLike}
        >
          {likedComment ? (
            <FaHeart className="text-red-500" size={18} />
          ) : (
            <FaRegHeart size={18} />
          )}{" "}
          {comment.likedBy.length}
        </div>
        <div
          className="font-bold cursor-pointer"
          onClick={() => setReplying(true)}
        >
          Reply
        </div>
      </div>
      {replying && (
        <>
          <Input
            placeholder="Your reply"
            value={newReply.content}
            setValue={(content) =>
              setNewReply((prev) => {
                return { ...prev, content };
              })
            }
          />
          <div className="flex gap-x-3">
            <Btn
              text={loading ? "Loading..." : "Post"}
              onclick={handlePost}
              primary
            />
            <Btn text="Cancel" onclick={() => setReplying(false)} />
          </div>
        </>
      )}
    </div>
  );
}

export default Reply;
