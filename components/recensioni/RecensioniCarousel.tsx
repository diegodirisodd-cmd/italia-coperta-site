"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ReviewCard } from "./ReviewCard";
import type { Review } from "@/data/reviews";

/**
 * Responsive review carousel: 3 per view on desktop, 2 on tablet, 1 on mobile
 * (native horizontal swipe via scroll-snap). Keyboard-accessible arrows, page
 * dots, slow autoplay paused on hover/focus, and respects prefers-reduced-motion
 * (no autoplay, instant scroll). Cards stretch to equal height → no layout shift.
 */
export function RecensioniCarousel({ reviews }: { reviews: Review[] }) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [perView, setPerView] = useState(1);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const pageRef = useRef(0);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const pages = Math.max(1, Math.ceil(reviews.length / perView));

  const goTo = useCallback(
    (p: number) => {
      const el = trackRef.current;
      if (!el) return;
      const target = ((p % pages) + pages) % pages;
      el.scrollTo({ left: target * el.clientWidth, behavior: reduced ? "auto" : "smooth" });
      setPage(target);
    },
    [pages, reduced],
  );

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const p = Math.round(el.scrollLeft / el.clientWidth);
    if (p !== pageRef.current) setPage(p);
  };

  useEffect(() => {
    if (reduced || paused || pages <= 1) return;
    const id = setInterval(() => goTo(pageRef.current + 1), 6500);
    return () => clearInterval(id);
  }, [reduced, paused, pages, goTo]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        role="group"
        aria-roledescription="carosello"
        aria-label="Recensioni dei clienti"
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r, i) => (
          <div
            key={i}
            className="w-full shrink-0 snap-start sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)]"
          >
            <ReviewCard review={r} index={i + 1} />
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2" role="tablist" aria-label="Pagine recensioni">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === page}
                aria-label={`Vai al gruppo ${i + 1} di ${pages}`}
                onClick={() => goTo(i)}
                className={[
                  "h-2 rounded-full transition-all",
                  i === page ? "w-6 bg-primary" : "w-2 bg-avorio/25 hover:bg-avorio/40",
                ].join(" ")}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ArrowButton dir="prev" onClick={() => goTo(page - 1)} />
            <ArrowButton dir="next" onClick={() => goTo(page + 1)} />
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Recensioni precedenti" : "Recensioni successive"}
      className="flex h-10 w-10 items-center justify-center rounded-md border-[1.5px] border-avorio/30 text-avorio transition-colors hover:border-primary/70 hover:text-primary focus-visible:border-primary"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
  );
}
