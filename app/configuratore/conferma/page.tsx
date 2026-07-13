import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfermaContent } from "./ConfermaContent";

export const metadata: Metadata = {
  title: "Richiesta inviata — Configuratore",
  description: "La tua richiesta è stata inviata a Di Riso Teloni.",
  robots: { index: false, follow: false },
};

export default function ConfermaPage() {
  return (
    <main className="bg-navy-deep px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={<div className="text-center text-avorio/50">Caricamento…</div>}>
          <ConfermaContent />
        </Suspense>
      </div>
    </main>
  );
}
