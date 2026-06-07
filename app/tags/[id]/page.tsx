import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Hero from "@/components/layout/Hero";
import Link from "next/link";
import MemeCard from "@/components/meme/MemeCard";

async function fetchTag(id: string) {
  const memeTag = await prisma.memeTag.findUnique({
    where: { id: Number(id) },
    include: { memes: { include: { user: true } }, user: true },
  });
  if (!memeTag) redirect("/tags");
  return memeTag;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const memeTag = await fetchTag(id);

  return {
    title: `${memeTag.name} Memes | MemeBoard`,
    description: `Browse all the memes labeled with the ${memeTag.name} tag!`,
  };
}

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const memeTag = await fetchTag(id);

  return (
    <div className="px-50 pb-30">
      <Hero
        text={`${memeTag.name} Memes (${memeTag.memes.length})`}
        description={`Browse all the memes labeled with the ${memeTag.name} tag!`}
      >
        <div className="flex gap-x-1 text-zinc-300">
          Created by:
          <Link
            href={`/users/${memeTag.user.username}`}
            className="hover:text-green-500"
          >
            {memeTag.user.name}
          </Link>
        </div>
      </Hero>
      <div className="flex flex-wrap justify-center gap-5">
        {memeTag.memes.map((meme) => {
          return <MemeCard key={meme.id} meme={meme} />;
        })}
      </div>
    </div>
  );
}

export default Page;
