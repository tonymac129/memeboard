"use client";

import type { MemeTag } from "@/app/generated/prisma/client";
import { useRef, useState, useEffect } from "react";
import { FaTrash, FaEllipsisH } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { redirect } from "next/navigation";
import { deleteTag } from "./actions";
import Modal from "@/components/ui/Modal";
import Btn from "@/components/ui/Btn";

const optionStyles =
  "flex gap-x-3 px-4 py-2 cursor-pointer hover:bg-zinc-900 items-center";

function Options({ tagData }: { tagData: MemeTag }) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  async function handleDelete() {
    setLoading(true);
    await deleteTag(tagData.id);
    redirect("/tags");
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
      <div className="relative text-zinc-300">
        <FaEllipsisH
          className={`p-2.5 rounded-full hover:bg-zinc-900 cursor-pointer ${menuOpen && "bg-zinc-900"}`}
          onClick={() => setMenuOpen(!menuOpen)}
          size={35}
        />
        {menuOpen && (
          <div className="absolute top-[calc(100%+5px)] border-2 bg-zinc-950 border-zinc-700 rounded right-0">
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
        {deleting && (
          <Modal closeModal={() => setDeleting(false)}>
            <div className="flex flex-col gap-y-3 p-6">
              <h2 className="text-white text-xl font-bold">
                Delete confirmation
              </h2>
              <p className="text-zinc-300">
                Are you sure you want to delete this tag? It will be removed
                from all the memes labeled with it. This action cannot be
                undone.
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
