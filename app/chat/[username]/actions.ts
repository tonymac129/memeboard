"use server";

import type { ReplyType } from "@/types/Chat";
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
