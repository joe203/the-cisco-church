// Save a sermon's printable handouts as PDFs.
//
//   node scripts/build-handouts.mjs <sermon-slug> [guide|recap|outline|nuggets ...]
//
// Renders /downloads/<slug>/<piece> from the running dev server (so start
// `npm run dev` first) and writes public/downloads/<slug>/<piece>.pdf.
// Pieces a sermon can't supply (e.g. no nuggets yet) are skipped.
// Re-run after changing a sermon's outline or nuggets, then commit + deploy.
import { mkdirSync } from "node:fs";
import path from "node:path";
import { launch } from "puppeteer-core";

const CHROME =
  "C:/Users/joeca/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe";
const BASE = process.env.HANDOUT_BASE ?? "http://localhost:3000";
const ALL = ["guide", "recap", "outline", "nuggets"];

const [slug, ...requested] = process.argv.slice(2);
if (!slug) {
  console.error("usage: node scripts/build-handouts.mjs <sermon-slug> [guide|recap|outline|nuggets ...]");
  process.exit(1);
}
const pieces = requested.length ? requested : ALL;

const outDir = path.join("public", "downloads", slug);
mkdirSync(outDir, { recursive: true });

const browser = await launch({ executablePath: CHROME, headless: true });
try {
  for (const piece of pieces) {
    const page = await browser.newPage();
    const res = await page.goto(`${BASE}/downloads/${slug}/${piece}`, { waitUntil: "networkidle0" });
    if (!res || res.status() !== 200) {
      console.log(`skip  ${piece} (page returned ${res?.status() ?? "no response"})`);
      await page.close();
      continue;
    }
    await page.emulateMediaType("print");
    await page.evaluate(() => document.fonts.ready);
    const file = path.join(outDir, `${piece}.pdf`);
    await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true });
    console.log(`wrote ${file}`);
    await page.close();
  }
} finally {
  await browser.close();
}
