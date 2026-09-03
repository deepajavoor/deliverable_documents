# SauceDemo Enterprise Playwright Automation Suite

## Scope
A 45-scenario automation package covering positive and negative functional testing, security, privacy, accessibility, network resilience, HTTP/API contracts, lightweight performance budgets, and cross-browser/cross-platform compatibility, against [saucedemo.com](https://www.saucedemo.com/).

## Prerequisites
- Node.js 20+
- npm

## Setup
```bash
npm install
npx playwright install --with-deps
```

## Run
```bash
npm test                   # full suite, all projects
npm run test:smoke         # @smoke-tagged critical-path subset
npm run test:functional    # @functional
npm run test:security      # @security
npm run test:privacy       # @privacy
npm run test:a11y          # @accessibility
npm run test:network       # @network
npm run test:api           # @api
npm run test:performance   # @performance
npm run test:compatibility # @compatibility
npm run test:desktop       # chromium + firefox + webkit
npm run test:mobile        # mobile-chrome + mobile-safari
npm run typecheck          # TypeScript check only, no test execution
npm run report              # open the last HTML report
```

The `edge` project (`playwright.config.ts`) requires Microsoft Edge to be installed locally. If Edge is unavailable, omit `--project=edge` or remove that project from the config.

## Viewing results
```bash
npm run report
```
Opens `playwright-report/` — pass/fail status, timings, and for any failed
test: screenshot, video, and trace. To inspect a trace directly:
```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

## Project structure
```
├── pages/AppPages.ts       # Page Object Model — LoginPage, InventoryPage, CartPage, CheckoutPage
├── fixtures/test-fixtures.ts   # typed fixture injection (login, inventory, cart, checkout)
├── utils/flows.ts          # composite flows (e.g. loginStandard) shared across specs
├── test-data/data.ts       # users, products, configurable performance budgets
├── tests/                  # category-specific specs with traceable TC-### identifiers
├── docs/TEST_CATALOG.md    # coverage summary and scope limitations
├── playwright.config.ts    # HTML/JUnit reporting, parallel execution, desktop/mobile/edge projects
└── .github/workflows/playwright.yml   # CI pipeline
```

## Threshold configuration
```bash
INVENTORY_BUDGET_MS=4000 CART_BUDGET_MS=1500 CHECKOUT_BUDGET_MS=2000 npm run test:performance
```
These values are proposed defaults, not committed client SLAs — adjust via environment variables per environment.

## Reports and diagnostics
- HTML report: `playwright-report/`
- JUnit: `test-results/junit.xml`
- Trace, screenshot, and video retained on failure

## Quality caveats
See `docs/TEST_CATALOG.md`. This suite is designed for SauceDemo's observable UI and HTTP behavior. Formal load testing, penetration testing, privacy-compliance auditing, and assistive-technology assessment require their respective specialist tools and agreed environments — this suite does not substitute for any of those.

## Fix applied before first run
`playwright.config.ts` was missing `testIdAttribute: 'data-test'`. SauceDemo's markup uses the `data-test` attribute, not Playwright's default `data-testid` — without this line, all 29 `getByTestId()` call sites across the framework would silently match zero elements and time out. This is now set in `use: { testIdAttribute: 'data-test' }`. `@types/node` was also missing from `package.json`, which broke `process.env` references in the config and test data files; both are fixed in this copy. See `TEST_EXECUTION_REPORT.md` for full detail.
