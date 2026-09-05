"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

function Motion({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {children}
    </motion.div>
  );
}

export default Motion;
