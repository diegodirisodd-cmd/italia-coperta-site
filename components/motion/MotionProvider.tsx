"use client";

import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);
import type { ReactNode } from "react";

/**
 * Loads only the `domAnimation` feature bundle (animations, variants,
 * whileInView / whileHover / whileTap gestures) once for the whole tree — no
 * drag or layout-projection features are used anywhere, so domMax is not
 * needed. `strict` forbids the full `motion.*` components, forcing every
 * animated element to use the lightweight `m.*` components instead, which is
 * what keeps framer-motion out of the initial bundle. The features themselves
 * are loaded asynchronously so they don't block first paint / LCP.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
