/**
 * Typed JSON-LD builders shared across pages. Render with:
 *   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
 */

import { AZIENDA, EMAIL, TEL_DISPLAY } from "@/lib/site";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dirisoteloni1950.com";
const TEL_E164 = `+${TEL_DISPLAY.replace(/\D/g, "")}`;

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
    // /logo.png never existed; the 512px brand icon is the real square logo.
    logo: `${SITE_URL}/icon-512.png`,
    foundingDate: "1950",
    slogan: "Italia Coperta",
    legalName: AZIENDA.ragioneSociale,
    vatID: `IT${AZIENDA.piva}`,
    email: EMAIL,
    telephone: TEL_E164,
  };
}

const angriAddress: PostalAddress = {
  "@type": "PostalAddress",
  streetAddress: "Via dei Goti 183",
  addressLocality: "Angri",
  addressRegion: "SA",
  postalCode: "84012",
  addressCountry: "IT",
};

// NB: Angri is the only physical sede with a street address, so it is the only
// one carrying a full PostalAddress. Lombardia is a coverage area (no fixed
// address) and is mentioned by name in the description text only.

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
      "Teloni per camion su misura dal 1950 — bilici, motrici, rimorchi e furgoni centinati. Terza generazione, sede ad Angri (SA) e copertura in Lombardia.",
    address: angriAddress,
    telephone: TEL_E164,
    email: EMAIL,
    image: `${SITE_URL}/images/hero-telone-rosso.jpg`,
    logo: `${SITE_URL}/icon-512.png`,
    legalName: AZIENDA.ragioneSociale,
    vatID: `IT${AZIENDA.piva}`,
    areaServed: { "@type": "Country", name: "Italia" },
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
    provider: { "@type": "LocalBusiness", "@id": `${SITE_URL}/#organization`, name: "Di Riso Teloni" },
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

/** Breadcrumb trail. `items` excludes Home, which is always prepended. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function productSchema(opts: {
  name: string;
  description: string;
  path: string;
  images: string[];
  brand: string;
  price: number;
  paymentUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    image: opts.images.map((src) => `${SITE_URL}${src}`),
    brand: { "@type": "Brand", name: opts.brand },
    url: `${SITE_URL}${opts.path}`,
    offers: {
      "@type": "Offer",
      price: opts.price.toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: opts.paymentUrl,
      seller: { "@id": `${SITE_URL}/#organization` },
    },
  };
}

export function jsonLdScriptProps(schema: unknown) {
  return { __html: JSON.stringify(schema) };
}
