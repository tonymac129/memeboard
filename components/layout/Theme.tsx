"use client";

import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

function Theme() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <div
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="text-zinc-700 dark:text-zinc-300 cursor-pointer hover:scale-130 hover:rotate-60 transition-transform! active:scale-80"
      title={`Toggle ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <MdDarkMode size={23} /> : <MdLightMode size={23} />}
    </div>
  ) : null;
}

export default Theme;
