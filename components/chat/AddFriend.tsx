"use client";

import type { User } from "@/app/generated/prisma/client";
import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import UserCard from "../user/UserCard";

type UserType = User & {
  followers: User[];
};

interface AddFriendProps {
  users: UserType[];
  userId: string;
}

function AddFriend({ users, userId }: AddFriendProps) {
  const [search, setSearch] = useState<string>("");
  const [adding, setAdding] = useState<boolean>(false);
  const displayed = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(query) ||
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query),
    );
  }, [users, search]);

  return (
    <>
      <div
        className="flex gap-x-3 items-center p-4 rounded hover:bg-zinc-900 text-zinc-300 cursor-pointer"
        onClick={() => setAdding(true)}
      >
        <FaPlus size={20} className="w-11.25" />
        Add friend
      </div>
      <AnimatePresence>
        {adding && (
          <Modal closeModal={() => setAdding(false)}>
            <div className="flex flex-col gap-y-3 p-6">
              <h2 className="text-white text-xl font-bold">Add friend</h2>
              <Input
                placeholder="Search username, display, or email"
                value={search}
                setValue={(name) => setSearch(name)}
              />
              <div className="flex flex-col gap-y-3 max-h-100 overflow-auto">
                {displayed.length > 0 ? (
                  displayed.map((user) => {
                    return (
                      <UserCard
                        key={user.id}
                        user={user}
                        follow={userId ? true : false}
                        following={
                          user.followers.find((u) => u.id === userId)
                            ? true
                            : false
                        }
                      />
                    );
                  })
                ) : (
                  <div className="py-2 text-zinc-300 text-center">
                    No users found! Try a different search?
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default AddFriend;
