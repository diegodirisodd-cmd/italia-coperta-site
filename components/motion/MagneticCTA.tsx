"use client";

import Link from "next/link";
import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { usePointerFine } from "./usePointerFine";

const MotionLink = m.create(Link);

type MagneticCTAProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** How strongly the button follows the cursor (0–1). */
  strength?: number;
};

/**
 * Primary CTA with a magnetic pull toward the cursor plus a gradient that
 * shifts in on hover. Magnetic pull is translate-only; the gradient shift is a
 * pure opacity fade of an overlay layer — both GPU-accelerated, no layout shift.
 */
export function MagneticCTA({ href, children, className, strength = 0.3 }: MagneticCTAProps) {
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  if (reduced) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  // Touch device: no hover/magnetic — just a tap-scale + gradient flash.
  if (!fine) {
    return (
      <MotionLink
        href={href}
        className={`relative overflow-hidden ${className ?? ""}`}
        initial="rest"
        whileTap="tap"
        variants={{ rest: { scale: 1 }, tap: { scale: 0.96 } }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <m.span
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, #E31919 0%, #FF4D4D 100%)" }}
          variants={{ rest: { opacity: 0 }, tap: { opacity: 1 } }}
          transition={{ duration: 0.2 }}
        />
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </MotionLink>
    );
  }

  return (
    <MotionLink
      ref={ref}
      href={href}
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      variants={{ rest: { scale: 1 }, hover: { scale: 1.03 } }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <m.span
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, #E31919 0%, #FF4D4D 100%)" }}
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.35 }}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </MotionLink>
  );
}
