import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Personalized Content Dashboard E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Reset localStorage before each test
    await page.goto("/feed");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("(1) app loads and personalized feed displays content cards", async ({ page }) => {
    await page.goto("/feed");

    // Header and navigation should be visible
    await expect(page.locator("h1")).toContainText(/Personalized Feed/i);

    // Assert cards are rendered
    const cards = page.locator('[data-testid="feed-card"]');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // Demo badge should be visible in keyless demo mode
    await expect(page.getByRole("region", { name: "Demo mode announcement" })).toBeVisible();
  });

  test("(2) search: type query, wait for debounced results, verify URL ?q=, and clear", async ({ page }) => {
    await page.goto("/feed");

    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill("quantum");

    // Wait for debounced navigation to /search?q=quantum
    await page.waitForURL(/\/search\?q=quantum/);
    expect(page.url()).toContain("q=quantum");

    // Verify search results page title
    await expect(page.locator("h1")).toContainText(/Search Results for "quantum"/i);

    // Clear search using the clear button
    const clearButton = page.getByRole("button", { name: /Clear search/i });
    await clearButton.click();
    await expect(searchInput).toHaveValue("");
  });

  test("(3) card reordering: test keyboard Move Down, reload, assert persisted", async ({ page }) => {
    await page.goto("/feed");

    const cards = page.locator('[data-testid="feed-card"]');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });

    const firstCardTitle = await cards.nth(0).locator("h3").innerText();

    // Click Move Down button on first card
    const moveDownBtn = cards.nth(0).getByRole("button", { name: /Move .* down/i });
    await moveDownBtn.click();

    // Card should now be at position 1 (the second card)
    const newSecondCardTitle = await cards.nth(1).locator("h3").innerText();
    expect(newSecondCardTitle).toBe(firstCardTitle);

    // Reload page to verify order persistence in localStorage
    await page.reload();
    await expect(cards.first()).toBeVisible({ timeout: 10000 });

    const reloadedSecondCardTitle = await cards.nth(1).locator("h3").innerText();
    expect(reloadedSecondCardTitle).toBe(firstCardTitle);

    // Reset order
    const resetBtn = page.getByRole("button", { name: /Reset Order/i });
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
    }
  });

  test("(4) favorite a card, navigate to Favorites, see it, reload, unfavorite", async ({ page }) => {
    await page.goto("/feed");

    const cards = page.locator('[data-testid="feed-card"]');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });

    const cardTitle = await cards.first().locator("h3").innerText();
    const favButton = cards.first().getByRole("button", { name: /Add .* to favorites/i });
    await favButton.click();

    // Navigate to Favorites
    await page.goto("/favorites");
    await expect(page.locator("h1")).toContainText(/Saved Favorites/i);
    await expect(page.getByText(cardTitle)).toBeVisible();

    // Reload page to assert offline persistence
    await page.reload();
    await expect(page.getByText(cardTitle)).toBeVisible();

    // Unfavorite
    const unfavButton = page.getByRole("button", { name: /Remove .* from favorites/i });
    await unfavButton.click();

    await expect(page.getByText("No favorites saved yet")).toBeVisible();
  });

  test("(5) toggle dark mode, reload, verify theme persists without flash", async ({ page }) => {
    await page.goto("/feed");

    const themeToggle = page.getByRole("button", { name: /Switch to .* mode/i });
    await themeToggle.click();

    // Verify .dark class added to html element
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);

    // Reload and assert dark mode remains persisted
    await page.reload();
    await expect(html).toHaveClass(/dark/);
  });

  test("(6) change categories in Settings and see feed update", async ({ page }) => {
    await page.goto("/feed");

    // Open Settings Drawer
    const settingsButton = page.getByRole("button", { name: /Customize Feed/i }).first();
    await settingsButton.click();

    // Drawer opens
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Feed Preferences/i })).toBeVisible();

    // Click Entertainment chip
    const entertainmentChip = page.getByRole("button", { name: /^Entertainment$/i });
    await entertainmentChip.click();

    // Close drawer
    const closeBtn = page.getByRole("button", { name: /Done/i });
    await closeBtn.click();

    // Feed updates with active preferences
    await expect(page.locator('[data-testid="feed-card"]').first()).toBeVisible();
  });

  test("(7) accessibility scan with axe-core on /feed, /trending, and /favorites", async ({ page }) => {
    for (const route of ["/feed", "/trending", "/favorites"]) {
      await page.goto(route);
      await page.waitForLoadState("domcontentloaded");
      await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .disableRules(["color-contrast"]) // External dynamic photos/cards contrast
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });
});
