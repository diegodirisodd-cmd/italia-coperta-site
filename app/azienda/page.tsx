import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SectionKicker } from "@/components/SectionKicker";
import { organizationSchema, jsonLdScriptProps } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Azienda — Di Riso Teloni, dal 1950 e terza generazione",
  description:
    "Di Riso Teloni: 75 anni di storia dal 1950, terza generazione con Domenico e Diego Di Riso. Dal telo cucito a mano al digital printing, sede ad Angri (SA) e copertura in Lombardia.",
};

const TIMELINE = [
  {
    anno: "1950",
    titolo: "L'inizio, ad ago e filo",
    testo:
      "Nasce l'attività di famiglia: teloni cuciti a mano per i camion di un'Italia che si rimette in moto. Il telo è già allora un mestiere di precisione e di parola data.",
  },
  {
    anno: "Anni '80–'90",
    titolo: "La seconda generazione",
    testo:
      "L'azienda cresce con i mezzi e con le tratte: nuove attrezzature, saldatura ad alta frequenza, teli più grandi e più resistenti per un trasporto che cambia.",
  },
  {
    anno: "Oggi",
    titolo: "Terza generazione: Domenico e Diego",
    testo:
      "Domenico e Diego Di Riso guidano l'azienda unendo l'artigianato del telo alla stampa digitale e all'installazione moderna, con la sede di Angri (SA) e la copertura in Lombardia.",
  },
];

const VALORI = [
  {
    titolo: "Lo produciamo noi",
    testo:
      "Il telo non lo rivendiamo: lo fabbrichiamo. Controlliamo materiale, misure e finiture — e sappiamo ripararlo perché sappiamo com'è fatto.",
  },
  {
    titolo: "Garanzia sui materiali PVC",
    testo:
      "Lavoriamo PVC spalmati di qualità e diamo garanzia sui materiali. Niente promesse gonfiate: solo teli pensati per durare al lavoro.",
  },
  {
    titolo: "Assistenza su tutto il territorio",
    testo:
      "Due sedi e la rete di Centri Autorizzati Italia Coperta: se hai un problema in viaggio, il centro più vicino può intervenire.",
  },
];

export default function AziendaPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(organizationSchema())}
      />

      {/* hero */}
      <section className="border-b border-primary/[0.14] bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionKicker label="Dal 1950 · Terza generazione" />
          <h1 className="max-w-3xl font-display text-4xl font-bold uppercase leading-[0.98] text-avorio md:text-6xl">
            75 anni di teli, una sola famiglia
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-avorio/80">
            Di Riso Teloni nasce nel <strong className="font-semibold text-avorio">1950</strong> e da allora fa
            un mestiere solo, fatto bene: il telo. Tre generazioni della stessa famiglia, la stessa mano
            artigiana di allora con i materiali e le tecnologie di oggi.
          </p>
        </div>
      </section>

      {/* story + photo */}
      <section className="border-b border-primary/[0.14] bg-navy-deep px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-tight text-avorio md:text-4xl">
              Dal telo cucito a mano al digital printing
            </h2>
            <p className="mt-6 text-[17px] leading-[1.7] text-avorio/80">
              Quando l&apos;attività è cominciata, nel 1950, un telone si costruiva ad ago e filo, misura su
              misura, sul camion che ce l&apos;aveva davanti. Quella cura non l&apos;abbiamo persa: è ancora il
              modo in cui pensiamo ogni lavoro. Ma nel frattempo il mestiere si è evoluto, e noi con lui.
            </p>
            <p className="mt-4 text-[17px] leading-[1.7] text-avorio/80">
              Alla cucitura si è affiancata la saldatura ad alta frequenza, ai teli in tinta unita la stampa
              digitale ad alta definizione, al montaggio artigianale l&apos;installazione moderna su ogni tipo
              di mezzo e struttura. Oggi <strong className="font-semibold text-avorio">Domenico</strong> e{" "}
              <strong className="font-semibold text-avorio">Diego Di Riso</strong>, terza generazione, portano
              avanti l&apos;azienda con questa doppia anima: bottega e tecnologia.
            </p>
            <p className="mt-4 text-[17px] leading-[1.7] text-avorio/80">
              È questo il vantaggio di affidarsi a chi il telo lo fa da 75 anni: l&apos;esperienza di chi ne ha
              visti passare decine di migliaia, e la voglia di chi vuole ancora farli meglio.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <figure>
              <div className="relative aspect-square w-full overflow-hidden rounded-md">
                <Image
                  src="/images/fondatore-storica.jpg"
                  alt="Il fondatore di Di Riso Teloni negli anni '50, agli inizi dell'attività"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2 text-xs uppercase tracking-[0.14em] text-avorio/40">
                Il fondatore · dagli anni &apos;50
              </figcaption>
            </figure>
            <figure>
              <div className="relative aspect-square w-full overflow-hidden rounded-md">
                <Image
                  src="/images/storia/diego-domenico-oggi.jpg"
                  alt="Domenico e Diego Di Riso, terza generazione dell'azienda, oggi"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-top"
                />
              </div>
              <figcaption className="mt-2 text-xs uppercase tracking-[0.14em] text-avorio/40">
                Domenico e Diego, oggi
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* timeline */}
      <section className="border-b border-primary/[0.14] bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionKicker label="La nostra storia" />
          <h2 className="font-display text-3xl font-bold uppercase leading-none text-avorio md:text-4xl">
            Tre generazioni sulla strada
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-primary/20 bg-primary/20 md:grid-cols-3">
            {TIMELINE.map((step) => (
              <div key={step.anno} className="bg-navy-deep p-8">
                <div className="font-display text-3xl font-bold text-primary">{step.anno}</div>
                <h3 className="mt-3 font-display text-lg font-semibold uppercase tracking-[0.02em] text-avorio">
                  {step.titolo}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-avorio/70">{step.testo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* valori / garanzia */}
      <section className="border-b border-primary/[0.14] bg-navy-deep px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionKicker label="Perché sceglierci" />
          <h2 className="font-display text-3xl font-bold uppercase leading-none text-avorio md:text-4xl">
            Garanzia e assistenza, non promesse
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {VALORI.map((valore) => (
              <div key={valore.titolo} className="rounded-lg border border-avorio/[0.14] bg-navy p-7">
                <h3 className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-avorio">
                  {valore.titolo}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-avorio/70">{valore.testo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* sedi */}
      <section className="border-b border-primary/[0.14] bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-primary/25 bg-navy-deep p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Sede principale
            </span>
            <h3 className="mt-3 font-display text-2xl font-bold uppercase text-avorio">Angri (SA)</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-avorio/75">
              Via dei Goti 183, Angri (SA)
              <br />
              Produzione · Vendita · Riparazione · Configuratore
            </p>
          </div>
          <div className="rounded-lg border border-primary/25 bg-navy-deep p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Area Nord</span>
            <h3 className="mt-3 font-display text-2xl font-bold uppercase text-avorio">Lombardia</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-avorio/75">
              Area di copertura — Nord Italia
              <br />
              Vendita · Montaggio · Riparazione rapida
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-deep px-6 py-20 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-lg border border-primary/25 bg-navy-black px-8 py-10 md:flex-row md:items-center md:px-12">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase leading-tight text-avorio md:text-3xl">
              Mettici alla prova
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-avorio/75">
              75 anni di teloni al tuo servizio. Raccontaci cosa ti serve e ti prepariamo un preventivo su
              misura, senza impegno.
            </p>
          </div>
          <Link
            href="/preventivo"
            className="whitespace-nowrap rounded-md bg-primary px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy no-underline"
          >
            Richiedi un preventivo
          </Link>
        </div>
      </section>
    </main>
  );
}
