// Live truck+tarp preview, ported from the "Italia Coperta" mockup. The tarp
// fill reflects the chosen colour so the preview reacts to the configuration.
export function TruckPreview({ tarpColor = "#12335c" }: { tarpColor?: string }) {
  return (
    <svg viewBox="0 0 440 180" className="block h-auto w-full">
      <line x1="10" y1="150" x2="430" y2="150" stroke="rgba(243,233,204,.2)" strokeWidth={2} />
      {/* cab */}
      <path d="M30 150 L30 96 Q30 88 40 86 L78 78 L98 100 L98 150 Z" fill="#12335c" stroke="#F3E9CC" strokeWidth={2} />
      <rect x="44" y="90" width="30" height="20" rx="2" fill="#0B2545" stroke="rgba(243,233,204,.6)" strokeWidth={1.5} />
      {/* trailer tarp */}
      <rect x="104" y="60" width="308" height="90" rx="3" fill={tarpColor} stroke="#F3E9CC" strokeWidth={2} />
      <g stroke="rgba(243,233,204,.28)" strokeWidth={2}>
        {[130, 160, 190, 220, 250, 280, 310, 340, 370].map((x) => (
          <line key={x} x1={x} y1="62" x2={x} y2="148" />
        ))}
      </g>
      {/* gold strap bottom */}
      <rect x="104" y="132" width="308" height="7" fill="#C9A227" />
      {/* wheels */}
      <g fill="#061529" stroke="#F3E9CC" strokeWidth={2}>
        {[70, 300, 340, 380].map((cx) => (
          <circle key={cx} cx={cx} cy="150" r="12" />
        ))}
      </g>
    </svg>
  );
}
