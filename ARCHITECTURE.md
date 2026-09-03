# Automation Architecture & Key Decisions

## Framework structure

**Page Object Model**, consolidated into a single file (`pages/AppPages.ts`) with one class per screen — `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`. This is a more compact variant of POM than splitting each class into its own file: appropriate at this suite's size (4 screens), though it's worth splitting into separate files if the app under test grows beyond a handful of pages, since a single file gets harder to navigate.

## Locator strategy

`getByTestId()` throughout, backed by `testIdAttribute: 'data-test'` in `playwright.config.ts` — this matches SauceDemo's actual markup convention rather than fighting it with raw CSS selectors. Where no test-id exists, the suite falls back to accessible role-based locators (`getByRole('button', { name: 'Add to cart' })`), which is the right fallback order: test-id first for stability, accessible role second (which doubles as implicit accessibility coverage), raw CSS last.

## Fixtures

`fixtures/test-fixtures.ts` extends Playwright's base `test` with one fixture per page object (`login`, `inventory`, `cart`, `checkout`). This is a lighter-weight fixture layer than a composite pre-authenticated fixture — every test calls `login.goto()` / `login.login()` explicitly rather than starting pre-authenticated. The trade-off: slightly more boilerplate per test, but every test is fully self-contained and readable in isolation without needing to know what a shared fixture does behind the scenes. `utils/flows.ts` adds one composite helper (`loginStandard`) for cases where the full login sequence is genuinely repetitive.

## Test data management

`test-data/data.ts` centralizes users, product references, and — notably — **performance budgets sourced from environment variables** (`INVENTORY_BUDGET_MS`, `CART_BUDGET_MS`, `CHECKOUT_BUDGET_MS`, each with a sensible default). This is a deliberate architectural choice: performance thresholds are environment-dependent (a staging environment behind a VPN will legitimately be slower than production), so hardcoding them in test code would force a code change every time the suite runs somewhere new. Sourcing them from env vars means the same test code runs correctly across environments with just a config change.

## No hard waits

No `waitForTimeout()` anywhere in the suite. Every wait is either Playwright's built-in locator auto-waiting or an explicit `expect(...)` assertion (which also auto-retries). The one place a delay appears (TC-035) is a deliberate `route.continue()` delay used to *test* resilience to slow responses — that's the suite creating a controlled scenario, not the suite waiting on one.

## Assertions & failure diagnostics

Beyond basic visibility/text checks, several assertions target real business logic rather than surface state:
- TC-010 checks the actual computed subtotal (`$39.98`) for a specific two-item combination — a genuine arithmetic check, not just "a number appeared."
- TC-025/026 assert **absence** of sensitive values (credentials, PII) from the URL — a security/privacy-oriented assertion pattern, not just a happy-path check.
- TC-028 inspects cookie flags (`httpOnly`) directly via `context.cookies()`, going beneath the UI layer entirely.

On failure, `playwright.config.ts` retains trace, screenshot, and video (`retain-on-failure` / `only-on-failure`), plus dual reporting: HTML for humans, JUnit XML for CI dashboards that parse structured results natively.

## Category structure via tags, not folders

Rather than splitting scenarios into separate folders per category, this suite tags tests with `@functional`, `@negative`, `@security`, `@privacy`, `@accessibility`, `@network`, `@api`, `@performance`, `@compatibility`, `@smoke` inside `test.describe()` blocks, and `package.json` exposes a matching `npm run test:<category>` script per tag via `--grep`. This means a single test file can carry multiple relevant tags (e.g., `security-privacy.spec.ts` holds both `@security` and `@privacy` describe blocks), and a CI pipeline can cherry-pick exactly which categories to run without restructuring the file layout — useful for the smoke-vs-full-suite split described below.

## Extended coverage beyond core functional testing

This suite goes beyond the take-home task's minimum scope into four additional categories, each with an explicit, documented boundary (`docs/TEST_CATALOG.md`) on what it does and doesn't replace:

- **Accessibility** — `@axe-core/playwright` automated WCAG 2A/2AA scanning, plus manual keyboard-navigation and accessible-name checks. Documented as *not* a substitute for manual assistive-technology testing.
- **Security** — safe, non-destructive checks (password masking, HTTPS enforcement, injection-string rejection, session invalidation, credential-URL-leakage). Documented as *not* a substitute for formal penetration testing, SAST, or DAST.
- **Performance** — lightweight in-browser timing budgets for three key interactions. Documented as *not* a substitute for load/soak/capacity testing (k6, JMeter, or similar).
- **API contract** — since SauceDemo exposes no documented business API, these tests validate observable HTTP-level behavior (status codes, content-type, response health) rather than a real schema contract. Documented as a placeholder pattern to replace once real authenticated endpoints exist.

This "do it lightly, but document the boundary clearly" approach is the right call for a take-home — it demonstrates awareness of these disciplines without overclaiming coverage a demo site can't actually support.

## Parallel & cross-browser/device execution

`fullyParallel: true`, workers capped at 2 in CI (matching typical GitHub Actions runner limits) and uncapped locally. Six projects: three desktop browsers (Chromium, Firefox, WebKit), Edge (conditional on local install), and two mobile emulation profiles (Pixel 7, iPhone 14) — giving both cross-browser and cross-device coverage from the same test bodies.

## CI/CD integration

`.github/workflows/playwright.yml` runs the full suite (`chromium`, `firefox`, `webkit`, `mobile-chrome`, `mobile-safari`) on every push/PR to `main`, plus manual `workflow_dispatch`. Report and trace artifacts are uploaded under `quality-evidence` regardless of outcome (`if: always()`), so a failed CI run still leaves behind everything needed to debug it.

**For extending this into a larger team pipeline**, the natural next steps:

1. **Gate PRs on `@smoke` only**, run the full 45-scenario suite on merge to `main` and nightly — the smoke tag and category-based npm scripts already make this split trivial to wire up; it just needs a second CI job.
2. **Shard the full run** (`--shard=1/3`, `2/3`, `3/3` across parallel jobs) once suite runtime grows — five projects × 45 scenarios is already a meaningful matrix.
3. **Separate the specialist categories** (security/a11y/performance) into their own scheduled workflow rather than blocking every PR — these are valuable as regular health checks but shouldn't slow down routine functional PRs.
4. **Fail the build on axe-core violations explicitly in CI output**, not just in the HTML report, so an accessibility regression is as visible as a functional one in the PR check list.
