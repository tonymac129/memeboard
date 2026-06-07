"use client";

import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

interface ModalProps {
  closeModal: () => void;
  children: React.ReactNode;
}

function Modal({ closeModal, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickListener = (e: Event) => {
      if (
        document.contains(e.target as Node) &&
        !modalRef.current?.contains(e.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener("click", clickListener);

    return () => {
      document.removeEventListener("click", clickListener);
    };
  }, [closeModal]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-screen h-screen fixed top-0 left-0 z-10 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, y: 100 }}
        className="rounded w-100 bg-zinc-950 border-2 border-zinc-700"
        ref={modalRef}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default Modal;
