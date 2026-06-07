"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function deleteAccount(id: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.id === id) {
      await prisma.user.delete({ where: { id } });
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
