import type { Meme, User } from "@/app/generated/prisma/client";
import Link from "next/link";
import Image from "next/image";

type MemeType = Meme & {
  user: User;
};

function MemeCard({ meme }: { meme: MemeType }) {
  return (
    <Link
      href={`/memes/${meme.id}`}
      className="flex flex-col gap-y-3 border-zinc-700 border-2 rounded hover:bg-zinc-900 px-5 py-3 w-80"
    >
      <div className="flex items-center gap-x-3 text-zinc-300">
        <Link
          href={`/users/${meme.userId}`}
          className="flex items-center gap-x-3 font-bold hover:text-green-500"
        >
          <Image
            src={meme.user.image || "/icons/default-avatar.svg"}
            alt="Avatar"
            width={35}
            height={35}
            className="rounded-full"
          />
          {meme.user.name}
        </Link>{" "}
        •{" "}
        <span className="text-sm" title={meme.createdAt.toISOString()}>
          {meme.createdAt.toLocaleDateString()}
        </span>
      </div>
      <h2 className="text-white text-xl font-bold">{meme.title}</h2>
      <Image
        src={meme.image}
        alt="Meme image"
        width={400}
        height={400}
        className="w-full rounded"
      />
    </Link>
  );
}

export default MemeCard;
