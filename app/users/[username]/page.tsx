import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteAccount } from "./actions";
import MemeCard from "@/components/meme/MemeCard";
import SignOut from "@/components/auth/SignOut";
import Delete from "@/components/user/Delete";
import Image from "next/image";

async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const userData = await prisma.user.findUnique({
    where: { username },
    include: { memes: { include: { user: true } } },
  });
  if (!userData) redirect("/");
  const session = await auth.api.getSession({ headers: await headers() });
  const isUser = userData.id === session?.user.id;

  return (
    <div className="px-50 pb-30 py-10 flex gap-x-20">
      <div className="flex flex-col gap-y-5 text-zinc-300 text-sm">
        <Image
          src={userData.image || "/icons/default-avatar.svg"}
          alt="Avatar"
          width={150}
          height={150}
          className="rounded"
        />
        <div className="flex flex-col gap-y-1 text-base">
          <h2 className="text-2xl font-bold text-green-500">{userData.name}</h2>
          <p>@{userData.username}</p>
        </div>
        <p>{userData.email}</p>
        <p>Joined {userData.createdAt.toLocaleDateString()}</p>
        {isUser && (
          <>
            <SignOut />
            <Delete id={userData.id} deleteAccount={deleteAccount} />
          </>
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
