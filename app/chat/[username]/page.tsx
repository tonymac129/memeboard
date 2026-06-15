import type { MessageType } from "@/types/Chat";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import MessageInput from "@/components/chat/MessageInput";
import Image from "next/image";
import Link from "next/link";
import Messages from "./Messages";

async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const userData = await prisma.user.findUnique({
    where: { username },
    include: { followers: true, following: true },
  });
  if (!userData) redirect("/chat");
  const messages: MessageType[] = await redis.lrange(
    `messages:${username}`,
    0,
    -1,
  );

  return (
    <div className="flex-1 h-full">
      <div className="h-[calc(100%-80px)] flex flex-col items-center gap-y-5 py-5 overflow-auto scrollbar-none">
        <div className="flex flex-col gap-y-3 items-center text-zinc-300">
          <Image
            src={userData.image || "/icons/default-avatar.svg"}
            alt="Avatar"
            width={100}
            height={100}
            className="rounded-full"
          />
          <Link
            href={`/users/${userData.username}`}
            className="text-lg font-bold hover:text-green-500"
          >
            {userData.name}
          </Link>
          <div className="text-sm">
            {userData.followers.length} followers • {userData.following.length}{" "}
            following
          </div>
        </div>
        <Messages messages={messages} />
      </div>
      <div className="h-20 w-full flex items-center justify-center px-5">
        <MessageInput name={userData.name} username={userData.username} />
      </div>
    </div>
  );
}

export default Page;
