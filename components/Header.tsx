import Link from "next/link";

const NAV_LINKS = [
  { href: "/azienda", label: "Azienda" },
  { href: "/settori", label: "Settori" },
  { href: "/configuratore", label: "Configuratore" },
  { href: "/centri", label: "Centri" },
  { href: "/riparazione-rapida", label: "Riparazione" },
];

export function Header() {
  return (
    <header
      className="sticky top-0 z-[60] flex items-center justify-between gap-6 border-b border-primary/[0.24] bg-navy-deep/[0.86] px-6 py-3.5 backdrop-blur-md md:px-10"
      style={{ paddingTop: "max(0.875rem, env(safe-area-inset-top))" }}
    >
      <Link href="/" className="flex items-center gap-3 no-underline">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-diriso-teloni.svg"
          alt="Di Riso Teloni — Italia Coperta"
          width={1230}
          height={693}
          className="h-11 w-auto"
        />
        <span className="hidden flex-col leading-none sm:flex">
          <span className="text-[9.5px] tracking-[0.34em] text-avorio/55">
            ITALIA COPERTA · DAL 1950
          </span>
        </span>
      </Link>
      <nav className="flex items-center gap-4 overflow-x-auto md:gap-7">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex min-h-[44px] items-center whitespace-nowrap text-[13px] tracking-[0.04em] text-avorio/80 no-underline"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/preventivo"
          className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded bg-primary px-5 py-[11px] font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-navy no-underline"
        >
          Richiedi preventivo
        </Link>
      </nav>
    </header>
  );
}
