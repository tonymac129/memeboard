"use server";

import type { User } from "@/app/generated/prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function updateProfile(user: User) {
  let shouldRedirect = false;
  let newUsername = "";

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.id === user.id) {
      const oldUsername = session.user.username;
      if (oldUsername !== user.username) {
        const existingUser = await prisma.user.findUnique({
          where: { username: user.username },
        });
        if (existingUser) {
          return { error: "That username is already taken" };
        }
      }
      const newUser = await prisma.user.update({
        where: { id: user.id },
        data: { username: user.username, name: user.name, image: user.image },
      });
      if (oldUsername !== newUser.username) {
        shouldRedirect = true;
        newUsername = newUser.username;
      } else {
        revalidatePath(`/users/${newUser.username}`);
      }
    }
  } catch (err) {
    console.error("Error: " + err);
  }

  if (shouldRedirect && newUsername) {
    redirect(`/users/${newUsername}`);
  }
}

export async function followUser(id: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      const isFollowing = await prisma.user.count({
        where: { id: session?.user.id, following: { some: { id } } },
      });
      const updatedUser = await prisma.user.update({
        where: { id: id },
        data: {
          followers: isFollowing
            ? { disconnect: { id: session.user.id } }
            : { connect: { id: session.user.id } },
        },
      });
      revalidatePath(`/users/${updatedUser.username}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
