"use server";

import type { CommentType } from "@/types/Meme";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function postComment(comment: CommentType) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      await prisma.comment.create({
        data: {
          content: comment.content,
          userId: session.user.id,
          memeId: comment.memeId,
        },
      });
      revalidatePath(`/memes/${comment.memeId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
