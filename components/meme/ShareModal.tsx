"use client";

import type { User } from "@/app/generated/prisma/client";
import { FaCheck, FaClipboard, FaFlag } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useState } from "react";
import { sendComment, sendMeme } from "@/app/memes/[id]/actions";
import { authClient } from "@/lib/auth-client";
import Modal from "../ui/Modal";
import Btn from "../ui/Btn";
import Image from "next/image";
import Input from "../ui/Input";

const optionStyles =
  "flex flex-col gap-y-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-900 items-center text-black dark:text-zinc-300 cursor-pointer text-sm font-bold";

interface ShareModalProps {
  memeId: number;
  friends: User[];
  setSharing: React.Dispatch<React.SetStateAction<boolean>>;
  setReporting: React.Dispatch<React.SetStateAction<boolean>>;
  isComment?: number;
  content?: string;
}

function ShareModal({
  memeId,
  friends,
  setSharing,
  setReporting,
  isComment,
  content,
}: ShareModalProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [sent, setSent] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { data: session } = authClient.useSession();

  async function handleSend() {
    if (sent) {
      const username = friends.find(
        (f) => f.id === selectedFriends[0],
      )!.username;
      window.open(`/chat/${username}`, "_self");
    } else {
      if (selectedFriends.length > 0) {
        setMessage("");
        if (isComment) {
          await sendComment(isComment, message, selectedFriends);
        } else {
          await sendMeme(memeId, message, selectedFriends);
        }
        setSent(true);
        setTimeout(() => {
          setSelectedFriends([]);
          setSent(false);
        }, 3000);
      }
    }
  }

  function handleCopy() {
    setCopied(true);
    navigator.clipboard.writeText(
      isComment ? (content as string) : window.location.href,
    );
    setTimeout(() => {
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
        <h2 className="text-black dark:text-white text-2xl font-bold">
          Share {isComment ? "comment" : "meme"}
        </h2>
        {session && (
          <>
            <div className="flex gap-x-3 overflow-auto">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() =>
                    setSelectedFriends(
                      selectedFriends.includes(friend.id)
                        ? selectedFriends.filter((f) => f !== friend.id)
                        : [...selectedFriends, friend.id],
                    )
                  }
                  className={`${optionStyles} p-2 border-transparent border-2 rounded ${selectedFriends.includes(friend.id) && "border-green-700!"}`}
                >
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
            {(selectedFriends.length > 0 || sent) && (
              <>
                <Input
                  placeholder="Send a message"
                  value={message}
                  setValue={(message) => setMessage(message)}
                />
                <Btn
                  text={
                    sent
                      ? `${isComment ? "Comment" : "Meme"} sent. View message`
                      : `Send ${isComment ? "comment" : "meme"}`
                  }
                  onclick={handleSend}
                  styles="text-base"
                  primary
                >
                  {sent ? <FaCheck size={18} /> : <IoSend size={18} />}
                </Btn>
              </>
            )}
            <div className="h-0.5 my-3 w-full bg-zinc-700 relative">
              <div className="absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] px-5 bg-zinc-100 dark:bg-zinc-950 text-black dark:text-zinc-300">
                or
              </div>
            </div>
          </>
        )}
        <div className="flex gap-x-3">
          <div
            onClick={handleCopy}
            title="Copy meme link"
            className={optionStyles + " w-20 px-5 py-2"}
          >
            <FaClipboard size={30} />
            {copied ? "Copied!" : "Copy"}
          </div>
          {session && (
            <div
              onClick={handleReport}
              title="Report meme"
              className={optionStyles + " w-20 px-5 py-2"}
            >
              <FaFlag size={30} />
              Report
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ShareModal;
