import type { MetadataRoute } from "next";
import { SETTORI } from "@/lib/settori";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dirisoteloni1950.com";

const STATIC_ROUTES = [
  "",
  "/azienda",
  "/settori",
  "/configuratore",
  "/riparazione-rapida",
  "/centri",
  "/diventa-centro",
  "/contatti",
  "/preventivo",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    priority: route === "" ? 1 : 0.7,
  }));

  // Derived from the single source of truth so index, [slug] and sitemap
  // can never drift (lib/settori.ts).
  const settoreEntries: MetadataRoute.Sitemap = SETTORI.map((s) => ({
    url: `${SITE_URL}/settori/${s.slug}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  return [...staticEntries, ...settoreEntries];
}
