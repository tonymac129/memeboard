import Link from "next/link";
import Image from "next/image";

interface UserProps {
  username: string;
  image: string;
}

function User({ username, image }: UserProps) {
  return (
    <Link
      href={`/users/${username}`}
      className="flex gap-x-3 items-center border-2 border-zinc-700 rounded text-zinc-300 px-3 py-0.5 font-bold hover:bg-zinc-900"
    >
      <Image
        src={image}
        alt="Profile avatar"
        title="Profile avatar"
        width={50}
        height={50}
        className="w-8 rounded-full"
      />
      <span className="hidden sm:block">Profile</span>
    </Link>
  );
}

export default User;
