import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteAccount } from "./actions";
import MemeCard from "@/components/meme/MemeCard";
import EditProfile from "@/components/user/EditProfile";
import SignOut from "@/components/auth/SignOut";
import Delete from "@/components/user/Delete";
import Image from "next/image";
import Follow from "@/components/user/Follow";

async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const userData = await prisma.user.findUnique({
    where: { username },
    include: {
      memes: { include: { user: true } },
      followers: true,
      following: true,
    },
  });
  if (!userData) redirect("/");
  const session = await auth.api.getSession({ headers: await headers() });
  const isUser = userData.id === session?.user.id;
  const isFollowing = userData.followers.find((u) => u.id === session?.user.id)
    ? true
    : false;

  return (
    <div className="px-50 pb-30 py-10 flex gap-x-20">
      <div className="flex flex-col gap-y-5 text-zinc-300 text-sm w-60">
        <Image
          src={userData.image || "/icons/default-avatar.svg"}
          alt="Avatar"
          width={150}
          height={150}
          className="rounded w-full"
        />
        <div className="flex flex-col gap-y-1 text-base">
          <h2 className="text-2xl font-bold text-green-500">{userData.name}</h2>
          <p>@{userData.username}</p>
        </div>
        <div className="flex gap-x-3 text-base flex-wrap">
          <span>{userData.followers.length} followers</span> •{" "}
          <span>{userData.following.length} following</span>
        </div>
        <p>{userData.email}</p>
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
      <div>
        <h2 className="text-2xl text-green-500 font-bold">
          Memes posted ({userData.memes.length})
        </h2>
        <div className="flex flex-wrap justify-center gap-5 mt-5">
          {userData.memes.map((meme) => {
            return <MemeCard key={meme.id} meme={meme} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Page;
