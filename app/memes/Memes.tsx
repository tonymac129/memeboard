"use client";

import type { MemeTag, User } from "../generated/prisma/client";
import type { MemeType } from "@/components/meme/MemeCard";
import { useState, useMemo } from "react";
import { FaFilter, FaSort, FaTag } from "react-icons/fa";
import { GrGrid } from "react-icons/gr";
import Input from "@/components/ui/Input";
import MemeCard from "@/components/meme/MemeCard";
import Dropdown from "@/components/ui/Dropdown";

const optionStyles = "flex gap-x-3 text-black dark:text-zinc-300 items-center";
const sortOptions = ["Best", "Top", "New"];
const filterOptions = [
  "Now",
  "Today",
  "This week",
  "All time",
  "Friends",
  "You",
];
const numberOptions = ["5", "10", "25", "50"];

type Meme = MemeType & {
  upvotes: User[];
  downvotes: User[];
  tags: MemeTag[];
};

interface MemesProps {
  memes: Meme[];
  friends: User[];
  userId: string;
  tags: MemeTag[];
}

function Memes({ memes, friends, userId, tags }: MemesProps) {
  const [search, setSearch] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [sortMethod, setSortMethod] = useState<string>("Best");
  const [filterMethod, setFilterMethod] = useState<string>("This week");
  const [count, setCount] = useState<string>("10");
  const [selectedTag, setSelectedTag] = useState<string>("None");
  const finalMemes = useMemo(() => {
    return memes
      .filter((meme) => {
        return selectedTag === "None"
          ? true
          : meme.tags.find((t) => t.name === selectedTag);
      })
      .filter((meme) => {
        let displayed = true;
        switch (filterMethod) {
          case "Now":
            displayed =
              new Date().getTime() - meme.createdAt.getTime() < 3600000;
            break;
          case "Today":
            displayed =
              new Date().getTime() - meme.createdAt.getTime() < 86400000;
            break;
          case "This week":
            displayed =
              new Date().getTime() - meme.createdAt.getTime() <
              3600000 * 24 * 7;
            break;
          case "Friends":
            displayed = friends.find((u) => u.id === meme.userId)
              ? true
              : false;
            break;
          case "You":
            displayed = meme.userId === userId;
        }
        return (
          displayed &&
          meme.title.toLowerCase().includes(query.trim().toLowerCase())
        );
      })
      .sort((a, b) => {
        let result;
        switch (sortMethod) {
          case "Best":
            result =
              b.upvotes.length / (b.downvotes.length + 1) -
              a.upvotes.length / (a.downvotes.length + 1);
            break;
          case "Top":
            result =
              b.upvotes.length -
              b.downvotes.length -
              a.upvotes.length +
              a.downvotes.length;
            break;
          case "New":
            result = b.createdAt.getTime() - a.createdAt.getTime();
            break;
          default:
            result = a.title.localeCompare(b.title);
        }
        return result;
      })
      .slice(0, Number(count));
  }, [
    memes,
    query,
    sortMethod,
    filterMethod,
    count,
    friends,
    userId,
    selectedTag,
  ]);

  function handleSearch(e: React.SubmitEvent) {
    e.preventDefault();
    setQuery(search);
  }

  return (
    <div className="flex flex-col gap-y-5 items-center">
      <form onSubmit={handleSearch}>
        <Input
          placeholder="Search memes"
          value={search}
          setValue={(search) => setSearch(search)}
          styles="w-[90%] sm:w-100"
        />
        <button type="submit" className="none" />
      </form>
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
        <div className={optionStyles}>
          <FaTag size={18} title="Has tag" />
          <Dropdown
            options={["None", ...tags.map((t) => t.name)]}
            label="Custom tag"
            value={selectedTag}
            setValue={setSelectedTag}
            hasSearch
          />
        </div>
        <div className={optionStyles}>
          <GrGrid size={18} title="Number of memes" />
          <Dropdown
            options={numberOptions}
            value={count}
            setValue={setCount}
            styles="w-fit"
          />
        </div>
        <div className="absolute right-0 text-black dark:text-zinc-300">
          {Math.min(Number(count), finalMemes.length)} of {memes.length} memes
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-5">
        {finalMemes.length > 0 ? (
          finalMemes.map((meme) => {
            return <MemeCard key={meme.id} meme={meme} />;
          })
        ) : (
          <div className="text-black dark:text-zinc-300">
            No memes found. Maybe try adjusting the filters?
          </div>
        )}
      </div>
    </div>
  );
}

export default Memes;
