"use server";

import type { UserType } from "@/types/User";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function addUsername(userData: UserType) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (userData.email === session?.user.email) {
      await prisma.user.update({
        where: { email: userData.email },
        data: { username: userData.username },
      });
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
