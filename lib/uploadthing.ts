import type { FileRouterType } from "@/app/api/uploadthing/core";
import { generateUploadButton } from "@uploadthing/react";

export const UploadButton = generateUploadButton<FileRouterType>();
