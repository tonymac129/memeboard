"use client";

import Link from "next/link";

interface BtnProps {
  text: string;
  type?: "button" | "submit" | "reset";
  primary?: boolean;
  onclick?: () => void;
  href?: string;
  styles?: string;
  children?: React.ReactNode;
}

function Btn({
  text,
  type,
  primary,
  onclick,
  href,
  styles,
  children,
}: BtnProps) {
  const btnStyles = `flex items-center justify-center gap-x-3 px-3.5 py-1.5 cursor-pointer font-bold border-2 rounded ${primary ? "bg-green-600 text-zinc-950 border-green-600" : "bg-transparent text-zinc-300 hover:bg-zinc-900 border-zinc-800"}`;

  return href ? (
    <Link href={href as string} className={`${btnStyles} ${styles}`}>
      {text}
    </Link>
  ) : (
    <button
      type={type || "button"}
      onClick={onclick}
      className={`${btnStyles} ${styles}`}
    >
      {children}
      {text}
    </button>
  );
}

export default Btn;
