"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT } from "./variants";

type CountUpProps = {
  /** Raw label such as "75", "2" or "3ª" — the numeric part is counted up,
   *  any prefix/suffix (e.g. the ordinal "ª") is preserved verbatim. */
  value: string;
  className?: string;
  duration?: number;
};

const NUM_RE = /^(\D*)(\d+(?:[.,]\d+)?)(.*)$/;

export function CountUp({ value, className, duration = 1.4 }: CountUpProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const match = value.match(NUM_RE);

  const [display, setDisplay] = useState(() =>
    match && !reduced ? `${match[1]}0${match[3]}` : value,
  );

  useEffect(() => {
    if (!match || reduced || !inView) return;
    const prefix = match[1];
    const target = parseFloat(match[2].replace(",", "."));
    const suffix = match[3];
    const decimals = (match[2].split(/[.,]/)[1] ?? "").length;
    const controls = animate(0, target, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(`${prefix}${v.toFixed(decimals)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduced, duration, value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Non-numeric labels render as-is (no ref needed).
  if (!match) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className}>
      {reduced ? value : display}
    </span>
  );
}
