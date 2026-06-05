"use server";

import type { MemeType } from "@/types/Meme";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function postMeme(meme: MemeType): Promise<string | undefined> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const newMeme = await prisma.meme.create({
      data: {
        title: meme.title,
        tags: meme.tags,
        image: meme.image,
        description: meme.description,
        user: {
          connect: {
            id: session?.user.id,
          },
        },
      },
    });
    return newMeme.id;
  } catch (err) {
    console.error("Error: " + err);
  }
}
