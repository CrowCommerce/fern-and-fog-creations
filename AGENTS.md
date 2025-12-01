# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js 16 App Router routes, layouts, and server components.
- `components/`: Reusable UI blocks and layout wrappers; prefer server components unless client state is required.
- `lib/` and `types/`: Shopify/Redis utilities, domain logic, and shared TypeScript types.
- `data/`, `public/`, `emails/`: Seed content, static assets, and React email templates.
- `scripts/`: `tsx` utilities for Shopify metaobject setup and data migrations (all support `--dry-run`).
- `e2e/`: Playwright specs (`.spec.ts`) and `playwright-report/` output.
- `docs/` and `references/`: Product, CMS, and analytics documentation.

## Build, Test, and Development Commands
Use pnpm (see `packageManager` in `package.json`).

```bash
pnpm dev           # Local development with Turbopack
pnpm build         # Production build
pnpm start         # Serve the built app
pnpm lint          # ESLint (Next.js + TypeScript rules)
pnpm test:e2e      # Playwright E2E suite (headless)
pnpm test:e2e:ui   # Inspect E2E runs in Playwright UI
```

## Coding Style & Naming Conventions
- TypeScript strict mode; prefer typed helpers in `lib/` over ad-hoc fetches.
- 2-space indentation; keep imports absolute via `@/` aliases.
- React 19 features are enabled—default to server components; mark client components explicitly.
- Styling: Tailwind CSS v4 with brand tokens (moss/fern/parchment/bark/gold). Keep class names semantic and layered (layout → typography → state).
- Linting is the source of truth; run `pnpm lint` before sending PRs. No auto-formatter is configured—respect existing style.

## Testing Guidelines
- Framework: Playwright (`e2e/*.spec.ts`). Add new flows as `.spec.ts` alongside existing ones.
- Expectations: cover critical storefront paths (navigation, product detail, cart, checkout handoff). Add assertions for SEO metadata when relevant.
- Reporting: `pnpm test:e2e:report` opens the latest HTML report. Upload screenshots/videos to the PR if a failure was investigated.

## Data & Script Usage
- Shopify setup/migration scripts live in `scripts/` (e.g., `pnpm setup:contact`, `pnpm migrate:gallery`). Prefer `:dry` variants first to inspect changes.
- Logs from scripts/tests land in `logs/` and `test-results/`. Keep generated outputs out of commits unless explicitly needed.

## Git Workflow (CRITICAL)

### Atomic Commits - ALWAYS FOLLOW
**Commit after EVERY logical unit of work.** Each commit should be:
- ONE logical change (one component, one fix, one test)
- In working state (tests pass, no type errors)
- Describable in one sentence
- Safely revertable without side effects

### Commit Format
```
<type>(<scope>): <description under 50 chars>

[optional body]

Refs: #issue

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Tests
- `refactor`: Code restructuring
- `style`: Formatting
- `chore`: Maintenance

### Commit Frequency (IMPORTANT)
Commit immediately after each:
- Single feature component added
- Single bug fix completed
- Test suite written for specific function
- Refactoring of single concern

**Example Task Breakdown:**
Instead of: "Implemented user authentication" (too broad)

Break into:
1. `feat(auth): add User model with password hashing`
2. `feat(auth): implement JWT token generation`
3. `feat(auth): create login API endpoint`
4. `test(auth): add unit tests for auth flow`

### Workflow Pattern
1. Implement ONE logical unit
2. Verify changes work
3. Stage relevant files: `git add <files>`
4. Commit immediately with descriptive message
5. Repeat for next unit
6. Push when feature complete

### Reverting Changes
```bash
git reset --soft HEAD~1     # Undo commit, keep changes
git reset --hard HEAD~1     # Undo commit, discard changes (destructive)
git revert <commit-hash>    # Create new commit that undoes changes
git push --force            # Update remote (feature branches only!)
```opening a PR, run `pnpm lint` and the relevant Playwright targets touched by your change.

## Security & Configuration
- Secrets live in `.env.local`; start from `.env.example`. Never commit tokens (Shopify, Sentry, Upstash).
- For instrumentation, Sentry is auto-initialized in `instrumentation.ts` and `app/layout.tsx`; ensure DSNs are set per environment.
- When touching rate limiting or analytics, coordinate with `docs/` owners to keep guidance in sync.
