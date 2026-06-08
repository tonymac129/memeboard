import { User } from "@/app/generated/prisma/client";
import Image from "next/image";
import Link from "next/link";

function UserCard({ user }: { user: User }) {
  return (
    <Link
      href={`/users/${user.username}`}
      className="font-bold hover:text-green-500 hover:bg-zinc-900 px-4 py-2 flex items-center gap-x-3 rounded text-zinc-300"
      key={user.id}
    >
      <Image
        src={user.image || "/icons/default-avatar.svg"}
        alt="Profile avatar"
        width={40}
        height={40}
        className="rounded-full"
      />
      {user.name}
    </Link>
  );
}

export default UserCard;
