"use client";

// Small shared field primitives for the wizard steps, matching the styling
// established in the earlier steps. Kept lightweight (no state of their own).

import type { ReactNode } from "react";

export function StepHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <header className="mx-auto max-w-xl text-center">
      <h2 className="font-display text-3xl font-bold uppercase tracking-[0.02em] text-primary md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-avorio/70">{sub}</p>
    </header>
  );
}

export function Legend({ children }: { children: ReactNode }) {
  return (
    <legend className="mb-3 text-[11px] uppercase tracking-[0.2em] text-avorio/50">{children}</legend>
  );
}

/**
 * Single option button. `variant`:
 *  - "radio" → circle indicator (single-select)
 *  - "check" → square indicator (multi-select)
 */
export function OptionButton({
  label,
  desc,
  selected,
  onClick,
  variant = "radio",
}: {
  label: string;
  desc?: string;
  selected: boolean;
  onClick: () => void;
  variant?: "radio" | "check";
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={[
        "flex min-h-[44px] items-center gap-3 rounded-md border-[1.5px] bg-navy-deep px-4 py-3 text-left transition-colors",
        selected ? "border-primary" : "border-avorio/[0.14] hover:border-primary/60",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-4 w-4 flex-none items-center justify-center border-[1.5px]",
          variant === "radio" ? "rounded-full" : "rounded",
          selected ? "border-primary" : "border-avorio/35",
        ].join(" ")}
        aria-hidden="true"
      >
        {selected &&
          (variant === "radio" ? (
            <span className="h-2 w-2 rounded-full bg-primary" />
          ) : (
            <span className="text-[11px] font-bold leading-none text-primary">✓</span>
          ))}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-avorio">{label}</span>
        {desc && <span className="mt-0.5 block text-[12px] text-avorio/55">{desc}</span>}
      </span>
    </button>
  );
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-avorio/60">
        {label}
        {required && <span className="text-primary"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none transition-colors placeholder:text-avorio/30 focus:border-primary"
      />
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-avorio/60">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-md border-[1.5px] border-avorio/20 bg-navy-deep px-4 py-3 text-avorio outline-none transition-colors placeholder:text-avorio/30 focus:border-primary"
      />
    </label>
  );
}

export function CheckboxRow({
  label,
  checked,
  onChange,
  required,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  required?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 flex-none accent-primary"
      />
      <span className="text-sm text-avorio">
        {label}
        {required && <span className="text-primary"> *</span>}
      </span>
    </label>
  );
}
