"use server";

import type { CollectionType, CommentType, ReportType } from "@/types/Meme";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function postComment(
  comment: CommentType,
  parentId: number | null = null,
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      await prisma.comment.create({
        data: parentId
          ? {
              content: comment.content,
              userId: session.user.id,
              memeId: comment.memeId,
              parentId,
            }
          : {
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

export async function vote(memeId: number, vote: boolean | null) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      await prisma.meme.update({
        where: { id: memeId },
        data: vote
          ? {
              upvotes: { connect: { id: session.user.id } },
              downvotes: { disconnect: { id: session.user.id } },
            }
          : vote === false
            ? {
                upvotes: { disconnect: { id: session.user.id } },
                downvotes: { connect: { id: session.user.id } },
              }
            : {
                upvotes: { disconnect: { id: session.user.id } },
                downvotes: { disconnect: { id: session.user.id } },
              },
      });
      revalidatePath(`/memes/${memeId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function createCollection(
  userId: string,
  memeId: number,
  collection: CollectionType,
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.id === userId) {
      await prisma.collection.create({
        data: {
          name: collection.name,
          userId: userId,
        },
      });
      revalidatePath(`/memes/${memeId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function addCollections(
  userId: string,
  memeId: number,
  collections: CollectionType[],
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.id === userId) {
      await prisma.meme.update({
        where: { id: memeId },
        data: {
          collections: {
            set: collections.map((c) => {
              return { id: c.id };
            }),
          },
        },
      });
      revalidatePath(`/memes/${memeId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function reportMeme(memeId: number, report: ReportType) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      await prisma.report.create({
        data: {
          selectedOptions: report.selectedOptions,
          feedback: report.feedback || "",
          memeId: memeId,
          userId: session.user.id,
        },
      });
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function likeComment(
  liking: boolean,
  commentId: number,
  memeId: number,
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          likedBy: liking
            ? { connect: { id: session.user.id } }
            : { disconnect: { id: session.user.id } },
        },
      });
      revalidatePath(`/memes/${memeId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
