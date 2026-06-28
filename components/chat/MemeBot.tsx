"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function MemeBot() {
  const pathname = usePathname();

  return (
    <Link
      href="/chat/memebot"
      className={`flex gap-x-3 items-center px-4 py-2 rounded hover:bg-zinc-900 text-zinc-300 ${pathname.includes("memebot") && "font-bold text-green-500! bg-zinc-900"}`}
    >
      <Image
        src="/icons/memebot.png"
        alt="Avatar"
        width={45}
        height={45}
        className="rounded-full"
      />
      MemeBot
    </Link>
  );
}

export default MemeBot;
