import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Friend from "@/components/chat/Friend";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const friends = await prisma.user.findMany({
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
  });

  return (
    <div className="px-50 h-[calc(100vh-68px)] flex">
      <div className="w-70 border-r-2 border-zinc-700 flex flex-col pr-5 py-2 gap-y-3 h-full overflow-auto">
        <h2 className="text-center text-white font-bold text-xl pt-3">
          Friends
        </h2>
        {friends.map((friend) => {
          return <Friend key={friend.id} friend={friend} />;
        })}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
