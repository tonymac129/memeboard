"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Btn from "../ui/Btn";

function SignOut() {
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSignOut() {
    setLoading(true);
    await authClient.signOut();
    window.location.reload();
  }

  return (
    <Btn
      text={loading ? "Loading..." : "Sign out"}
      onclick={handleSignOut}
      primary
    />
  );
}

export default SignOut;
