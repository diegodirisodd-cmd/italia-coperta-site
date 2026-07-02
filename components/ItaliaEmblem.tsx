import { useId } from "react";

// Shared Italy silhouette path data — the "Italia Coperta" signature emblem
// (Italy as a PVC tarp) and the stylized map both draw from these same
// paths so the shape never drifts between uses.
export const ITALY_PATH_MAINLAND =
  "M60 46 C74 34 98 32 122 35 C140 37 160 33 176 45 C188 54 189 71 195 89 C201 108 209 127 213 149 C215 161 216 173 216 184 C226 184 236 190 238 200 C240 210 233 217 222 216 C213 215 205 212 197 219 C189 226 185 239 178 251 C171 262 165 274 157 285 C152 292 143 294 141 284 C139 273 146 263 141 249 C135 228 126 206 116 183 C107 162 96 142 85 121 C77 103 63 84 58 66 C54 57 53 50 60 46 Z";
export const ITALY_PATH_SICILY =
  "M114 302 C130 294 152 300 161 312 C166 319 156 327 142 326 C127 325 110 316 114 302 Z";
export const ITALY_PATH_SARDINIA =
  "M54 202 C46 194 49 218 53 240 C56 255 69 257 72 242 C76 222 64 208 54 202 Z";

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
    return <RichEmblem width={width ?? 330} height={height ?? 480} className={className} />;
  }
  return <SyntheticEmblem width={width ?? 26} height={height ?? 38} className={className} />;
}

function SyntheticEmblem({ width, height, className }: { width: number; height: number; className?: string }) {
  return (
    <svg viewBox="0 0 260 380" width={width} height={height} aria-hidden="true" className={className} style={{ display: "block", flex: "none" }}>
      <path d={ITALY_PATH_MAINLAND} fill="#0B2545" stroke="#C9A227" strokeWidth={6} />
      <path d={ITALY_PATH_SICILY} fill="#0B2545" stroke="#C9A227" strokeWidth={6} />
      <path d={ITALY_PATH_SARDINIA} fill="#0B2545" stroke="#C9A227" strokeWidth={6} />
      <rect x="30" y="150" width="220" height="24" rx="4" fill="#C9A227" transform="rotate(19 130 165)" />
    </svg>
  );
}

function RichEmblem({ width, height, className }: { width: number; height: number; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `icTarp-${uid}`;
  const ribsId = `icRibs-${uid}`;
  const clipId = `icClip-${uid}`;

  return (
    <svg
      viewBox="0 0 260 380"
      width={width}
      height={height}
      className={className}
      style={{ filter: "drop-shadow(0 26px 50px rgba(0,0,0,.5))", maxWidth: "100%" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#173a63" />
          <stop offset="0.5" stopColor="#0B2545" />
          <stop offset="1" stopColor="#061529" />
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
        <rect x="0" y="0" width="260" height="380" fill={`url(#${ribsId})`} />
        <ellipse cx="76" cy="70" rx="130" ry="150" fill="rgba(243,233,204,.06)" />
      </g>

      {/* gold strap wraps the tarp */}
      <g clipPath={`url(#${clipId})`}>
        <rect x="-10" y="150" width="290" height="26" fill="#C9A227" transform="rotate(19 130 165)" />
        <rect x="-10" y="150" width="290" height="3" fill="rgba(255,255,255,.4)" transform="rotate(19 130 165)" />
        <rect x="-10" y="173" width="290" height="3" fill="rgba(0,0,0,.3)" transform="rotate(19 130 165)" />
      </g>

      {/* silhouette outlines */}
      <path d={ITALY_PATH_MAINLAND} fill="none" stroke="rgba(243,233,204,.6)" strokeWidth={1.8} />
      <path d={ITALY_PATH_SICILY} fill="none" stroke="rgba(243,233,204,.55)" strokeWidth={1.6} />
      <path d={ITALY_PATH_SARDINIA} fill="none" stroke="rgba(243,233,204,.55)" strokeWidth={1.6} />

      {/* eyelets / grommets along the coast */}
      <g fill="#081A33" stroke="#C9A227" strokeWidth={2}>
        <circle cx="62" cy="72" r="4.5" />
        <circle cx="70" cy="104" r="4.5" />
        <circle cx="83" cy="140" r="4.5" />
        <circle cx="98" cy="176" r="4.5" />
        <circle cx="196" cy="120" r="4.5" />
        <circle cx="205" cy="150" r="4.5" />
      </g>

      {/* metal buckle on the strap */}
      <g transform="rotate(19 130 165)">
        <rect x="118" y="150" width="30" height="26" rx="3" fill="#8a9099" />
        <rect x="118" y="150" width="30" height="26" rx="3" fill="none" stroke="#c7ccd2" strokeWidth={1.5} />
        <rect x="130" y="150" width="4" height="26" fill="#5c626b" />
        <rect x="122" y="154" width="22" height="3" fill="rgba(255,255,255,.5)" />
      </g>

      {/* lifted corner (peel) top-right */}
      <path d="M176 45 C186 44 192 52 195 62 L172 74 C168 62 168 50 176 45 Z" fill="#3a4a5e" />
      <path d="M176 45 C186 44 192 52 195 62" fill="none" stroke="#C9A227" strokeWidth={2} />
      <path d="M195 62 L172 74" fill="none" stroke="rgba(243,233,204,.5)" strokeWidth={1.4} />
    </svg>
  );
}
