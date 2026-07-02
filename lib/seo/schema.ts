/**
 * Typed JSON-LD builders shared across pages. Render with:
 *   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dirisoteloni1950.com";

type PostalAddress = {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode?: string;
  addressCountry: string;
};

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Di Riso Teloni",
    alternateName: "Italia Coperta",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    foundingDate: "1950",
    slogan: "Italia Coperta",
    sameAs: [] as string[],
  };
}

const angriAddress: PostalAddress = {
  "@type": "PostalAddress",
  streetAddress: "Via dei Goti 183",
  addressLocality: "Angri",
  addressRegion: "SA",
  addressCountry: "IT",
};

// NB: the Brescia street address is not yet available, so it is intentionally
// left out of the structured data — only Angri carries a full PostalAddress.
// Brescia is still mentioned as a location by name in the description text.

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: "Di Riso Teloni",
    alternateName: "Italia Coperta",
    url: SITE_URL,
    foundingDate: "1950",
    description:
      "Teloni per camion su misura dal 1950 — bilici, motrici, rimorchi e furgoni centinati. Terza generazione, sedi ad Angri (SA) e Brescia.",
    address: angriAddress,
    location: [
      {
        "@type": "Place",
        name: "Di Riso Teloni — Sede principale, Angri (SA)",
        address: angriAddress,
      },
    ],
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: { "@type": "LocalBusiness", name: "Di Riso Teloni" },
    name: opts.name,
    description: opts.description,
    areaServed: opts.areaServed ?? "IT",
  };
}

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function jsonLdScriptProps(schema: unknown) {
  return { __html: JSON.stringify(schema) };
}
