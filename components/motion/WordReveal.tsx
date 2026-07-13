"use client";

import { m, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "./variants";

type WordRevealProps = {
  text: string;
  className?: string;
  /** Delay in seconds before the first word appears. */
  delay?: number;
};

const container = (delay: number) => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: delay } },
});

const word = {
  hidden: { opacity: 0, y: "0.5em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

/**
 * Reveals text word by word. The visible words are aria-hidden and the whole
 * phrase is exposed once via aria-label so screen readers read it normally.
 */
export function WordReveal({ text, className, delay = 0 }: WordRevealProps) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{text}</span>;

  const words = text.split(" ");
  return (
    <m.span
      className={className}
      aria-label={text}
      variants={container(delay)}
      initial="hidden"
      animate="show"
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <m.span aria-hidden variants={word} className="inline-block will-change-transform">
            {w}
          </m.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </m.span>
  );
}
