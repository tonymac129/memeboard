"use client";

import type { ClientUploadedFileData } from "uploadthing/types";
import type { MemeType, ServerDataType } from "@/types/Meme";
import { FaUpload } from "react-icons/fa";
import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

function Upload({
  setNewMeme,
}: {
  setNewMeme: React.Dispatch<React.SetStateAction<MemeType>>;
}) {
  const [status, setStatus] = useState<string>("");
  const [uploadedFile, setUploadedFile] =
    useState<ClientUploadedFileData<ServerDataType> | null>(null);

  return (
    <div className="w-60 border-zinc-700 border-2 rounded flex flex-col justify-center gap-y-3 cursor-pointer hover:bg-zinc-900 text-center px-10 py-5 items-center">
      {uploadedFile ? (
        <Image
          src={uploadedFile.ufsUrl}
          alt="Meme"
          width={150}
          height={150}
          className="rounded"
        />
      ) : (
        <FaUpload size={35} />
      )}
      {status === "uploading"
        ? "Uploading..."
        : status === "uploaded"
          ? uploadedFile?.name
          : "Upload PNG, JPG, or GIF here (max 25MB)"}
      <UploadButton
        className="hidden w-fit"
        endpoint="imageUploader"
        onUploadBegin={() => setStatus("uploading")}
        onClientUploadComplete={(res) => {
          setUploadedFile(res[0]);
          setStatus("uploaded");
          setNewMeme((prev) => {
            return { ...prev, image: res[0].ufsUrl };
          });
        }}
        onUploadError={(res) => {
          console.error("Error: ", res);
        }}
      />
    </div>
  );
}

export default Upload;
