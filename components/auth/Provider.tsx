"use client";

import { FaGithub, FaGoogle } from "react-icons/fa";
import Btn from "../ui/Btn";

interface ProviderProps {
  text: string;
  provider: string;
  setProvider: React.Dispatch<React.SetStateAction<string>>;
}

function Provider({ text, provider, setProvider }: ProviderProps) {
  return (
    <Btn
      text={provider === text ? "Loading..." : "Log in with " + text}
      onclick={() => setProvider(text)}
      styles="py-2 justify-start"
    >
      {text === "Google" && <FaGoogle size={20} />}
      {text === "GitHub" && <FaGithub size={20} />}
    </Btn>
  );
}

export default Provider;
