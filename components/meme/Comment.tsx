import type { User, Comment } from "@/app/generated/prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { displayTime } from "@/lib/calc";
import Reply from "../comment/Reply";
import Image from "next/image";
import Link from "next/link";
import Options from "../comment/Options";

export type CommentType = Comment & {
  likedBy: User[];
  replies?: CommentType[];
  user: User;
};

interface CommentProps {
  comment: CommentType;
  memeId: number;
}

//TODO: move comment.tsx and commentfield.tsx to the comment folder
//TODO: add share comment to chat feature

async function Comment({ comment, memeId }: CommentProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const likedComment = comment.likedBy.find((c) => c.id === session?.user.id)
    ? true
    : false;
  const hasUpdated =
    comment.createdAt.getTime() !== comment.updatedAt.getTime();

  return (
    <div className="w-full relative border-2 border-zinc-700 rounded flex flex-col gap-y-3 p-5">
      <div className="flex items-center gap-x-3 text-zinc-300">
        <Link
          href={`/users/${comment.user.username}`}
          className="flex items-center gap-x-3 font-bold hover:text-green-500"
        >
          <Image
            src={comment.user.image || "/icons/default-avatar.svg"}
            alt="Avatar"
            width={35}
            height={35}
            className="rounded-full"
          />
          {comment.user.name}
        </Link>{" "}
        •{" "}
        <span className="text-sm" title={comment.createdAt.toISOString()}>
          {hasUpdated && "Posted "}
          {displayTime(comment.createdAt.getTime()) ||
            comment.createdAt.toLocaleDateString()}
        </span>
        {hasUpdated && (
          <>
            •
            <span className="text-sm" title={comment.updatedAt.toISOString()}>
              Updated{" "}
              {displayTime(comment.updatedAt.getTime()) ||
                comment.updatedAt.toLocaleDateString()}
            </span>
          </>
        )}
      </div>
      <p className="text-zinc-300">{comment.content}</p>
      <Reply
        comment={comment}
        likedComment={likedComment}
        userId={session?.user.id || ""}
        memeId={memeId}
      />
      {comment.replies && (
        <div className="flex flex-col gap-y-3">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} memeId={memeId} />
          ))}
        </div>
      )}
      {session?.user.id === comment.userId && (
        <Options comment={comment} userId={session.user.id} />
      )}
    </div>
  );
}

export default Comment;
