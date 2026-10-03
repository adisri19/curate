import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs";

const assetsDir = path.resolve(process.cwd(), "docs/assets");
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

async function run() {
  const browser = await chromium.launch();

  const routes = [
    { path: "/feed", name: "feed" },
    { path: "/trending", name: "trending" },
    { path: "/favorites", name: "favorites" },
    { path: "/search?q=apple", name: "search" },
    { path: "/settings", name: "settings" },
  ];

  // 1. Desktop captures (1440x900)
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const desktopPage = await desktopCtx.newPage();

  for (const r of routes) {
    // Light
    await desktopPage.goto(`http://localhost:3000${r.path}`, { waitUntil: "domcontentloaded" });
    await desktopPage.evaluate(() => document.documentElement.classList.remove("dark"));
    await desktopPage.waitForTimeout(800);
    const lightPath = path.join(assetsDir, `${r.name}-desktop-light.png`);
    await desktopPage.screenshot({ path: lightPath });
    console.log(`Saved: ${lightPath}`);

    // Dark
    await desktopPage.evaluate(() => document.documentElement.classList.add("dark"));
    await desktopPage.waitForTimeout(500);
    const darkPath = path.join(assetsDir, `${r.name}-desktop-dark.png`);
    await desktopPage.screenshot({ path: darkPath });
    console.log(`Saved: ${darkPath}`);
  }
  await desktopCtx.close();

  // 2. Mobile captures (390x844)
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileCtx.newPage();

  for (const r of routes) {
    // Light
    await mobilePage.goto(`http://localhost:3000${r.path}`, { waitUntil: "domcontentloaded" });
    await mobilePage.evaluate(() => document.documentElement.classList.remove("dark"));
    await mobilePage.waitForTimeout(800);
    const lightPath = path.join(assetsDir, `${r.name}-mobile-light.png`);
    await mobilePage.screenshot({ path: lightPath });
    console.log(`Saved: ${lightPath}`);

    // Dark
    await mobilePage.evaluate(() => document.documentElement.classList.add("dark"));
    await mobilePage.waitForTimeout(500);
    const darkPath = path.join(assetsDir, `${r.name}-mobile-dark.png`);
    await mobilePage.screenshot({ path: darkPath });
    console.log(`Saved: ${darkPath}`);
  }

  // 3. Mobile Navigation Drawer
  await mobilePage.goto("http://localhost:3000/feed", { waitUntil: "domcontentloaded" });
  await mobilePage.evaluate(() => document.documentElement.classList.remove("dark"));
  const menuBtn = mobilePage.getByRole("button", { name: "Toggle navigation menu" });
  if (await menuBtn.isVisible()) {
    await menuBtn.click();
    await mobilePage.waitForTimeout(600);
    await mobilePage.screenshot({ path: path.join(assetsDir, "drawer-mobile-light.png") });
    console.log("Saved: drawer-mobile-light.png");

    await mobilePage.evaluate(() => document.documentElement.classList.add("dark"));
    await mobilePage.waitForTimeout(400);
    await mobilePage.screenshot({ path: path.join(assetsDir, "drawer-mobile-dark.png") });
    console.log("Saved: drawer-mobile-dark.png");
  }
  await mobileCtx.close();

  // 4. Hero Image (side by side light and dark)
  console.log("Composing hero side-by-side preview...");
  const heroPage = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  const lightData = fs.readFileSync(path.join(assetsDir, "feed-desktop-light.png")).toString("base64");
  const darkData = fs.readFileSync(path.join(assetsDir, "feed-desktop-dark.png")).toString("base64");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 820px;
            box-sizing: border-box;
            font-family: system-ui, -apple-system, sans-serif;
          }
          .hero-container {
            display: flex;
            gap: 24px;
            width: 100%;
            max-width: 1520px;
            perspective: 1200px;
          }
          .frame {
            flex: 1;
            background: #1e293b;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
          }
          .frame-bar {
            height: 32px;
            background: #0f172a;
            display: flex;
            align-items: center;
            padding: 0 12px;
            gap: 6px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          .dot {
            width: 9px;
            height: 9px;
            border-radius: 50%;
          }
          .dot-red { background: #ef4444; }
          .dot-yellow { background: #eab308; }
          .dot-green { background: #22c55e; }
          .title-tag {
            margin-left: auto;
            color: #94a3b8;
            font-size: 11px;
            font-weight: 500;
            padding: 2px 8px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.05);
          }
          .preview-img {
            width: 100%;
            height: auto;
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="hero-container">
          <div class="frame">
            <div class="frame-bar">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
              <span class="title-tag">Curate — Light Theme</span>
            </div>
            <img class="preview-img" src="data:image/png;base64,${lightData}" alt="Curate Dashboard Light Mode" />
          </div>
          <div class="frame">
            <div class="frame-bar">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
              <span class="title-tag">Curate — Dark Theme</span>
            </div>
            <img class="preview-img" src="data:image/png;base64,${darkData}" alt="Curate Dashboard Dark Mode" />
          </div>
        </div>
      </body>
    </html>
  `;

  await heroPage.setContent(htmlContent);
  await heroPage.waitForTimeout(800);
  const heroPath = path.join(assetsDir, "hero.png");
  await heroPage.screenshot({ path: heroPath });
  console.log(`Saved hero: ${heroPath}`);

  await browser.close();
  console.log("All assets generated successfully!");
}

run().catch((e) => {
  console.error("Asset generation error:", e);
  process.exit(1);
});
