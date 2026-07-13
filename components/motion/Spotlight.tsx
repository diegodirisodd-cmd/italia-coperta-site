"use client";

import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect } from "react";
import { usePointerFine } from "./usePointerFine";

type SpotlightProps = {
  /** Diameter of the light halo in px. */
  size?: number;
  /** Colour of the halo — kept in the brand indigo range by default. */
  color?: string;
};

/**
 * A soft light halo that follows the cursor, blended with `screen` so it only
 * lifts the dark navy→indigo gradient of the site and leaves bright areas
 * (hero photo, red CTAs) untouched. Renders NOTHING on touch devices or when
 * prefers-reduced-motion is set — the component is fully unmounted, not just
 * hidden, so no listeners or springs run there. Moves via transform only.
 */
export function Spotlight({ size = 620, color = "rgba(120,112,255,0.16)" }: SpotlightProps) {
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const active = fine && !reduced;

  const half = size / 2;
  const x = useMotionValue(-size);
  const y = useMotionValue(-size);
  const sx = useSpring(x, { stiffness: 140, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 140, damping: 22, mass: 0.4 });

  useEffect(() => {
    if (!active) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX - half);
      y.set(e.clientY - half);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [active, half, x, y]);

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30" style={{ mixBlendMode: "screen" }}>
      <m.div
        className="absolute left-0 top-0 rounded-full will-change-transform"
        style={{
          width: size,
          height: size,
          x: sx,
          y: sy,
          background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}
