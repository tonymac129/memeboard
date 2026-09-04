"use client";

import type { CommentType } from "@/types/Meme";
import { useRef, useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEllipsisH } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { deleteComment, editComment } from "@/app/memes/[id]/actions";
import Modal from "@/components/ui/Modal";
import Btn from "@/components/ui/Btn";
import Input from "@/components/ui/Input";

const optionStyles =
  "flex gap-x-3 px-4 py-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900 items-center";

interface OptionsProps {
  comment: CommentType;
  userId: string;
}

function Options({ comment, userId }: OptionsProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [content, setContent] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  async function handleEdit() {
    if (content?.trim() !== comment.content && content!.trim().length > 0) {
      setLoading(true);
      await editComment({ ...comment, content: content! }, userId);
      setContent(null);
      setMenuOpen(false);
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    await deleteComment(comment.id, userId);
    setLoading(false);
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
    <div ref={menuRef} className="absolute top-3 right-3">
      <div className="relative text-black dark:text-zinc-300">
        <FaEllipsisH
          className={`p-2.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-900 cursor-pointer ${menuOpen && "bg-zinc-200 dark:bg-zinc-900"}`}
          onClick={() => setMenuOpen(!menuOpen)}
          size={35}
        />
        {menuOpen && (
          <div className="absolute top-[calc(100%+5px)] border-2 border-zinc-700 rounded flex flex-col right-0">
            <div
              className={optionStyles}
              onClick={() => setContent(comment.content)}
            >
              <FaEdit size={15} /> Edit
            </div>
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
              <h2 className="text-black dark:text-white text-xl font-bold">
                Delete confirmation
              </h2>
              <p className="text-black dark:text-zinc-300">
                Are you sure you want to delete this comment and all its
                replies? This action cannot be undone.
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
        {content !== null && (
          <Modal closeModal={() => setContent(null)}>
            <div className="flex flex-col gap-y-3 p-6">
              <h2 className="text-black dark:text-white text-xl font-bold">
                Edit comment
              </h2>
              <Input
                placeholder="Edit comment"
                value={content}
                setValue={(text) => setContent(text)}
              />
              <div className="flex gap-x-3">
                <Btn
                  text={loading ? "Loading..." : "Save"}
                  onclick={handleEdit}
                  primary
                />
                <Btn text="Cancel" onclick={() => setContent(null)} />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Options;
