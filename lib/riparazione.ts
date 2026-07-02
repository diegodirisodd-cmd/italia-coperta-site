// Data + helpers for the /riparazione-rapida service (booking, availability,
// FAQ). Server-safe (no React) so both the client widget and the API route
// share the same definitions.

export type Intervento = { id: string; label: string; tempo?: string };

export const INTERVENTI: Intervento[] = [
  { id: "strappo", label: "Strappo / foro nel telo", tempo: "~45 min" },
  { id: "occhielli", label: "Occhielli e cinghie", tempo: "~30 min" },
  { id: "telo-tetto", label: "Sostituzione telo tetto", tempo: "~2 ore" },
  { id: "centinato", label: "Riparazione centinato" },
  { id: "manutenzione", label: "Manutenzione generale" },
];

export const SEDI = [
  { id: "angri", label: "Angri (SA)" },
  { id: "brescia", label: "Brescia" },
] as const;

export const FASCE = [
  { id: "mattina", label: "Mattina · 8–13" },
  { id: "pomeriggio", label: "Pomeriggio · 14–18" },
] as const;

// Value proposition — tempi INDICATIVI, da confermare con i tempi reali Di Riso.
export const TEMPI = [
  { valore: "45 min", label: "Taglio o strappo nel telo" },
  { valore: "2 ore", label: "Sostituzione telo tetto" },
  { valore: "In giornata", label: "Interventi urgenti su appuntamento" },
];

export const FAQ_RIPARAZIONE: { question: string; answer: string }[] = [
  {
    question: "Che tipo di danni riparate?",
    answer:
      "Strappi e fori nel telo, occhielli e cinghie saltate, cuciture aperte, sostituzione di teli tetto e teli laterali, riparazione di centinati e piccole manutenzioni. Se il danno è troppo esteso, ti diciamo subito se conviene riparare o rifare il telo.",
  },
  {
    question: "Quanto costa una riparazione e come si paga?",
    answer:
      "Il costo dipende dal tipo e dall'estensione del danno: una riparazione di uno strappo parte da poche decine di euro, la sostituzione di un telo tetto è un intervento più importante. Ti diamo il preventivo prima di intervenire, senza sorprese. Si paga in sede al ritiro del mezzo.",
  },
  {
    question: "Quanto tempo ci vuole?",
    answer:
      "Molte riparazioni si fanno mentre aspetti: un taglio o uno strappo in genere in circa 45 minuti, la sostituzione di un telo tetto in circa 2 ore. I tempi esatti te li confermiamo al momento della prenotazione, in base all'intervento e alla sede.",
  },
  {
    question: "La riparazione tiene nel tempo?",
    answer:
      "Sì. Usiamo saldatura ad alta frequenza e materiali PVC compatibili con il telo originale, non semplici toppe incollate. La zona riparata torna a tenere acqua e vento come il resto del telo, e sui materiali diamo garanzia.",
  },
  {
    question: "Il colore della riparazione sarà uguale al telo?",
    answer:
      "Cerchiamo sempre la massima uniformità di colore usando teli della stessa tonalità. Su teli molto vecchi o sbiaditi dal sole una lieve differenza può restare visibile: è normale e non incide sulla tenuta. Ti avvisiamo prima se prevediamo uno stacco cromatico.",
  },
];

export type Giorno = { iso: string; dow: string; day: string };

const DOW = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

/** Next `count` working days (Sundays skipped) starting from tomorrow. */
export function buildGiorni(from: Date, count: number): Giorno[] {
  const out: Giorno[] = [];
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) continue; // skip Sunday
    out.push({ iso: d.toISOString().slice(0, 10), dow: DOW[d.getDay()], day: String(d.getDate()) });
  }
  return out;
}

/** Deterministic per-centre availability so the "calendario per centro" is
 *  meaningful before Supabase provides real slots. ~1 in 4 slots is full. */
export function slotDisponibile(sedeId: string, iso: string, fasciaId: string): boolean {
  const key = `${sedeId}|${iso}|${fasciaId}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % 4 !== 0;
}

export function labelIntervento(id: string): string {
  return INTERVENTI.find((i) => i.id === id)?.label ?? "—";
}
export function labelSede(id: string): string {
  return SEDI.find((s) => s.id === id)?.label ?? "—";
}
export function labelFascia(id: string): string {
  return FASCE.find((f) => f.id === id)?.label ?? "—";
}
