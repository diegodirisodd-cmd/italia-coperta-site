export function SectionKicker({ label, center = false }: { label: string; center?: boolean }) {
  return (
    <div className={`flex items-center gap-3 mb-4 ${center ? "justify-center" : ""}`}>
      <span className="h-0.5 w-8 bg-oro" />
      <span className="text-xs font-semibold uppercase tracking-[0.28em] text-oro">{label}</span>
      {center && <span className="h-0.5 w-8 bg-oro" />}
    </div>
  );
}
