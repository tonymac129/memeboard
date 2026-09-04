"use client";

import type { CollectionType } from "@/types/Meme";
import { AnimatePresence } from "framer-motion";
import { MdOutlineAdd } from "react-icons/md";
import { useState } from "react";
import { createCollection } from "@/app/memes/[id]/actions";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Btn from "../ui/Btn";
import Checkbox from "./Checkbox";

const labelStyles =
  "flex flex-col gap-y-1 text-black dark:text-zinc-300 text-sm";

function CreateCollection() {
  const [creating, setCreating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [newCollection, setNewCollection] = useState<CollectionType>({
    id: 0,
    name: "",
    userId: "",
  });
  const { data: session } = authClient.useSession();

  async function handleCreate() {
    if (newCollection.name.trim().length > 0 && session?.user) {
      setLoading(true);
      const newId = await createCollection(session.user.id, -1, newCollection);
      redirect(`/collections/${newId}`);
    }
  }

  return (
    <div className="absolute top-10 right-5 sm:right-20 lg:right-50">
      <MdOutlineAdd
        size={35}
        className="text-black dark:text-zinc-300 p-1.5 cursor-pointer rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-900"
        title="Create collection"
        onClick={() => setCreating(true)}
      />
      <AnimatePresence>
        {creating && (
          <Modal closeModal={() => setCreating(false)}>
            <div className="flex flex-col gap-y-3 p-6">
              <h2 className="text-black dark:text-white text-xl font-bold">
                Create collection
              </h2>
              <label className={labelStyles}>
                Name
                <Input
                  placeholder="Cringe memes"
                  value={newCollection.name}
                  setValue={(name) =>
                    setNewCollection({ ...newCollection, name })
                  }
                />
              </label>
              <label className={labelStyles}>
                Description
                <textarea
                  className="text-base border-2 border-zinc-700 rounded px-4 py-2 text-black dark:text-zinc-300 outline-none resize-none h-30"
                  placeholder="Describe what kinds of memes go in this collection (optional)"
                  value={newCollection.description || ""}
                  onChange={(e) =>
                    setNewCollection({
                      ...newCollection,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </label>
              <Checkbox
                collection={newCollection}
                setCollection={setNewCollection}
              />
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

export default CreateCollection;
