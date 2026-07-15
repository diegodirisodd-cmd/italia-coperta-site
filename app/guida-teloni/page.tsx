import type { Metadata } from "next";
import Link from "next/link";
import { SectionKicker } from "@/components/SectionKicker";

export const metadata: Metadata = {
  title: { absolute: "Tipi di Teloni per Camion: Guida Completa | Di Riso Teloni" },
  description:
    "Guida completa ai teloni per camion e veicoli industriali: tipi, materiali, misure e come scegliere quello giusto. Dal 1950, esperienza artigianale su misura.",
  alternates: { canonical: "/guida-teloni" },
};

export default function GuidaTeloniPage() {
  return (
    <main>
      {/* hero */}
      <section className="border-b border-primary/[0.14] bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto max-w-3xl">
          <SectionKicker label="Guida ai teloni" />
          <h1 className="font-display text-4xl font-bold uppercase leading-[0.98] text-avorio md:text-5xl">
            Tipi di Teloni per Camion: Guida Completa
          </h1>
        </div>
      </section>

      {/* body */}
      <section className="bg-navy-deep px-6 py-20 md:px-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-14">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase leading-tight text-avorio md:text-3xl">
              Cos&apos;è un telone (o toldo)
            </h2>
            <p className="mt-5 text-[17px] leading-[1.7] text-avorio/80">
              Il telone — chiamato anche &quot;toldo&quot; in alcune zone d&apos;Italia — è la copertura in PVC
              o tessuto tecnico che protegge il carico sui veicoli industriali: camion, semirimorchi, motrici.
              Non è solo protezione dagli agenti atmosferici, ma un elemento strutturale che deve resistere a
              tensioni, usura e movimentazione quotidiana del mezzo.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold uppercase leading-tight text-avorio md:text-3xl">
              I principali tipi di teloni
            </h2>
            <p className="mt-5 text-[17px] leading-[1.7] text-avorio/80">
              Tra le tipologie più diffuse c&apos;è il{" "}
              <Link href="/settori/teloni-automezzi" className="text-primary no-underline hover:underline">
                telone laterale
              </Link>
              , che copre i lati del mezzo ed è spesso removibile o scorrevole per facilitare le operazioni di
              carico e scarico. A completarlo c&apos;è il telone tetto, la copertura superiore che garantisce la
              tenuta stagna del carico.
            </p>
            <p className="mt-4 text-[17px] leading-[1.7] text-avorio/80">
              Oltre al trasporto su strada, lavoriamo{" "}
              <Link href="/settori/coperture-pvc" className="text-primary no-underline hover:underline">
                coperture in PVC generiche
              </Link>
              , pensate per cantieristica, agricoltura e strutture temporanee, e{" "}
              <Link
                href="/settori/tensostrutture-industriali"
                className="text-primary no-underline hover:underline"
              >
                tensostrutture industriali
              </Link>
              , coperture di grandi dimensioni per capannoni e spazi industriali. Chi vuole invece trasformare
              il proprio mezzo in uno spazio pubblicitario mobile può orientarsi verso i{" "}
              <Link href="/settori/teloni-pubblicitari" className="text-primary no-underline hover:underline">
                teloni pubblicitari
              </Link>
              , con stampa digitale ad alta definizione direttamente sul PVC.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold uppercase leading-tight text-avorio md:text-3xl">
              Materiali e misure
            </h2>
            <p className="mt-5 text-[17px] leading-[1.7] text-avorio/80">
              Il PVC utilizzato varia per grammatura e resistenza a seconda dell&apos;uso — un telone da
              trasporto quotidiano richiede caratteristiche diverse da una copertura stagionale. Ogni telone
              viene realizzato su misura reale del mezzo, non su taglie standard, per garantire tenuta e
              durata.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold uppercase leading-tight text-avorio md:text-3xl">
              Riparazione o sostituzione: come scegliere
            </h2>
            <p className="mt-5 text-[17px] leading-[1.7] text-avorio/80">
              Un telone danneggiato non sempre va sostituito interamente — spesso una{" "}
              <Link href="/riparazione-rapida" className="text-primary no-underline hover:underline">
                riparazione rapida
              </Link>{" "}
              mirata su lacerazioni, cuciture o ganci risolve il problema a un costo molto inferiore.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold uppercase leading-tight text-avorio md:text-3xl">
              Come richiedere il tuo telone su misura
            </h2>
            <p className="mt-5 text-[17px] leading-[1.7] text-avorio/80">
              Il modo più rapido è il nostro{" "}
              <Link href="/configuratore" className="text-primary no-underline hover:underline">
                configuratore online
              </Link>
              , che ti guida passo passo nella scelta di mezzo, colore e misure. In alternativa puoi richiedere
              un preventivo dettagliato descrivendo la tua esigenza.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-lg border border-primary/25 bg-navy-black px-8 py-10 md:flex-row md:items-center md:px-12">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase leading-tight text-avorio md:text-3xl">
              Pronto a costruire il tuo telone?
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-avorio/75">
              Scegli mezzo, colore e misure con il configuratore, oppure raccontaci cosa ti serve per un
              preventivo su misura.
            </p>
          </div>
          <Link
            href="/configuratore"
            className="whitespace-nowrap rounded-md bg-primary px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy no-underline"
          >
            Configura il tuo telone
          </Link>
        </div>
      </section>
    </main>
  );
}
