"use client";

import type { MessageType, ReplyType } from "@/types/Chat";
import type { User } from "@/app/generated/prisma/client";
import { useRealtime } from "@/lib/realtime-client";
import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { FaEdit, FaReply, FaTrash } from "react-icons/fa";
import { HiOutlineReply } from "react-icons/hi";
import {
  deleteMessage,
  editMessage,
  reactMessage,
  undoMessage,
} from "./actions";
import EmbeddedMeme from "@/components/chat/EmbeddedMeme";
import React from "@/components/chat/React";
import Reaction from "@/components/chat/Reaction";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import Input from "@/components/ui/Input";
import Btn from "@/components/ui/Btn";

const optionStyles =
  "flex rounded text-sm items-center bg-zinc-900 w-fit gap-x-2 cursor-pointer px-1.5 py-0.5";

interface EditingType {
  id: string;
  content: string;
}

interface MessagesProps {
  messages: MessageType[];
  name: string;
  userData?: User;
  id: string;
  setReplying: React.Dispatch<React.SetStateAction<ReplyType | null>>;
}

function Messages({
  messages,
  name,
  userData,
  id,
  setReplying,
}: MessagesProps) {
  const [allMessages, setAllMessages] = useState<MessageType[]>(messages);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditingType | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const highlightedRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [allMessages]);

  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlighted]);

  useRealtime({
    events: ["chat.message"],
    onData: (data) => {
      const newMessage = JSON.parse(data.data);
      if (newMessage.chatId === id || newMessage.memebot === session?.user.id) {
        setAllMessages((prev) => [...prev, newMessage]);
      }
    },
  });

  useRealtime({
    events: ["chat.reaction", "chat.edit", "chat.delete", "chat.undo"],
    onData: (data) => {
      const newMessage = JSON.parse(data.data);
      if (newMessage.chatId == id) {
        const messages = [...allMessages];
        messages[
          messages.findIndex((message) => message.id === newMessage.id)
        ] = newMessage;
        setAllMessages(messages);
      }
    },
  });

  function handleReply(replying: string) {
    setHighlighted(replying);
    setTimeout(() => {
      setHighlighted(null);
    }, 1500);
  }

  async function handleEdit() {
    setLoading(true);
    await editMessage(id, editing!.id, editing!.content);
    setEditing(null);
    setLoading(false);
  }

  async function handleReact(messageId: string, emoji: string) {
    await reactMessage(id, messageId, emoji);
  }

  async function handleDelete() {
    if (deleting) {
      setLoading(true);
      await deleteMessage(id, deleting);
      setLoading(false);
      setDeleting(null);
    }
  }

  async function handleUndo(messageId: string) {
    await undoMessage(id, messageId);
  }

  return (
    <div className="flex flex-col gap-y-3 w-full px-5">
      {allMessages.map((message, i) => {
        const fromMe = message.from === session?.user.id;
        const firstMessage =
          i == 0
            ? true
            : message.replying
              ? true
              : new Date(message.created).getTime() -
                    new Date(allMessages[i - 1].created).getTime() >
                  1000 * 60 * 5
                ? true
                : allMessages[i - 1].deleted
                  ? true
                  : allMessages[i - 1].from !== message.from;
        const created = new Date(message.created);

        return message.deleted ? (
          <div key={i} className="text-zinc-300 text-sm my-2 text-center">
            {fromMe ? (
              <>
                You deleted a message{" "}
                <span
                  onClick={() => handleUndo(message.id)}
                  className="ml-5 hover:text-green-500 cursor-pointer"
                >
                  Undo
                </span>
              </>
            ) : (
              `Message deleted by ${userData?.name || "MemeBot"}`
            )}
          </div>
        ) : (
          <div
            key={message.id}
            className={`flex group flex-col gap-y-1 ${highlighted === message.id && "bg-zinc-900"}`}
            ref={highlighted === message.id ? highlightedRef : null}
          >
            {message.replying && (
              <div
                className={`relative flex items-center mx-15 mt-5 text-zinc-300 cursor-pointer text-sm ${fromMe && "self-end"}`}
                onClick={() => handleReply(message.replying!.id)}
              >
                <HiOutlineReply
                  size={20}
                  className={`absolute ${!fromMe ? "scale-x-[-1] -left-7" : "-right-7"}`}
                />
                Replying to: {message.replying.message}
              </div>
            )}
            <div
              className={`flex gap-x-3 relative mx-0 sm:mx-15 ${fromMe && "self-end"}`}
            >
              {!fromMe &&
                firstMessage &&
                (userData ? (
                  <Link
                    href={`/users/${userData.username}`}
                    className="absolute -left-15 top-0 hidden sm:block"
                  >
                    <Image
                      src={userData.image || "/icons/default-avatar.svg"}
                      alt="Avatar"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </Link>
                ) : (
                  <div className="absolute -left-15 top-0 hidden sm:block">
                    <Image
                      src="/icons/memebot.png"
                      alt="Avatar"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </div>
                ))}
              <div className="text-zinc-300 flex flex-col gap-y-1 flex-1">
                {firstMessage && (
                  <div
                    className={`flex gap-x-2 items-center text-sm ${fromMe && "self-end"}`}
                  >
                    <span className="font-bold text-base">
                      {fromMe ? "You" : name}
                    </span>
                    •
                    <span title={created.toISOString()}>
                      {new Date().getTime() - created.getTime() < 86400000
                        ? created.toTimeString().slice(0, 5)
                        : created.toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div
                  className={`flex gap-x-3 items-center ${fromMe && "flex-row-reverse"}`}
                >
                  <div
                    className={`bg-zinc-900 rounded px-4 flex flex-col gap-y-3 py-2 overflow-auto max-w-[45%] md:max-w-[60%] ${fromMe && "bg-green-800! self-end"}`}
                  >
                    {message.memeId && <EmbeddedMeme memeId={message.memeId} />}
                    <div className="flex gap-x-2 items-end">
                      {message.message}
                      {message.edited && (
                        <span className="text-xs">(edited)</span>
                      )}
                    </div>
                  </div>
                  <div
                    className={`opacity-0 flex gap-x-3 group-hover:opacity-100 transition-all! duration-300 ${fromMe && "flex-row-reverse"}`}
                  >
                    <React chatId={id} messageId={message.id} />
                    {fromMe ? (
                      <>
                        <div
                          onClick={() =>
                            setEditing({
                              id: message.id,
                              content: message.message,
                            })
                          }
                          className={optionStyles}
                        >
                          <FaEdit size={15} />
                          <span className="hidden md:block">Edit</span>
                        </div>
                        <div
                          onClick={() => setDeleting(message.id)}
                          className={optionStyles + " text-red-500"}
                        >
                          <FaTrash size={15} />
                          <span className="hidden md:block">Delete</span>
                        </div>
                      </>
                    ) : (
                      <div
                        onClick={() =>
                          setReplying({
                            id: message.id,
                            message:
                              message.message.slice(0, 80) +
                              (message.message.length > 80 ? "..." : ""),
                          })
                        }
                        className={optionStyles}
                      >
                        <FaReply size={15} />
                        <span className="hidden md:block">Reply</span>
                      </div>
                    )}
                  </div>
                </div>
                {message.reactions && message.reactions.length > 0 && (
                  <div
                    className={`flex gap-x-3 mt-2 ${fromMe && "flex-row-reverse"}`}
                  >
                    {message.reactions.map((reaction, i) => (
                      <Reaction
                        key={i}
                        reaction={reaction}
                        handleReact={handleReact}
                        messageId={message.id}
                        reacted={reaction.count.includes(
                          session?.user.id || "",
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
              {fromMe && firstMessage && (
                <Link
                  href={`/users/${(session.user as typeof session.user & { username: string }).username}`}
                  className="absolute -right-15 top-0 hidden sm:block"
                >
                  <Image
                    src={session.user.image || "/icons/default-avatar.svg"}
                    alt="Avatar"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </Link>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messageRef} />
      <AnimatePresence>
        {editing !== null && (
          <Modal closeModal={() => setEditing(null)}>
            <div className="flex flex-col gap-y-3 p-6">
              <h2 className="text-white text-xl font-bold">Edit message</h2>
              <Input
                placeholder="Edit message"
                value={editing.content}
                setValue={(content) => setEditing({ ...editing, content })}
              />
              <div className="flex gap-x-3">
                <Btn
                  text={loading ? "Loading..." : "Save"}
                  onclick={handleEdit}
                  primary
                />
                <Btn text="Cancel" onclick={() => setEditing(null)} />
              </div>
            </div>
          </Modal>
        )}
        {deleting && (
          <Modal closeModal={() => setDeleting(null)}>
            <div className="flex flex-col gap-y-3 p-6">
              <h2 className="text-white text-xl font-bold">Delete message</h2>
              <p className="text-zinc-300">
                Are you sure you want to delete this message from the chat?
              </p>
              <div className="flex gap-x-3">
                <Btn
                  text={loading ? "Loading..." : "Delete"}
                  onclick={handleDelete}
                  styles="bg-red-500 text-white! border-red-500"
                  primary
                />
                <Btn text="Cancel" onclick={() => setDeleting(null)} />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Messages;
