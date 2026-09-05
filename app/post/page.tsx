import type { Metadata } from "next";
import { postMeme } from "./actions";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import MemeForm from "@/components/meme/MemeForm";

export const metadata: Metadata = {
  title: "Post Meme | MemeBoard",
  description:
    "Post a meme, either found online or created by yourself, on this page and share with the community and your friends!",
  authors: [{ name: "tonymac129", url: "https://tonymac.net" }],
  openGraph: {
    title: "Post Meme | MemeBoard",
    description:
      "Post a meme, either found online or created by yourself, on this page and share with the community and your friends!",
    url: "https://memeboard-app.vercel.app/post",
    siteName: "MemeBoard",
    images: [
      {
        url: "/logo.png",
        width: 100,
        height: 100,
      },
    ],
    type: "website",
  },
};

async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const memeTags = await prisma.memeTag.findMany({ orderBy: { id: "asc" } });

  return (
    <div className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 flex flex-col pb-30 gap-y-10">
      <h2 className="text-black dark:text-white text-2xl font-bold pt-10">
        Post meme
      </h2>
      <MemeForm postMeme={postMeme} memeTags={memeTags} />
    </div>
  );
}

export default Page;
