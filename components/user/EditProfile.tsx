"use client";

import type { User } from "@/app/generated/prisma/client";
import type { ClientUploadedFileData } from "uploadthing/types";
import type { ServerDataType } from "@/types/Meme";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { updateProfile } from "@/app/users/[username]/actions";
import { UploadButton } from "@/lib/uploadthing";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Btn from "../ui/Btn";
import Image from "next/image";

const labelStyles =
  "flex flex-col gap-y-1 text-black dark:text-zinc-300 text-sm";

function EditProfile({ user }: { user: User }) {
  const [editing, setEditing] = useState<boolean>(false);
  const [userData, setUserData] = useState<User>(user);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] =
    useState<ClientUploadedFileData<ServerDataType> | null>(null);

  async function handleSave() {
    setLoading(true);
    const res = await updateProfile(userData);
    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      setEditing(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {editing && (
          <Modal closeModal={() => setEditing(false)}>
            <div className="px-10 pt-5 flex flex-col gap-y-3">
              <h2 className="text-black dark:text-white text-2xl font-bold">
                Edit profile
              </h2>
              <label className={labelStyles}>
                Display name
                <Input
                  placeholder="Tung Tung Tung Sahur"
                  value={userData.name}
                  setValue={(name) => setUserData({ ...userData, name })}
                />
              </label>
              <label className={labelStyles}>
                Username
                <Input
                  placeholder="triplet67"
                  value={userData.username}
                  setValue={(username) =>
                    setUserData({ ...userData, username })
                  }
                />
              </label>
              <label className={labelStyles}>
                Bio
                <textarea
                  className="text-base border-2 border-zinc-700 rounded px-4 py-2 text-black dark:text-zinc-300 outline-none resize-none h-30"
                  placeholder="Tell people about you"
                  value={userData.bio || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, bio: e.target.value })
                  }
                ></textarea>
              </label>
              <label className={labelStyles}>
                Profile image
                <Image
                  src={
                    uploadedFile?.ufsUrl ||
                    userData.image ||
                    "/icons/default-avatar.svg"
                  }
                  alt="Profile avatar"
                  width={150}
                  height={150}
                  className="cursor-pointer rounded"
                />
                <div>
                  {status === "uploading"
                    ? "Uploading..."
                    : status === "uploaded"
                      ? uploadedFile?.name
                      : "Upload PNG, JPG, or GIF here (max 4MB)"}
                </div>
                <UploadButton
                  className="hidden w-fit"
                  endpoint="imageUploader"
                  onUploadBegin={() => setStatus("uploading")}
                  onClientUploadComplete={(res) => {
                    setUploadedFile(res[0]);
                    setStatus("uploaded");
                    setUserData((prev) => {
                      return { ...prev, image: res[0].ufsUrl };
                    });
                    setError(null);
                  }}
                  onUploadError={(res) => {
                    setError(res.message);
                    console.error("Error: ", res);
                  }}
                />
              </label>
              {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>
            <div className="flex gap-x-3 px-10 py-5">
              <Btn
                text={loading ? "Loading..." : "Save"}
                onclick={handleSave}
                styles="w-fit"
                primary
              />
              <Btn
                text="Cancel"
                onclick={() => setEditing(false)}
                styles="w-fit"
              />
            </div>
          </Modal>
        )}
      </AnimatePresence>
      <Btn
        text="Edit profile"
        onclick={() => setEditing(true)}
        styles="w-fit"
        primary
      />
    </>
  );
}

export default EditProfile;
