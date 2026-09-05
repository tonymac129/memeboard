"use server";

import type { CollectionType, CommentType, ReportType } from "@/types/Meme";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redis } from "@/lib/redis";
import { realtime } from "@/lib/realtime";

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

export async function deleteComment(commentId: number, userId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user && session.user.id === userId) {
      const deletedComment = await prisma.comment.delete({
        where: { id: commentId, userId: session.user.id },
      });
      revalidatePath(`/memes/${deletedComment.memeId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function editComment(comment: CommentType, userId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user && session.user.id === userId) {
      const updatedComment = await prisma.comment.update({
        where: { id: comment.id, userId: session.user.id },
        data: { content: comment.content },
      });
      revalidatePath(`/memes/${updatedComment.memeId}`);
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
      const newCollection = await prisma.collection.create({
        data: {
          name: collection.name,
          userId: userId,
          public: collection.public,
          description: collection.description,
        },
      });
      if (memeId === -1) {
        return newCollection.id;
      } else {
        revalidatePath(`/memes/${memeId}`);
      }
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

export async function sendMeme(
  memeId: number,
  message: string,
  friends: string[],
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      const pairs = friends.map((friend) => {
        return [session.user.id, friend].sort().join("-");
      });
      const chats = await prisma.chat.findMany({
        where: {
          OR: [{ userId1: session.user.id }, { userId2: session.user.id }],
        },
      });
      let counter = 0;
      for (const chat of chats) {
        if (pairs.includes([chat.userId1, chat.userId2].join("-"))) {
          const newMessage = {
            id: crypto.randomUUID(),
            message,
            memeId,
            created: new Date(),
            from: session.user.id,
            chatId: chat.id,
          };
          await redis.rpush(`messages:${chat.id}`, newMessage);
          await realtime.emit("chat.message", JSON.stringify(newMessage));
          counter++;
        }
      }
      await prisma.meme.update({
        where: { id: memeId },
        data: { shares: { increment: counter } },
      });
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function sendComment(
  commentId: number,
  message: string,
  friends: string[],
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session) {
      const pairs = friends.map((friend) => {
        return [session.user.id, friend].sort().join("-");
      });
      const chats = await prisma.chat.findMany({
        where: {
          OR: [{ userId1: session.user.id }, { userId2: session.user.id }],
        },
      });
      for (const chat of chats) {
        if (pairs.includes([chat.userId1, chat.userId2].join("-"))) {
          const newMessage = {
            id: crypto.randomUUID(),
            message,
            commentId,
            created: new Date(),
            from: session.user.id,
            chatId: chat.id,
          };
          await redis.rpush(`messages:${chat.id}`, newMessage);
          await realtime.emit("chat.message", JSON.stringify(newMessage));
        }
      }
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function deleteMeme(memeId: number, userId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user && session.user.id === userId) {
      await prisma.meme.delete({
        where: { id: memeId, userId: session.user.id },
      });
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function react(memeId: number, emoji: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session) {
      await prisma.reaction.upsert({
        where: { memeId_userId: { userId: session.user.id, memeId } },
        update: { emoji },
        create: { emoji, memeId, userId: session.user.id },
      });
      revalidatePath(`/memes/${memeId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function removeReaction(memeId: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session) {
      await prisma.reaction.delete({
        where: { memeId_userId: { memeId, userId: session.user.id } },
      });
      revalidatePath(`/memes/${memeId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
