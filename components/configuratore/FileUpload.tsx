"use client";

import { useId, useRef, useState } from "react";
import { useConfiguratore } from "./ConfiguratoreProvider";

/**
 * Upload control for the wizard. Uploads the picked file immediately to the
 * private `configuratore-uploads` bucket (via /api/configuratore/upload, small
 * per-file requests) and keeps only the returned storage path in the wizard
 * state (`value`) — serializable, so it survives a reload. The submit step turns
 * these paths into signed URLs for the notification email.
 */
export function FileUpload({
  label,
  slot,
  value,
  onChange,
  accept,
}: {
  label: string;
  slot: string;
  /** Stored storage path (empty when nothing uploaded). */
  value: string;
  onChange: (path: string) => void;
  accept?: string;
}) {
  const { state } = useConfiguratore();
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const displayName = name || (value ? value.split("/").pop() ?? value : "");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    if (file.size > 10 * 1024 * 1024) {
      setStatus("error");
      setError("File troppo grande (max 10 MB).");
      return;
    }
    setStatus("uploading");
    setName(file.name);
    try {
      const fd = new FormData();
      fd.append("reference", state.reference);
      fd.append("slot", slot);
      fd.append("file", file);
      const res = await fetch("/api/configuratore/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("upload");
      const json = (await res.json()) as { path: string };
      onChange(json.path);
      setStatus("idle");
    } catch {
      setStatus("error");
      setError("Upload non riuscito, riprova.");
      setName("");
    }
  }

  function clear() {
    onChange("");
    setName("");
    setStatus("idle");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-avorio/60">{label}</span>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="flex items-center justify-between gap-3 rounded-md border-[1.5px] border-primary/40 bg-navy-deep px-4 py-3">
          <span className="flex min-w-0 items-center gap-2 text-sm text-avorio">
            <FileIcon />
            <span className="truncate">{displayName}</span>
          </span>
          <button
            type="button"
            onClick={clear}
            className="flex-none text-[11px] font-semibold uppercase tracking-[0.12em] text-primary hover:text-primary-light"
          >
            Rimuovi
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-md border-[1.5px] border-dashed border-avorio/25 bg-navy-deep px-4 py-3 text-sm text-avorio/60 transition-colors hover:border-primary/60 hover:text-avorio"
        >
          {status === "uploading" ? (
            <>
              <Spinner />
              Caricamento…
            </>
          ) : (
            <>
              <UploadIcon />
              Carica file
            </>
          )}
        </label>
      )}

      {status === "error" ? (
        <span className="mt-1 block text-[11px] text-primary-light">{error}</span>
      ) : (
        <span className="mt-1 block text-[11px] text-avorio/35">Immagini o PDF, max 10 MB.</span>
      )}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none text-primary">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin text-primary">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
