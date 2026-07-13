"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Loads only the `domAnimation` feature bundle (animations, variants,
 * whileInView / whileHover / whileTap gestures) once for the whole tree — no
 * drag or layout-projection features are used anywhere, so domMax is not
 * needed. `strict` forbids the full `motion.*` components, forcing every
 * animated element to use the lightweight `m.*` components instead, which is
 * what keeps framer-motion out of the initial bundle.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
