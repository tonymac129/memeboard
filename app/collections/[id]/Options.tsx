"use client";

import type { Collection, Meme } from "@/app/generated/prisma/client";
import { useRef, useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaEllipsisH,
  FaCheck,
  FaInfoCircle,
} from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { redirect } from "next/navigation";
import { editCollection, deleteCollection } from "./actions";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Btn from "@/components/ui/Btn";

const labelStyles =
  "flex flex-col gap-y-1 text-black dark:text-zinc-300 text-sm";
const optionStyles =
  "flex gap-x-3 px-4 py-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900 items-center";

export type CollectionType = Collection & {
  memes: Meme[];
};

function Options({ collectionData }: { collectionData: CollectionType }) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [collection, setCollection] = useState<CollectionType>(collectionData);
  const [editing, setEditing] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMemes, setSelectedMemes] = useState<number[]>(
    collectionData.memes.map((m) => m.id),
  );
  const menuRef = useRef<HTMLDivElement>(null);

  async function handleEdit() {
    setLoading(true);
    await editCollection(collection, selectedMemes);
    setLoading(false);
    setEditing(false);
  }

  useEffect(() => {
    setCollection(collectionData);
  }, [collectionData]);

  async function handleDelete() {
    setLoading(true);
    await deleteCollection(collectionData.id);
    redirect("/collections");
  }

  useEffect(() => {
    const clickListener = (e: Event) => {
      if (!menuRef?.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", clickListener);
    return () => {
      document.removeEventListener("click", clickListener);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="absolute top-10 right-5 sm:right-20 lg:right-50"
    >
      <div className="relative text-black dark:text-zinc-300">
        <FaEllipsisH
          className={`p-2.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-900 cursor-pointer ${menuOpen && "bg-zinc-200 dark:bg-zinc-900"}`}
          onClick={() => setMenuOpen(!menuOpen)}
          size={35}
        />
        {menuOpen && (
          <div className="absolute top-[calc(100%+5px)] border-2 bg-zinc-100 dark:bg-zinc-950 border-zinc-700 rounded flex flex-col right-0">
            <div onClick={() => setEditing(true)} className={optionStyles}>
              <FaEdit size={15} /> Edit
            </div>
            <div
              className={optionStyles + " text-red-500"}
              onClick={() => setDeleting(true)}
            >
              <FaTrash size={15} /> Delete
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {editing && (
          <Modal closeModal={() => setEditing(false)}>
            <div className="flex flex-col gap-y-3 p-6">
              <h2 className="text-black dark:text-white text-xl font-bold">
                Edit collection
              </h2>
              <label className={labelStyles}>
                Name
                <Input
                  placeholder="Cringe memes"
                  value={collection.name}
                  setValue={(name) => setCollection({ ...collection, name })}
                />
              </label>
              <label className={labelStyles}>
                Description
                <textarea
                  className="text-base border-2 border-zinc-700 rounded px-4 py-2 text-black dark:text-zinc-300 outline-none resize-none h-30"
                  placeholder="Describe what kinds of memes go in this collection (optional)"
                  value={collection.description || ""}
                  onChange={(e) =>
                    setCollection({
                      ...collection,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </label>
              <label className="text-black dark:text-zinc-300 text-sm w-fit cursor-pointer flex items-center gap-x-3 py-2">
                <div className="group">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={collection?.public ? true : false}
                    onChange={(e) => {
                      setCollection((prev) => {
                        return prev && { ...prev, public: e.target.checked };
                      });
                    }}
                  />
                  <div
                    className="w-4.5 h-4.5 rounded border-2 border-zinc-700 text-zinc-100 dark:text-zinc-950 flex items-center justify-center
                                                 group-has-checked:border-green-600 group-has-checked:bg-green-600"
                  >
                    {collection?.public && <FaCheck size={13} />}
                  </div>
                </div>
                Public
                <div className="group relative">
                  <FaInfoCircle size={15} />
                  <div className="pointer-events-none opacity-0 group-hover:opacity-100 absolute left-7 top-[50%] translate-y-[-50%] transition-opacity! duration-300 w-60 bg-zinc-200 dark:bg-zinc-900 rounded p-2 text-xs">
                    Public collections are viewable by everyone, but only you
                    can edit and add/remove memes from it.
                  </div>
                </div>
              </label>
              <div className="max-h-70 flex flex-col gap-y-1 overflow-auto">
                <p className={labelStyles}>Memes</p>
                {collection.memes.length > 0 ? (
                  collection.memes.map((meme) => (
                    <label
                      key={meme.id}
                      className="text-black dark:text-zinc-300 text-sm w-fit cursor-pointer flex items-center gap-x-3 py-2"
                    >
                      <div className="group">
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={
                            selectedMemes.find((m) => m === meme.id)
                              ? true
                              : false
                          }
                          onChange={() => {
                            setSelectedMemes((prev) =>
                              prev.find((m) => m === meme.id)
                                ? prev.filter((m) => m !== meme.id)
                                : [...prev, meme.id],
                            );
                          }}
                        />
                        <div
                          className="w-4.5 h-4.5 rounded border-2 border-zinc-700 text-zinc-100 dark:text-zinc-950 flex items-center justify-center
                                 group-has-checked:border-green-600 group-has-checked:bg-green-600"
                        >
                          {selectedMemes.find((m) => m === meme.id) && (
                            <FaCheck size={13} />
                          )}
                        </div>
                      </div>
                      {meme.title}
                    </label>
                  ))
                ) : (
                  <div className="text-black dark:text-zinc-300 text-center text-sm my-2">
                    No memes added to this collection yet
                  </div>
                )}
              </div>
              <div className="flex gap-x-3">
                <Btn
                  text={loading ? "Loading..." : "Save"}
                  onclick={handleEdit}
                  primary
                />
                <Btn text="Cancel" onclick={() => setEditing(false)} />
              </div>
            </div>
          </Modal>
        )}
        {deleting && (
          <Modal closeModal={() => setDeleting(false)}>
            <div className="flex flex-col gap-y-3 p-6">
              <h2 className="text-black dark:text-white text-xl font-bold">
                Delete confirmation
              </h2>
              <p className="text-black dark:text-zinc-300">
                Are you sure you want to delete this collection and all its
                related data? This action cannot be undone.
              </p>
              <div className="flex gap-x-3">
                <Btn
                  text={loading ? "Loading..." : "Delete"}
                  onclick={handleDelete}
                  styles="bg-red-500 text-white! border-red-500"
                  primary
                />
                <Btn text="Cancel" onclick={() => setDeleting(false)} />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Options;
