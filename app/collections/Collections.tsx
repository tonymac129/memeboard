"use client";

import type { Collection, Meme } from "../generated/prisma/client";
import { useState } from "react";
import CollectionCard from "@/components/collection/CollectionCard";
import Input from "@/components/ui/Input";

type CollectionType = Collection & {
  memes: Meme[];
};

function Collections({ collections }: { collections: CollectionType[] }) {
  const [search, setSearch] = useState<string>("");
  const displayed = collections.filter((collection) =>
    collection.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-y-5 items-center">
      <Input
        placeholder="Search collections"
        value={search}
        setValue={(search) => setSearch(search)}
        styles="w-[90%] sm:w-100"
      />
      <div className="flex flex-wrap justify-center gap-5">
        {displayed.length > 0 ? (
          displayed.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))
        ) : (
          <div className="text-zinc-300">
            No collections found. Try a different search?
          </div>
        )}
      </div>
    </div>
  );
}

export default Collections;
