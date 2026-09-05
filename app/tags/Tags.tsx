"use client";

import type { MemeTag, Meme } from "../generated/prisma/client";
import type { Metadata } from "next";
import { useState } from "react";
import TagCard from "@/components/meme/TagCard";
import Input from "@/components/ui/Input";

type TagType = MemeTag & {
  memes: Meme[];
};

export const metadata: Metadata = {
  title: "Tags | MemeBoard",
  description:
    "Check out all the categorized and custom tags on MemeBoard to discover more memes related to a specific topic!",
};

function Tags({ tags }: { tags: TagType[] }) {
  const [search, setSearch] = useState<string>("");
  const displayed = tags.filter((tag) =>
    tag.name.trim().toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-y-5 items-center">
      <Input
        placeholder="Search tags"
        value={search}
        setValue={(search) => setSearch(search)}
        styles="w-[90%] sm:w-100"
      />
      <div className="flex flex-wrap justify-center gap-5">
        {displayed.length > 0 ? (
          displayed.map((tag, i) => {
            return <TagCard key={tag.id} tag={tag} index={i} />;
          })
        ) : (
          <div className="text-black dark:text-zinc-300">
            No tags found. Try a different search?
          </div>
        )}
      </div>
    </div>
  );
}

export default Tags;
