import type { Metadata } from "next";
import { SectionKicker } from "@/components/SectionKicker";
import { PreferenzeCookie } from "./PreferenzeCookie";

export const metadata: Metadata = {
  title: "Preferenze cookie",
  description: "Gestisci o revoca il consenso ai cookie su Di Riso Teloni / Italia Coperta.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/preferenze-cookie" },
};

export default function PreferenzeCookiePage() {
  return (
    <main className="bg-navy-deep px-6 py-24 md:px-10">
      <div className="mx-auto max-w-2xl">
        <SectionKicker label="Note legali" />
        <h1 className="font-display text-4xl font-bold uppercase leading-none text-avorio md:text-5xl">
          Preferenze cookie
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-avorio/80">
          Gestisci il consenso ai cookie. Puoi cambiare o revocare la tua scelta in qualsiasi momento da questa
          pagina.
        </p>
      </div>
      <div className="mt-10">
        <PreferenzeCookie />
      </div>
    </main>
  );
}
