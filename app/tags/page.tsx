import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Hero from "@/components/layout/Hero";
import TagCard from "@/components/meme/TagCard";

export const metadata: Metadata = {
  title: "Tags | MemeBoard",
  description:
    "Check out all the categorized and custom tags on MemeBoard to discover more memes related to a specific topic!",
};

async function Page() {
  const tags = await prisma.memeTag.findMany({
    orderBy: { id: "asc" },
    include: { memes: true },
  });

  return (
    <div className="px-50 pb-30">
      <Hero
        text="Explore Tags"
        description="Check out all the categorized and custom tags on MemeBoard to discover more memes related to a specific topic!"
      />
      <div className="flex flex-wrap justify-center gap-5">
        {tags.map((tag) => {
          return <TagCard key={tag.id} tag={tag} />;
        })}
      </div>
    </div>
  );
}

export default Page;
