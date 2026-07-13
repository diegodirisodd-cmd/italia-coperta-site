// TEMPORARY verification script for Block 1 (spec §2 branching).
// Run: node --experimental-strip-types scripts/verify-branching.ts
//
// Prints the dynamic step path getVisibleSteps() produces for a few macro
// categories, so the branching (Riparazione skips Colore telo + Misure;
// Sostituzione skips only Colore telo) can be eyeballed before Block 2.
// Delete once the wizard UI is verified end-to-end.

import { getVisibleSteps, initialState, STEP_ORDER } from "../lib/configuratore/reducer.ts";
import type { ConfiguratoreState, MacroCategoria } from "../lib/configuratore/types.ts";

function pathFor(macro: MacroCategoria | null): string[] {
  const state: ConfiguratoreState = { ...initialState, macroCategoria: macro };
  return getVisibleSteps(state);
}

const scenarios: { label: string; macro: MacroCategoria | null }[] = [
  { label: "Nessuna scelta (stato iniziale)", macro: null },
  { label: "Telo completo", macro: "telo-completo" },
  { label: "Solo laterali", macro: "solo-laterali" },
  { label: "Portellone", macro: "portellone" },
  { label: "Accessori vari", macro: "accessori" },
  { label: "Sostituzione componenti", macro: "sostituzione" },
  { label: "Riparazione", macro: "riparazione" },
];

console.log("STEP_ORDER (9 step totali):");
console.log("  " + STEP_ORDER.join(" → "));
console.log("");

for (const { label, macro } of scenarios) {
  const path = pathFor(macro);
  const skipped = STEP_ORDER.filter((s) => !path.includes(s));
  console.log(`▸ ${label}`);
  console.log(`    percorso (${path.length} step): ${path.join(" → ")}`);
  console.log(`    saltati: ${skipped.length ? skipped.join(", ") : "—"}`);
  console.log("");
}
