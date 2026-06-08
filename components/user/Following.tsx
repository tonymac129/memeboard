"use client";

import type { User } from "@/app/generated/prisma/client";
import { AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import UserCard from "./UserCard";
import Modal from "../ui/Modal";
import Input from "../ui/Input";

const tabBtnStyles =
  "w-[50%] text-zinc-300 text-center py-2 cursor-pointer border-b-2 border-zinc-700";

interface FollowingProps {
  followers: User[];
  following: User[];
}

function Following({ followers, following }: FollowingProps) {
  const [tab, setTab] = useState<"followers" | "following" | null>(null);
  const [search, setSearch] = useState<string>("");
  const displayed = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (tab === "followers" ? followers : following).filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query),
    );
  }, [search, followers, following, tab]);

  return (
    <div>
      <span
        className="cursor-pointer hover:underline"
        onClick={() => setTab("followers")}
      >
        {followers.length} followers
      </span>{" "}
      •{" "}
      <span
        className="cursor-pointer hover:underline"
        onClick={() => setTab("following")}
      >
        {following.length} following
      </span>
      <AnimatePresence>
        {tab && (
          <Modal closeModal={() => setTab(null)}>
            <div className="flex">
              <div
                onClick={() => setTab("followers")}
                className={
                  tabBtnStyles +
                  ` ${tab === "followers" ? "border-b-zinc-950" : "hover:bg-zinc-900"} border-r-2`
                }
              >
                Followers ({followers.length})
              </div>
              <div
                onClick={() => setTab("following")}
                className={
                  tabBtnStyles +
                  ` ${tab === "following" ? "border-b-zinc-950" : "hover:bg-zinc-900"}`
                }
              >
                Following ({following.length})
              </div>
            </div>
            <div className="px-4 pt-5 flex flex-col">
              <Input
                placeholder={`Search ${tab}`}
                value={search}
                setValue={(search) => setSearch(search)}
              />
            </div>
            <div className="px-4 py-5 flex flex-col gap-y-3 h-100 overflow-auto">
              {tab && (
                <>
                  {displayed.length > 0 ? (
                    displayed.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))
                  ) : (
                    <span className="text-zinc-300 text-center">
                      No users found :(
                    </span>
                  )}
                </>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Following;
