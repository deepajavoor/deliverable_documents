# SauceDemo Enterprise Playwright Automation Suite

## Scope
A 45-scenario automation package covering positive and negative functional testing, security, privacy, accessibility, network resilience, HTTP/API contracts, lightweight performance budgets, and cross-browser/cross-platform compatibility.

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
npm test
npm run test:functional
npm run test:security
npm run test:privacy
npm run test:a11y
npm run test:network
npm run test:api
npm run test:performance
npm run test:desktop
npm run test:mobile
npm run report
```

The Edge project requires Microsoft Edge to be installed. If Edge is unavailable, omit `--project=edge` or remove the project locally.

## Architecture
- `pages/`: page objects for reusable business actions.
- `fixtures/`: typed fixture injection per isolated test.
- `test-data/`: users, products and configurable performance budgets.
- `tests/`: category-specific specifications with traceable TC identifiers.
- `docs/TEST_CATALOG.md`: coverage summary and scope limitations.
- `playwright.config.ts`: HTML/JUnit reports, parallel execution, desktop/mobile projects and failure diagnostics.

## Threshold configuration
```bash
INVENTORY_BUDGET_MS=4000 CART_BUDGET_MS=1500 CHECKOUT_BUDGET_MS=2000 npm run test:performance
```
These values are proposed defaults, not committed client SLAs.

## Reports and diagnostics
- HTML report: `playwright-report/`
- JUnit: `test-results/junit.xml`
- Trace, screenshot and video retained on failure

## Quality caveats
Review `docs/TEST_CATALOG.md`. The suite is designed for SauceDemo's observable UI and HTTP behavior. Formal load, penetration, privacy-compliance and assistive-technology assessments require their respective specialist tools and agreed environments.
