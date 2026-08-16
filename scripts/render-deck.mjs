// Render every slide of a deck to PNGs for review — e.g. to drag into
// Claude desktop, print, or archive.
//
//   node scripts/render-deck.mjs <deck-slug>
//
// Requires the dev server on localhost:3000. Output lands in
// slide_review/<deck-slug>/slide-NN.png (gitignored).
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { launch } from "puppeteer-core";

const CHROME =
  "C:/Users/joeca/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe";

const slug = process.argv[2];
if (!slug) {
  console.error("usage: node scripts/render-deck.mjs <deck-slug>");
  process.exit(1);
}

const outDir = path.join("slide_review", slug);
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const browser = await launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.goto(`http://localhost:3000/slides/${slug}`, {
  waitUntil: "networkidle2",
});
await new Promise((r) => setTimeout(r, 1500));

const count = await page.evaluate(() => {
  const counter = document.querySelector(".tabular-nums");
  return counter ? Number(counter.textContent.split("/")[1]) : 0;
});
if (!count) {
  console.error("Could not read slide count — is the dev server running?");
  await browser.close();
  process.exit(1);
}

for (let i = 1; i <= count; i++) {
  // Let the slide change commit (cross-fade + remount) before inspecting it,
  // or a staged slide reads as unstaged and gets shot mid-reveal.
  await new Promise((r) => setTimeout(r, 900));
  const hasStages = await page.evaluate(
    () => document.querySelectorAll(".slide-frame .stage").length > 0,
  );
  // Staged slides need time for every beat to land before the shot.
  if (hasStages) await new Promise((r) => setTimeout(r, 6200));
  const file = path.join(outDir, `slide-${String(i).padStart(2, "0")}.png`);
  await page.screenshot({ path: file });
  console.log(file);
  if (i < count) await page.keyboard.press("ArrowRight");
}

await browser.close();
console.log(`\n${count} slides rendered to ${outDir}`);
