import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { FaGlobe, FaLock } from "react-icons/fa";
import Hero from "@/components/layout/Hero";
import MemeCard from "@/components/meme/MemeCard";
import Options from "./Options";
import Link from "next/link";

async function fetchCollection(id: string) {
  const collectionData = await prisma.collection.findUnique({
    where: { id: Number(id) },
    include: {
      memes: { include: { user: true, upvotes: true, downvotes: true } },
      user: true,
    },
  });
  if (!collectionData) redirect("/collections");
  return collectionData;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collectionData = await fetchCollection(id);

  return {
    title: `${collectionData.name} Collection | MemeBoard`,
    description: `Check out the memes in the ${collectionData.name} collection created by ${collectionData.user.name}!`,
  };
}

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const collectionData = await fetchCollection(id);
  const fromMe = collectionData.userId === session?.user.id;
  if (!collectionData.public && !fromMe) redirect("/collections");

  return (
    <div className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 pb-30 relative">
      <Hero
        text={`${collectionData.name} Collection (${collectionData.memes.length})`}
        description={collectionData.description || ""}
      >
        <div className="flex gap-x-3 text-black dark:text-zinc-300">
          <div>
            Created by{" "}
            <Link
              href={`/users/${collectionData.user.username}`}
              className="hover:text-green-600 dark:hover:text-green-500"
            >
              {collectionData.user.name}
            </Link>
          </div>
          •
          {collectionData.public ? (
            <div
              className="flex items-center gap-x-3 text-black dark:text-zinc-300"
              title="Everyone on MemeBoard can see this collection and its content"
            >
              <FaGlobe size={20} />
              Public
            </div>
          ) : (
            <div
              className="flex items-center gap-x-3 text-black dark:text-zinc-300"
              title="Only you can see this collection and its content"
            >
              <FaLock size={20} />
              Private
            </div>
          )}
        </div>
      </Hero>
      <div className="flex flex-wrap justify-center gap-5">
        {collectionData.memes.length > 0 ? (
          collectionData.memes.map((meme) => (
            <MemeCard key={meme.id} meme={meme} />
          ))
        ) : (
          <div className="text-black dark:text-zinc-300">
            No memes added to this collection yet
          </div>
        )}
      </div>
      {fromMe && <Options collectionData={collectionData} />}
    </div>
  );
}

export default Page;
