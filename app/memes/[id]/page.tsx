import { prisma } from "@/lib/prisma";
import { postComment } from "./actions";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { FaLink } from "react-icons/fa";
import { displayTime } from "@/lib/calc";
import CommentField from "@/components/meme/CommentField";
import Comment, { CommentType } from "@/components/meme/Comment";
import Btn from "@/components/ui/Btn";
import MemeBar from "@/components/meme/MemeBar";
import Options from "./Options";
import Image from "next/image";
import Link from "next/link";

function generateTree(comments: CommentType[]): CommentType[] {
  const commentMap: Record<string, CommentType & { replies: CommentType[] }> =
    {};
  const roots: CommentType[] = [];

  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  comments.forEach((comment) => {
    const mappedComment = commentMap[comment.id];
    if (comment.parentId) {
      const parent = commentMap[comment.parentId];
      parent?.replies.push(mappedComment);
    } else {
      roots.push(mappedComment);
    }
  });

  return roots;
}

async function fetchMeme(id: number) {
  const memeData = await prisma.meme.findUnique({
    where: { id: Number(id) },
    include: {
      user: true,
      tags: true,
      upvotes: true,
      downvotes: true,
      comments: { include: { user: true, likedBy: true } },
    },
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
  memeData.comments = generateTree(memeData.comments);
  const session = await auth.api.getSession({ headers: await headers() });
  const userCollections = session
    ? await prisma.collection.findMany({
        where: { userId: session.user.id },
        include: { memes: true },
      })
    : [];
  const userFriends = await prisma.user.findMany({
    where: {
      AND: [
        {
          followers: {
            some: { id: session?.user.id },
          },
        },
        {
          following: {
            some: { id: session?.user.id },
          },
        },
      ],
    },
  });
  const hasUpdated =
    memeData.updatedAt.getTime() !== memeData.createdAt.getTime();

  return (
    <div className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 pt-10 pb-30 flex flex-col gap-y-10">
      <div className="flex flex-col gap-y-3 relative w-[90%] sm:w-[75%] md:w-150">
        <div className="flex flex-wrap gap-3 text-zinc-300 text-sm">
          <p>
            Uploaded by:{" "}
            <Link
              href={`/users/${memeData.user.username}`}
              className="hover:text-green-500"
            >
              {memeData.user.name}
            </Link>
          </p>{" "}
          •
          <p title={memeData.createdAt.toISOString()}>
            {hasUpdated && "Posted "}
            {displayTime(memeData.createdAt.getTime()) ||
              memeData.createdAt.toLocaleDateString()}
          </p>
          {hasUpdated && (
            <>
              •
              <p title={memeData.updatedAt.toISOString()}>
                Updated{" "}
                {displayTime(memeData.updatedAt.getTime()) ||
                  memeData.updatedAt.toLocaleDateString()}
              </p>
            </>
          )}
        </div>
        <h1 className="text-white font-bold text-3xl flex items-center gap-x-5">
          {memeData.title}
          {memeData.source && (
            <Link
              href={memeData.source}
              className="hover:text-green-500"
              title="Original source"
              target="_blank"
            >
              <FaLink size={20} />
            </Link>
          )}
        </h1>
        {memeData.tags.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {memeData.tags.map((tag) => (
              <Link
                href={`/tags/${tag.id}`}
                key={tag.id}
                className="text-sm text-zinc-300 rounded-full px-4 py-2 bg-zinc-900 font-bold cursor-pointer"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
        {session?.user.id === memeData.userId && (
          <Options memeId={memeData.id} userId={session.user.id} />
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
      <MemeBar
        meme={memeData}
        userId={session?.user.id}
        collections={userCollections}
        friends={userFriends}
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
        <div className="w-[90%] sm:w-[75%] md:w-150 flex flex-col gap-y-5">
          {memeData.comments.length > 0 ? (
            memeData.comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                memeId={memeData.id}
              />
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
