import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Provider from "@/components/chat/Provider";
import Friend from "@/components/chat/Friend";

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

  return (
    <div className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 h-[calc(100vh-68px)] flex">
      <div className="w-[35%] max-w-70 border-r-2 border-zinc-700 flex flex-col pr-5 py-2 gap-y-3 h-full overflow-auto">
        <h2 className="text-center text-white font-bold text-xl pt-3">
          Friends
        </h2>
        {friends.map((friend) => {
          return <Friend key={friend.id} friend={friend} />;
        })}
      </div>
      <div className="w-[65%] md:flex-1">
        <Provider>{children}</Provider>
      </div>
    </div>
  );
}
