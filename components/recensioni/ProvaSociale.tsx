import { reviewForService } from "@/data/reviews";
import { Stars } from "./Stars";

/**
 * Compact single-review social proof for conversion pages (preventivo,
 * configuratore, riparazione-rapida). Picks the most relevant review for the
 * given service; kept short so it doesn't lengthen the page.
 */
export function ProvaSociale({ service }: { service: string }) {
  const r = reviewForService(service);
  if (!r) return null;
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-avorio/[0.14] bg-navy p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Stars rating={r.rating} />
        {r.source === "Google" && (
          <span className="text-[12px] text-tricolore-verde">Recensione verificata su Google</span>
        )}
      </div>
      <p className="mt-3 text-[15px] italic leading-relaxed text-avorio/85">“{r.text}”</p>
      <p className="mt-2 text-sm text-avorio/60">
        <span className="font-semibold text-avorio">{r.customer}</span> · {r.service}
      </p>
    </div>
  );
}
