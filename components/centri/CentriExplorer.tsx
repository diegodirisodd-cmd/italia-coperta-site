"use client";

import { useState } from "react";
import Link from "next/link";
import { CENTRI, type Centro } from "@/lib/centri";
import { ITALY_PATH_MAINLAND, ITALY_PATH_SICILY, ITALY_PATH_SARDINIA } from "@/components/ItaliaEmblem";
import { waLink } from "@/lib/site";

// Shared interactive map + list + detail, used by the home preview and the
// full /centri page so the two never drift.
export function CentriExplorer({ footerHref }: { footerHref?: string }) {
  const [activeId, setActiveId] = useState<string>("angri");
  const active = CENTRI.find((c) => c.id === activeId) ?? CENTRI[0];
  const isAttivo = active.stato === "attivo";

  return (
    <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
      {/* MAP */}
      <div className="relative mx-auto w-full max-w-[440px]" style={{ aspectRatio: "260 / 380" }}>
        <svg viewBox="0 0 260 380" className="block h-full w-full drop-shadow-[0_16px_32px_rgba(0,0,0,0.4)]">
          <defs>
            <linearGradient id="icMapFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#12335c" />
              <stop offset="1" stopColor="#081A33" />
            </linearGradient>
          </defs>
          <path d={ITALY_PATH_MAINLAND} fill="url(#icMapFill)" stroke="#C9A227" strokeWidth={1.4} />
          <path d={ITALY_PATH_SICILY} fill="url(#icMapFill)" stroke="#C9A227" strokeWidth={1.4} />
          <path d={ITALY_PATH_SARDINIA} fill="url(#icMapFill)" stroke="#C9A227" strokeWidth={1.4} />
        </svg>
        {CENTRI.map((c) => (
          <MapPin key={c.id} centro={c} active={c.id === activeId} onSelect={() => setActiveId(c.id)} />
        ))}
      </div>

      {/* LIST + DETAIL */}
      <div>
        <div className="mb-6 flex flex-col gap-px border border-oro/20 bg-oro/[0.14]">
          {CENTRI.map((c) => {
            const sel = c.id === activeId;
            const attivo = c.stato === "attivo";
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`flex items-center justify-between gap-3 px-4 py-4 text-left transition-colors ${
                  sel ? "bg-navy-deep" : "bg-navy"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="h-2 w-2 flex-none rounded-full"
                    style={{ background: attivo ? "#C9A227" : "rgba(243,233,204,.3)" }}
                  />
                  <span className="font-display text-base font-semibold uppercase tracking-[0.02em] text-avorio">
                    {c.citta}
                  </span>
                </span>
                <span
                  className="text-[11px] uppercase tracking-[0.12em]"
                  style={{ color: attivo ? "#C9A227" : "rgba(243,233,204,.4)" }}
                >
                  {attivo ? c.tipo : "Prossima apertura"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg border border-oro/30 bg-navy-deep p-7">
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.2em] text-oro">
            {isAttivo ? active.tipo : "Prossima apertura"}
          </span>
          <h3 className="mb-3.5 font-display text-3xl font-bold uppercase text-avorio">{active.citta}</h3>

          {isAttivo ? (
            <div className="flex flex-col gap-2.5 text-[15px] text-avorio/80">
              <div>{active.indirizzo}</div>
              <div className="font-semibold text-oro">{active.servizi}</div>
              <div className="font-display text-xl font-semibold tracking-[0.03em] text-avorio">{active.tel}</div>
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href={waLink(`Ciao Di Riso Teloni, vorrei informazioni dalla sede di ${active.citta}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-oro px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-navy no-underline"
                >
                  Scrivi su WhatsApp
                </a>
                <a
                  href={`tel:${active.tel.replace(/\s/g, "")}`}
                  className="rounded-md border-[1.5px] border-avorio/40 px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-avorio no-underline"
                >
                  Chiama
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 text-[15px] text-avorio/80">
              <div>
                Stiamo ampliando la rete <span className="text-oro">Italia Coperta</span> in{" "}
                <strong className="text-avorio">{active.area}</strong>. Nel frattempo, serviamo tutta l&apos;area
                dalle sedi di Angri e Brescia.
              </div>
              <Link
                href="/diventa-centro"
                className="mt-1 inline-block w-fit rounded-md border-[1.5px] border-oro/50 px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.05em] text-oro no-underline"
              >
                Diventa centro qui →
              </Link>
            </div>
          )}

          {footerHref && (
            <Link
              href={footerHref}
              className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-oro no-underline"
            >
              Vedi tutti i centri →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function MapPin({ centro, active, onSelect }: { centro: Centro; active: boolean; onSelect: () => void }) {
  const attivo = centro.stato === "attivo";
  const size = active ? 26 : 18;
  const bg = active ? "#C9A227" : attivo ? "#C9A227" : "#0B2545";
  const border = active ? "#F3E9CC" : attivo ? "#C9A227" : "rgba(201,162,39,.55)";
  const dot = active || attivo ? "#0B2545" : "#C9A227";

  return (
    <button
      onClick={onSelect}
      aria-label={centro.citta}
      className="absolute -translate-x-1/2 -translate-y-full border-none bg-transparent p-0"
      style={{ left: `${centro.x}%`, top: `${centro.y}%`, zIndex: active ? 6 : attivo ? 4 : 3, opacity: attivo || active ? 1 : 0.8 }}
    >
      <span className="relative block" style={{ width: size, height: size }}>
        {active && (
          <span className="absolute left-1/2 top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 animate-ic-pulse rounded-full bg-oro" />
        )}
        <span
          className="absolute inset-0 rounded-[50%_50%_50%_0] shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
          style={{ transform: "rotate(-45deg)", background: bg, border: `2px solid ${border}` }}
        />
        <span
          className="absolute left-1/2 top-[44%] h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: dot }}
        />
      </span>
      {active && (
        <span className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-oro px-2.5 py-1 font-display text-xs font-semibold uppercase tracking-[0.04em] text-navy">
          {centro.citta}
        </span>
      )}
    </button>
  );
}
