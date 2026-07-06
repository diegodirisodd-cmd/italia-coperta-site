"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_TARP } from "./variants";

type TarpRevealProps = {
  children: ReactNode;
  className?: string;
  /** "mount" = reveal on load (hero); "inView" = reveal on scroll. */
  trigger?: "mount" | "inView";
  /** Extra delay in seconds. */
  delay?: number;
};

/**
 * "Telone che si scosta": a tarp-textured panel covers the content and slides
 * off to the left to reveal it. Pure translateX on a GPU layer — no layout
 * shift. The wrapper clips the panel while it is off-screen.
 */
export function TarpReveal({ children, className, trigger = "inView", delay = 0 }: TarpRevealProps) {
  const reduced = useReducedMotion();

  const transition = { duration: 0.95, ease: EASE_TARP, delay };
  const motionProps =
    trigger === "mount"
      ? { initial: { x: "0%" }, animate: { x: "-101%" } }
      : {
          initial: { x: "0%" },
          whileInView: { x: "-101%" },
          viewport: { once: true, margin: "0px 0px -15% 0px" },
        };

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {children}
      {!reduced && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 will-change-transform"
          style={{
            background: "linear-gradient(115deg, #1A1980 0%, #12103f 55%, #000000 100%)",
          }}
          transition={transition}
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
