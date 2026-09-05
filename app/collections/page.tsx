import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Hero from "@/components/layout/Hero";
import Collections from "./Collections";
import CreateCollection from "@/components/collection/CreateCollection";

export const metadata: Metadata = {
  title: "Collections | MemeBoard",
  description:
    "Browse public custom curated meme collections other people created or manage your own here!",
  authors: [{ name: "tonymac129", url: "https://tonymac.net" }],
  openGraph: {
    title: "Collections | MemeBoard",
    description:
      "Browse public custom curated meme collections other people created or manage your own here!",
    url: "https://memeboard-app.vercel.app/collections",
    siteName: "MemeBoard",
    images: [
      {
        url: "/logo.png",
        width: 100,
        height: 100,
      },
    ],
    type: "website",
  },
};

async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  const collections = await prisma.collection.findMany({
    where: { OR: [{ public: true }, { userId: session?.user.id }] },
    include: { memes: true, user: true },
  });
  const friends = session
    ? await prisma.user.findMany({
        where: {
          followers: { some: { id: session.user.id } },
          following: { some: { id: session.user.id } },
        },
      })
    : [];
  const friendIds = friends.map((f) => f.id);

  return (
    <div className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 pb-30 relative">
      <Hero
        text="Collections"
        description="Browse public custom curated meme collections other people created or create and manage your own here!"
      />
      <Collections
        userId={session?.user.id}
        friendIds={friendIds}
        collections={collections}
      />
      {session && <CreateCollection />}
    </div>
  );
}

export default Page;
