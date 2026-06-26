"use server";

import type { MessageType, ReplyType } from "@/types/Chat";
import { redis } from "@/lib/redis";
import { realtime } from "@/lib/realtime";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function sendMessage(
  message: string,
  id: string,
  replying: ReplyType | null,
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      const [userId1, userId2] = [session.user.id, id].sort();
      const chat = await prisma.chat.upsert({
        where: { userId1_userId2: { userId1, userId2 } },
        update: {},
        create: { userId1, userId2 },
      });
      const newMessage = {
        id: crypto.randomUUID(),
        message: message,
        created: new Date(),
        from: session.user.id,
        chatId: chat.id,
        replying,
      };
      await redis.rpush(`messages:${chat.id}`, newMessage);
      await realtime.emit("chat.message", JSON.stringify(newMessage));
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function reactMessage(
  chatId: string,
  messageId: string,
  emoji: string,
  reacted?: boolean,
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      const existingMessages: MessageType[] = await redis.lrange(
        `messages:${chatId}`,
        0,
        -1,
      );
      if (existingMessages) {
        const message = existingMessages.find((m) => m.id === messageId)!;
        const index = existingMessages.indexOf(message);
        const existingReaction = message.reactions?.find(
          (r) => r.emoji === emoji,
        );
        let newReaction;
        if (existingReaction) {
          if (reacted) {
            existingReaction.count = existingReaction.count.filter(
              (r) => r !== session.user.id,
            );
          } else {
            existingReaction.count.push(session.user.id);
          }
          newReaction = existingReaction;
        } else {
          newReaction = { emoji, count: [session.user.id] };
        }
        message.reactions = (
          message.reactions
            ? [
                ...message?.reactions.filter((r) => r.emoji !== emoji),
                newReaction,
              ]
            : [newReaction]
        ).filter((r) => r.count.length > 0);
        await redis.lset(`messages:${chatId}`, index, message);
        await realtime.emit("chat.reaction", JSON.stringify(message));
      }
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function editMessage(
  chatId: string,
  messageId: string,
  newMessage: string,
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      const existingMessages: MessageType[] = await redis.lrange(
        `messages:${chatId}`,
        0,
        -1,
      );
      if (existingMessages) {
        const message = existingMessages.find((m) => m.id === messageId)!;
        const index = existingMessages.indexOf(message);
        message.message = newMessage;
        message.edited = true;
        await redis.lset(`messages:${chatId}`, index, message);
        await realtime.emit("chat.edit", JSON.stringify(message));
      }
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function deleteMessage(chatId: string, messageId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      const existingMessages: MessageType[] = await redis.lrange(
        `messages:${chatId}`,
        0,
        -1,
      );
      if (existingMessages) {
        const message = existingMessages.find((m) => m.id === messageId);
        if (message?.from === session.user.id) {
          const newMessage = { ...message, deleted: true };
          await redis.lset(
            `messages:${chatId}`,
            existingMessages.indexOf(message),
            newMessage,
          );
          await realtime.emit("chat.delete", JSON.stringify(newMessage));
        }
      }
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function undoMessage(chatId: string, messageId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      const existingMessages: MessageType[] = await redis.lrange(
        `messages:${chatId}`,
        0,
        -1,
      );
      if (existingMessages) {
        const message = existingMessages.find((m) => m.id === messageId);
        if (message?.deleted && message.from === session.user.id) {
          const newMessage = { ...message, deleted: false };
          await redis.lset(
            `messages:${chatId}`,
            existingMessages.indexOf(message),
            newMessage,
          );
          await realtime.emit("chat.undo", JSON.stringify(newMessage));
        }
      }
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

//TODO: all these actions are just boilerplate and could be merged into one function but im too lazy to refactor
