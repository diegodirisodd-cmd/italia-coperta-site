// Shared motion tokens for the "Italia Coperta" site.
// Every animated primitive imports easing/timing from here so the whole
// site shares one motion language. Only transform/opacity are animated.

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_TARP = [0.76, 0, 0.24, 1] as const;

export const revealItem = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
} as const;

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
} as const;
