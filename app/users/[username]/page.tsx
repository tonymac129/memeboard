import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteAccount } from "./actions";
import { FaInfoCircle } from "react-icons/fa";
import { MdEmail, MdVerified } from "react-icons/md";
import MemeCard from "@/components/meme/MemeCard";
import EditProfile from "@/components/user/EditProfile";
import CollectionCard from "@/components/collection/CollectionCard";
import SignOut from "@/components/auth/SignOut";
import Delete from "@/components/user/Delete";
import Follow from "@/components/user/Follow";
import Following from "@/components/user/Following";
import UserCard from "@/components/user/UserCard";
import EmbeddedComment from "@/components/chat/EmbeddedComment";
import Image from "next/image";
import Link from "next/link";

async function fetchUser(username: string) {
  const userData = await prisma.user.findUnique({
    where: { username },
    include: {
      memes: {
        include: { user: true, upvotes: true, downvotes: true },
        orderBy: { createdAt: "desc" },
      },
      collections: { include: { memes: true }, orderBy: { createdAt: "desc" } },
      followers: true,
      following: true,
      comments: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!userData) redirect("/");
  return userData;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const userData = await fetchUser(username);

  return {
    title: `${userData.name}'s Profile | MemeBoard`,
    description: `Check out ${userData.name}'s custom profile on MemeBoard! Explore their memes and interests and connect with them!`,
  };
}

async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const userData = await fetchUser(username);
  const friends = await prisma.user.findMany({
    where: {
      AND: [
        {
          followers: {
            some: { id: userData.id },
          },
        },
        {
          following: {
            some: { id: userData.id },
          },
        },
      ],
    },
  });
  const session = await auth.api.getSession({ headers: await headers() });
  const isUser = userData.id === session?.user.id;
  const isFollowing = userData.followers.find((u) => u.id === session?.user.id)
    ? true
    : false;
  const publicCollections = userData.collections.filter((c) => c.public);
  const privateCollections = userData.collections.filter((c) => !c.public);
  const comments = userData.comments;

  return (
    <div className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 py-10 flex flex-col sm:flex-row gap-20">
      <div className="flex flex-col gap-y-5 text-black dark:text-zinc-300 text-sm w-60">
        <Image
          src={userData.image || "/icons/default-avatar.svg"}
          alt="Avatar"
          width={150}
          height={150}
          className="rounded w-full"
        />
        <div className="flex flex-col gap-y-1 text-base">
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-500">
            {userData.name}
          </h2>
          <p>@{userData.username}</p>
        </div>
        <div className="flex gap-x-3 text-base flex-wrap">
          <Following
            followers={userData.followers}
            following={userData.following}
          />
        </div>
        {userData.bio && (
          <div className="flex flex-col gap-y-1">
            <h2 className="text-black dark:text-zinc-300 flex items-center gap-x-2 font-bold text-base">
              <FaInfoCircle size={15} /> Bio
            </h2>
            <p>{userData.bio}</p>
          </div>
        )}
        <div className="flex flex-col gap-y-1">
          <h2 className="text-black dark:text-zinc-300 flex items-center gap-x-2 font-bold text-base">
            <MdEmail size={15} /> Email
          </h2>
          <p className="flex gap-x-2 items-center">
            {userData.email}
            {userData.emailVerified && (
              <MdVerified
                size={15}
                title="This user's email address is verified"
              />
            )}
          </p>
        </div>
        <p>Joined {userData.createdAt.toLocaleDateString()}</p>
        {isUser && (
          <div className="flex flex-col gap-y-3 text-base">
            <EditProfile user={userData} />
            <SignOut />
            <Delete id={userData.id} deleteAccount={deleteAccount} />
          </div>
        )}
        {!isUser && session && (
          <Follow id={userData.id} isFollowing={isFollowing} />
        )}
      </div>
      <div className="flex-1 flex flex-col gap-y-5">
        <Link
          href="/memes"
          className="w-fit text-2xl text-green-600 dark:text-green-500 font-bold"
        >
          Memes posted ({userData.memes.length})
        </Link>
        <div className="flex flex-wrap gap-5">
          {userData.memes.length > 0 ? (
            userData.memes.map((meme) => {
              return <MemeCard key={meme.id} meme={meme} />;
            })
          ) : (
            <div className="text-black dark:text-zinc-300 text-sm">
              No memes posted yet
            </div>
          )}
        </div>
        <Link
          href="/collections"
          className="w-fit text-2xl text-green-600 dark:text-green-500 font-bold"
        >
          Public collections ({publicCollections.length})
        </Link>
        <div className="flex flex-wrap gap-5">
          {publicCollections.length > 0 ? (
            publicCollections.map((collection) => {
              return (
                <CollectionCard key={collection.id} collection={collection} />
              );
            })
          ) : (
            <div className="text-black dark:text-zinc-300 text-sm">
              No public collections yet
            </div>
          )}
        </div>
        {isUser && (
          <>
            <Link
              href="/collections"
              className="w-fit text-2xl text-green-600 dark:text-green-500 font-bold"
            >
              Private collections ({privateCollections.length})
            </Link>
            <div className="flex flex-wrap gap-5">
              {privateCollections.length > 0 ? (
                privateCollections.map((collection) => {
                  return (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                    />
                  );
                })
              ) : (
                <div className="text-black dark:text-zinc-300 text-sm">
                  No private collections yet
                </div>
              )}
            </div>
          </>
        )}
        <Link
          href="/chat"
          className="w-fit text-2xl text-green-600 dark:text-green-500 font-bold"
        >
          Friends ({friends.length})
        </Link>
        <div className="flex flex-wrap gap-5">
          {friends.map((user) => {
            return <UserCard key={user.id} user={user} />;
          })}
        </div>
        <h2 className="w-fit text-2xl text-green-600 dark:text-green-500 font-bold">
          Comments ({comments.length})
        </h2>
        <div className="flex flex-wrap gap-5">
          {comments.map((comment) => {
            return (
              <EmbeddedComment
                key={comment.id}
                commentId={comment.id}
                profile
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Page;
