import { SectionKicker } from "./SectionKicker";

type PlaceholderPageProps = {
  kicker: string;
  title: string;
  description: string;
};

/** Minimal, crawlable stub for sitemap routes not yet built out (see build plan). */
export function PlaceholderPage({ kicker, title, description }: PlaceholderPageProps) {
  return (
    <section className="min-h-[60vh] bg-navy-deep px-6 py-24 md:px-10">
      <div className="mx-auto max-w-3xl">
        <SectionKicker label={kicker} />
        <h1 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-5xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-avorio/80">{description}</p>
      </div>
    </section>
  );
}
