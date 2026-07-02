import type { Metadata } from "next";
import { SectionKicker } from "@/components/SectionKicker";
import { CandidaturaForm } from "@/components/diventa/CandidaturaForm";

export const metadata: Metadata = {
  title: "Diventa Centro Autorizzato Italia Coperta — partner",
  description:
    "Diventa Centro Autorizzato Italia Coperta: fornitura prodotta direttamente da Di Riso Teloni, richieste dal configuratore, listino unico e marketing condiviso. Candidati per la tua zona.",
};

const VANTAGGI = [
  {
    titolo: "Riferimento locale",
    testo: "Diventi il punto Italia Coperta della tua zona: vendita, montaggio e riparazione con un marchio riconoscibile.",
  },
  {
    titolo: "Fornitura prodotta da noi",
    testo: "Non rivendi teli di terzi: ricevi prodotto fabbricato direttamente da Di Riso, con qualità e tempi garantiti.",
  },
  {
    titolo: "Richieste dal configuratore",
    testo: "Le richieste di preventivo e riparazione della tua area ti arrivano dal sito, assegnate automaticamente.",
  },
  {
    titolo: "Listino unico",
    testo: "Prezzi chiari e coerenti su tutta la rete: lavori con margini definiti, senza sorprese.",
  },
  {
    titolo: "Marketing condiviso",
    testo: "Ti sosteniamo con il brand Italia Coperta, la presenza sulla mappa e la comunicazione online.",
  },
  {
    titolo: "Formazione e supporto",
    testo: "Ti affianchiamo su prodotto, montaggio e riparazione, con il know-how di tre generazioni.",
  },
];

const REQUISITI = [
  "Sede o officina con spazio per lavorazione e montaggio teli",
  "Attività già avviata nel settore (officina, gommista, carrozzeria, teloneria o affine)",
  "Disponibilità a rappresentare il marchio Italia Coperta sul territorio",
  "Serietà e assistenza al cliente come priorità",
];

export default function DiventaCentroPage() {
  return (
    <main>
      {/* hero */}
      <section className="border-b border-primary/[0.14] bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionKicker label="Reclutamento partner" />
          <h1 className="max-w-3xl font-display text-4xl font-bold uppercase leading-[0.98] text-avorio md:text-6xl">
            Diventa Centro Autorizzato Italia Coperta
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-avorio/80">
            Porta nella tua zona un marchio con 75 anni di storia. Fornitura prodotta da noi, richieste che
            arrivano dal sito, un listino unico e il supporto di Di Riso Teloni.
          </p>
        </div>
      </section>

      {/* vantaggi */}
      <section className="border-b border-primary/[0.14] bg-navy-deep px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionKicker label="Perché diventare partner" />
          <h2 className="font-display text-3xl font-bold uppercase leading-none text-avorio md:text-4xl">
            I vantaggi della rete
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VANTAGGI.map((v) => (
              <div key={v.titolo} className="rounded-lg border border-avorio/[0.14] bg-navy p-7">
                <h3 className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-avorio">
                  {v.titolo}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-avorio/70">{v.testo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* requisiti + form */}
      <section className="bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <SectionKicker label="Cosa serve" />
            <h2 className="font-display text-3xl font-bold uppercase leading-tight text-avorio md:text-4xl">
              Requisiti
            </h2>
            <ul className="mt-6 flex flex-col gap-3.5">
              {REQUISITI.map((r) => (
                <li key={r} className="flex gap-3 text-[15px] leading-snug text-avorio/80">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-avorio/60">
              Compila il form: valutiamo ogni candidatura e ti ricontattiamo per capire insieme se c&apos;è lo
              spazio per aprire nella tua zona.
            </p>
          </div>
          <CandidaturaForm />
        </div>
      </section>
    </main>
  );
}
