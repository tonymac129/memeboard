import Btn from "../ui/Btn";
import Link from "next/link";

const navLinkStyles = "text-zinc-300 hover:text-green-500 py-2 px-4";

function Nav() {
  return (
    <nav className="border-b-2 border-b-zinc-800 flex items-center justify-between px-50 py-3">
      <div className="flex items-center gap-x-3">
        <Link
          href="/"
          className={navLinkStyles + " text-xl text-green-500! font-bold pl-0"}
        >
          MemeBoard
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
      <div>
        <Btn text="Log in" href="/login" primary />
      </div>
    </nav>
  );
}

export default Nav;
