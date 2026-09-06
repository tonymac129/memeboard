"use client";

import type { User } from "@/app/generated/prisma/client";
import type { CommentType as NewCommentType } from "@/types/Meme";
import type { CommentType } from "./Comment";
import { useState } from "react";
import { likeComment, postComment } from "@/app/memes/[id]/actions";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ReportModal from "../meme/ReportModal";
import ShareModal from "../meme/ShareModal";
import Input from "../ui/Input";
import Btn from "../ui/Btn";

const optionStyles =
  "font-bold cursor-pointer hover:text-green-600 dark:hover:text-green-500";

interface ReplyProps {
  comment: CommentType;
  likedComment: boolean;
  userId: string;
  memeId: number;
  friends: User[];
}

function Reply({ comment, likedComment, userId, memeId, friends }: ReplyProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [replying, setReplying] = useState<boolean>(false);
  const [sharing, setSharing] = useState<boolean>(false);
  const [reporting, setReporting] = useState<boolean>(false);
  const [newReply, setNewReply] = useState<NewCommentType>({
    id: 0,
    content: "",
    createdAt: new Date(),
    userId,
    memeId,
  });
  const router = useRouter();

  async function handleLike() {
    if (userId) {
      await likeComment(!likedComment, comment.id, memeId);
    } else {
      router.push("/login");
    }
  }

  async function handlePost() {
    setLoading(true);
    await postComment(newReply, comment.id);
    setNewReply({ ...newReply, content: "" });
    setLoading(false);
    setReplying(false);
  }

  function handleCancel() {
    setReplying(false);
    setNewReply({ ...newReply, content: "" });
  }

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex gap-x-5 text-black dark:text-zinc-300 text-sm">
        <div
          className="cursor-pointer flex items-center gap-x-2"
          title={`${likedComment ? "Unl" : "L"}ike comment`}
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
          className={optionStyles}
          onClick={() => (userId ? setReplying(true) : router.push("/login"))}
        >
          Reply
        </div>
        <div className={optionStyles} onClick={() => setSharing(true)}>
          Share
        </div>
        <div className={optionStyles} onClick={() => setReporting(true)}>
          Report
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
            <Btn text="Cancel" onclick={handleCancel} />
          </div>
        </>
      )}
      <AnimatePresence>
        {reporting && (
          <ReportModal memeId={memeId} setReporting={setReporting} />
        )}
        {sharing && (
          <ShareModal
            memeId={memeId}
            friends={friends}
            setSharing={setSharing}
            setReporting={setReporting}
            isComment={comment.id}
            content={comment.content}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Reply;
