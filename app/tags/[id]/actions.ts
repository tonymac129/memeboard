"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function deleteTag(tagId: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      await prisma.memeTag.delete({
        where: { id: tagId, userId: session.user.id },
      });
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
