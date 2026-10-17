"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SECTION_TARGET_EVENT } from "@/components/layout/smoothScroll";

type RevealPhase = "idle" | "hidden" | "visible";

function containsHashTarget(node: HTMLElement) {
  const id = window.location.hash.replace(/^#/, "");
  if (!id) return false;
  const target = document.getElementById(id);
  return Boolean(target && node.contains(target));
}

function isAlreadyVisible(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  return rect.top < window.innerHeight - 48 && rect.bottom > 48;
}

function useRevealPhase() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<RevealPhase>("idle");

  useEffect(() => {
    if (reduceMotion) {
      setPhase("visible");
      return;
    }

    const node = ref.current;
    if (!node) return;

    const revealIfTargeted = () => {
      if (isAlreadyVisible(node) || containsHashTarget(node)) {
        setPhase("visible");
        return true;
      }
      return false;
    };

    if (revealIfTargeted()) return;

    setPhase("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);

    const onSectionTarget = () => {
      if (!revealIfTargeted()) return;
      observer.disconnect();
    };
    window.addEventListener(SECTION_TARGET_EVENT, onSectionTarget);
    window.addEventListener("hashchange", onSectionTarget);

    return () => {
      observer.disconnect();
      window.removeEventListener(SECTION_TARGET_EVENT, onSectionTarget);
      window.removeEventListener("hashchange", onSectionTarget);
    };
  }, [reduceMotion]);

  return { ref, phase };
}

type ScrollRevealProps = {
  children: ReactNode;
  delay?: number;
};

export function ScrollReveal({ children, delay = 0 }: ScrollRevealProps) {
  const { ref, phase } = useRevealPhase();

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={phase === "hidden" ? { opacity: 0, y: 18 } : { opacity: 1, y: 0 }}
      transition={{
        duration: phase === "idle" ? 0 : 0.5,
        delay: phase === "visible" ? delay : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
