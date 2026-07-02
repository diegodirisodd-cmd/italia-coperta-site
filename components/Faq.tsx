// Accessible FAQ accordion using native <details>/<summary> — no client JS,
// SSR-safe. The same data should feed a FAQPage JSON-LD on the page.
export function Faq({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-lg border border-avorio/[0.14] bg-navy px-6 py-1 open:border-primary/40"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-semibold uppercase tracking-[0.02em] text-avorio marker:content-none">
            {item.question}
            <span className="flex-none text-primary transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="pb-5 pr-8 text-[15px] leading-relaxed text-avorio/75">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
