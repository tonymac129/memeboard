import type { MessageType } from "@/types/Chat";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redis } from "@/lib/redis";
import Provider from "@/components/chat/Provider";
import Friend from "@/components/chat/Friend";
import MemeBot from "@/components/chat/MemeBot";
import AddFriend from "@/components/chat/AddFriend";

export interface PreviewType {
  userId: string;
  from: string;
  channel: string;
  message: string;
}

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const friends = session
    ? await prisma.user.findMany({
        where: {
          AND: [
            {
              followers: {
                some: { id: session?.user.id },
              },
            },
            {
              following: {
                some: { id: session?.user.id },
              },
            },
          ],
        },
      })
    : [];
  const chats = session
    ? await prisma.chat.findMany({
        where: {
          OR: [{ userId1: session.user.id }, { userId2: session.user.id }],
        },
      })
    : [];
  const previews: (PreviewType | null)[] = session
    ? await Promise.all(
        chats.map(async (chat) => {
          const message: MessageType = await redis.lindex(
            `messages:${chat.id}`,
            -1,
          );
          if (message) {
            const friend = friends.find((f) => f.id === message.from);
            return {
              userId:
                chat.userId1 === session.user.id ? chat.userId2 : chat.userId1,
              from:
                message.from === session.user.id
                  ? "You"
                  : friend?.name || "MemeBot",
              channel: chat.id,
              message: message.deleted ? "Deleted message" : message.message,
            };
          }
          return null;
        }),
      )
    : [];
  const unfriended = await prisma.user.findMany({
    where: {
      NOT: [
        {
          id: session?.user.id,
        },
        {
          username: "memebot",
        },
      ],
      OR: [
        { followers: { none: { id: session?.user.id } } },
        { following: { none: { id: session?.user.id } } },
      ],
    },
    include: { followers: true },
  });

  return (
    <div className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 h-[calc(100vh-68px)] flex">
      <div className="w-[35%] max-w-70 border-r-2 border-zinc-700 flex flex-col pr-5 py-2 gap-y-3 h-full overflow-auto">
        <h2 className="text-center text-white font-bold text-xl pt-3">
          Friends
        </h2>
        <Provider>
          <MemeBot />
          {friends.map((friend) => {
            return (
              <Friend
                key={friend.id}
                friend={friend}
                prev={
                  previews.find((chat) => chat?.userId === friend.id) || null
                }
              />
            );
          })}
        </Provider>
        {session && <AddFriend users={unfriended} userId={session.user.id} />}
      </div>
      <div className="w-[65%] md:flex-1">
        <Provider>{children}</Provider>
      </div>
    </div>
  );
}
