import { prisma } from "@/lib/prisma";
import { postComment } from "./actions";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CommentField from "@/components/meme/CommentField";
import Comment from "@/components/meme/Comment";
import Image from "next/image";
import Link from "next/link";
import Btn from "@/components/ui/Btn";

async function fetchMeme(id: number) {
  const memeData = await prisma.meme.findUnique({
    where: { id: Number(id) },
    include: { user: true, tags: true, comments: { include: { user: true } } },
  });
  if (!memeData) redirect("/memes");
  return memeData;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const memeData = await fetchMeme(id);

  return {
    title: `${memeData.title} | MemeBoard`,
    description: memeData.description.slice(0, 100),
  };
}

async function Page({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  const memeData = await fetchMeme(id);
  const session = await auth.api.getSession({ headers: await headers() });

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
          <div className="flex gap-3 flex-wrap">
            {memeData.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-sm text-zinc-300 rounded-full px-4 py-2 bg-zinc-900 font-bold cursor-pointer"
              >
                {tag.name}
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
      <div className="flex flex-col gap-y-5">
        {session?.user ? (
          <CommentField
            userId={session.user.id}
            memeId={memeData.id}
            postComment={postComment}
          />
        ) : (
          <div className="flex flex-col gap-y-3 py-5 border-2 border-zinc-700 rounded w-120 items-center">
            <span className="text-zinc-300">Sign in to leave a comment!</span>
            <Btn text="Sign in" href="/login" styles="w-fit" />
          </div>
        )}
        <h2 className="text-lg font-bold text-white">
          Comment{memeData.comments.length !== 1 && "s"} (
          {memeData.comments.length})
        </h2>
        <div className="w-120 flex flex-col gap-y-5">
          {memeData.comments.length > 0 ? (
            memeData.comments.map((comment) => (
              <Comment key={comment.id} comment={comment} user={comment.user} />
            ))
          ) : (
            <span className="text-sm text-zinc-300">
              No comments found. Be the first to say something!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
