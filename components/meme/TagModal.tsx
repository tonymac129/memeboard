"use client";

import type { MemeTag } from "@/app/generated/prisma/client";
import type { MemeType, TagType } from "@/types/Meme";
import { useState, useMemo } from "react";
import { FaCheck, FaStar } from "react-icons/fa";
import { addTag } from "@/app/post/actions";
import Input from "../ui/Input";
import Btn from "../ui/Btn";
import Modal from "../ui/Modal";

interface TagModalProps {
  selected: TagType[];
  setNewMeme: React.Dispatch<React.SetStateAction<MemeType>>;
  setSelecting: React.Dispatch<React.SetStateAction<boolean>>;
  tags: MemeTag[];
}

function TagModal({ selected, setNewMeme, setSelecting, tags }: TagModalProps) {
  const [search, setSearch] = useState<string>("");
  const [newTag, setNewTag] = useState<TagType | null>(null);
  const [selectedTags, setSelectedTags] = useState<TagType[]>(selected);
  const displayedTags = useMemo(() => {
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(search.trim().toLowerCase()),
    );
  }, [search, tags]);

  async function handleAddTag() {
    if (
      newTag &&
      newTag.name.trim().length > 0 &&
      !tags.find((t) => t.name === newTag?.name.trim())
    ) {
      await addTag(newTag);
      setNewTag(null);
    }
  }

  function handleSave() {
    setNewMeme((prev) => {
      return {
        ...prev,
        tags: selectedTags.sort((a, b) => a.name.localeCompare(b.name)),
      };
    });
    setSelecting(false);
  }

  return (
    <Modal closeModal={() => setSelecting(false)}>
      <div className="px-10 pt-5 flex flex-col gap-y-3">
        <h2 className="text-white text-2xl font-bold">Add tags</h2>
        <Input
          placeholder="Search tags"
          value={search}
          setValue={(search) => setSearch(search)}
        />
        <div className="max-h-70 flex flex-col gap-y-1 overflow-auto">
          {displayedTags.length > 0 ? (
            displayedTags.map((tag) => (
              <label
                key={tag.id}
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
                {tag.name}
                {tag.default && <FaStar size={15} title="Popular tag" />}
              </label>
            ))
          ) : (
            <span className="text-sm text-zinc-300">No tags found</span>
          )}
        </div>
        {newTag && (
          <Input
            placeholder="Custom tag"
            value={newTag.name}
            setValue={(name) => setNewTag({ ...newTag, name })}
          />
        )}
        <div className="flex gap-x-3">
          <Btn
            text={newTag ? "Add" : "New tag"}
            styles="w-fit"
            onclick={() =>
              newTag ? handleAddTag() : setNewTag({ id: 0, name: "" })
            }
          />
          {newTag && (
            <Btn text="Cancel" styles="w-fit" onclick={() => setNewTag(null)} />
          )}
        </div>
      </div>
      <div className="flex gap-x-3 px-10 py-5">
        <Btn text="Save" onclick={handleSave} styles="w-fit" primary />
        <Btn text="Cancel" onclick={() => setSelecting(false)} styles="w-fit" />
      </div>
    </Modal>
  );
}

export default TagModal;
