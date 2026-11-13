"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { TEL_DISPLAY, waLink } from "@/lib/site";

// Pages with their own bottom actions (wizard / form) — the bar would compete.
const HIDDEN_ON = ["/configuratore", "/preventivo"];

/**
 * Mobile-only bar with WhatsApp + Chiama, shown once the visitor scrolls past
 * the hero. Truckers decide on the phone: the shortest path to a conversation
 * should always be one tap away.
 */
export function MobileContactBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-[65] border-t border-primary/30 bg-navy-black/95 px-3 pt-2.5 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={waLink("Ciao Di Riso Teloni, vorrei informazioni su un telone.")}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-primary font-display text-[14px] font-semibold uppercase tracking-[0.05em] text-navy no-underline"
        >
          <MessageCircle size={18} strokeWidth={2.25} /> WhatsApp
        </a>
        <a
          href={`tel:${TEL_DISPLAY.replace(/\s/g, "")}`}
          tabIndex={visible ? 0 : -1}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-md border-[1.5px] border-avorio/40 font-display text-[14px] font-semibold uppercase tracking-[0.05em] text-avorio no-underline"
        >
          <Phone size={18} strokeWidth={2.25} /> Chiama
        </a>
      </div>
    </div>
  );
}
