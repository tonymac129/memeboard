"use client";

import type { CollectionType } from "@/types/Meme";
import type { CollectionType as Collection } from "./MemeBar";
import { createCollection, addCollections } from "@/app/memes/[id]/actions";
import { useState, useMemo } from "react";
import { FaCheck } from "react-icons/fa";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Btn from "../ui/Btn";

interface CollectionModalProps {
  userId: string;
  memeId: number;
  collections: Collection[];
  setCollection: React.Dispatch<React.SetStateAction<boolean>>;
}

function CollectionModal({
  userId,
  memeId,
  collections,
  setCollection,
}: CollectionModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [newCollection, setNewCollection] = useState<CollectionType | null>(
    null,
  );
  const [selectedCollections, setSelectedCollections] = useState<
    CollectionType[]
  >(collections.filter((c) => c.memes.find((m) => m.id === memeId)));
  const displayedCollections = useMemo(() => {
    return collections.filter((c) =>
      c.name.toLowerCase().includes(search.trim().toLowerCase()),
    );
  }, [collections, search]);

  async function handleSave() {
    setLoading(true);
    await addCollections(userId, memeId, selectedCollections);
    setCollection(false);
  }

  async function handleAddCollection() {
    if (newCollection && newCollection.name.trim().length > 0) {
      await createCollection(userId, memeId, newCollection);
      setNewCollection(null);
    }
  }

  return (
    <Modal closeModal={() => setCollection(false)}>
      <div className="px-10 pt-5 flex flex-col gap-y-3">
        <h2 className="text-white text-2xl font-bold">Add to collection</h2>
        <Input
          placeholder="Search your collections"
          value={search}
          setValue={(search) => setSearch(search)}
        />
        <div className="max-h-70 flex flex-col gap-y-1 overflow-auto">
          {displayedCollections.length > 0 ? (
            displayedCollections.map((collection) => (
              <label
                key={collection.id}
                className="text-zinc-300 w-fit cursor-pointer flex items-center gap-x-3 py-2"
              >
                <div className="group">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={
                      selectedCollections.find((c) => c.id === collection.id)
                        ? true
                        : false
                    }
                    onChange={() => {
                      setSelectedCollections((prev) =>
                        selectedCollections.includes(collection)
                          ? selectedCollections.filter((t) => t !== collection)
                          : [...prev, collection],
                      );
                    }}
                  />
                  <div
                    className="w-4.5 h-4.5 rounded border-2 border-zinc-700 text-zinc-950 flex items-center justify-center
                   group-has-checked:border-green-600 group-has-checked:bg-green-600"
                  >
                    {selectedCollections.find(
                      (c) => c.id === collection.id,
                    ) && <FaCheck size={13} />}
                  </div>
                </div>
                {collection.name} ({collection.memes.length})
              </label>
            ))
          ) : (
            <span className="text-sm text-zinc-300">No collections found</span>
          )}
        </div>
        {newCollection && (
          <Input
            placeholder="Custom collection"
            value={newCollection.name}
            setValue={(name) => setNewCollection({ ...newCollection, name })}
          />
        )}
        <div className="flex gap-x-3">
          <Btn
            text={newCollection ? "Add" : "New collection"}
            styles="w-fit"
            onclick={() =>
              newCollection
                ? handleAddCollection()
                : setNewCollection({ id: 0, name: "", userId: "" })
            }
          />
          {newCollection && (
            <Btn
              text="Cancel"
              styles="w-fit"
              onclick={() => setNewCollection(null)}
            />
          )}
        </div>
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
          onclick={() => setCollection(false)}
          styles="w-fit"
        />
      </div>
    </Modal>
  );
}

export default CollectionModal;
