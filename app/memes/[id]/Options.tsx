"use client";

import { useRef, useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEllipsisH } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { deleteMeme } from "./actions";
import { redirect } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Btn from "@/components/ui/Btn";
import Link from "next/link";

const optionStyles =
  "flex gap-x-3 px-4 py-2 cursor-pointer hover:bg-zinc-900 items-center";

interface OptionsProps {
  memeId: number;
  userId: string;
}

function Options({ memeId, userId }: OptionsProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  async function handleDelete() {
    setLoading(true);
    await deleteMeme(memeId, userId);
    redirect("/memes");
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
    <div ref={menuRef} className="absolute top-0 right-0">
      <div className="relative text-zinc-300">
        <FaEllipsisH
          className={`p-2.5 rounded-full hover:bg-zinc-900 cursor-pointer ${menuOpen && "bg-zinc-900"}`}
          onClick={() => setMenuOpen(!menuOpen)}
          size={35}
        />
        {menuOpen && (
          <div className="absolute top-[calc(100%+5px)] border-2 border-zinc-700 rounded flex flex-col right-0">
            <Link href={`/edit/${memeId}`} className={optionStyles}>
              <FaEdit size={15} /> Edit
            </Link>
            <div
              className={optionStyles + " text-red-500"}
              onClick={() => setModalOpen(true)}
            >
              <FaTrash size={15} /> Delete
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {modalOpen && (
          <Modal closeModal={() => setModalOpen(false)}>
            <div className="flex flex-col gap-y-3 p-6">
              <h2 className="text-white text-xl font-bold">
                Delete confirmation
              </h2>
              <p className="text-zinc-300">
                Are you sure you want to delete this meme and all its related
                information and comments? This action cannot be undone.
              </p>
              <div className="flex gap-x-3">
                <Btn
                  text={loading ? "Loading..." : "Delete"}
                  onclick={handleDelete}
                  styles="bg-red-500 text-white! border-red-500"
                  primary
                />
                <Btn text="Cancel" onclick={() => setModalOpen(false)} />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Options;
