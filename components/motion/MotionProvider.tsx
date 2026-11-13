"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Loads only the `domAnimation` feature bundle (animations, variants,
 * whileInView / whileHover / whileTap gestures) once for the whole tree — no
 * drag or layout-projection features are used anywhere, so domMax is not
 * needed. `strict` forbids the full `motion.*` components, forcing every
 * animated element to use the lightweight `m.*` components instead.
 *
 * The features are loaded synchronously on purpose. Loading them async (to
 * shave main-thread time) broke the configurator: when a saved draft is
 * restored on mount, the step changes before the features arrive and
 * <AnimatePresence mode="wait"> never finishes the exit animation, so the
 * wizard stayed stuck on step 1 under a "Step 6" header.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
