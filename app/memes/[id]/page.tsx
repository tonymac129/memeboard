import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

async function fetchMeme(id: string) {
  const memeData = await prisma.meme.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!memeData) redirect("/memes");
  return memeData;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memeData = await fetchMeme(id);

  return {
    title: `${memeData.title} | MemeBoard`,
    description: memeData.description.slice(0, 100),
  };
}

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const memeData = await fetchMeme(id);

  return (
    <div className="px-50 pt-10 pb-30 flex flex-col gap-y-10">
      <div className="flex flex-col gap-y-3">
        <p className="text-zinc-300 text-sm">
          Uploaded by:{" "}
          <Link
            href={`/users/${memeData.user.id}`}
            className="hover:text-green-500"
          >
            {memeData.user.name}
          </Link>
        </p>
        <h1 className="text-white font-bold text-3xl">{memeData.title}</h1>
        {memeData.tags.length > 0 && (
          <div className="flex gap-x-3">
            {memeData.tags.map((tag, i) => (
              <span
                key={i}
                className="text-sm text-zinc-300 rounded-full px-4 py-2 bg-zinc-900 font-bold cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {memeData.description && (
        <p className="text-zinc-300">{memeData.description}</p>
      )}
      <Image
        src={memeData.image}
        alt={memeData.title}
        width={300}
        height={300}
        className="rounded"
      />
    </div>
  );
}

export default Page;
