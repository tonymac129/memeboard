import type { Collection, Meme } from "@/app/generated/prisma/client";
import Image from "next/image";
import Link from "next/link";

type CollectionType = Collection & {
  memes: Meme[];
};

interface CollectionCardProps {
  collection: CollectionType;
  user?: string;
}

function CollectionCard({ collection, user }: CollectionCardProps) {
  return (
    <Link
      key={collection.id}
      href={`/collections/${collection.id}`}
      className="flex flex-col gap-y-3 w-55 border-2 border-zinc-700 rounded p-4 pb-7 font-bold text-lg text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-900"
    >
      {collection.name.slice(0, 14) +
        (collection.name.length > 14 ? "..." : "")}{" "}
      ({collection.memes.length})
      {user && <div className="font-normal text-sm">Created by {user}</div>}
      {collection.memes.length > 0 ? (
        <div className="flex flex-col items-center w-full relative">
          <div className="absolute -bottom-3 w-[84%] rounded bg-zinc-300 dark:bg-zinc-800 h-10" />
          <div className="absolute -bottom-1.5 w-[92%] rounded bg-zinc-400 dark:bg-zinc-700 h-10" />
          <Image
            src={collection.memes[0].image}
            alt={collection.memes[0].title}
            width={100}
            height={100}
            className="w-full rounded z-10"
          />
        </div>
      ) : (
        <div className="w-full rounded bg-zinc-300 dark:bg-zinc-800 h-40 flex items-center font-normal text-black dark:text-zinc-300 text-sm px-4 py-2 text-center">
          No memes added to this collection yet
        </div>
      )}
    </Link>
  );
}

export default CollectionCard;
