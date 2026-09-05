"use client";

import type { Collection, Meme, User } from "../generated/prisma/client";
import { useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa";
import CollectionCard from "@/components/collection/CollectionCard";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";

const optionStyles = "flex gap-x-3 text-black dark:text-zinc-300 items-center";
const sortOptions: string[] = ["New", "Name", "Creator"];
const filterOptions: string[] = ["All", "Friends", "You"];

type CollectionType = Collection & {
  memes: Meme[];
  user: User;
};

interface CollectionsProps {
  userId: string | undefined;
  friendIds: string[];
  collections: CollectionType[];
}

function Collections({ userId, friendIds, collections }: CollectionsProps) {
  const [search, setSearch] = useState<string>("");
  const [sortMethod, setSortMethod] = useState<string>("New");
  const [filterMethod, setFilterMethod] = useState<string>("All");
  const displayed = collections
    .filter((collection) => {
      const matchesSearch = collection.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      let matched = true;
      switch (filterMethod) {
        case "Friends":
          matched = friendIds.includes(collection.userId);
          break;
        case "You":
          matched = collection.userId === userId;
          break;
      }
      return matchesSearch && matched;
    })
    .sort((a, b) => {
      let result = 0;
      switch (sortMethod) {
        case "New":
          result =
            collections.indexOf(collections.find((c) => c.id === b.id)!) -
            collections.indexOf(collections.find((c) => c.id === a.id)!);
          break;
        case "Name":
          result = a.name.localeCompare(b.name);
          break;
        case "Creator":
          result = a.user.name.localeCompare(b.user.name);
          break;
      }
      return result;
    });

  return (
    <div className="flex flex-col gap-y-5 items-center">
      <Input
        placeholder="Search collections"
        value={search}
        setValue={(search) => setSearch(search)}
        styles="w-[90%] sm:w-100"
      />
      <div className="flex flex-wrap justify-center items-center gap-3 lg:gap-10 w-full mb-5 relative">
        <div className={optionStyles}>
          <FaSort size={20} title="Sort by" />
          <Dropdown
            options={sortOptions}
            label="Sort by"
            value={sortMethod}
            setValue={setSortMethod}
          />
        </div>
        <div className={optionStyles}>
          <FaFilter size={18} title="Filter by" />
          <Dropdown
            options={filterOptions}
            label="Filter by"
            value={filterMethod}
            setValue={setFilterMethod}
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-5">
        {displayed.length > 0 ? (
          displayed.map((collection, i) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              user={collection.user.name}
              index={i}
            />
          ))
        ) : (
          <div className="text-black dark:text-zinc-300">
            No collections found. Try a different search?
          </div>
        )}
      </div>
    </div>
  );
}

export default Collections;
