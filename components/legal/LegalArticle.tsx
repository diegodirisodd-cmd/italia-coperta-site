import type { ReactNode } from "react";
import { SectionKicker } from "@/components/SectionKicker";

/** Shared layout for the legal pages (privacy, cookie policy) with real content. */
export function LegalArticle({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-navy-deep px-6 py-24 md:px-10">
      <div className="mx-auto max-w-3xl">
        <SectionKicker label="Note legali" />
        <h1 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-xs uppercase tracking-[0.14em] text-avorio/50">
          Ultimo aggiornamento: {lastUpdated}
        </p>

        <div className="mt-10 space-y-10 border-t border-avorio/10 pt-10">{children}</div>
      </div>
    </main>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold uppercase tracking-[0.02em] text-avorio">{heading}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-avorio/70">{children}</div>
    </section>
  );
}
