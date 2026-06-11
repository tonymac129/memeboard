import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Hero from "@/components/layout/Hero";
import CollectionCard from "@/components/collection/CollectionCard";

export const metadata: Metadata = {
  title: "Collections | MemeBoard",
  description:
    "Browse custom curated meme collections other people created or manage your own here!",
};

async function Page() {
  const collections = await prisma.collection.findMany({
    include: { memes: true },
  });

  return (
    <div className="px-50 pb-30">
      <Hero
        text="Collections"
        description="Browse custom curated meme collections other people created or create and manage your own here!"
      />
      <div className="flex flex-wrap justify-center gap-5">
        {collections.length > 0 ? (
          collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))
        ) : (
          <div>No collections yet</div>
        )}
      </div>
    </div>
  );
}

export default Page;
