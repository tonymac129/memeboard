"use client";

import { useEffect, useState } from "react";

function Error() {
  const [dark, setDark] = useState<boolean>(false);
  const [italic, setItalic] = useState<boolean>(false);

  useEffect(() => {
    const flash = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.05) {
        setDark(true);
        setTimeout(() => {
          setDark(false);
        }, 200);
      }
      if (rand < 0.09 && rand > 0.04) {
        setItalic(true);
        setTimeout(() => {
          setItalic(false);
        }, 1000);
      }
    }, 100);

    return () => {
      clearInterval(flash);
    };
  }, []);

  return (
    <h1
      className={`font-mono text-green-600 dark:text-green-500 duration-75 text-9xl font-extrabold ${dark && "text-transparent!"} ${italic && "italic!"}`}
    >
      404
    </h1>
  );
}

export default Error;
