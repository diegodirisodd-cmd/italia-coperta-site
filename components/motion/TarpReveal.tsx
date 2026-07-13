"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_TARP } from "./variants";

type TarpRevealProps = {
  children: ReactNode;
  className?: string;
  /** "mount" = reveal on load (hero); "inView" = reveal once on scroll;
   *  "scrub" = tarp position is bound to scroll progress (storia). */
  trigger?: "mount" | "inView" | "scrub";
  /** Extra delay in seconds (mount/inView only). */
  delay?: number;
};

/**
 * "Telone che si scosta": a tarp-textured panel covers the content and slides
 * off to the left to reveal it. Pure translateX on a GPU layer — no layout
 * shift. The wrapper clips the panel while it is off-screen.
 */
export function TarpReveal({ children, className, trigger = "inView", delay = 0 }: TarpRevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // scrub: the tarp follows how far the block has scrolled into the viewport,
  // fully covered at the bottom edge, fully revealed past the upper third
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.92", "start 0.35"] });
  const scrubX = useTransform(scrollYProgress, [0, 1], ["0%", "-101%"]);

  const transition = { duration: 0.95, ease: EASE_TARP, delay };
  const motionProps =
    trigger === "mount"
      ? { transition, initial: { x: "0%" }, animate: { x: "-101%" } }
      : trigger === "inView"
        ? {
            transition,
            initial: { x: "0%" },
            whileInView: { x: "-101%" },
            viewport: { once: true, margin: "0px 0px -15% 0px" },
          }
        : {};

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      {children}
      {!reduced && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 will-change-transform"
          style={{
            background: "linear-gradient(115deg, #1A1980 0%, #12103f 55%, #000000 100%)",
            ...(trigger === "scrub" ? { x: scrubX } : null),
          }}
          {...motionProps}
        >
          {/* woven rib texture */}
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(243,233,204,0.5) 0 1px, transparent 1px 15px)",
            }}
          />
          {/* trailing red seam edge, like the hem of a tarp */}
          <div className="absolute inset-y-0 right-0 w-1.5 bg-primary" />
        </m.div>
      )}
    </div>
  );
}
