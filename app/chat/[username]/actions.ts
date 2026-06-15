"use server";

import { redis } from "@/lib/redis";
import { realtime } from "@/lib/realtime";

export async function sendMessage(message: string, username: string) {
  try {
    await redis.rpush(`messages:${username}`, {
      message: message,
      created: new Date(),
    });
    await realtime.emit("chat.message", message);
  } catch (err) {
    console.error("Error: " + err);
  }
}
