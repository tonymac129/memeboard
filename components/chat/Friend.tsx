"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/app/generated/prisma/client";

function Friend({ friend }: { friend: User }) {
  const { username } = useParams();

  return (
    <Link
      href={`/chat/${friend.username}`}
      key={friend.id}
      className={`flex gap-x-3 items-center px-4 py-2 rounded hover:bg-zinc-900 text-zinc-300 ${username === friend.username && "font-bold text-green-500! bg-zinc-900"}`}
    >
      <Image
        src={friend.image || "/icons/default-avatar.svg"}
        alt="Avatar"
        width={45}
        height={45}
        className="rounded-full"
      />
      {friend.name}
    </Link>
  );
}

export default Friend;
