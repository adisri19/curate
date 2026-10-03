import { chromium } from "@playwright/test";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const screenshotsDir = path.resolve(process.cwd(), "docs/screenshots");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeout}ms`);
}

async function main() {
  console.log("Checking if Next.js server is running on http://localhost:3000...");
  let serverProcess = null;
  let isRunning = false;
  try {
    const res = await fetch("http://localhost:3000/feed");
    if (res.ok) isRunning = true;
  } catch {
    isRunning = false;
  }

  if (!isRunning) {
    console.log("Starting Next.js production server on port 3000...");
    serverProcess = spawn("npm", ["run", "start"], {
      stdio: "inherit",
      env: { ...process.env, PORT: "3000" },
    });
    await waitForServer("http://localhost:3000/feed");
  }

  console.log("Launching headless browser to capture screenshots...");
  const browser = await chromium.launch();

  const viewports = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 375, height: 812 },
  ];

  const routes = [
    { path: "/feed", name: "feed" },
    { path: "/trending", name: "trending" },
    { path: "/favorites", name: "favorites" },
    { path: "/search?q=ai", name: "search" },
    { path: "/settings", name: "settings" },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    for (const route of routes) {
      // 1. Light Mode
      await page.goto(`http://localhost:3000${route.path}`, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => {
        document.documentElement.classList.remove("dark");
      });
      await page.waitForTimeout(1000); // Wait for content animation

      const lightFile = path.join(screenshotsDir, `${route.name}-${vp.name}-light.png`);
      await page.screenshot({ path: lightFile, fullPage: false });
      console.log(`Saved: ${lightFile}`);

      // 2. Dark Mode
      await page.evaluate(() => {
        document.documentElement.classList.add("dark");
      });
      await page.waitForTimeout(500);

      const darkFile = path.join(screenshotsDir, `${route.name}-${vp.name}-dark.png`);
      await page.screenshot({ path: darkFile, fullPage: false });
      console.log(`Saved: ${darkFile}`);
    }

    await context.close();
  }

  await browser.close();

  if (serverProcess) {
    serverProcess.kill();
  }

  console.log("All screenshots captured successfully!");
}

main().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
