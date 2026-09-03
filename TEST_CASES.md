# Test Case / Scenario Document

45 scenarios across 9 categories. IDs are traceable directly to `test('TC-### ...')` names in `tests/*.spec.ts`.

## Functional — Positive (`tests/functional.spec.ts`) — 12

| ID | Scenario | Expected Result | Tag |
|---|---|---|---|
| TC-001 | Valid login shows inventory | Redirect to `/inventory.html`, "Products" title visible, 6 items | `@smoke` |
| TC-002 | Inventory cards show names and prices | Each configured product's name and price visible on inventory page | |
| TC-003 | Add one product | Cart badge shows "1" | |
| TC-004 | Add multiple products | Cart badge shows "2" | `@smoke` |
| TC-005 | Cart has correct product quantity and price | Cart page reflects same name/price as inventory for each item | |
| TC-006 | Remove product from inventory | Cart badge returns to absent/0 | |
| TC-007 | Remove product from cart | Cart item count is 0 after removal | |
| TC-008 | Continue shopping returns to inventory | Inventory page reloads correctly | |
| TC-009 | Valid checkout reaches overview | URL matches `checkout-step-two.html` | |
| TC-010 | Order subtotal is correct | Subtotal label shows `$39.98` for the two configured products | |
| TC-011 | Complete order confirmation | "Thank you for your order!" confirmation shown | `@smoke` |
| TC-012 | Sort products low to high | Displayed prices are in ascending order | |

## Functional — Negative (`tests/negative.spec.ts`) — 8

| ID | Scenario | Expected Result |
|---|---|---|
| TC-013 | Locked-out user login | Error contains "locked out" |
| TC-014 | Invalid credentials | Error contains "do not match" |
| TC-015 | Blank username | Error: "Username is required" |
| TC-016 | Blank password | Error: "Password is required" |
| TC-017 | Missing first name at checkout | Error: "First Name is required" |
| TC-018 | Missing last name at checkout | Error: "Last Name is required" |
| TC-019 | Missing postal code at checkout | Error: "Postal Code is required" |
| TC-020 | Direct navigation to `checkout-step-two.html` without a session | Page load completes — **see quality note below** |

## Security (`tests/security-privacy.spec.ts`) — 5

| ID | Scenario | Expected Result |
|---|---|---|
| TC-021 | Password field is masked | Input `type="password"` |
| TC-022 | HTTPS is enforced | URL starts with `https:` |
| TC-023 | SQL-injection-style login attempt | Rejected with standard "do not match" error, no auth bypass |
| TC-024 | Session invalid after logout | Direct navigation to `/inventory.html` post-logout does not stay on that URL |
| TC-025 | Credentials absent from URL | URL contains neither username nor password after login |

## Privacy (`tests/security-privacy.spec.ts`) — 3

| ID | Scenario | Expected Result |
|---|---|---|
| TC-026 | Customer PII absent from URL | Checkout URL contains none of the entered first name/last name/postal code |
| TC-027 | Customer PII not in localStorage | Serialized localStorage contains none of the entered customer field values |
| TC-028 | Auth cookies are HttpOnly when present | Any cookie matching `session\|auth\|token` has `httpOnly: true` |

## Accessibility (`tests/accessibility.spec.ts`) — 5

| ID | Scenario | Expected Result |
|---|---|---|
| TC-029 | Login supports keyboard submission | Enter key on focused login button submits and navigates to inventory |
| TC-030 | Focused control has visible focus | Username field reports `toBeFocused()` after `.focus()` |
| TC-031 | Login fields have accessible names | Username field matches accessible textbox role/name; password has a placeholder |
| TC-032 | Login page — no serious/critical axe violations | axe-core (`wcag2a`, `wcag2aa`) reports zero serious/critical violations |
| TC-033 | Inventory page — no serious/critical axe violations | Same axe check, post-login |

## Network / Resilience (`tests/network-api.spec.ts`) — 3

| ID | Scenario | Expected Result |
|---|---|---|
| TC-034 | No failed network requests on login page load | Zero entries captured on the page's `requestfailed` event |
| TC-035 | Inventory survives a delayed document response | Login still succeeds with a 500ms artificial delay injected via route interception |
| TC-036 | Offline state produces a controlled failure | `page.reload()` under `context.setOffline(true)` rejects (does not hang or crash silently) |

## HTTP / API Contract (`tests/network-api.spec.ts`) — 3

| ID | Scenario | Expected Result |
|---|---|---|
| TC-037 | Root endpoint returns successful HTML | `200 OK`, `content-type: text/html` |
| TC-038 | Unauthenticated request to inventory endpoint | Status is one of `200/301/302/303/307/308/401/403` — no 5xx |
| TC-039 | Static assets return without server error | Response body non-empty, status `< 500` |

## Performance Budgets (`tests/performance.spec.ts`) — 3

| ID | Scenario | Budget (default, env-overridable) |
|---|---|---|
| TC-040 | Login-to-inventory navigation time | < 4000ms (`INVENTORY_BUDGET_MS`) |
| TC-041 | Add-to-cart interaction time | < 1500ms (`CART_BUDGET_MS`) |
| TC-042 | Checkout navigation time | < 2000ms (`CHECKOUT_BUDGET_MS`) |

## Cross-Browser / Compatibility (`tests/compatibility.spec.ts`) — 3

| ID | Scenario | Expected Result |
|---|---|---|
| TC-043 | Core journey renders on configured browser/platform | Login → add to cart → cart count "1", body visible |
| TC-044 | No horizontal overflow on inventory page | `scrollWidth <= clientWidth + 1` |
| TC-045 | Navigation and cart usable at mobile viewport (390×844) | Cart link visible after add-to-cart at mobile size |

---

## Quality note: TC-020

TC-020's name ("invalid route does not expose protected data") implies a security assertion, but the current test body only navigates to `/checkout-step-two.html` and waits for `domcontentloaded` — **it contains no assertion**, so it will pass regardless of whether the page actually exposes anything. This doesn't affect the other 44 scenarios, but as written, TC-020 doesn't verify what its name claims. Recommend either asserting the app redirects away from the protected route (e.g. `expect(page).not.toHaveURL(/checkout-step-two/)`) or renaming the test to reflect what it actually checks.

## Coverage against take-home task requirements

- ✅ Valid + invalid/locked-out login
- ✅ Inventory page verification
- ✅ Cart — correct products, count, quantities, prices
- ✅ Full checkout with valid info + order confirmation
- ✅ 8 negative scenarios (task required minimum 2)
- ✅ Bonus: CI via GitHub Actions, screenshots/traces on failure
- ➕ Beyond task scope: security, privacy, accessibility (axe-core), network resilience, API contract, and performance-budget categories — see `docs/TEST_CATALOG.md` for the scope caveats on each of these categories (they are lightweight/observable checks, not a substitute for formal specialist tooling).
