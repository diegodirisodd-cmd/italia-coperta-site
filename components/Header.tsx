"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X, MessageCircle, Phone } from "lucide-react";
import { TEL_DISPLAY, waLink } from "@/lib/site";

const NAV_LINKS = [
  { href: "/azienda", label: "Azienda" },
  { href: "/negozio/tenditore-cricchetto", label: "Negozio" },
  { href: "/settori", label: "Settori" },
  { href: "/configuratore", label: "Configuratore" },
  { href: "/centri", label: "Centri" },
  { href: "/riparazione-rapida", label: "Riparazione" },
];

const telHref = `tel:${TEL_DISPLAY.replace(/\s/g, "")}`;

/**
 * Full nav from xl (1280px) up. Below that a hamburger opens a full-screen
 * panel — the old horizontally-scrolling nav showed a visible scrollbar on
 * Windows/laptop widths and cut off the "Richiedi preventivo" CTA.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Close on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Scroll lock, Esc to close, focus trap while the panel is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = () =>
      panel
        ? Array.from(panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"))
        : [];
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [toggleRef.current, ...focusables()].filter(Boolean) as HTMLElement[];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Close if the viewport grows past the breakpoint while open.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className="sticky top-0 z-[70] border-b border-primary/[0.24] bg-navy-deep/[0.86] backdrop-blur-md"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-3 md:px-10 md:py-3.5">
        <Link href="/" className="flex flex-none items-center gap-3 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-diriso-teloni.svg"
            alt="Di Riso Teloni — Italia Coperta"
            width={1230}
            height={693}
            className="h-10 w-auto md:h-11"
          />
          <span className="hidden text-[9.5px] leading-none tracking-[0.34em] text-avorio/55 sm:block">
            ITALIA COPERTA · DAL 1950
          </span>
        </Link>

        {/* Desktop nav (xl+) */}
        <nav aria-label="Principale" className="hidden items-center gap-7 xl:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`flex min-h-[44px] items-center whitespace-nowrap text-[13px] tracking-[0.04em] no-underline transition-colors hover:text-avorio ${
                isActive(link.href) ? "text-avorio" : "text-avorio/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/preventivo"
            className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded bg-primary px-5 py-[11px] font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-navy no-underline"
          >
            Richiedi preventivo
          </Link>
        </nav>

        {/* Compact bar (< xl): preventivo CTA always visible + hamburger */}
        <div className="flex items-center gap-2 xl:hidden">
          <Link
            href="/preventivo"
            className="hidden min-h-[44px] items-center whitespace-nowrap rounded bg-primary px-4 font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-navy no-underline min-[350px]:inline-flex"
          >
            Preventivo
          </Link>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded border-[1.5px] border-avorio/30 text-avorio transition-colors hover:border-primary/70"
          >
            {open ? <X size={22} strokeWidth={2.25} /> : <Menu size={22} strokeWidth={2.25} />}
          </button>
        </div>
      </div>

      {/* Full-screen panel (< xl) */}
      <div
        id="menu-mobile"
        ref={panelRef}
        hidden={!open}
        className="absolute inset-x-0 top-full h-[100dvh] overflow-y-auto overscroll-contain border-t border-primary/20 bg-navy-black px-6 pb-32 pt-6 xl:hidden"
      >
        <nav aria-label="Menu" className="mx-auto flex max-w-md flex-col">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`flex min-h-[56px] items-center justify-between border-b border-avorio/10 font-display text-2xl font-semibold uppercase tracking-[0.03em] no-underline ${
                isActive(link.href) ? "text-primary" : "text-avorio"
              }`}
            >
              {link.label}
              <span aria-hidden className="text-primary">→</span>
            </Link>
          ))}
          <Link
            href="/preventivo"
            onClick={() => setOpen(false)}
            className="mt-8 flex min-h-[52px] items-center justify-center rounded-md bg-primary font-display text-base font-semibold uppercase tracking-[0.06em] text-navy no-underline"
          >
            Richiedi preventivo
          </Link>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <a
              href={waLink("Ciao Di Riso Teloni, vorrei informazioni.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-md border-[1.5px] border-avorio/30 font-display text-sm font-semibold uppercase tracking-[0.05em] text-avorio no-underline"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a
              href={telHref}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-md border-[1.5px] border-avorio/30 font-display text-sm font-semibold uppercase tracking-[0.05em] text-avorio no-underline"
            >
              <Phone size={18} /> Chiama
            </a>
          </div>
          <p className="mt-6 text-center text-sm text-avorio/60">
            Rilievo misure gratuito in tutta Italia ·{" "}
            <span className="whitespace-nowrap">{TEL_DISPLAY}</span>
          </p>
        </nav>
      </div>
    </header>
  );
}
