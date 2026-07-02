import Link from "next/link";
import { ItaliaEmblem } from "./ItaliaEmblem";

const NAV_LINKS = [
  { href: "/azienda", label: "Azienda" },
  { href: "/settori", label: "Settori" },
  { href: "/configuratore", label: "Configuratore" },
  { href: "/centri", label: "Centri" },
  { href: "/riparazione-rapida", label: "Riparazione" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-[60] flex items-center justify-between gap-6 border-b border-oro/[0.24] bg-navy-deep/[0.86] px-6 py-3.5 backdrop-blur-md md:px-10">
      <Link href="/" className="flex items-center gap-3 no-underline">
        <ItaliaEmblem variant="synthetic" width={26} height={38} />
        <span className="flex flex-col leading-none">
          <span className="font-display text-[17px] font-bold tracking-[0.06em] text-avorio">
            DI RISO <span className="text-oro">TELONI</span>
          </span>
          <span className="mt-[3px] text-[9.5px] tracking-[0.34em] text-avorio/55">
            ITALIA COPERTA · DAL 1950
          </span>
        </span>
      </Link>
      <nav className="flex items-center gap-4 overflow-x-auto md:gap-7">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-[13px] tracking-[0.04em] text-avorio/80 no-underline"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/preventivo"
          className="whitespace-nowrap rounded bg-oro px-5 py-[11px] font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-navy no-underline"
        >
          Richiedi preventivo
        </Link>
      </nav>
    </header>
  );
}
