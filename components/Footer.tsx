import Link from "next/link";
import { ItaliaEmblem } from "./ItaliaEmblem";
import { EMAIL, WHATSAPP_DISPLAY, waLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-oro/20 bg-navy-black px-6 pb-10 pt-14 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <ItaliaEmblem variant="synthetic" width={24} height={35} />
            <span className="font-display text-lg font-bold tracking-[0.06em] text-avorio">
              DI RISO <span className="text-oro">TELONI</span>
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-avorio/60">
            Teloni per camion dal 1950. Il telo che copre l&apos;Italia — e ti copre in tutta Italia.
          </p>
          <div className="mt-4 flex flex-col gap-1 text-sm">
            <a href={`mailto:${EMAIL}`} className="text-avorio/75 no-underline">
              {EMAIL}
            </a>
            <a href={waLink("Ciao Di Riso Teloni,")} target="_blank" rel="noopener noreferrer" className="text-oro no-underline">
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>
        <div>
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.2em] text-oro">Sedi</span>
          <div className="text-sm leading-loose text-avorio/75">
            <Link href="/centri" className="no-underline">Angri (SA) — Sede principale</Link>
            <br />
            <Link href="/centri" className="no-underline">Brescia — Sede Nord</Link>
          </div>
        </div>
        <div>
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.2em] text-oro">Servizi</span>
          <div className="text-sm leading-loose text-avorio/75">
            <Link href="/configuratore" className="no-underline">Teloni su misura</Link><br />
            <Link href="/configuratore" className="no-underline">Configuratore online</Link><br />
            <Link href="/riparazione-rapida" className="no-underline">Riparazione rapida</Link><br />
            <Link href="/centri" className="no-underline">Centri autorizzati</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-9 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-avorio/10 pt-5 text-xs text-avorio/45">
        <span>© 1950–{new Date().getFullYear()} Di Riso Teloni · Terza generazione</span>
        <span className="uppercase tracking-[0.14em]">Italia Coperta</span>
      </div>
    </footer>
  );
}
