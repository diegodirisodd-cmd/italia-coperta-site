import { test } from "node:test";
import assert from "node:assert/strict";
import { frameForProgress, loadOrder, nearestLoaded, coverRect, frameUrl } from "./heroSequence.ts";

test("frameForProgress agli estremi e con clamp", () => {
  assert.equal(frameForProgress(0, 150), 1);
  assert.equal(frameForProgress(1, 150), 150);
  assert.equal(frameForProgress(0.5, 150), 75);
  assert.equal(frameForProgress(-0.2, 150), 1);
  assert.equal(frameForProgress(1.7, 150), 150);
  assert.equal(frameForProgress(Number.NaN, 150), 1);
});

test("loadOrder: prima un fotogramma ogni 8, poi tutti, senza duplicati", () => {
  const o = loadOrder(150);
  assert.deepEqual(o.slice(0, 3), [1, 9, 17]);
  assert.equal(o.length, 150);
  assert.equal(new Set(o).size, 150);
  assert.ok(o.includes(150));
});

test("nearestLoaded: mai vuoto se qualcosa è caricato", () => {
  assert.equal(nearestLoaded(50, new Set([1, 49, 57])), 49);
  assert.equal(nearestLoaded(53, new Set([49, 57])), 49);
  assert.equal(nearestLoaded(57, new Set([49, 57])), 57);
  assert.equal(nearestLoaded(10, new Set()), null);
});

test("coverRect ritaglia centrato per schermi più stretti o più larghi", () => {
  assert.deepEqual(coverRect(1920, 1080, 1080, 1080), { sx: 420, sy: 0, sw: 1080, sh: 1080 });
  assert.deepEqual(coverRect(1920, 1080, 1920, 1080), { sx: 0, sy: 0, sw: 1920, sh: 1080 });
  assert.deepEqual(coverRect(1080, 1440, 1080, 720), { sx: 0, sy: 360, sw: 1080, sh: 720 });
});

test("frameUrl a 4 cifre", () => {
  assert.equal(frameUrl("mobile", 7), "/sequenze/hero/mobile/0007.webp");
  assert.equal(frameUrl("desktop", 150), "/sequenze/hero/desktop/0150.webp");
});
