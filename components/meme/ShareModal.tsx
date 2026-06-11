"use client";

import type { User } from "@/app/generated/prisma/client";
import { FaClipboard, FaFlag } from "react-icons/fa";
import { useState } from "react";
import Modal from "../ui/Modal";
import Image from "next/image";

const optionStyles =
  "flex flex-col gap-y-1 rounded hover:bg-zinc-900 items-center text-zinc-300 cursor-pointer text-sm font-bold";

interface ShareModalProps {
  friends: User[];
  setSharing: React.Dispatch<React.SetStateAction<boolean>>;
  setReporting: React.Dispatch<React.SetStateAction<boolean>>;
}

function ShareModal({ friends, setSharing, setReporting }: ShareModalProps) {
  const [copied, setCopied] = useState<boolean>(false);

  function handleCopy() {
    setCopied(true);
    setTimeout(() => {
      navigator.clipboard.writeText(window.location.href);
      setCopied(false);
    }, 2000);
  }

  function handleReport() {
    setReporting(true);
    setSharing(false);
  }

  return (
    <Modal closeModal={() => setSharing(false)}>
      <div className="px-10 py-5 flex flex-col gap-y-3">
        <h2 className="text-white text-2xl font-bold">Share meme</h2>
        <div className="flex gap-x-3 overflow-auto">
          {friends.map((friend) => (
            <div key={friend.id} className={optionStyles + " p-2"}>
              <Image
                src={friend.image || "/icons/default-avatar.svg"}
                alt="User avatar"
                width={50}
                height={50}
                className="rounded-full"
              />
              {friend.name}
            </div>
          ))}
        </div>
        <div className="h-0.5 my-3 w-full bg-zinc-700 relative">
          <div className="absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] px-5 bg-zinc-950 text-zinc-300">
            or
          </div>
        </div>
        <div className="flex gap-x-3">
          <div
            onClick={handleCopy}
            title="Copy meme link"
            className={optionStyles + " w-20 px-5 py-2"}
          >
            <FaClipboard size={30} />
            {copied ? "Copied!" : "Copy"}
          </div>
          <div
            onClick={handleReport}
            title="Report meme"
            className={optionStyles + " w-20 px-5 py-2"}
          >
            <FaFlag size={30} />
            Report
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ShareModal;
