// Kicker above section titles: thin red rule + small cream label. The label
// used to be red too — with red on every kicker, number and border, red stopped
// pointing at the one thing that matters (the CTA).
export function SectionKicker({ label, center = false }: { label: string; center?: boolean }) {
  return (
    <div className={`mb-4 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
      <span className="h-px w-8 bg-primary" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-avorio/70">{label}</span>
      {center && <span className="h-px w-8 bg-primary" />}
    </div>
  );
}
