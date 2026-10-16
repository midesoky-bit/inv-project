"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSyncExternalStore, type ReactNode } from "react";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type ScrollRevealProps = {
  children: ReactNode;
  delay?: number;
};

export function ScrollReveal({ children, delay = 0 }: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const hydrated = useHydrated();
  const animate = hydrated && !reduceMotion;

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 28 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
