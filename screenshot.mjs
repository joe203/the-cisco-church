// Screenshot helper: node screenshot.mjs <url> [label]
// Labels containing "mobile" shoot at 390px, "slides" at 1920x1080,
// everything else at 1440px. Full-page except slides.
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { launch } from "puppeteer-core";

const CHROME =
  "C:/Users/joeca/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe";
const OUT_DIR = "./temporary screenshots";

const url = process.argv[2] ?? "http://localhost:3000";
const label = process.argv[3] ?? "";

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
const n =
  readdirSync(OUT_DIR).filter((f) => f.startsWith("screenshot-")).length + 1;
const name = label ? `screenshot-${n}-${label}` : `screenshot-${n}`;

const isMobile = label.includes("mobile");
const isSlides = label.includes("slides");
const viewport = isMobile
  ? { width: 390, height: 844 }
  : isSlides
    ? { width: 1920, height: 1080 }
    : { width: 1440, height: 900 };

const browser = await launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setViewport(viewport);
if (label.includes("reduced")) {
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
}
await page.goto(url, { waitUntil: "networkidle0", timeout: 45000 });
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({
  path: `${OUT_DIR}/${name}.png`,
  fullPage: !isSlides,
  // Resize-viewport capture so CSS view() scroll animations complete —
  // captureBeyondViewport renders unscrolled regions in their pre-entry state.
  captureBeyondViewport: false,
});
await browser.close();
console.log(`${OUT_DIR}/${name}.png`);
