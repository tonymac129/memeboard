import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MdOutlineAdd } from "react-icons/md";
import Btn from "../ui/Btn";
import User from "./User";
import Link from "next/link";

const navLinkStyles = "text-zinc-300 hover:text-green-500 py-2 px-4";

async function Nav() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="sticky top-0 bg-zinc-950 z-5">
      <nav className="border-b-2 border-b-zinc-800 flex items-center justify-between px-50 py-3">
        <div className="flex items-center gap-x-3">
          <Link
            href="/"
            className={
              navLinkStyles + " text-xl text-green-500! font-bold pl-0"
            }
          >
            MemeBoard
          </Link>
          <Link href="/memes" className={navLinkStyles}>
            Memes
          </Link>
          <Link href="/top" className={navLinkStyles}>
            Top
          </Link>
          <Link href="/new" className={navLinkStyles}>
            New
          </Link>
          <Link href="/friends" className={navLinkStyles}>
            Friends
          </Link>
        </div>
        <div className="flex items-center gap-x-5">
          {session ? (
            <>
              <Btn text="Post" href="/post" styles="gap-x-1.5!" primary>
                <MdOutlineAdd size={22} />
              </Btn>
              <User img={session.user.image || "/icons/default-avatar.svg"} />
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
