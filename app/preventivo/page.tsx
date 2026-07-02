import type { Metadata } from "next";
import Link from "next/link";
import { SectionKicker } from "@/components/SectionKicker";
import { RichiestaForm } from "@/components/contatti/RichiestaForm";

export const metadata: Metadata = {
  title: "Richiedi un preventivo su misura — teloni e coperture",
  description:
    "Richiedi un preventivo gratuito e senza impegno per teloni per camion, tensostrutture e coperture su misura. Ti ricontattiamo con una proposta concreta, dal 1950.",
};

const PUNTI = [
  "Preventivo su misura, gratuito e senza impegno",
  "Ti ricontattiamo noi, con materiali e tempi chiari",
  "Prodotto e assistito direttamente da Di Riso Teloni",
];

export default function PreventivoPage() {
  return (
    <main>
      {/* hero */}
      <section className="border-b border-oro/[0.14] bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionKicker label="Senza impegno" />
          <h1 className="max-w-3xl font-display text-4xl font-bold uppercase leading-[0.98] text-avorio md:text-6xl">
            Richiedi un preventivo su misura
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-avorio/80">
            Dicci cosa ti serve e ti prepariamo una proposta concreta. Per i teloni da camion puoi anche partire
            dal configuratore e ricevere una stima immediata.
          </p>
        </div>
      </section>

      {/* punti + form */}
      <section className="bg-navy-deep px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <ul className="flex flex-col gap-3.5">
              {PUNTI.map((p) => (
                <li key={p} className="flex gap-3 text-[16px] leading-snug text-avorio/85">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-oro" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-lg border border-avorio/[0.14] bg-navy p-6">
              <h2 className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-avorio">
                Telone per camion?
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-avorio/70">
                Usa il configuratore: scegli veicolo, telo, misura ed extra e ottieni una stima istantanea con il
                centro più vicino.
              </p>
              <Link
                href="/configuratore"
                className="mt-4 inline-block rounded-md border-[1.5px] border-oro/50 px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-oro no-underline"
              >
                Apri il configuratore →
              </Link>
            </div>
          </div>
          <RichiestaForm tipo="preventivo" />
        </div>
      </section>
    </main>
  );
}
