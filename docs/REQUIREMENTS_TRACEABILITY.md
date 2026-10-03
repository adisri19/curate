# Requirements Traceability Matrix

This document tracks all assignment requirements for the **Personalized Content Dashboard (Curate)**, detailing the implementation files and the corresponding automated test suites validating them.

| Requirement | Implementation File(s) | Verification / Test Suite | Status |
| :--- | :--- | :--- | :--- |
| **Tech Stack: Next.js App Router + TypeScript Strict** | `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx` | `npm run typecheck`, `npm run build` | Verified |
| **Tech Stack: Redux Toolkit + RTK Query** | `src/store/store.ts`, `src/services/api.ts`, `src/store/slices/*` | `tests/unit/slices/*.test.ts`, `tests/integration/*.test.tsx` | Verified |
| **Tech Stack: Tailwind CSS + CSS Custom Properties Theme** | `src/styles/globals.css`, `src/hooks/useTheme.ts`, `src/components/layout/ThemeToggle.tsx` | `tests/unit/components/ThemeToggle.test.tsx`, `e2e/dashboard.spec.ts` (test 5) | Verified |
| **Tech Stack: Framer Motion Animations** | `src/components/feed/DraggableCard.tsx`, `src/components/cards/ContentCard.tsx`, `src/components/ui/Dialog.tsx`, `src/components/ui/Toast.tsx` | Unit tests & E2E card layout assertions | Verified |
| **Tech Stack: Drag-and-Drop (react-dnd HTML5 + Touch)** | `src/components/feed/DndWrapper.tsx`, `src/components/feed/DraggableCard.tsx`, `src/store/slices/feedOrderSlice.ts` | `tests/unit/slices/feedOrderSlice.test.ts`, `e2e/dashboard.spec.ts` (test 3) | Verified |
| **Tech Stack: Lucide React Icons** | `src/components/layout/Sidebar.tsx`, `src/components/layout/Header.tsx`, `src/components/cards/ContentCard.tsx` | `npm run build`, visual regression screenshots | Verified |
| **Testing Suites (Vitest + RTL + MSW + Playwright)** | `vitest.config.ts`, `playwright.config.ts`, `tests/setup.ts`, `tests/msw/server.ts`, `e2e/dashboard.spec.ts` | `npm test` (79/79 passing), `npm run e2e` (14/14 passing) | Verified |
| **Normalized Content Model (news, movie, social)** | `src/types/content.ts`, `src/services/normalizers/*` | `tests/unit/normalizers.test.ts` (5 tests) | Verified |
| **Data Source 1: NewsAPI Route Handler + Fallback** | `src/app/api/news/route.ts`, `src/mocks/newsFixtures.ts`, `src/services/normalizers/newsNormalizer.ts` | `tests/unit/normalizers.test.ts`, `tests/integration/feed.test.tsx` | Verified |
| **Data Source 2: TMDB Movie Route Handler + Genre Mapping** | `src/app/api/recommendations/route.ts`, `src/lib/genreMapping.ts`, `src/mocks/movieFixtures.ts`, `src/services/normalizers/movieNormalizer.ts` | `tests/unit/genreMapping.test.ts`, `tests/unit/normalizers.test.ts` | Verified |
| **Data Source 3: Deterministic Seeded Social Feed Mock** | `src/app/api/social/route.ts`, `src/mocks/socialFixtures.ts` (65 realistic posts), `src/services/normalizers/socialNormalizer.ts` | `tests/unit/normalizers.test.ts`, `tests/integration/feed.test.tsx` | Verified |
| **Keyless Demo Mode & Dismissible Badge** | `src/components/states/DemoBadge.tsx`, `src/app/api/*/route.ts` | `tests/integration/feed.test.tsx`, `e2e/dashboard.spec.ts` (test 1) | Verified |
| **Server-Side Zod Validation & Cache Headers** | `src/app/api/news/route.ts`, `src/app/api/recommendations/route.ts`, `src/app/api/social/route.ts` | Route handler error code handling & schema validation | Verified |
| **State: preferencesSlice (Categories, Hashtags, Theme)** | `src/store/slices/preferencesSlice.ts` | `tests/unit/slices/preferencesSlice.test.ts` (8 tests) | Verified |
| **State: favoritesSlice (Snapshots, Offline Persistence)** | `src/store/slices/favoritesSlice.ts`, `src/components/cards/FavoriteButton.tsx` | `tests/unit/slices/favoritesSlice.test.ts` (4 tests), `tests/integration/favorites.test.tsx` (2 tests), `e2e/dashboard.spec.ts` (test 4) | Verified |
| **State: feedOrderSlice (Custom Order & Merge Strategy)** | `src/store/slices/feedOrderSlice.ts` | `tests/unit/slices/feedOrderSlice.test.ts` (6 tests), `e2e/dashboard.spec.ts` (test 3) | Verified |
| **State: searchSlice & historySlice** | `src/store/slices/searchSlice.ts`, `src/store/slices/historySlice.ts` | `tests/unit/slices/searchSlice.test.ts`, `tests/unit/slices/historySlice.test.ts` | Verified |
| **State: localStorage Persistence & Corruption Recovery** | `src/store/persist.ts`, `src/components/providers/StoreProvider.tsx` | `tests/unit/persist.test.ts` (5 tests) | Verified |
| **Responsive Shell (Desktop Sidebar + Mobile Drawer)** | `src/components/layout/Sidebar.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/MobileNav.tsx`, `src/app/(dashboard)/layout.tsx` | `tests/unit/components/Layout.test.tsx`, `e2e/dashboard.spec.ts` (all tests) | Verified |
| **Personalized Feed (/feed) with Round-Robin Merge** | `src/app/(dashboard)/feed/page.tsx`, `src/components/feed/FeedList.tsx`, `src/hooks/useInfiniteFeed.ts` | `tests/integration/feed.test.tsx`, `e2e/dashboard.spec.ts` (test 1) | Verified |
| **Content Cards (16:9 Image, Badges, CTAs, Error Fallback)** | `src/components/cards/ContentCard.tsx`, `src/components/cards/CardSkeleton.tsx` | `tests/unit/components/ContentCard.test.tsx`, visual QA screenshots | Verified |
| **Infinite Scrolling + Accessible "Load More" Fallback** | `src/hooks/useIntersectionObserver.ts`, `src/components/feed/FeedList.tsx` | `tests/integration/feed.test.tsx` | Verified |
| **Card Drag-and-Drop + Keyboard Reorder (A11y)** | `src/components/feed/DraggableCard.tsx`, `src/components/cards/ContentCard.tsx` (Move Up/Down buttons) | `e2e/dashboard.spec.ts` (test 3) | Verified |
| **Trending Page (/trending)** | `src/app/(dashboard)/trending/page.tsx` | `tests/integration/trending.test.tsx` (2 tests), `e2e/dashboard.spec.ts` (test 7) | Verified |
| **Favorites Page (/favorites) with Clear All & Undo Toast** | `src/app/(dashboard)/favorites/page.tsx` | `tests/integration/favorites.test.tsx` (2 tests), `e2e/dashboard.spec.ts` (test 4) | Verified |
| **Search Page & Debounced SearchBar (400ms, /search?q=)** | `src/components/layout/SearchBar.tsx`, `src/hooks/useDebouncedValue.ts`, `src/app/(dashboard)/search/page.tsx` | `tests/unit/useDebouncedValue.test.ts`, `tests/unit/components/SearchBar.test.tsx`, `tests/integration/search.test.tsx`, `e2e/dashboard.spec.ts` (test 2) | Verified |
| **Settings Drawer & Page (Live Category Updates)** | `src/components/settings/PreferencesPanel.tsx`, `src/components/settings/SettingsDrawer.tsx`, `src/components/settings/CategoryChips.tsx`, `src/components/settings/HashtagInput.tsx` | `tests/unit/components/PreferencesPanel.test.tsx`, `tests/unit/components/HashtagInput.test.tsx`, `e2e/dashboard.spec.ts` (test 6) | Verified |
| **Zero-Flash Dark Mode Inline Script** | `src/app/layout.tsx` (inline script), `src/styles/globals.css` | `e2e/dashboard.spec.ts` (test 5) | Verified |
| **Accessibility Audit (axe-core WCAG 2.1 AA)** | All semantic landmarks, aria-labels, aria-live, focus rings | `e2e/dashboard.spec.ts` (test 7: 0 violations across /feed, /trending, /favorites) | Verified |
| **Security of API Keys** | Server-side Route Handlers only; `.env.example` template | `.next/static` bundle search verified 0 client leakages | Verified |
