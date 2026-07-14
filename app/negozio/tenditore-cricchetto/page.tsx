import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SectionKicker } from "@/components/SectionKicker";

const price = "13,00 €";
const shippingCost = "5,00 €";
const totalPrice = "18,00 €";

const stripePaymentLink = "https://buy.stripe.com/9B6fZ90R372GfOS5VSc7u0c";

const heroImage = {
  src: "/images/shop/tenditore-cricchetto-02.jpg",
  alt: "Tenditore a cricchetto standard",
};

const galleryImages = [
  { src: "/images/shop/tenditore-cricchetto-05.jpg", alt: "Tenditore a cricchetto standard — vista d'insieme" },
  { src: "/images/shop/tenditore-cricchetto-01.jpg", alt: "Tenditore a cricchetto standard — vista laterale" },
  { src: "/images/shop/tenditore-cricchetto-03-dettaglio.jpg", alt: "Tenditore a cricchetto standard — dettaglio gancio" },
];

const SCHEDA_TECNICA = [
  { label: "Larghezza cinghia", value: "50 mm" },
  { label: "Lunghezza totale", value: "9,00 m" },
  { label: "Cinghia lunga (che avvolge il carico)", value: "8,60 m" },
  { label: "Cinghia corta (fissa al cricchetto)", value: "0,40 m" },
  { label: "Colore", value: "Blu" },
  { label: "Materiale", value: "Cricchetto in acciaio inox, cinghia in poliestere, gancio aperto zincato" },
  { label: "Marchio", value: "LoadLok" },
];

export const metadata: Metadata = {
  title: "Tenditore a cricchetto standard — Negozio",
  description:
    "Tenditore a cricchetto standard: cricchetto in acciaio inox, cinghia in poliestere, gancio aperto zincato. Robusto e affidabile per il fissaggio del carico.",
  alternates: { canonical: "/negozio/tenditore-cricchetto" },
};

export default function TenditoreCricchettoPage() {
  return (
    <main>
      {/* hero */}
      <section className="border-b border-primary/[0.14] bg-navy px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-primary no-underline"
          >
            ← Torna alla home
          </Link>
          <div className="mt-6 grid items-start gap-12 md:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-primary/20">
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {galleryImages.map((img) => (
                  <div
                    key={img.src}
                    className="relative aspect-square overflow-hidden rounded-md border border-avorio/[0.14]"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 33vw, 15vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionKicker label="Negozio · Accessori" />
              <h1 className="font-display text-4xl font-bold uppercase leading-[0.98] text-avorio md:text-5xl">
                Tenditore a cricchetto standard
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-avorio/80">
                Cricchetto in acciaio inox, cinghia in poliestere, gancio aperto zincato. Robusto e
                affidabile per il fissaggio del carico.
              </p>
              <div className="mt-7 flex flex-wrap items-baseline gap-3">
                <span className="font-display text-2xl font-bold text-primary">{price}</span>
                <span className="text-sm text-avorio/60">+ {shippingCost} di spedizione</span>
              </div>
              <p className="mt-1 text-xs text-avorio/40">
                Totale al checkout: {totalPrice} · quantità regolabile su Stripe.
              </p>
              <a
                href={stripePaymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-block rounded-md bg-primary px-7 py-4 font-display text-[15px] font-semibold uppercase tracking-[0.05em] text-navy no-underline"
              >
                Acquista ora
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* scheda tecnica */}
      <section className="bg-navy-deep px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionKicker label="Scheda tecnica" />
          <div className="mt-6 max-w-2xl overflow-hidden rounded-lg border border-avorio/[0.14]">
            {SCHEDA_TECNICA.map((row, i) => (
              <div
                key={row.label}
                className={`flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
                  i % 2 === 0 ? "bg-navy" : "bg-navy-deep"
                }`}
              >
                <span className="text-[13px] uppercase tracking-[0.06em] text-avorio/55">{row.label}</span>
                <span className="text-[15px] font-semibold text-avorio">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
