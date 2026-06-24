import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { editMeme } from "./actions";
import MemeForm from "@/components/meme/MemeForm";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/memes");
  const existingMeme = await prisma.meme.findUnique({
    where: { id: Number(id) },
    include: { tags: true },
  });
  if (!existingMeme || existingMeme.userId !== session.user.id)
    redirect("/memes");
  const memeTags = await prisma.memeTag.findMany({ orderBy: { id: "asc" } });

  return (
    <div className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 flex flex-col pb-30 gap-y-10">
      <h2 className="text-white text-2xl font-bold pt-10">Edit meme</h2>
      <MemeForm
        postMeme={editMeme}
        memeTags={memeTags}
        data={{ ...existingMeme, comments: [], created: new Date() }}
      />
    </div>
  );
}

export default Page;
