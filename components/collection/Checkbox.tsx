"use client";

import type { CollectionType } from "@/app/collections/[id]/Options";
import type { CollectionType as Collection } from "@/types/Meme";
import { FaCheck } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";

interface CheckboxProps {
  collection: CollectionType | Collection;
  setCollection: React.Dispatch<
    React.SetStateAction<CollectionType | Collection>
  >;
}

function Checkbox({ collection, setCollection }: CheckboxProps) {
  return (
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
          Public collections are viewable by everyone, but only you can edit and
          add/remove memes from it.
        </div>
      </div>
    </label>
  );
}

export default Checkbox;
