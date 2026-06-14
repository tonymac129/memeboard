import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Hero from "@/components/layout/Hero";
import Memes from "./Memes";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Memes | MemeBoard",
  description:
    "Browse, search, explore, and discover all kinds of memes curated by the community here with custom tags and filters!",
};

async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  const memes = await prisma.meme.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      upvotes: true,
      downvotes: true,
    },
  });
  const userData = await prisma.user.findUnique({
    where: { id: session?.user.id },
  });
  const friends = userData
    ? await prisma.user.findMany({
        where: {
          AND: [
            {
              followers: {
                some: { id: userData.id },
              },
            },
            {
              following: {
                some: { id: userData.id },
              },
            },
          ],
        },
      })
    : [];

  return (
    <div className="px-50 pb-30">
      <Hero
        text="Explore Memes"
        description="Browse, search, explore, and discover all kinds of memes curated by the community here with custom tags and filters!"
      />
      <Memes memes={memes} friends={friends} userId={userData?.id || ""} />
    </div>
  );
}

//TODO: maybe put the sorting/filtering and flex wrap grid into a reusable component for all instances of displaying memes

export default Page;
