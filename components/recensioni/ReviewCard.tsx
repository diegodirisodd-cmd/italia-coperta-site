import Image from "next/image";
import type { Review } from "@/data/reviews";
import { Stars } from "./Stars";

/**
 * Single review card, industrial style consistent with the site: thin border,
 * rounded corners, subtle desktop hover. Numbered badge (optional), stars,
 * quote icon, text, customer, service + date badges, "verificata su Google"
 * when applicable, optional work photo. Presentational only.
 */
export function ReviewCard({ review, index }: { review: Review; index?: number }) {
  const { rating, text, customer, service, date, source, image } = review;
  return (
    <article className="group flex h-full flex-col rounded-lg border border-avorio/[0.14] bg-navy p-6 transition-colors duration-300 hover:border-primary/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {typeof index === "number" && (
            <span
              className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-primary/15 font-display text-[11px] font-bold text-primary"
              aria-hidden="true"
            >
              {String(index).padStart(2, "0")}
            </span>
          )}
          <Stars rating={rating} />
        </div>
        <QuoteIcon />
      </div>

      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-avorio/85">{text}</p>

      <p className="mt-5 font-display text-[15px] font-semibold uppercase tracking-[0.02em] text-avorio">
        {customer}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>
          <WrenchIcon />
          {service}
        </Badge>
        <Badge>
          <CalendarIcon />
          {date}
        </Badge>
      </div>

      {source === "Google" && (
        <p className="mt-3 flex items-center gap-1.5 text-[12px] text-tricolore-verde">
          <CheckIcon />
          Recensione verificata su Google
        </p>
      )}

      {image && (
        <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-md border border-avorio/10">
          <Image
            src={image}
            alt={`Lavoro Di Riso Teloni — ${service}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
    </article>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-avorio/15 px-3 py-1 text-[11px] text-avorio/70">
      {children}
    </span>
  );
}

function QuoteIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="flex-none text-primary/25">
      <path d="M7.5 6C5 6 3 8 3 10.5S5 15 7.5 15c0 2-1.2 3.2-3 3.6L5 20c3-.6 5-3 5-6.5V10.5C10 8 8.5 6 7.5 6zm9 0C14 6 12 8 12 10.5S14 15 16.5 15c0 2-1.2 3.2-3 3.6L14 20c3-.6 5-3 5-6.5V10.5C19 8 17.5 6 16.5 6z" />
    </svg>
  );
}
function WrenchIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-primary">
      <path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-primary">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
