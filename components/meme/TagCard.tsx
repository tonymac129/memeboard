import { Meme, MemeTag } from "@/app/generated/prisma/client";
import { FaHashtag, FaStar } from "react-icons/fa";
import Link from "next/link";

type TagType = MemeTag & {
  memes: Meme[];
};

function TagCard({ tag }: { tag: TagType }) {
  return (
    <Link
      key={tag.id}
      href={`/tags/${tag.id}`}
      className="flex items-center gap-x-3 px-5 py-3 text-zinc-300 rounded border-2 border-zinc-700 w-60 hover:bg-zinc-900"
    >
      <FaHashtag size={35} className="rounded bg-zinc-800 p-2" />
      <h2 className="font-bold">
        {tag.name} ({tag.memes.length})
      </h2>
      {tag.default && <FaStar size={15} title="Popular tag" />}
    </Link>
  );
}

export default TagCard;
