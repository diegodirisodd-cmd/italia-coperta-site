/** Rating stars with an accessible label (not just graphics). */
export function Stars({ rating }: { rating: number }) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`Valutazione: ${r} stelle su 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={i <= r ? "text-primary" : "text-avorio/25"}
          fill="currentColor"
        >
          <path d="M12 2l2.9 6.26L21.5 9.3l-4.75 4.64L17.9 21 12 17.5 6.1 21l1.15-7.06L2.5 9.3l6.6-1.04z" />
        </svg>
      ))}
    </span>
  );
}
