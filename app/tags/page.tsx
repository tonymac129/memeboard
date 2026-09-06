import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Hero from "@/components/layout/Hero";
import Tags from "./Tags";
import CreateTag from "./CreateTag";

export const metadata: Metadata = {
  title: "Tags | MemeBoard",
  description:
    "Check out all the categorized and custom tags on MemeBoard to discover more memes related to a specific topic!",
  authors: [{ name: "tonymac129", url: "https://tonymac.net" }],
  openGraph: {
    title: "Tags | MemeBoard",
    description:
      "Check out all the categorized and custom tags on MemeBoard to discover more memes related to a specific topic!",
    url: "https://memeboard-app.vercel.app/tags",
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
  const tags = await prisma.memeTag.findMany({
    orderBy: { id: "asc" },
    include: { memes: true },
  });

  return (
    <div className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 pb-30 relative">
      <Hero
        text="Explore Tags"
        description="Check out all the categorized and custom tags on MemeBoard to discover more memes related to a specific topic!"
      />
      <Tags tags={tags} />
      {session && <CreateTag />}
    </div>
  );
}

export default Page;
