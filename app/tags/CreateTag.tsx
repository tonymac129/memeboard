"use client";

import type { TagType } from "@/types/Meme";
import { AnimatePresence } from "framer-motion";
import { MdOutlineAdd } from "react-icons/md";
import { useState } from "react";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { addTag } from "../post/actions";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Btn from "@/components/ui/Btn";

const labelStyles =
  "flex flex-col gap-y-1 text-black dark:text-zinc-300 text-sm";

function CreateTag() {
  const [creating, setCreating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<TagType>({
    id: 0,
    name: "",
  });
  const { data: session } = authClient.useSession();

  async function handleCreate() {
    if (newTag.name.trim().length > 0 && session?.user) {
      setLoading(true);
      const newId = await addTag(newTag, true);
      redirect(`/tags/${newId}`);
    }
  }

  return (
    <div className="absolute top-10 right-5 sm:right-20 lg:right-50">
      <MdOutlineAdd
        size={35}
        className="text-black dark:text-zinc-300 p-1.5 cursor-pointer rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-900"
        title="Create tag"
        onClick={() => setCreating(true)}
      />
      <AnimatePresence>
        {creating && (
          <Modal closeModal={() => setCreating(false)}>
            <div className="flex flex-col gap-y-3 p-6">
              <h2 className="text-black dark:text-white text-xl font-bold">
                Create tag
              </h2>
              <label className={labelStyles}>
                Name
                <Input
                  placeholder="Random"
                  value={newTag.name}
                  setValue={(name) => setNewTag({ ...newTag, name })}
                />
              </label>
              <div className="flex gap-x-3">
                <Btn
                  text={loading ? "Loading..." : "Create"}
                  onclick={handleCreate}
                  primary
                />
                <Btn text="Cancel" onclick={() => setCreating(false)} />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CreateTag;
