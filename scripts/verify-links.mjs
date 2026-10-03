import { chromium } from "@playwright/test";

async function verify() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("Navigating to http://localhost:3000/feed...");
  await page.goto("http://localhost:3000/feed", { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="feed-card"]', { timeout: 10000 });

  const cards = page.locator('[data-testid="feed-card"]');
  const count = await cards.count();
  console.log(`Found ${count} cards on /feed.`);

  for (let i = 0; i < Math.min(count, 6); i++) {
    const card = cards.nth(i);
    const title = await card.locator("h3").innerText();
    const cta = card.locator("a");
    const href = await cta.getAttribute("href");
    const target = await cta.getAttribute("target");
    const rel = await cta.getAttribute("rel");
    console.log(`Card ${i + 1}: "${title.slice(0, 35)}..." -> [${href}] (target: ${target}, rel: ${rel})`);
  }

  // Check navigation links
  console.log("\nChecking navigation links...");
  for (const path of ["/feed", "/trending", "/favorites", "/settings"]) {
    const res = await page.goto(`http://localhost:3000${path}`, { waitUntil: "domcontentloaded" });
    console.log(`Navigated to ${path} -> HTTP ${res?.status()}`);
  }

  await browser.close();
  console.log("\nLink verification complete!");
}

verify().catch((e) => {
  console.error("Verification failed:", e);
  process.exit(1);
});
