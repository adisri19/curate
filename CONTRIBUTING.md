# Contributing to Curate

Thank you for your interest in contributing to **Curate**. We welcome contributions that improve code quality, accessibility, performance, and documentation.

---

## 🛠️ Development Setup

### Prerequisites
- **Node.js:** `>= 18.18.0` (Node 20 or 22 LTS recommended)
- **npm:** `>= 9.0.0`

### Initial Installation
```bash
git clone https://github.com/<!-- TODO(owner): your-username -->/curate.git
cd curate
npm install
```

### Running the App
```bash
# Starts development server on http://localhost:3000 with zero keys needed
npm run dev
```

---

## 📜 Available Scripts

Before submitting a Pull Request, ensure all quality scripts pass:

```bash
# 1. Typecheck (TypeScript strict mode)
npm run typecheck

# 2. Linting (ESLint 9)
npm run lint

# 3. Unit and integration tests (Vitest + RTL + MSW)
npm test

# 4. Coverage report
npm run test:coverage

# 5. Production build
npm run build

# 6. End-to-End and accessibility tests (Playwright + axe-core)
npm run e2e
```

---

## 💬 Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` Adds a new user-facing feature or capability
- `fix:` Patches a bug or addresses an issue
- `test:` Adds or updates unit, integration, or E2E tests
- `docs:` Documentation updates, diagrams, or guides
- `refactor:` Code refactoring without changing observable behavior
- `chore:` Dependency bumps, tooling configuration, or build scripts

---

## 🧪 Testing Guidelines

1. **Unit Tests:** Place in `tests/unit/` adjacent to relevant domain slices, formatters, and components.
2. **Integration Tests:** Place in `tests/integration/`. Use MSW (`server.use(...)`) to mock network conditions and test empty, error, and partial-failure states.
3. **E2E Tests:** Place in `e2e/`. Use Playwright locators (`getByRole`, `locator('[data-testid="..."]')`). Ensure axe-core audits pass with zero WCAG 2.1 AA violations.
