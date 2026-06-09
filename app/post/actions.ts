"use server";

import type { MemeType, TagType } from "@/types/Meme";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function postMeme(meme: MemeType): Promise<number | undefined> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const sourceLink = meme.source
      ? meme.source.toLowerCase().includes("https://") ||
        meme.source.toLowerCase().includes("http://")
        ? meme.source
        : "https://" + meme.source
      : "";
    const newMeme = await prisma.meme.create({
      data: {
        title: meme.title,
        image: meme.image,
        source: sourceLink,
        description: meme.description || "",
        userId: session?.user.id as string,
        tags: {
          connect: meme.tags!.map((tag) => ({
            id: tag.id,
          })),
        },
      },
    });
    return newMeme.id;
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function addTag(tag: TagType) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    await prisma.memeTag.create({
      data: {
        name: tag.name,
        userId: session?.user.id as string,
      },
    });
    revalidatePath("/post");
  } catch (err) {
    console.error("Error: " + err);
  }
}
