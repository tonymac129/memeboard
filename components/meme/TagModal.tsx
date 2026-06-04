"use client";

import type { MemeType } from "@/types/Meme";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import Input from "../ui/Input";
import Btn from "../ui/Btn";
import { FaCheck } from "react-icons/fa";

interface TagModalProps {
  selected: string[];
  setNewMeme: React.Dispatch<React.SetStateAction<MemeType>>;
  setSelecting: React.Dispatch<React.SetStateAction<boolean>>;
}

const tags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4"];

function TagModal({ selected, setNewMeme, setSelecting }: TagModalProps) {
  const [search, setSearch] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>(selected);
  const displayedTags = useMemo(() => {
    return tags.filter((tag) =>
      tag.toLowerCase().includes(search.trim().toLowerCase()),
    );
  }, [search]);
  const modalRef = useRef<HTMLDivElement>(null);

  function handleSave() {
    setNewMeme((prev) => {
      return { ...prev, tags: selectedTags.sort() };
    });
    setSelecting(false);
  }

  useEffect(() => {
    const clickListener = (e: Event) => {
      if (!modalRef.current?.contains(e.target as Node)) {
        setSelecting(false);
      }
    };

    document.addEventListener("click", clickListener);

    return () => {
      document.removeEventListener("click", clickListener);
    };
  }, [setSelecting]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-screen h-screen fixed top-0 left-0 z-10 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, y: 100 }}
        className="rounded w-100 bg-zinc-950 border-2 border-zinc-700"
        ref={modalRef}
      >
        <div className="px-10 pt-5 flex flex-col gap-y-3">
          <h2 className="text-white text-2xl font-bold">Add tags</h2>
          <Input
            placeholder="Search tags"
            value={search}
            setValue={(search) => setSearch(search)}
          />
          <div className="max-h-70 flex flex-col gap-y-1 overflow-auto">
            {displayedTags.length > 0 ? (
              displayedTags.map((tag, i) => (
                <label
                  key={i}
                  className="text-zinc-300 w-fit cursor-pointer flex items-center gap-x-3 py-2"
                >
                  <div className="group">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedTags.includes(tag)}
                      onChange={() => {
                        setSelectedTags((prev) =>
                          selectedTags.includes(tag)
                            ? selectedTags.filter((t) => t !== tag)
                            : [...prev, tag],
                        );
                      }}
                    />
                    <div
                      className="w-4.5 h-4.5 rounded border-2 border-zinc-700 text-zinc-950 flex items-center justify-center
                   group-has-checked:border-green-600 group-has-checked:bg-green-600"
                    >
                      {selectedTags.includes(tag) && <FaCheck size={13} />}
                    </div>
                  </div>
                  {tag}
                </label>
              ))
            ) : (
              <span className="text-sm text-zinc-300">No tags found</span>
            )}
          </div>
        </div>
        <div className="flex gap-x-3 px-10 py-5">
          <Btn text="Save" onclick={handleSave} styles="w-fit" primary />
          <Btn
            text="Cancel"
            onclick={() => setSelecting(false)}
            styles="w-fit"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TagModal;
