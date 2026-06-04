import Link from "next/link";

function Footer() {
  return (
    <div className="flex flex-col gap-y-5 py-15 border-t-2 border-zinc-700 text-sm text-zinc-300 items-center">
      <div className="flex gap-x-15">
        <span>&copy; {new Date().getFullYear()} MemeBoard</span>
        <span>
          Made with ♥️ by{" "}
          <a
            href="https://github.com/tonymac129"
            className="hover:text-green-500"
            target="_blank"
          >
            TonyMac129
          </a>
        </span>
      </div>
      <div className="flex gap-x-5">
        <Link href="/top" className="hover:text-green-500">
          Top
        </Link>
        <Link href="/new" className="hover:text-green-500">
          New
        </Link>
        <Link href="/friends" className="hover:text-green-500">
          Friends
        </Link>
        <a
          href="https://github.com/tonymac129/memeboard"
          className="hover:text-green-500"
          target="_blank"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}

export default Footer;
