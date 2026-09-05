import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { FaImage } from "react-icons/fa";
import { BiSolidCollection } from "react-icons/bi";
import { IoChatbubbles } from "react-icons/io5";
import Hero from "@/components/layout/Hero";
import Section from "@/components/layout/Section";
import MemeCard from "@/components/meme/MemeCard";
import UserCard from "@/components/user/UserCard";
import Btn from "@/components/ui/Btn";

const headerStyles =
  "w-fit text-2xl text-green-600 dark:text-green-500 font-bold";

async function Page() {
  const weekStart = new Date(
    new Date().setHours(0, 0, 0, 0) - 3600000 * 24 * 7,
  );
  const recent = await prisma.meme.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: true, upvotes: true, downvotes: true },
  });
  const top = await prisma.meme.findMany({
    where: { createdAt: { gt: weekStart } },
    orderBy: { upvotes: { _count: "desc" } },
    take: 5,
    include: { user: true, upvotes: true, downvotes: true },
  });
  const topAll = await prisma.meme.findMany({
    orderBy: { upvotes: { _count: "desc" } },
    take: 5,
    include: { user: true, upvotes: true, downvotes: true },
  });
  const session = await auth.api.getSession({ headers: await headers() });
  const friends = session
    ? await prisma.meme.findMany({
        where: {
          user: {
            followers: { some: { id: session.user.id } },
            following: { some: { id: session.user.id } },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: true, upvotes: true, downvotes: true },
      })
    : [];
  const chats = session
    ? await prisma.chat.findMany({
        where: {
          OR: [
            {
              userId1: session.user.id,
              OR: [
                { userId2: "memebot" },
                {
                  user2: {
                    followers: { some: { id: session.user.id } },
                    following: { some: { id: session.user.id } },
                  },
                },
              ],
            },
            {
              userId2: session.user.id,
              OR: [
                { userId1: "memebot" },
                {
                  user1: {
                    followers: { some: { id: session.user.id } },
                    following: { some: { id: session.user.id } },
                  },
                },
              ],
            },
          ],
        },
        include: { user1: true, user2: true },
        take: 5,
      })
    : [];

  return (
    <div className="max-w-400 mx-auto flex flex-col gap-y-5 px-5 sm:px-20 lg:px-50 pb-30">
      <Hero
        text="Welcome to MemeBoard!"
        description="Explore the trendiest memes, upload your own creations, chat with your friends, interact with the community, and more!"
      />
      {!session && (
        <div className="flex gap-x-5 justify-center mb-5">
          <Btn href="/memes" text="Browse memes" primary />
          <Btn href="/login" text="Log in" primary />
          <Btn
            href="https://github.com/tonymac129/memeboard"
            text="Learn more"
          />
        </div>
      )}
      <div className="flex gap-3 pb-5 flex-wrap">
        <Section
          href="/memes"
          title="Memes"
          description="Post your own creations, browse community
              memes by tags, and view discussion comments."
        >
          <FaImage size={30} />
        </Section>
        <Section
          href="/collections"
          title="Collections"
          description="Curate your own public or private meme tags and
              collections to make organizing different
              memes easier."
        >
          <BiSolidCollection size={30} />
        </Section>
        <Section
          href="/chat"
          title="Chat"
          description="Interact with the useless MemeBot or friend other people to chat and share memes/comments in realtime."
        >
          <IoChatbubbles size={30} />
        </Section>
      </div>
      <div className="flex flex-col gap-y-5">
        <h2 className={headerStyles}>Most recent posts ({recent.length})</h2>
        <div className="flex gap-5 flex-wrap">
          {recent.map((meme, i) => (
            <MemeCard key={meme.id} meme={meme} index={i} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-y-5">
        <h2 className={headerStyles}>Top posts this week ({top.length})</h2>
        <div className="flex gap-5 flex-wrap">
          {top.length > 0 ? (
            top.map((meme, i) => (
              <MemeCard key={meme.id} meme={meme} index={i} />
            ))
          ) : (
            <div className="py-5 text-black dark:text-zinc-300">
              Nothing was posted in the past 7 days, weird...
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-y-5">
        <h2 className={headerStyles}>All time top posts ({topAll.length})</h2>
        <div className="flex gap-5 flex-wrap">
          {topAll.map((meme, i) => (
            <MemeCard key={meme.id} meme={meme} index={i} />
          ))}
        </div>
      </div>
      {session && (
        <>
          <div className="flex flex-col gap-y-5">
            <h2 className={headerStyles}>
              Your friends&apos; posts ({friends.length})
            </h2>
            <div className="flex gap-5 flex-wrap">
              {friends.length > 0 ? (
                friends.map((meme, i) => (
                  <MemeCard key={meme.id} meme={meme} index={i} />
                ))
              ) : (
                <div className="py-5 text-black dark:text-zinc-300">
                  You either don&apos;t have any friends, or they haven&apos;t
                  posted anything yet :(
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-y-5">
            <h2 className={headerStyles}>Recent chats ({chats.length})</h2>
            <div className="flex gap-5 flex-wrap">
              {chats.length > 0 ? (
                chats.map((chat) => {
                  const targetUser =
                    chat.userId1 === session.user.id ? chat.user2 : chat.user1;
                  return (
                    <UserCard
                      key={chat.id}
                      user={targetUser}
                      link={`/chat/${targetUser.username}`}
                    />
                  );
                })
              ) : (
                <div className="py-5 text-black dark:text-zinc-300">
                  You either don&apos;t have any friends, or you haven&apos;t
                  chatted with them yet :(
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

//TODO: add lazy loading/loading indicator for certain pages
//TODO: add page transition animation

export default Page;
