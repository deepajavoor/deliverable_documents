import { test, expect } from '../fixtures/test-fixtures';
import { users, customer, products } from '../test-data/data';

test.describe('@security safe browser security checks', () => {
  test('TC-021 password field is masked', async ({ page, login }) => { await login.goto(); await expect(page.getByTestId('password')).toHaveAttribute('type','password'); });
  test('TC-022 HTTPS is enforced', async ({ page }) => { await page.goto('/'); expect(page.url()).toMatch(/^https:/); });
  test('TC-023 common injection text does not authenticate', async ({ login }) => { await login.goto(); await login.login("' OR '1'='1", 'x'); await login.expectError('do not match'); });
  test('TC-024 session cannot use inventory after logout', async ({ page, login }) => { await login.goto(); await login.login(users.standard.username, users.standard.password); await page.getByRole('button',{name:'Open Menu'}).click(); await page.getByTestId('logout-sidebar-link').click(); await page.goto('/inventory.html'); await expect(page).not.toHaveURL(/inventory\.html$/); });
  test('TC-025 credentials are absent from URL', async ({ page, login }) => { await login.goto(); await login.login(users.standard.username, users.standard.password); expect(page.url()).not.toContain(users.standard.password); expect(page.url()).not.toContain(users.standard.username); });
});

test.describe('@privacy client-side privacy checks', () => {
  test('TC-026 customer PII is absent from URL', async ({ page, login, inventory, cart, checkout }) => { await login.goto(); await login.login(users.standard.username, users.standard.password); await inventory.add(products[0].name); await inventory.openCart(); await cart.checkout(); await checkout.fill(customer); await checkout.continue(); for (const value of Object.values(customer)) expect(page.url()).not.toContain(value); });
  test('TC-027 customer PII is not persisted in local storage', async ({ page, login, inventory, cart, checkout }) => { await login.goto(); await login.login(users.standard.username, users.standard.password); await inventory.add(products[0].name); await inventory.openCart(); await cart.checkout(); await checkout.fill(customer); const storage = await page.evaluate(() => JSON.stringify(localStorage)); for (const value of Object.values(customer)) expect(storage).not.toContain(value); });
  test('TC-028 authentication cookie is not exposed to page script when present', async ({ page, login, context }) => { await login.goto(); await login.login(users.standard.username, users.standard.password); const cookies = await context.cookies(); const sessionLike = cookies.filter(c => /session|auth|token/i.test(c.name)); for (const cookie of sessionLike) expect(cookie.httpOnly).toBeTruthy(); });
});
