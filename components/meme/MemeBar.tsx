"use client";

import type { Collection, Meme, User } from "@/app/generated/prisma/client";
import { FaBookmark, FaFlag, FaRegBookmark, FaShare } from "react-icons/fa";
import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import CollectionModal from "./CollectionModal";
import ShareModal from "./ShareModal";
import ReportModal from "./ReportModal";
import Voting from "./Voting";
import Link from "next/link";
import React from "./React";

const optionStyles =
  "border-2 border-zinc-700 rounded cursor-pointer px-3 py-1.5 flex items-center gap-x-2 text-sm text-black dark:text-zinc-300 font-bold";

export type MemeType = Meme & {
  upvotes: User[];
  downvotes: User[];
};

export type CollectionType = Collection & {
  memes: Meme[];
};

interface MemeBarProps {
  meme: MemeType;
  userId?: string;
  collections: CollectionType[];
  friends: User[];
}

function MemeBar({ meme, userId, collections, friends }: MemeBarProps) {
  const [collection, setCollection] = useState<boolean>(false);
  const [sharing, setSharing] = useState<boolean>(false);
  const [reporting, setReporting] = useState<boolean>(false);
  const savedCollections = useMemo(() => {
    return collections.filter(
      (c) => c.memes.filter((m) => m.id === meme.id).length > 0,
    );
  }, [collections, meme.id]);
  const upvoted = userId
    ? meme.upvotes.find((u) => u.id === userId)
      ? true
      : meme.downvotes.find((u) => u.id === userId)
        ? false
        : null
    : null;
  const { data: session } = authClient.useSession();

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Voting meme={meme} upvoted={upvoted} />
      {session && (
        <>
          <div
            className={
              optionStyles + " hover:bg-zinc-200 dark:hover:bg-zinc-900"
            }
            onClick={() => setCollection(true)}
          >
            {savedCollections.length > 0 ? (
              <FaBookmark className="text-yellow-500" size={18} />
            ) : (
              <FaRegBookmark size={18} />
            )}
            Save
            {savedCollections.length > 0
              ? `d (${savedCollections.length})`
              : ""}
          </div>
          <React memeId={meme.id} />
        </>
      )}
      <div
        className={optionStyles + " hover:bg-zinc-200 dark:hover:bg-zinc-900"}
        onClick={() => setSharing(true)}
      >
        <FaShare size={18} />
        Share
      </div>
      {session ? (
        <div
          className={optionStyles + " hover:bg-zinc-200 dark:hover:bg-zinc-900"}
          onClick={() => setReporting(true)}
        >
          <FaFlag size={18} />
          Report
        </div>
      ) : (
        <div className="text-black dark:text-zinc-300">
          <Link
            href="/login"
            className="hover:text-green-600 dark:hover:text-green-500"
          >
            Log in
          </Link>{" "}
          to unlock more features!
        </div>
      )}
      <AnimatePresence>
        {collection && (
          <CollectionModal
            userId={userId as string}
            memeId={meme.id}
            collections={collections}
            setCollection={setCollection}
          />
        )}
        {sharing && (
          <ShareModal
            memeId={meme.id}
            friends={friends}
            setSharing={setSharing}
            setReporting={setReporting}
          />
        )}
        {reporting && (
          <ReportModal memeId={meme.id} setReporting={setReporting} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default MemeBar;
