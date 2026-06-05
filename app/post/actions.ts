"use server";

import type { MemeType } from "@/types/Meme";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function postMeme(meme: MemeType): Promise<number | undefined> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const newMeme = await prisma.meme.create({
      data: {
        title: meme.title,
        tags: meme.tags,
        image: meme.image,
        description: meme.description,
        userId: session?.user.id as string,
      },
    });
    return newMeme.id;
  } catch (err) {
    console.error("Error: " + err);
  }
}
