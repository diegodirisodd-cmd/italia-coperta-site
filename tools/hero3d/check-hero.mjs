// Controlli in browser dell'hero 3D (Task 7). Richiede `npm run build && npx next start -p 3111` attivo.
// Uso: node tools/hero3d/check-hero.mjs
import { chromium } from "playwright";

const URL = process.env.HERO_URL || "http://localhost:3111/";
const risultati = [];
const ok = (nome, cond, info = "") => risultati.push(`${cond ? "ok  " : "NO  "} ${nome}${info ? " — " + info : ""}`);
const browser = await chromium.launch({ channel: "chrome" });

async function pagina(viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, ...opts });
  const page = await ctx.newPage();
  const richieste = [];
  page.on("request", (r) => r.url().includes("/sequenze/hero/") && richieste.push(r.url()));
  return { ctx, page, richieste };
}

async function centroNonNero(page) {
  return page.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return false;
    const d = c.getContext("2d").getImageData(c.width / 2, c.height / 2, 1, 1).data;
    return d[0] + d[1] + d[2] > 30;
  });
}

for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const tag = `${vp.width}x${vp.height}`;
  const { ctx, page } = await pagina(vp);
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  // (a) H1 e CTA nel DOM al primo paint
  const h1 = await page.locator("h1").first().textContent();
  const cta = await page.locator('a[href="/preventivo"]').count();
  const conf = await page.locator('a[href="/configuratore"]').count();
  ok(`(a) ${tag} H1 e CTA presenti`, /Teli per bilico/.test(h1 || "") && cta > 0 && conf > 0);
  // (b) dopo scroll al 50% il canvas ha pixel non neri al centro
  await page.waitForTimeout(2500);
  await page.evaluate(() => {
    const s = document.getElementById("top");
    window.scrollTo(0, (s.offsetHeight - innerHeight) * 0.5);
  });
  await page.waitForTimeout(2000);
  ok(`(b) ${tag} canvas disegnato a metà`, await centroNonNero(page));
  await ctx.close();
}

// (i) senza interazione nessun fotogramma nei primi 3 s (non compete con LCP)
{
  const { ctx, page, richieste } = await pagina({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(3000);
  const seq = richieste.filter((u) => /\/(desktop|mobile)\/\d{4}\.webp/.test(u)).length;
  ok("(i) nessun fotogramma prima dell'interazione", seq === 0, `${seq} richieste`);
  await ctx.close();
}

// (c) riduci movimento: niente canvas
{
  const { ctx, page } = await pagina({ width: 1440, height: 900 }, { reducedMotion: "reduce" });
  await page.goto(URL, { waitUntil: "networkidle" });
  ok("(c) reduced motion senza canvas", (await page.locator("canvas").count()) === 0);
  await ctx.close();
}

// (d) pagina caricata già scrollata al 60%: il primo fotogramma della sequenza richiesto non è lo 0001
{
  const { ctx, page, richieste } = await pagina({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    const s = document.getElementById("top");
    window.scrollTo(0, (s.offsetHeight - innerHeight) * 0.6);
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  const primo = richieste.find((u) => /\/(desktop|mobile)\/\d{4}\.webp/.test(u)) || "";
  ok("(d) ripristino a metà: primo fotogramma ≠ 0001", primo !== "" && !primo.endsWith("/0001.webp"), primo.split("/").pop());
  await ctx.close();
}

// (e) cambio altezza tipo barra iOS: la sezione non cambia offset del contenuto
{
  const { ctx, page } = await pagina({ width: 390, height: 664 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  const top1 = await page.evaluate(() => document.querySelector("h1").getBoundingClientRect().top);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  const top2 = await page.evaluate(() => document.querySelector("h1").getBoundingClientRect().top);
  ok("(e) barra iOS: H1 non salta", Math.abs(top1 - top2) < 2, `${top1} → ${top2}`);
  await ctx.close();
}

// (f) scheda nascosta: nessuna nuova richiesta di fotogrammi per 3 s
{
  const { ctx, page, richieste } = await pagina({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.mouse.wheel(0, 40); // fa partire il caricamento
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(800); // lascia finire il lotto in corso
  const prima = richieste.length;
  await page.waitForTimeout(3000);
  ok("(f) scheda nascosta: download in pausa", prima > 0 && richieste.length === prima, `${prima} → ${richieste.length}`);
  await ctx.close();
}

// (g) in cima alla pagina un solo set di CTA dell'hero è raggiungibile (gli strati invisibili sono inert)
{
  const { ctx, page } = await pagina({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const n = await page.evaluate(
    () => [...document.querySelectorAll('#top a[href="/configuratore"]')].filter((a) => !a.closest("[inert]")).length,
  );
  ok("(g) CTA invisibili non raggiungibili da tastiera", n === 1, `${n} raggiungibili`);
  await ctx.close();
}

// (h) riduci movimento: nessun salto di layout (altezza sezione già finale prima e dopo l'idratazione)
{
  const { ctx, page } = await pagina({ width: 1440, height: 900 }, { reducedMotion: "reduce", javaScriptEnabled: false });
  await page.goto(URL, { waitUntil: "load" }); // a domcontentloaded il CSS può non essere ancora applicato
  const prima = await page.evaluate(() => document.getElementById("top").offsetHeight);
  await ctx.close();
  const b = await pagina({ width: 1440, height: 900 }, { reducedMotion: "reduce" });
  await b.page.goto(URL, { waitUntil: "networkidle" });
  const dopo = await b.page.evaluate(() => document.getElementById("top").offsetHeight);
  ok("(h) riduci movimento senza salto di layout", Math.abs(prima - dopo) < 4, `${prima} → ${dopo}`);
  await b.ctx.close();
}

await browser.close();
console.log(risultati.join("\n"));
const passati = risultati.filter((r) => r.startsWith("ok")).length;
console.log(`${passati}/${risultati.length} ok`);
process.exit(passati === risultati.length ? 0 : 1);
