"use client";

import { useState } from "react";
import { ReviewCard } from "@/components/recensioni/ReviewCard";
import { reviews, serviziRecensioni } from "@/data/reviews";

/** Full review grid with an optional filter by service. */
export function RecensioniList() {
  const [filter, setFilter] = useState<string | null>(null);
  const shown = filter ? reviews.filter((r) => r.service === filter) : reviews;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtra per servizio">
        <FilterChip active={filter === null} onClick={() => setFilter(null)}>
          Tutte
        </FilterChip>
        {serviziRecensioni.map((s) => (
          <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
            {s}
          </FilterChip>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((r, i) => (
          <ReviewCard key={i} review={r} index={i + 1} />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        "rounded-full border-[1.5px] px-4 py-2 text-[13px] transition-colors",
        active
          ? "border-primary bg-primary/10 text-avorio"
          : "border-avorio/20 text-avorio/70 hover:border-primary/60",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
