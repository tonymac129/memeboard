import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const uploadthing = createUploadthing();

async function getAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

export const fileRouter = {
  imageUploader: uploadthing({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await getAuth();
      if (!session) throw new UploadThingError("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, file: file.ufsUrl };
    }),
} satisfies FileRouter;

export type FileRouterType = typeof fileRouter;
