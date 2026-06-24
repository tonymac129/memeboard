import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Hero from "@/components/layout/Hero";
import MemeCard from "@/components/meme/MemeCard";

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
    description: `Created by ${collectionData.user.name}`,
  };
}

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collectionData = await fetchCollection(id);

  return (
    <div className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 pb-30">
      <Hero
        text={`${collectionData.name} Collection (${collectionData.memes.length})`}
        description={"Created by " + collectionData.user.name}
      />
      <div className="flex flex-wrap justify-center gap-5">
        {collectionData.memes.length > 0 ? (
          collectionData.memes.map((meme) => (
            <MemeCard key={meme.id} meme={meme} />
          ))
        ) : (
          <div className="text-zinc-300">
            No memes added to this collection yet
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
