"use client";

import { followUser } from "@/app/users/[username]/actions";
import { useState } from "react";
import Btn from "../ui/Btn";

interface FollowProps {
  id: string;
  isFollowing: boolean;
}

function Follow({ id, isFollowing }: FollowProps) {
  const [loading, setLoading] = useState<boolean>(false);

  async function handleFollow() {
    setLoading(true);
    await followUser(id);
    setLoading(false);
  }

  return (
    <Btn
      text={loading ? "Loading..." : isFollowing ? "Following" : "Follow"}
      onclick={handleFollow}
      styles="w-fit text-base"
      primary
    />
  );
}

export default Follow;
