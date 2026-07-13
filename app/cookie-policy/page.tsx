import type { Metadata } from "next";
import Link from "next/link";
import { LegalPlaceholder } from "@/components/legal/LegalPlaceholder";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Come Di Riso Teloni / Italia Coperta usa i cookie e come gestire il consenso.",
  robots: { index: false, follow: true },
};

export default function CookiePolicyPage() {
  return (
    <>
      <LegalPlaceholder
        title="Cookie Policy"
        intro="Questo sito usa esclusivamente cookie tecnici necessari al funzionamento. Non sono attivi cookie di profilazione o strumenti di tracciamento di terze parti; eventuali cookie di statistica verrebbero attivati solo previo tuo consenso."
      />
      <section className="bg-navy-deep px-6 pb-24 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/preferenze-cookie"
            className="inline-block rounded-md border-[1.5px] border-primary/50 px-6 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-primary no-underline transition-colors hover:border-primary"
          >
            Gestisci le preferenze cookie
          </Link>
        </div>
      </section>
    </>
  );
}
