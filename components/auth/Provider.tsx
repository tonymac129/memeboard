"use client";

import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Btn from "../ui/Btn";

interface ProviderProps {
  text: string;
  signIn: (provider: string) => Promise<void>;
}

function Provider({ text, signIn }: ProviderProps) {
  const [loading, setLoading] = useState<boolean>(false);

  function handleSignIn() {
    setLoading(true);
    signIn(text);
  }

  return (
    <Btn
      text={loading ? "Loading..." : "Log in with " + text}
      onclick={handleSignIn}
      styles="py-2 justify-start"
    >
      {text === "Google" && <FaGoogle size={20} />}
      {text === "GitHub" && <FaGithub size={20} />}
    </Btn>
  );
}

export default Provider;
