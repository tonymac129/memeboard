"use server";

import type { MemeType } from "@/types/Meme";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function editMeme(meme: MemeType): Promise<number | undefined> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      const existingMeme = await prisma.meme.findUnique({
        where: { id: meme.id },
      });
      if (existingMeme && existingMeme.userId === session.user.id) {
        await prisma.meme.update({
          where: { id: meme.id },
          data: {
            title: meme.title,
            description: meme.description,
            image: meme.image,
            source: meme.source,
            tags: {
              set: meme.tags!.map((tag) => {
                return { id: tag.id };
              }),
            },
          },
        });
        return meme.id;
      }
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
