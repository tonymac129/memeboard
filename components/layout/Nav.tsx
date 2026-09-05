import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MdOutlineAdd } from "react-icons/md";
import Btn from "../ui/Btn";
import User from "./User";
import Sidebar from "./Sidebar";
import Theme from "./Theme";
import Link from "next/link";

const navLinkStyles =
  "hidden lg:block text-black dark:text-zinc-300 hover:text-green-600 dark:hover:text-green-500 py-2 px-4";

async function Nav() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="sticky top-0 bg-zinc-100 dark:bg-zinc-950 z-50 border-b-2 border-b-zinc-700">
      <nav className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 flex items-center justify-between py-1 sm:py-3">
        <div className="flex items-center gap-x-3">
          <Sidebar />
          <Link
            href="/"
            className={
              navLinkStyles +
              " block! text-xl text-green-600! dark:text-green-500! font-bold pl-0"
            }
          >
            MemeBoard
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
        </div>
        <div className="flex items-center gap-x-5">
          <Theme />
          {session ? (
            <>
              <Btn text="" href="/post" styles="gap-x-1.5!" primary>
                <MdOutlineAdd size={22} />
                <span className="hidden sm:block">Post</span>
              </Btn>
              <User
                username={session.user.username as string}
                image={session.user.image || "/icons/default-avatar.svg"}
              />
            </>
          ) : (
            <Btn text="Log in" href="/login" primary />
          )}
        </div>
      </nav>
    </div>
  );
}

export default Nav;
