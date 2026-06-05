import type { Metadata } from "next";
import { postMeme } from "./actions";
import { prisma } from "@/lib/prisma";
import MemeForm from "@/components/meme/MemeForm";

export const metadata: Metadata = {
  title: "Post Meme | MemeBoard",
  description:
    "Post a meme, either found online or created by yourself, on this page and share with the community and your friends!",
};

async function Page() {
  const memeTags = await prisma.memeTag.findMany();

  return (
    <div className="px-50 flex flex-col pb-30 gap-y-10">
      <h2 className="text-white text-2xl font-bold pt-10">Post meme</h2>
      <MemeForm postMeme={postMeme} memeTags={memeTags} />
    </div>
  );
}

export default Page;
