"use client";

import { useId, useRef } from "react";

/**
 * Reusable upload control for the wizard. For now it only captures the selected
 * file name for display — the actual upload to Supabase storage is wired at
 * submit time in a later block. Kept serializable (name string) so it fits the
 * localStorage-persisted wizard state.
 */
export function FileUpload({
  label,
  fileName,
  onChange,
  accept,
}: {
  label: string;
  fileName: string;
  onChange: (name: string) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  return (
    <div>
      <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-avorio/60">{label}</span>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")}
      />
      {fileName ? (
        <div className="flex items-center justify-between gap-3 rounded-md border-[1.5px] border-primary/40 bg-navy-deep px-4 py-3">
          <span className="flex min-w-0 items-center gap-2 text-sm text-avorio">
            <FileIcon />
            <span className="truncate">{fileName}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              onChange("");
              if (inputRef.current) inputRef.current.value = "";
            }}
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
          <UploadIcon />
          Carica file
        </label>
      )}
      <span className="mt-1 block text-[11px] text-avorio/35">
        Il file viene allegato all&apos;invio della richiesta.
      </span>
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
