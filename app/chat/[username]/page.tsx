import type { MessageType } from "@/types/Chat";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import MessageInput from "@/components/chat/MessageInput";
import Image from "next/image";
import Link from "next/link";
import Messages from "./Messages";

async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const userData = await prisma.user.findUnique({
    where: {
      username,
      AND: {
        followers: { some: { id: session.user.id } },
        following: { some: { id: session.user.id } },
      },
    },
    include: { followers: true, following: true },
  });
  if (!userData) redirect("/chat");
  const [userId1, userId2] = [userData.id, session.user.id].sort();
  const chat = await prisma.chat.findUnique({
    where: { userId1_userId2: { userId1, userId2 } },
  });
  const messages: MessageType[] = await redis.lrange(
    `messages:${chat?.id || ""}`,
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
        <Messages
          messages={messages}
          name={userData.name}
          userData={userData}
          id={chat?.id || ""}
        />
      </div>
      <div className="h-20 w-full flex items-center justify-center px-5">
        <MessageInput name={userData.name} id={userData.id} />
      </div>
    </div>
  );
}

export default Page;
