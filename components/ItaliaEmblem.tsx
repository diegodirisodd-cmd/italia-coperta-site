"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Shared Italy silhouette path data — the "Italia Coperta" signature emblem
// (Italy as a PVC tarp) and the stylized map both draw from these same
// paths so the shape never drifts between uses.
// Coordinates derived from real Italy country boundary data (mainland +
// Sicily + Sardinia), projected and scaled to fit this viewBox.
export const ITALY_PATH_MAINLAND =
  "M 125.3 27.9 L 153.2 34.7 L 151.1 47.7 L 155.8 58.8 L 140.3 55.0 L 124.4 64.3 L 125.5 77.4 L 123.1 84.9 L 129.5 98.2 L 147.8 111.5 L 157.6 133.2 L 179.3 154.4 L 194.6 154.2 L 199.3 160.0 L 193.9 165.2 L 211.3 174.7 L 225.7 182.7 L 242.4 196.4 L 244.4 201.3 L 240.8 210.7 L 229.9 198.4 L 213.0 194.1 L 204.8 211.1 L 218.9 220.8 L 216.6 234.5 L 208.4 236.1 L 198.0 258.6 L 189.9 260.7 L 189.9 252.6 L 193.9 238.5 L 198.2 232.9 L 190.5 217.7 L 184.6 204.4 L 176.5 201.2 L 170.7 189.8 L 158.2 185.1 L 149.8 174.5 L 135.3 172.8 L 120.1 160.9 L 102.2 143.8 L 89.0 128.7 L 82.9 102.7 L 73.2 99.7 L 57.3 91.0 L 48.3 94.6 L 37.1 106.8 L 29.0 108.7 L 31.2 97.3 L 20.6 93.9 L 15.6 73.6 L 22.4 65.6 L 16.6 55.8 L 17.4 48.3 L 25.8 54.0 L 35.2 52.7 L 46.2 43.8 L 49.5 48.0 L 58.8 47.1 L 63.1 36.5 L 77.5 39.8 L 86.1 35.4 L 87.6 24.6 L 99.4 28.4 L 101.7 23.4 L 121.0 18.8 L 125.3 27.9 Z";
export const ITALY_PATH_SICILY =
  "M 186.7 252.2 L 179.6 272.9 L 182.6 281.0 L 178.5 294.5 L 163.6 284.6 L 153.6 281.8 L 126.4 268.4 L 129.1 254.9 L 152.0 257.3 L 171.9 254.5 L 186.7 252.2 Z";
export const ITALY_PATH_SARDINIA =
  "M 63.6 173.9 L 75.3 192.6 L 72.5 227.3 L 63.7 225.7 L 55.7 234.4 L 48.3 227.5 L 47.6 195.8 L 43.1 180.8 L 53.8 182.1 L 63.6 173.9 Z";

type ItaliaEmblemProps = {
  /** "synthetic" = flat silhouette + strap, for header/footer/pins.
   *  "rich" = full tarp treatment (ribs, gradient, buckle, eyelets, lifted corner), for the hero. */
  variant?: "synthetic" | "rich";
  width?: number;
  height?: number;
  className?: string;
};

export function ItaliaEmblem({ variant = "synthetic", width, height, className }: ItaliaEmblemProps) {
  if (variant === "rich") {
    return <RichEmblem width={width ?? 330} height={height ?? 396} className={className} />;
  }
  return <SyntheticEmblem width={width ?? 26} height={height ?? 31} className={className} />;
}

function SyntheticEmblem({ width, height, className }: { width: number; height: number; className?: string }) {
  return (
    <svg viewBox="0 0 260 313.3" width={width} height={height} aria-hidden="true" className={className} style={{ display: "block", flex: "none" }}>
      <path d={ITALY_PATH_MAINLAND} fill="#000000" stroke="#E31919" strokeWidth={6} />
      <path d={ITALY_PATH_SICILY} fill="#000000" stroke="#E31919" strokeWidth={6} />
      <path d={ITALY_PATH_SARDINIA} fill="#000000" stroke="#E31919" strokeWidth={6} />
      <rect x="-30" y="128" width="320" height="26" rx="4" fill="#E31919" transform="rotate(-18 131 141)" />
    </svg>
  );
}

// On scroll-into-view the coastline outlines draw themselves via pathLength
// (framer-motion drives stroke-dasharray/dashoffset under the hood).
const drawTransition = (delay: number) => ({
  pathLength: { duration: 1.6, ease: "easeInOut" as const, delay },
  opacity: { duration: 0.3, delay },
});

function RichEmblem({ width, height, className }: { width: number; height: number; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `icTarp-${uid}`;
  const ribsId = `icRibs-${uid}`;
  const clipId = `icClip-${uid}`;
  const reduced = useReducedMotion();

  const drawProps = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, margin: "0px 0px -15% 0px" },
          transition: drawTransition(delay),
        };

  return (
    <svg
      viewBox="0 0 260 313.3"
      width={width}
      height={height}
      className={className}
      style={{ filter: "drop-shadow(0 26px 50px rgba(0,0,0,.5))", maxWidth: "100%" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#173a63" />
          <stop offset="0.5" stopColor="#000000" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <pattern id={ribsId} width="17" height="14" patternUnits="userSpaceOnUse">
          <rect width="17" height="14" fill={`url(#${gradId})`} />
          <rect x="0" width="1.5" height="14" fill="rgba(243,233,204,.11)" />
          <rect x="9" width="3" height="14" fill="rgba(0,0,0,.26)" />
        </pattern>
        <clipPath id={clipId}>
          <path d={ITALY_PATH_MAINLAND} />
          <path d={ITALY_PATH_SICILY} />
          <path d={ITALY_PATH_SARDINIA} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="260" height="313.3" fill={`url(#${ribsId})`} />
        <ellipse cx="90" cy="60" rx="120" ry="140" fill="rgba(243,233,204,.06)" />
      </g>

      {/* red strap wraps the tarp */}
      <g clipPath={`url(#${clipId})`}>
        <rect x="-30" y="128" width="320" height="26" fill="#E31919" transform="rotate(-18 131 141)" />
        <rect x="-30" y="128" width="320" height="3" fill="rgba(255,255,255,.4)" transform="rotate(-18 131 141)" />
        <rect x="-30" y="151" width="320" height="3" fill="rgba(0,0,0,.3)" transform="rotate(-18 131 141)" />
      </g>

      {/* silhouette outlines — drawn progressively on scroll-into-view */}
      <motion.path d={ITALY_PATH_MAINLAND} fill="none" stroke="rgba(243,233,204,.6)" strokeWidth={1.8} {...drawProps(0)} />
      <motion.path d={ITALY_PATH_SICILY} fill="none" stroke="rgba(243,233,204,.55)" strokeWidth={1.6} {...drawProps(1.1)} />
      <motion.path d={ITALY_PATH_SARDINIA} fill="none" stroke="rgba(243,233,204,.55)" strokeWidth={1.6} {...drawProps(1.3)} />

      {/* eyelets / grommets along the coast */}
      <g fill="#1A1980" stroke="#E31919" strokeWidth={2}>
        <circle cx="125.5" cy="77.4" r="4.2" />
        <circle cx="86.1" cy="35.4" r="4.2" />
        <circle cx="20.6" cy="93.9" r="4.2" />
        <circle cx="216.6" cy="234.5" r="4.2" />
        <circle cx="198.2" cy="232.9" r="4.2" />
        <circle cx="189.9" cy="260.7" r="4.2" />
      </g>

      {/* metal buckle on the strap */}
      <g transform="rotate(-18 131 141)">
        <rect x="116" y="128" width="30" height="26" rx="3" fill="#8a9099" />
        <rect x="116" y="128" width="30" height="26" rx="3" fill="none" stroke="#c7ccd2" strokeWidth={1.5} />
        <rect x="128" y="128" width="4" height="26" fill="#5c626b" />
        <rect x="120" y="132" width="22" height="3" fill="rgba(255,255,255,.5)" />
      </g>

      {/* lifted corner (peel) at the Gargano promontory — the real geographic "spur" of the boot */}
      <path d="M 225.7 182.7 C 236 180 244 188 244.4 201.3 L 229.9 198.4 C 224 194 222 187 225.7 182.7 Z" fill="#3a4a5e" />
      <path d="M 225.7 182.7 C 236 180 244 188 244.4 201.3" fill="none" stroke="#E31919" strokeWidth={2} />
      <path d="M 244.4 201.3 L 229.9 198.4" fill="none" stroke="rgba(243,233,204,.5)" strokeWidth={1.4} />
    </svg>
  );
}
