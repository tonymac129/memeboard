"use client";

import type { MemeTag } from "@/app/generated/prisma/client";
import type { MemeType } from "@/types/Meme";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { redirect } from "next/navigation";
import TagModal from "./TagModal";
import Upload from "./Upload";
import Input from "../ui/Input";
import Btn from "../ui/Btn";

const labelStyles = "flex flex-col gap-y-1 text-zinc-300 text-sm";

interface MemeFormProps {
  postMeme: (meme: MemeType) => Promise<number | undefined>;
  memeTags: MemeTag[];
  data?: MemeType;
}

function MemeForm({ postMeme, memeTags, data }: MemeFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [selecting, setSelecting] = useState<boolean>(false);
  const [newMeme, setNewMeme] = useState<MemeType>(
    data || {
      id: 0,
      title: "",
      image: "",
      tags: [],
      description: "",
      comments: [],
      created: new Date(),
    },
  );

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    const id = await postMeme(newMeme);
    redirect("/memes/" + id);
  }

  return (
    <form className="flex flex-col gap-y-3 w-120" onSubmit={handleSubmit}>
      <label className={labelStyles}>
        <div>
          Title{" "}
          <span className="text-red-500" title="Required field">
            *
          </span>
        </div>
        <Input
          placeholder="Another niche meme 🥹"
          value={newMeme.title}
          setValue={(title) => setNewMeme({ ...newMeme, title })}
        />
      </label>
      <label className={labelStyles + " w-fit"}>
        Tags
        <div className="flex gap-x-3">
          <Btn
            text="Select tags"
            onclick={() => setSelecting(true)}
            styles="w-fit"
          />
          {newMeme.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="rounded-full px-4 py-2 bg-zinc-900 font-bold cursor-pointer"
            >
              {tag.name}
            </span>
          ))}
          {newMeme.tags?.length && newMeme.tags.length > 3 ? (
            <span className="rounded-full px-4 py-2 bg-zinc-900 font-bold cursor-pointer">
              + {newMeme.tags.length - 3}
            </span>
          ) : (
            <></>
          )}
        </div>
      </label>
      <label className={labelStyles + " w-fit"}>
        <div>
          Upload{" "}
          <span className="text-red-500" title="Required field">
            *
          </span>
        </div>
        <Upload provided={newMeme.image} setNewMeme={setNewMeme} />
      </label>
      <label className={labelStyles}>
        Description
        <textarea
          className="text-base border-2 border-zinc-700 rounded px-4 py-2 text-zinc-300 outline-none resize-none h-30"
          placeholder="Describe what the meme is about (optional)"
          value={newMeme.description}
          onChange={(e) =>
            setNewMeme({ ...newMeme, description: e.target.value })
          }
        ></textarea>
      </label>
      <label className={labelStyles}>
        <div>Original source</div>
        <Input
          placeholder="tiktok.com/@memeboard/video/12345"
          value={newMeme.source || ""}
          setValue={(source) => setNewMeme({ ...newMeme, source })}
        />
      </label>
      {newMeme.title.trim().length > 0 && newMeme.image && (
        <Btn
          text={loading ? "Loading..." : data ? "Edit" : "Post"}
          type="submit"
          styles="w-fit"
          primary
        />
      )}
      <AnimatePresence>
        {selecting && (
          <TagModal
            selected={newMeme.tags || []}
            setNewMeme={setNewMeme}
            setSelecting={setSelecting}
            tags={memeTags}
          />
        )}
      </AnimatePresence>
    </form>
  );
}

export default MemeForm;
