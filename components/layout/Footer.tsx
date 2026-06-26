import Link from "next/link";

function Footer() {
  return (
    <div className="flex flex-col gap-y-5 py-15 border-t-2 border-zinc-700 text-sm text-zinc-300 items-center">
      <div className="flex flex-col sm:flex-row gap-y-5 gap-x-15">
        <span className="text-center">
          &copy; {new Date().getFullYear()} MemeBoard
        </span>
        <span>
          Made with ♥️ by{" "}
          <a
            href="https://github.com/tonymac129"
            className="hover:text-green-500 text-center"
            target="_blank"
          >
            TonyMac129
          </a>
        </span>
      </div>
      <div className="flex gap-x-5">
        <Link href="/memes" className="hover:text-green-500">
          Memes
        </Link>
        <Link href="/tags" className="hover:text-green-500">
          Tags
        </Link>
        <Link href="/collections" className="hover:text-green-500">
          Collections
        </Link>
        <Link href="/chat" className="hover:text-green-500">
          Chat
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
