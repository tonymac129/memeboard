import { User } from "@/app/generated/prisma/client";
import Follow from "./Follow";
import Image from "next/image";
import Link from "next/link";

const userStyles =
  "font-bold hover:text-green-500 hover:bg-zinc-900 px-4 py-2 flex items-center gap-x-3 rounded text-zinc-300";

interface UserCardProps {
  user: User;
  follow?: boolean;
  following?: boolean;
}

function UserCard({ user, follow, following }: UserCardProps) {
  return follow ? (
    <div className={userStyles + " justify-between"}>
      <Link
        href={`/users/${user.username}`}
        className="flex gap-x-3 items-center"
      >
        <Image
          src={user.image || "/icons/default-avatar.svg"}
          alt="Profile avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <span>{user.name}</span>
          <span className="text-sm font-normal">@{user.username}</span>
        </div>
      </Link>
      <Follow id={user.id} isFollowing={following || false} />
    </div>
  ) : (
    <Link href={`/users/${user.username}`} className={userStyles}>
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
