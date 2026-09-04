"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaBars } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinkStyles =
  "text-black dark:text-zinc-300 hover:text-green-600 dark:hover:text-green-500 font-bold py-2 px-10";

function Sidebar() {
  const [open, setOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const clickListener = (e: Event) => {
      if (
        !sidebarRef.current?.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", clickListener);
    return () => {
      document.removeEventListener("click", clickListener);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div>
      <div
        className="block md:hidden text-black dark:text-zinc-300 p-3 border-2 border-zinc-700 rounded 
      cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900"
        ref={btnRef}
        onClick={() => setOpen(true)}
      >
        <FaBars size={20} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen w-screen absolute top-0 left-0 bg-zinc-100/75 dark:bg-zinc-950/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ left: "-100%" }}
              animate={{ left: 0 }}
              exit={{ left: "-100%" }}
              className="h-screen w-[80%] max-w-50 py-5 overflow-auto absolute left-0 top-0 flex flex-col gap-y-3 bg-zinc-100 dark:bg-zinc-950 border-r-2 border-zinc-700"
              ref={sidebarRef}
            >
              <Link href="/" className={navLinkStyles}>
                Home
              </Link>
              <Link href="/memes" className={navLinkStyles}>
                Memes
              </Link>
              <Link href="/tags" className={navLinkStyles}>
                Tags
              </Link>
              <Link href="/collections" className={navLinkStyles}>
                Collections
              </Link>
              <Link href="/chat" className={navLinkStyles}>
                Chat
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Sidebar;
