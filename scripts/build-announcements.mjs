// Turn the weekly announcements PDF (exported from PowerPoint) into the
// images + manifest behind /announcements.
//
//   node scripts/build-announcements.mjs "<file.pdf>" --date 2026-10-25 --skip 1,6,8
//
// --date  the Sunday these announcements run (shown as "Updated …")
// --skip  page numbers to leave off the public page (default: none). Always
//         skip the prayer-request slide: it lists names and health needs.
//
// Needs `pdftoppm` (poppler) on PATH. Writes public/announcements/NN.webp and
// lib/announcements.json (title / alt / details start blank — fill them in).
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "../node_modules/sharp/dist/index.mjs";

const args = process.argv.slice(2);
const pdf = args[0];
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const date = flag("date");
const skip = new Set((flag("skip") ?? "").split(",").filter(Boolean).map(Number));

if (!pdf || pdf.startsWith("--") || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error('usage: node scripts/build-announcements.mjs "<file.pdf>" --date yyyy-mm-dd [--skip 1,6,8]');
  process.exit(1);
}

const tmp = mkdtempSync(path.join(os.tmpdir(), "announce-"));
// 144 dpi on a 960x540pt slide = 1920x1080.
execFileSync("pdftoppm", ["-r", "144", "-png", pdf, path.join(tmp, "p")]);
const pages = readdirSync(tmp)
  .filter((f) => f.endsWith(".png"))
  .sort((a, b) => parseInt(a.match(/(\d+)/)[1]) - parseInt(b.match(/(\d+)/)[1]));

const outDir = path.join("public", "announcements");
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const slides = [];
for (let i = 0; i < pages.length; i++) {
  if (skip.has(i + 1)) continue;
  const name = `${String(slides.length + 1).padStart(2, "0")}.webp`;
  await sharp(path.join(tmp, pages[i])).resize({ width: 1920 }).webp({ quality: 82 }).toFile(path.join(outDir, name));
  slides.push({ id: `slide-${slides.length + 1}`, file: name, title: "", alt: "", details: [] });
}
rmSync(tmp, { recursive: true, force: true });

writeFileSync(path.join("lib", "announcements.json"), JSON.stringify({ date, slides }, null, 2) + "\n");
console.log(`Wrote ${slides.length} slides (skipped ${[...skip].join(", ") || "none"}). Now fill in title/alt/details in lib/announcements.json.`);
