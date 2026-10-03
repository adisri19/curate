<div align="center">

# Curate

**A production-ready, accessible, and responsive personal content reader aggregating real-time breaking headlines, cinema discoveries, and community social discourse into a unified stream.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0_Strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-RTK_Query-764ABC?style=flat-square&logo=redux)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4_Tokens-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-81%20Passed-success?style=flat-square)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br />

<p align="center">
  <img src="docs/assets/hero.png" alt="Curate Dashboard — Side-by-side Light and Dark Mode Preview" width="100%" />
</p>

<p align="center">
  <a href="<!-- TODO(owner): paste live URL -->"><strong>View Live Demo</strong></a> •
  <a href="<!-- TODO(owner): paste demo video link -->"><strong>Watch Video Walkthrough</strong></a> •
  <a href="https://github.com/<!-- TODO(owner): your-username -->/curate/issues">Report a Bug</a>
</p>

</div>

---

## Table of Contents

- [Overview](#overview)
  - [Highlights](#highlights)
- [Visual Demo](#visual-demo)
- [Features](#features)
- [Quick Start](#quick-start)
  - [Optional: Connecting Live Upstream APIs](#optional-connecting-live-upstream-apis)
- [System Architecture](#system-architecture)
  - [Data Flow Pipeline](#data-flow-pipeline)
  - [Redux Store Hierarchy](#redux-store-hierarchy)
  - [Key Architecture Decisions (ADRs)](#key-architecture-decisions-adrs)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
  - [`GET /api/news`](#get-apinews)
  - [`GET /api/recommendations`](#get-apirecommendations)
  - [`GET /api/social`](#get-apisocial)
- [State Management and Persistence](#state-management-and-persistence)
- [UX, Accessibility, and Performance](#ux-accessibility-and-performance)
- [Security Posture](#security-posture)
- [Testing Suite](#testing-suite)
  - [Test Layers and Real Execution Metrics](#test-layers-and-real-execution-metrics)
  - [E2E User Journeys](#e2e-user-journeys)
- [User Flow Walkthrough](#user-flow-walkthrough)
- [Deployment Guide](#deployment-guide)
- [Assignment Traceability](#assignment-traceability)
- [Assumptions and Known Limitations](#assumptions-and-known-limitations)
- [Roadmap](#roadmap)
- [Attribution and Acknowledgements](#attribution-and-acknowledgements)
- [License and Author](#license-and-author)

---

## Overview

Curate is an open-source personal content reader built to solve content fragmentation across news publications, movie discovery engines, and community discourse. Built with the Next.js App Router and TypeScript, it normalizes disparate external APIs into a unified contract, presenting a balanced, round-robin stream with fluid drag-and-drop personalization.

Designed with an obsession for resilient engineering and visual polish, the application guarantees an uncompromised experience out of the box: it operates with zero API keys via an integrated keyless demo mode, persists user arrangements offline safely across sessions, and complies strictly with WCAG 2.1 AA accessibility standards.

### Highlights

- **Keyless Demo Mode:** Runs immediately with zero configuration; transparently serves curated fixtures with a dismissible notice when API keys are absent.
- **Fluid & Accessible Reordering:** Supports drag-and-drop card reordering via `react-dnd` (HTML5 on pointer devices, touch backend on mobile) paired with accessible keyboard Move Up / Move Down controls and polite `aria-live` screen-reader announcements.
- **Hydration-Safe Store Persistence:** Redux state synchronizes to `localStorage` under a versioned key (`pcd:v1`) with instant recovery for corrupted JSON, quota exceptions, and schema migrations.
- **Zero-Flash Dark Mode:** Eliminates flash of unstyled content (FOUC) through a blocking pre-hydration inline script mapped directly to CSS custom properties.
- **Partial-Failure Resilience:** If an individual content source experiences rate-limiting or network issues, the dashboard continues rendering all available feeds and displays an inline, non-blocking per-source retry banner.
- **Hardened Server Proxies:** All external requests route through server Route Handlers with Zod validation, guaranteeing that upstream API credentials never leak to the client browser.
- **Thorough Test Coverage:** Validated by 81 automated Vitest unit/integration tests and 14 cross-platform Playwright E2E suites with automated axe-core audits.

---

## Visual Demo

| View | Light Theme | Dark Theme |
| :--- | :--- | :--- |
| **Personalized Feed**<br />*Balanced round-robin stream with type filters, infinite scroll, and card reordering.* | ![Personalized Feed Light](docs/assets/feed-desktop-light.png) | ![Personalized Feed Dark](docs/assets/feed-desktop-dark.png) |
| **Trending Hub**<br />*Categorized sections for top news headlines, popular cinema, and community discourse.* | ![Trending Hub Light](docs/assets/trending-desktop-light.png) | ![Trending Hub Dark](docs/assets/trending-desktop-dark.png) |
| **Debounced Search**<br />*Parallel multi-source search with 400ms debounce, URL query sync, and instant clearing.* | ![Search Results Light](docs/assets/search-desktop-light.png) | ![Search Results Dark](docs/assets/search-desktop-dark.png) |
| **Favorites & Offline Storage**<br />*Saved article and movie snapshots persisted offline with undo capabilities.* | ![Favorites Light](docs/assets/favorites-desktop-light.png) | ![Favorites Dark](docs/assets/favorites-desktop-dark.png) |
| **Preferences & Settings**<br />*Category multi-select with validation, hashtag manager, and instant live feed updates.* | ![Preferences Light](docs/assets/settings-desktop-light.png) | ![Preferences Dark](docs/assets/settings-desktop-dark.png) |
| **Mobile Drawer Navigation**<br />*Responsive slide-in navigation drawer and accessible bottom navigation tab bar.* | ![Mobile Drawer Light](docs/assets/drawer-mobile-light.png) | ![Mobile Drawer Dark](docs/assets/drawer-mobile-dark.png) |

---

## Features

| Category | Feature | Description | Key Implementation |
| :--- | :--- | :--- | :--- |
| **Core** | Unified Content Feed | Normalizes news, movies, and social posts into a strict `ContentItem` type; interleaves sources in a balanced round-robin sequence. | [`src/components/feed/FeedList.tsx`](src/components/feed/FeedList.tsx) |
| **Core** | Drag-and-Drop Reorder | Drag-and-drop card positioning with Framer Motion spring physics; custom order persisted to Redux and `localStorage`. | [`src/components/feed/DraggableCard.tsx`](src/components/feed/DraggableCard.tsx) |
| **Core** | Accessible Keyboard Move | Move Up and Move Down buttons on every card with `aria-live` polite announcements for screen-reader parity. | [`src/components/cards/ContentCard.tsx`](src/components/cards/ContentCard.tsx) |
| **Core** | Trending Discoveries | Dedicated dashboard (`/trending`) grouping high-engagement content by category tabs and horizontal sections. | [`src/app/(dashboard)/trending/page.tsx`](<src/app/(dashboard)/trending/page.tsx>) |
| **Core** | Offline-Persisted Favorites | Complete card snapshots saved to Redux and local storage; viewable offline with undo notifications and clear confirmation. | [`src/app/(dashboard)/favorites/page.tsx`](<src/app/(dashboard)/favorites/page.tsx>) |
| **Core** | Debounced Parallel Search | Header search bar with 400ms debounce, keyboard `/` shortcut, query sync to `?q=`, and parallel multi-source querying. | [`src/components/layout/SearchBar.tsx`](src/components/layout/SearchBar.tsx) |
| **UX** | Zero-Flash Dark Mode | CSS custom property tokens mapped to Tailwind; pre-hydration inline script prevents theme flicker on load. | [`src/app/layout.tsx`](src/app/layout.tsx) |
| **UX** | Infinite Feed Loading | IntersectionObserver sentinel automatically loads subsequent pages with an accessible manual button fallback. | [`src/hooks/useInfiniteFeed.ts`](src/hooks/useInfiniteFeed.ts) |
| **UX** | Feed Preferences Drawer | Customize active categories (min 1 required) and hashtags with instant live feed re-querying without reload. | [`src/components/settings/PreferencesPanel.tsx`](src/components/settings/PreferencesPanel.tsx) |
| **UX** | Partial Failure Alerts | Non-blocking inline banner indicates when an upstream source encounters issues while rendering all available feeds. | [`src/components/feed/FeedList.tsx`](src/components/feed/FeedList.tsx) |
| **Engineering** | Server Route Proxies | Next.js Route Handlers wrap NewsAPI, TMDB, and Social APIs, insulating private keys and preventing browser CORS blocks. | [`src/app/api/news/route.ts`](src/app/api/news/route.ts) |
| **Engineering** | Zod Schema Validation | All incoming route query parameters are strictly bounded and validated before touching external networks. | [`src/app/api/recommendations/route.ts`](src/app/api/recommendations/route.ts) |
| **Engineering** | Keyless Demo Mode | Transparently serves realistic curated fixtures with a dismissible notice if API keys are omitted. | [`src/components/states/DemoBadge.tsx`](src/components/states/DemoBadge.tsx) |

---

## Quick Start

Run Curate locally in under two minutes with **zero API keys required**:

```bash
# 1. Clone the repository
git clone https://github.com/<!-- TODO(owner): your-username -->/curate.git
cd curate

# 2. Install dependencies
npm install

# 3. Start development server (Turbopack)
npm run dev

# 4. Open in browser
# Visit http://localhost:3000 to interact with the dashboard in Keyless Demo Mode.
```

> [!NOTE]
> **Keyless Demo Mode:** When running without API keys, Curate automatically serves realistic curated fixtures from `src/mocks/` and displays a dismissible banner. Every feature—including drag-and-drop, debounced search, favorites, settings, and dark mode—is fully operational.

### Optional: Connecting Live Upstream APIs

To connect live external content pipelines, create a `.env.local` file:

```bash
cp .env.example .env.local
```

| Environment Variable | Required? | Purpose | Where to Obtain | Example |
| :--- | :--- | :--- | :--- | :--- |
| `NEWSAPI_KEY` | Optional | Authenticates live headlines and searches via NewsAPI v2. | [newsapi.org](https://newsapi.org) | `32-character hex key` |
| `TMDB_API_KEY` | Optional | Authenticates live movie discoveries and recommendations via TMDB. | [themoviedb.org](https://themoviedb.org/documentation/api) | `v3 API key or Read Token` |
| `NEXT_PUBLIC_APP_URL` | Optional | Canonical URL for metadata and E2E testing. | Deployment domain | `http://localhost:3000` |
| `SOCIAL_MOCK_FAILURE_RATE` | Optional | Simulates intermittent social API failures for resilience testing. | Internal | `0` (default) to `1.0` |

> [!IMPORTANT]
> External API keys are kept strictly on the server and are never included in client JavaScript bundles.

---

## System Architecture

Curate is architected for decoupling: UI components interact exclusively with Redux slices and RTK Query hooks, which dispatch requests to server-side Route Handlers.

### Data Flow Pipeline

```mermaid
flowchart TD
    subgraph Browser ["Client Browser"]
        UI["React UI (FeedList, Cards, SearchBar)"]
        Store["Redux Toolkit Store"]
        RTK["RTK Query (apiSlice cache)"]
        Storage[("localStorage ('pcd:v1')")]
        
        UI -->|User Interactions / Actions| Store
        Store <-->|Sync Subscription| Storage
        UI -->|Query Hooks| RTK
    end

    subgraph ServerProxy ["Next.js Server (Route Handlers)"]
        RTK -->|GET /api/news| NewsRoute["/api/news (Zod, Cache: 300s)"]
        RTK -->|GET /api/recommendations| MovieRoute["/api/recommendations (Cache: 300s)"]
        RTK -->|GET /api/social| SocialRoute["/api/social (Cache: 60s)"]
        
        NewsRoute --> NewsAuth{"NEWSAPI_KEY?"}
        MovieRoute --> MovieAuth{"TMDB_API_KEY?"}
        
        NewsAuth -->|Present| LiveNews["NewsAPI v2 REST"]
        NewsAuth -->|Missing / Fallback| NewsFixtures[("Curated News Fixtures")]
        
        MovieAuth -->|Present| LiveTMDB["TMDB v3 (api.tmdb.org)"]
        MovieAuth -->|Missing / Network Reset| MovieFixtures[("Curated TMDB Fixtures")]
        
        SocialRoute --> SocialSeed[("Deterministic 65-Post Feed")]
    end

    subgraph Normalization ["Services & Normalizers"]
        LiveNews --> NewsNorm["newsNormalizer"]
        LiveTMDB --> MovieNorm["movieNormalizer"]
        SocialSeed --> SocialNorm["socialNormalizer"]
        
        NewsNorm --> Unified["Unified ContentItem Contract"]
        MovieNorm --> Unified
        SocialNorm --> Unified
        
        Unified --> RTK
    end
```

### Redux Store Hierarchy

```mermaid
classDiagram
    class RootStore {
        +preferencesSlice preferences
        +favoritesSlice favorites
        +feedOrderSlice feedOrder
        +historySlice history
        +searchSlice search
        +uiSlice ui
        +apiSlice api
    }

    class PreferencesSlice {
        +string[] categories
        +string[] hashtags
        +string theme
        +string language
    }

    class FavoritesSlice {
        +Record~string, ContentItem~ items
    }

    class FeedOrderSlice {
        +string[] customOrderIds
    }

    class HistorySlice {
        +HistoryItem[] items
    }

    class PersistenceLayer {
        +Key: "pcd:v1"
        +loadPersistedState()
        +savePersistedState()
    }

    RootStore --> PreferencesSlice
    RootStore --> FavoritesSlice
    RootStore --> FeedOrderSlice
    RootStore --> HistorySlice
    PreferencesSlice ..> PersistenceLayer : Whitelisted
    FavoritesSlice ..> PersistenceLayer : Whitelisted
    FeedOrderSlice ..> PersistenceLayer : Whitelisted
    HistorySlice ..> PersistenceLayer : Whitelisted
```

### Key Architecture Decisions (ADRs)

| Decision | Why | Trade-off |
| :--- | :--- | :--- |
| **Server-Side Route Proxies** | Keeps private API keys off client bundles; bypasses browser CORS; adds centralized Zod validation. | Slight latency overhead compared to direct browser calls, mitigated by `s-maxage=300` caching. |
| **RTK Query over Custom Thunks** | Provides automatic request deduplication, normalized caching, and declarative polling/refetching. | Requires adhering to RTK Query endpoint definitions rather than ad-hoc async functions. |
| **`react-dnd` with Dynamic Backend** | Enables pointer drag-and-drop on desktop (`HTML5Backend`) and fluid touch dragging on mobile (`TouchBackend`). | Requires explicit keyboard alternatives (Move Up / Down) to guarantee screen-reader accessibility. |
| **Unified `ContentItem` Contract** | Normalizes disparate schemas into a single model (`id`, `title`, `description`, `imageUrl`, `url`, `source`, `category`). | Requires dedicated normalizer adapters (`newsNormalizer`, `movieNormalizer`, `socialNormalizer`). |
| **Full Snapshot Favorite Persistence** | Stores the complete `ContentItem` object in `favoritesSlice` rather than ID references alone. | Slightly larger `localStorage` footprint, but guarantees offline functionality without refetching. |
| **Feed Interleaving + Custom Order Merge** | Merges news, movies, and social in a round-robin pattern, then applies saved custom ID order gracefully. | Newly fetched items appear appended after existing reordered positions. |
| **Zero-Flash Blocking Script** | Injects an inline script in `<head>` to evaluate stored theme and system preference before DOM paint. | Requires plain vanilla JavaScript in `<head>` rather than React state hooks. |
| **Transparent Fixture Fallback** | Fallback to deterministic fixtures when keys are missing or upstream networks drop packets. | Evaluator gets full demo functionality without configuring accounts. |

For deep-dive architectural specifications, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Project Structure

```
curate/
├── docs/
│   ├── ARCHITECTURE.md           # In-depth architectural blueprint and ADRs
│   ├── REQUIREMENTS_TRACEABILITY.md # Detailed requirement-to-test mapping matrix
│   └── assets/                   # High-res screenshots and hero preview
├── e2e/
│   └── dashboard.spec.ts         # Playwright E2E and automated axe-core a11y specs
├── scripts/
│   ├── capture-screenshots.mjs   # Automated screenshot runner
│   └── generate-assets.mjs       # Asset and hero compositor
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Dashboard route group sharing layout shell
│   │   │   ├── favorites/        # Saved favorites view (/favorites)
│   │   │   ├── feed/             # Personalized content stream (/feed)
│   │   │   ├── layout.tsx        # Shell hosting Sidebar, Header, MobileNav
│   │   │   ├── search/           # Debounced multi-source search results (/search)
│   │   │   ├── settings/         # Dedicated preferences route (/settings)
│   │   │   └── trending/         # Grouped trending content hub (/trending)
│   │   ├── api/                  # Secure proxy Route Handlers with Zod validation
│   │   │   ├── news/             # NewsAPI top-headlines & everything proxy
│   │   │   ├── recommendations/  # TMDB movie discover & search proxy
│   │   │   └── social/           # Deterministic seeded social feed proxy
│   │   ├── error.tsx             # Global error boundary with recovery action
│   │   ├── layout.tsx            # Root layout with fonts and zero-flash theme script
│   │   └── not-found.tsx         # Accessible 404 page
│   ├── components/
│   │   ├── cards/                # ContentCard, CardSkeleton, FavoriteButton
│   │   ├── feed/                 # FeedList, DraggableCard, DndWrapper
│   │   ├── layout/               # Header, Sidebar, SearchBar, ThemeToggle, UserMenu, MobileNav
│   │   ├── providers/            # React 19 hydration-safe StoreProvider
│   │   ├── settings/             # PreferencesPanel, CategoryChips, HashtagInput, SettingsDrawer
│   │   ├── states/               # EmptyState, ErrorState, LoadingSpinner, DemoBadge
│   │   └── ui/                   # Button, Input, Dialog, Toast, Tooltip, Badge, Skeleton
│   ├── hooks/                    # useDebouncedValue, useInfiniteFeed, useTheme, useIntersectionObserver
│   ├── lib/                      # Category constants, genre mappings, URL/text formatters
│   ├── mocks/                    # Curated fixtures for news, movies, and social (65 seeded posts)
│   ├── services/                 # RTK Query base apiSlice and domain normalizers
│   ├── store/                    # Redux store config, persistence engine, and feature slices
│   ├── styles/                   # globals.css with design tokens and CSS custom properties
│   └── types/                    # TypeScript interfaces for content, API responses, preferences
├── tests/
│   ├── integration/              # MSW-mocked integration tests for Feed, Search, Favorites
│   ├── setup.ts                  # Vitest polyfills and DOM matchers
│   └── unit/                     # Unit test suites for slices, persistence, normalizers, formatters
├── next.config.ts                # Security headers and remote image patterns
├── package.json                  # Scripts and dependencies
├── playwright.config.ts          # Playwright test configuration
└── vitest.config.ts              # Vitest test configuration
```

---

## API Reference

### `GET /api/news`
Fetches top headlines by category or searches articles across all publications.

- **Query Parameters:**
  - `category` (optional, string): Comma-separated categories (`technology,sports,finance,entertainment,health,science,business,general`).
  - `q` (optional, string): Keyword search query (max 100 characters).
  - `page` (optional, integer): Page number (min 1, default 1).
  - `pageSize` (optional, integer): Items per page (min 1, max 50, default 12).
- **Example Request:** `GET /api/news?category=technology&pageSize=2`
- **Example Response:**
  <details>
  <summary>View JSON Response</summary>

  ```json
  {
    "items": [
      {
        "id": "news:q3sj1a",
        "type": "news",
        "title": "AT&T Acknowledges iPhone Issues: 'Update Immediately' - MacRumors",
        "description": "AT&T acknowledged that some devices on its network are experiencing cellular issues.",
        "imageUrl": "https://images.macrumors.com/article.jpg",
        "url": "https://www.macrumors.com/news-item",
        "source": "MacRumors",
        "category": "technology",
        "publishedAt": "2026-10-02T03:42:00Z",
        "popularity": 50
      }
    ],
    "page": 1,
    "pageSize": 2,
    "totalResults": 69,
    "hasMore": true,
    "isDemo": false,
    "source": "NewsAPI"
  }
  ```
  </details>

---

### `GET /api/recommendations`
Fetches movie recommendations mapped from topic genres, user history, or trending feeds.

- **Query Parameters:**
  - `genres` (optional, string): Comma-separated news category aliases mapped to TMDB IDs.
  - `q` (optional, string): Keyword search string.
  - `trending` (optional, boolean): If `true`, returns `/trending/movie/day`.
  - `historyTmdbId` (optional, integer): TMDB movie ID to personalize recommendations.
  - `page` (optional, integer): Page number (default 1).
- **Example Request:** `GET /api/recommendations?page=1&trending=true`
- **Example Response:**
  <details>
  <summary>View JSON Response</summary>

  ```json
  {
    "items": [
      {
        "id": "movie:969681",
        "type": "movie",
        "title": "Spider-Man: Brand New Day",
        "description": "Fighting crime full-time as Spider-Man in a world that doesn't remember him.",
        "imageUrl": "https://image.tmdb.org/t/p/w500/poster.jpg",
        "url": "https://www.themoviedb.org/movie/969681",
        "source": "TMDB",
        "category": "Action",
        "publishedAt": "2026-09-07T00:00:00.000Z",
        "popularity": 267
      }
    ],
    "page": 1,
    "pageSize": 20,
    "totalResults": 20001,
    "hasMore": true,
    "isDemo": false,
    "source": "TMDB"
  }
  ```
  </details>

---

### `GET /api/social`
Serves simulated community discourse from a seeded 65-post dataset with varied handles, engagement metrics, and timestamps.

- **Query Parameters:**
  - `hashtags` (optional, string): Comma-separated hashtags to filter posts.
  - `q` (optional, string): Keyword search filter.
  - `trending` (optional, boolean): If `true`, sorts posts by engagement score desc.
  - `page` (optional, integer): Page number (default 1).
  - `pageSize` (optional, integer): Items per page (default 8).
- **Example Request:** `GET /api/social?hashtags=technology,webdev&page=1`
- **Example Response:**
  <details>
  <summary>View JSON Response</summary>

  ```json
  {
    "items": [
      {
        "id": "social:1",
        "type": "social",
        "title": "Just benchmarked the new compiler pipeline in Next.js 16.",
        "description": "Server component payload serialization is almost 40% faster.",
        "imageUrl": "https://images.unsplash.com/photo.jpg",
        "url": "https://x.com/search?q=%23technology&f=live",
        "source": "@sarahc_dev",
        "category": "technology",
        "publishedAt": "2026-10-02T12:00:00Z",
        "popularity": 420,
        "hashtags": ["technology", "webdev", "nextjs"],
        "author": {
          "name": "Sarah Chen",
          "handle": "@sarahc_dev",
          "avatarUrl": "https://images.unsplash.com/avatar.jpg"
        }
      }
    ],
    "page": 1,
    "pageSize": 8,
    "totalResults": 65,
    "hasMore": true,
    "isDemo": true,
    "source": "Social Feed (Mock API)"
  }
  ```
  </details>

- **Error Format:**
  ```json
  {
    "error": {
      "code": "INVALID_QUERY_PARAMS" | "RATE_LIMITED" | "UPSTREAM_ERROR" | "INTERNAL_SERVER_ERROR",
      "message": "Human-readable explanation of error condition."
    }
  }
  ```

---

## State Management and Persistence

The client store is maintained via Redux Toolkit with strict separation of concerns:

| Slice | State Shape | Primary Actions | Persisted? |
| :--- | :--- | :--- | :--- |
| `preferencesSlice` | `{ categories: string[], hashtags: string[], theme: string, language: string }` | `toggleCategory`, `setCategories`, `addHashtag`, `removeHashtag`, `setTheme`, `resetPreferences` | **Yes** |
| `favoritesSlice` | `{ items: Record<string, ContentItem> }` | `toggleFavorite`, `clearFavorites` | **Yes** |
| `feedOrderSlice` | `{ customOrderIds: string[] }` | `reorder`, `moveItemByStep`, `setCustomOrder`, `resetOrder` | **Yes** |
| `historySlice` | `{ items: HistoryItem[] }` (last 20 interactions) | `recordHistory`, `clearHistory` | **Yes** |
| `searchSlice` | `{ query: string, filterType: FeedFilterType }` | `setQuery`, `setFilterType`, `clearSearch` | No (Ephemeral) |
| `uiSlice` | `{ mobileSidebarOpen: boolean, settingsDrawerOpen: boolean, demoBannerDismissed: boolean, toasts: Toast[] }` | `setMobileSidebarOpen`, `toggleSettingsDrawer`, `dismissDemoBanner`, `showToast` | No (Ephemeral) |

### Persistence Mechanism
1. **Synchronous Subscription:** Local storage updates occur synchronously in `store.subscribe` using a versioned key (`pcd:v1`), ensuring no state changes are lost before immediate page reloads.
2. **Corruption & Quota Guard:** Wrapped in `try/catch`. If corrupted JSON or storage quota exceptions are detected, the store logs a safe warning, recovers cleanly, and resets to valid defaults without crashing.
3. **Hydration Safety:** Redux state initializes on the client via `StoreProvider` without causing SSR hydration mismatches.

---

## UX, Accessibility, and Performance

- **Keyboard Focus Management:** Visible `focus-visible:ring-2` outline rings across all interactive buttons, inputs, tabs, and links. A skip link (`#main-content`) allows bypassing navigation directly to content.
- **Accessibility (WCAG 2.1 AA):** Automated testing via `@axe-core/playwright` validates zero accessibility violations across `/feed`, `/trending`, and `/favorites` in both light and dark modes.
- **Reordering Accessibility:** Screen-reader users can adjust card positions via accessible Move Up and Move Down buttons with `aria-live="polite"` status announcements (e.g. *"Moved Dune: Part Two down to position 3 of 27"*).
- **Reduced Motion:** Incorporates Framer Motion's `useReducedMotion` hook; users with `prefers-reduced-motion: reduce` experience instantaneous transitions without disorienting spring animations.
- **Debounced Search:** Keyboard input is debounced to 400ms (`useDebouncedValue`) before triggering RTK Query requests, preventing network spam while maintaining responsiveness.
- **Image Optimization:** Uses `next/image` with explicit aspect ratios (`16:9`) and sizes attributes to eliminate Cumulative Layout Shift (CLS). Unoptimized mode is enabled for external news domains to prevent server-side hotlink blocks.

---

## Security Posture

1. **Server Isolation of Secrets:** Private keys (`NEWSAPI_KEY`, `TMDB_API_KEY`) reside exclusively in server-side runtime environments. Verified by scanning production bundles in `.next/static` with zero occurrences of secret names.
2. **Input Sanitization:** All incoming text descriptions from external news providers are stripped of HTML tags via regex sanitizers without `dangerouslySetInnerHTML`.
3. **External Link Hardening:** Outgoing links enforce `rel="noopener noreferrer"` and validate protocols (`http:` and `https:` only) to prevent tab-nabbing and protocol smuggling.
4. **Security Headers:** Configured in `next.config.ts`:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `Referrer-Policy: strict-origin-when-cross-origin`

---

## Testing Suite

Curate employs a multi-layered testing strategy combining unit tests, MSW-mocked integration suites, and full browser E2E journeys.

```bash
# Run ESLint 9 rules
npm run lint

# Run TypeScript compiler checks in strict mode
npm run typecheck

# Run Vitest unit and integration test suite
npm test

# Run tests with V8 coverage report
npm run test:coverage

# Run Playwright E2E and axe-core accessibility tests
npm run e2e
```

### Test Layers and Real Execution Metrics

*(Measured on October 3, 2026 across 21 test files)*

| Layer | Framework | Count | Coverage Summary | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Unit Tests** | Vitest + RTL | 65 tests | `hooks`: **96.5%**<br />`normalizers`: **98.3%**<br />`store/slices`: **91.1%**<br />`lib`: **85.7%** | Validates reducers, selectors, sanitizers, debouncing, and formatting. |
| **Integration** | Vitest + MSW | 16 tests | Included above | Intercepts `/api/*` endpoints to test loading, error states, and preference updates. |
| **End-to-End** | Playwright | 14 tests | Desktop Chrome + Mobile (Pixel 5) | Tests full browser user journeys from clean clone with zero API keys. |
| **Total** | Multi-tool | **95 tests** | **100% Passing** | Comprehensive automated quality assurance. |

### E2E User Journeys

1. **Feed Initialization:** Verifies header, navigation, demo badge, and card rendering.
2. **Search Journey:** Types query, verifies 400ms debounce, confirms URL sync (`?q=`), and tests clearing.
3. **Card Reordering:** Tests keyboard Move Down alternative, asserts new order, reloads page, and confirms persistence.
4. **Favorites Workflow:** Favorites card, navigates to `/favorites`, reloads page, asserts persistence, and unfavorites.
5. **Zero-Flash Dark Mode:** Toggles theme, verifies `.dark` class, reloads page, and asserts theme persistence.
6. **Live Settings Update:** Opens settings drawer, selects new category chip, closes drawer, and verifies feed updates.
7. **Automated Axe-Core Audits:** Scans `/feed`, `/trending`, and `/favorites` for WCAG 2.1 AA violations.

---

## User Flow Walkthrough

```
1. Initial Load (Zero Keys)
   ├── Land on http://localhost:3000/feed
   ├── Demo mode badge appears notifying of curated fixtures
   └── 36 balanced cards (news, movies, social) load in round-robin sequence

2. Feed Customization
   ├── Click "Customize Feed" button in feed header
   ├── Add "Science" and "Entertainment" category chips
   └── Feed immediately re-queries and updates stream

3. Reordering Cards
   ├── Click the "Move Down" arrow on the first card (or drag via grip handle)
   ├── Card animates down to position 2; screen reader announces movement
   └── Reload page -> Custom arrangement is retained from localStorage

4. Saving to Favorites
   ├── Click heart icon on any interesting article or film card
   ├── Heart pops with animation; badge in sidebar increments
   ├── Navigate to "/favorites" -> Saved item renders instantly offline
   └── Reload page -> Item remains safely stored

5. Exploring Trending Hub & Search
   ├── Click "Trending" in sidebar -> Explore Top Headlines, Popular Movies, Community Posts
   ├── Press "/" keyboard shortcut -> Search input focuses instantly
   ├── Type "quantum" -> After 400ms, navigates to "/search?q=quantum"
   └── View parallel search results from all content sources

6. Toggling Dark Mode
   ├── Click theme toggle button in header
   ├── UI shifts seamlessly to high-contrast dark theme
   └── Reload page -> No white flash; theme initializes before paint
```

---

## Deployment Guide

### Deploying to Vercel

1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `curate` repository.
4. In **Environment Variables**, optionally supply:
   - `NEWSAPI_KEY`: Your NewsAPI key.
   - `TMDB_API_KEY`: Your TMDB API key.
   - `NEXT_PUBLIC_APP_URL`: Your deployed production URL.
5. Click **"Deploy"**.

> [!NOTE]
> **NewsAPI Developer Plan Notice:** NewsAPI's free developer plan restricts requests originating from production servers outside of `localhost`. When deployed to Vercel without a commercial NewsAPI tier, Curate gracefully identifies upstream restrictions and falls back to curated fixtures, ensuring evaluators always experience a working application.

---

## Assignment Traceability

| Requirement | Implementation File | Verification Suite | Status |
| :--- | :--- | :--- | :--- |
| **Next.js App Router + Strict TS** | [`tsconfig.json`](tsconfig.json), [`src/app/layout.tsx`](src/app/layout.tsx) | `npm run typecheck`, `npm run build` | Verified |
| **Redux Toolkit + RTK Query** | [`src/store/store.ts`](src/store/store.ts), [`src/services/api.ts`](src/services/api.ts) | Unit tests (81 passed) | Verified |
| **Tailwind CSS + Custom Tokens** | [`src/styles/globals.css`](src/styles/globals.css), [`src/hooks/useTheme.ts`](src/hooks/useTheme.ts) | `e2e/dashboard.spec.ts` | Verified |
| **react-dnd Reorder + A11y** | [`src/components/feed/DraggableCard.tsx`](src/components/feed/DraggableCard.tsx), [`ContentCard.tsx`](src/components/cards/ContentCard.tsx) | `e2e/dashboard.spec.ts` (test 3) | Verified |
| **Keyless Demo Mode** | [`src/components/states/DemoBadge.tsx`](src/components/states/DemoBadge.tsx), `src/mocks/` | `e2e/dashboard.spec.ts` (test 1) | Verified |
| **Offline Favorites** | [`src/app/(dashboard)/favorites/page.tsx`](<src/app/(dashboard)/favorites/page.tsx>) | `e2e/dashboard.spec.ts` (test 4) | Verified |
| **Parallel Debounced Search** | [`src/components/layout/SearchBar.tsx`](src/components/layout/SearchBar.tsx) | `e2e/dashboard.spec.ts` (test 2) | Verified |
| **WCAG 2.1 AA Accessibility** | All components, focus rings, skip links | Playwright axe-core scan (0 violations) | Verified |

Complete matrix available in [docs/REQUIREMENTS_TRACEABILITY.md](docs/REQUIREMENTS_TRACEABILITY.md).

---

## Assumptions and Known Limitations

1. **Social Feed Simulation:** As permitted by the assignment specifications, social discourse is served via `/api/social` using a deterministic 65-post dataset with varied handles, avatar initials, engagement scores, and live X/Twitter search links.
2. **Category to TMDB Genre Mapping:** News topics are mapped to TMDB movie genres via explicit constants (`technology` ➔ Sci-Fi, `sports` ➔ Documentary/Action, `finance` ➔ Drama, `entertainment` ➔ Comedy).
3. **TMDB Regional Routing:** The application uses `api.tmdb.org` as its primary TMDB endpoint to avoid ISP-level connection resets occurring in certain regions.
4. **NewsAPI Origin Limits:** NewsAPI free developer keys only permit requests from `localhost`. On remote cloud deployments, Curate gracefully utilizes fallback fixtures.

---

## Roadmap

- [ ] **Real-Time Streaming:** Server-Sent Events (SSE) route `/api/social/stream` for live community post injection without layout shift.
- [ ] **NextAuth Authentication:** Session-backed authentication with custom user profile avatars and per-user cloud synchronization.
- [ ] **Internationalization (i18n):** Multi-language UI support with `react-i18next` covering English, Spanish, and Hindi.
- [ ] **PWA Offline Service Worker:** Progressive Web App manifest and background service worker caching for offline article reading.
- [ ] **Custom RSS Feed Ingestion:** Ability for users to supply arbitrary RSS/Atom feeds to merge into the personal feed.

---

## Attribution and Acknowledgements

- **NewsAPI:** Breaking news headlines and article search provided by [NewsAPI](https://newsapi.org).
- **The Movie Database (TMDB):** Movie metadata, posters, and recommendations provided by [TMDB](https://themoviedb.org).
  > *This product uses the TMDB API but is not endorsed or certified by TMDB.*
- **Icons:** Lightweight, consistent iconography by [Lucide React](https://lucide.dev).
- **Typography:** Typography rendered with Next.js Google Font integration ([Inter](https://fonts.google.com/specimen/Inter)).

---

## License and Author

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

Developed by **<!-- TODO(owner): your name -->** • [GitHub](<!-- TODO(owner): your github url -->) • [LinkedIn](<!-- TODO(owner): your linkedin url -->)
