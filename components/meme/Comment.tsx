import type { User } from "@/app/generated/prisma/client";
import type { CommentType } from "@/types/Meme";
import Image from "next/image";
import Link from "next/link";

interface CommentProps {
  comment: CommentType;
  user: User;
}

function Comment({ comment, user }: CommentProps) {
  return (
    <div className="border-2 border-zinc-700 rounded flex flex-col gap-y-3 p-5">
      <div className="flex items-center gap-x-3 text-zinc-300">
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-x-3 font-bold hover:text-green-500"
        >
          <Image
            src={user.image || "/icons/default-avatar.svg"}
            alt="Avatar"
            width={35}
            height={35}
            className="rounded-full"
          />
          {user.name}
        </Link>{" "}
        •{" "}
        <span className="text-sm" title={comment.createdAt.toISOString()}>
          {comment.createdAt.toLocaleDateString()}
        </span>
      </div>
      <p className="text-zinc-300">{comment.content}</p>
    </div>
  );
}

export default Comment;
