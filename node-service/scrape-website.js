// usage
// npm i -D playwright
// npx playwright install chromium

// node scrape-website.js https://example.com

// scrape-website.js
import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";

// Ensure a URL was passed
if (process.argv.length < 3) {
  console.error("Usage: node scrape-website.js <URL>");
  process.exit(1);
}

const url = process.argv[2];
const domain = new URL(url).hostname.replace(/^www\./, "");
const filename = `${domain}.html`;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: "networkidle" });

  // Get full page HTML after JS loads
  const html = await page.content();

  // Save HTML to file
  const outputPath = path.join(process.cwd(), filename);
  await fs.writeFile(outputPath, html, "utf-8");

  console.log(`✅ Saved HTML to ${outputPath}`);
  await browser.close();
})();
