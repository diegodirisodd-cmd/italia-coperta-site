"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

/**
 * Widget Cloudflare Turnstile in modalità **Managed** (SECURITY-AUDIT.md —
 * S-02). Carica lo script una sola volta per pagina e restituisce il token al
 * form tramite `onToken`.
 *
 * Se NEXT_PUBLIC_TURNSTILE_SITE_KEY non è impostata il widget non viene
 * renderizzato e `onToken("")` lascia il form utilizzabile: lo sviluppo locale
 * continua a funzionare, e lato server la verifica è comunque saltata quando
 * manca TURNSTILE_SECRET_KEY.
 */

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          action?: string;
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("turnstile")));
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("turnstile"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export function Turnstile({
  onToken,
  action,
}: {
  onToken: (token: string) => void;
  /** Etichetta della form, utile nelle analytics di Cloudflare. */
  action?: string;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const id = useId();
  const [errore, setErrore] = useState(false);

  // `onToken` cambia identità a ogni render del form: la teniamo in un ref
  // così l'effetto di montaggio non ri-renderizza il widget a ogni battitura.
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  const emit = useCallback((t: string) => onTokenRef.current(t), []);

  useEffect(() => {
    if (!siteKey) {
      // Ambiente senza Turnstile configurato: sblocca comunque il form.
      emit("");
      return;
    }
    let annullato = false;

    loadScript()
      .then(() => {
        if (annullato || !ref.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          action,
          theme: "dark",
          callback: (token) => emit(token),
          "error-callback": () => {
            setErrore(true);
            emit("");
          },
          "expired-callback": () => emit(""),
        });
      })
      .catch(() => {
        if (!annullato) setErrore(true);
      });

    return () => {
      annullato = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          // widget già rimosso col nodo: niente da fare
        }
      }
    };
  }, [siteKey, action, emit]);

  if (!siteKey) return null;

  return (
    <div className="mt-4">
      <div ref={ref} id={id} />
      {errore && (
        <p className="mt-2 text-xs text-primary-light">
          Verifica anti-spam non caricata. Controlla la connessione e ricarica la pagina.
        </p>
      )}
    </div>
  );
}
