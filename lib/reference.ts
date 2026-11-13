/**
 * Reference della richiesta (SECURITY-AUDIT.md — S-10).
 *
 * Prima veniva coniato dal client con Date.now() + Math.random() e il server
 * lo accettava così com'era, pur usandolo come cartella di storage. Ora lo
 * genera il server con crypto.randomUUID() e il formato viene validato prima
 * di ogni uso.
 *
 * Nessun guard `server-only`: il formato serve anche al client per capire se
 * il valore che ha in localStorage è ancora utilizzabile. La GENERAZIONE resta
 * server-side (crypto.randomUUID non è esposto qui per il client).
 */

/** `IC-` + 8 caratteri esadecimali maiuscoli. */
export const REFERENCE_RE = /^IC-[0-9A-F]{8}$/;

export function isValidReference(v: unknown): v is string {
  return typeof v === "string" && REFERENCE_RE.test(v);
}

/**
 * Nuovo reference. Da usare SOLO lato server (route handler): il client lo
 * riceve da /api/configuratore/reference all'avvio del wizard.
 */
export function newReference(): string {
  return "IC-" + crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
}

/**
 * Tiene solo gli allegati che stanno nella cartella di QUESTA richiesta
 * (S-09). I path arrivano dallo stato inviato dal client, che potrebbe
 * puntarli altrove nel bucket per farsi firmare i file di un'altra richiesta.
 */
export function allegatiDelReference<T extends { path: string }>(
  allegati: readonly T[],
  reference: string,
): T[] {
  if (!isValidReference(reference)) return [];
  const prefisso = `${reference}/`;
  return allegati.filter(
    (a) =>
      typeof a.path === "string" &&
      a.path.startsWith(prefisso) &&
      // niente risalite di directory dopo il prefisso
      !a.path.slice(prefisso.length).includes("..") &&
      a.path.length > prefisso.length,
  );
}
