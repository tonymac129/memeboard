"use server";

import type { CollectionType } from "./Options";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function editCollection(
  collectionData: CollectionType,
  selectedMemes: number[],
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      await prisma.collection.update({
        where: { id: collectionData.id, userId: session.user.id },
        data: {
          name: collectionData.name,
          memes: {
            set: selectedMemes.map((m) => {
              return { id: m };
            }),
          },
        },
      });
      revalidatePath(`/collections/${collectionData.id}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function deleteCollection(collectionId: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      await prisma.collection.delete({
        where: { id: collectionId, userId: session.user.id },
      });
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
