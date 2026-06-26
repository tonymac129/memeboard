import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Hero from "@/components/layout/Hero";
import Collections from "./Collections";

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
    <div className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 pb-30">
      <Hero
        text="Collections"
        description="Browse custom curated meme collections other people created or create and manage your own here!"
      />
      <Collections collections={collections} />
    </div>
  );
}

export default Page;
