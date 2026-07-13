/** Obvious placeholder panel standing in for a real photo — swap for
 *  next/image once real assets exist. Kept visually distinct on purpose. */
export function PhotoPlaceholder({
  caption,
  className = "",
  aspect,
}: {
  caption: string;
  className?: string;
  aspect?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-md border border-dashed border-primary/25 bg-gradient-to-br from-navy-black via-navy to-navy-deep ${className}`}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      <span className="max-w-[240px] px-4 text-center text-xs uppercase tracking-[0.18em] text-avorio/30">
        {caption}
      </span>
    </div>
  );
}
