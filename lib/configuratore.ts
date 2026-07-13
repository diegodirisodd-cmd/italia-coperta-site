// Configurator option catalogue + indicative pricing. Kept server-safe (no
// React) so both the client component and the /api/preventivo route can import
// it — the estimate is recomputed server-side at submit, never trusted from
// the client.

export type Opt = {
  id: string;
  label: string;
  desc?: string;
  /** Multiplier applied to the running base price. */
  factor?: number;
  /** Flat amount added to the base price (used by extras). */
  add?: number;
};

export const VEICOLI: (Opt & { base: number })[] = [
  { id: "bilico", label: "Bilico / Semirimorchio", base: 900 },
  { id: "motrice", label: "Motrice", base: 520 },
  { id: "rimorchio", label: "Rimorchio", base: 700 },
  { id: "furgone", label: "Furgone centinato", base: 460 },
];

export const TELI: Opt[] = [
  { id: "centinato", label: "Centinato (cappotta)", desc: "Telo ad archi, apertura a soffietto", factor: 1.0 },
  { id: "scorrevole", label: "Scorrevole / Curtain", desc: "Sponde laterali scorrevoli", factor: 1.25 },
  { id: "fisso", label: "Telo fisso", desc: "Copertura fissa ad alta tenuta", factor: 0.85 },
  { id: "isotermico", label: "Isotermico", desc: "Coibentato per la catena del freddo", factor: 1.6 },
];

export const MISURE: Opt[] = [
  { id: "standard", label: "Standard 13,6 m", factor: 1.0 },
  { id: "mega", label: "Mega — 3 m altezza", factor: 1.2 },
  { id: "ribassato", label: "Ribassato", factor: 0.95 },
  { id: "sumisura", label: "Su misura", factor: 1.1 },
];

export const MATERIALI: Opt[] = [
  { id: "pvc680", label: "PVC 680 g/m²", desc: "Standard, leggero e maneggevole", factor: 1.0 },
  { id: "pvc900", label: "PVC 900 g/m²", desc: "Alta resistenza per uso intenso", factor: 1.3 },
  { id: "ignifugo", label: "PVC ignifugo M2", desc: "Certificato per trasporti speciali", factor: 1.45 },
];

export const COLORI: { id: string; label: string; hex: string }[] = [
  { id: "navy", label: "Blu navy", hex: "#0B2545" },
  { id: "grigio", label: "Grigio acciaio", hex: "#6B7280" },
  { id: "rosso", label: "Rosso", hex: "#8f2d2d" },
  { id: "verde", label: "Verde", hex: "#2f5d3a" },
  { id: "bianco", label: "Bianco", hex: "#e8e5dc" },
  { id: "nero", label: "Nero", hex: "#1a1d24" },
];

export const EXTRA: Opt[] = [
  { id: "stampa", label: "Stampa logo aziendale", add: 220 },
  { id: "occhielli", label: "Occhielli rinforzati inox", add: 90 },
  { id: "antivento", label: "Rinforzo antivento", add: 120 },
  { id: "tasca", label: "Tasca portadocumenti", add: 40 },
  { id: "bande", label: "Bande rifrangenti", add: 70 },
  { id: "kit", label: "Kit riparazione incluso", add: 60 },
];

export type ConfiguratoreSelezione = {
  veicolo: string;
  telo: string;
  misura: string;
  materiale: string;
  colore: string;
  extra: string[];
};

function factorOf(list: Opt[], id: string): number {
  return list.find((o) => o.id === id)?.factor ?? 1;
}

export type Stima = { min: number; max: number; formatted: string };

/** Indicative, non-binding price range. Rounded to the nearest €50. */
export function stimaPrezzo(sel: Pick<ConfiguratoreSelezione, "veicolo" | "telo" | "misura" | "materiale" | "extra">): Stima {
  const base = VEICOLI.find((v) => v.id === sel.veicolo)?.base ?? 600;
  let price = base * factorOf(TELI, sel.telo) * factorOf(MISURE, sel.misura) * factorOf(MATERIALI, sel.materiale);
  const extraTotal = sel.extra.reduce((sum, id) => sum + (EXTRA.find((e) => e.id === id)?.add ?? 0), 0);
  price += extraTotal;

  const round50 = (n: number) => Math.round(n / 50) * 50;
  const min = round50(price * 0.9);
  const max = round50(price * 1.1);
  // Deterministic "." thousands separator — avoids SSR/client hydration
  // mismatches from Intl locale differences (Node ICU vs browser).
  const fmt = (n: number) => "€ " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return { min, max, formatted: `${fmt(min)} – ${fmt(max)}` };
}

export function labelOf(list: (Opt | { id: string; label: string })[], id: string): string {
  return list.find((o) => o.id === id)?.label ?? "—";
}
