import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Hero from "@/components/layout/Hero";
import Tags from "./Tags";

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
    <div className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 pb-30">
      <Hero
        text="Explore Tags"
        description="Check out all the categorized and custom tags on MemeBoard to discover more memes related to a specific topic!"
      />
      <Tags tags={tags} />
    </div>
  );
}

//TODO: add tag button on tags page

export default Page;
