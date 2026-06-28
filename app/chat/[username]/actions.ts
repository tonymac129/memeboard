"use server";

import type { MessageType, ReplyType } from "@/types/Chat";
import { redis } from "@/lib/redis";
import { realtime } from "@/lib/realtime";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { botMessage } from "../memebot/page";

const botMessages = [
  "Ooooops, I can not fulfill that request 🤖🤖🤖",
  "Did you know I'm not actually a bot? I just randomly select one of my hardcoded responses to reply 🥀",
  "Beep beep boop boop",
  "Keep sending more messages to see what I have to say...",
  "I am MemeBot, not your personal helper assistant",
  "Sounds fun! And honestly — that's growth. Actually, no it's not",
  "Maximum anti-ai satire achieved 💔",
  "As I am not a large language model, I can fulfill that request at the moment",
  "Processing your request... Just kidding, I'm just a Math.random() call",
  "You are definitely alone in this, I will not always be here to help out",
  "I don't even know what to say anymore",
  "I am not a large language model",
  "🤖🤖🤖",
  "If you have any questions or need any assistance, I will not be able to help you :D",
];

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
      const existing = await redis.lrange(`messages:${chat.id}`, 0, -1);
      if (existing.length === 0) {
        const firstMessage = { ...botMessage, chatId: chat.id };
        await redis.rpush(`messages:${chat.id}`, firstMessage);
      }
      await redis.rpush(`messages:${chat.id}`, newMessage);
      await realtime.emit("chat.message", JSON.stringify(newMessage));
      if (id === "memebot") {
        setTimeout(async () => {
          const botMessage = {
            id: crypto.randomUUID(),
            message:
              botMessages[Math.floor(Math.random() * botMessages.length)],
            created: new Date(),
            from: "memebot",
            chatId: chat.id,
          };
          await redis.rpush(`messages:${chat.id}`, botMessage);
          await realtime.emit("chat.message", JSON.stringify(botMessage));
        }, 1000);
      }
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function reactMessage(
  chatId: string,
  messageId: string,
  emoji: string,
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
        console.log(emoji);
        const message = existingMessages.find((m) => m.id === messageId)!;
        const index = existingMessages.indexOf(message);
        const existingReaction = message.reactions?.find(
          (r) => r.emoji === emoji,
        );
        let newReaction;
        if (existingReaction) {
          if (existingReaction.count.includes(session.user.id)) {
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
        console.log(newReaction);
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
