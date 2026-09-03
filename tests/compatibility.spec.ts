import { test, expect } from '../fixtures/test-fixtures';
import { users, products } from '../test-data/data';

test.describe('@compatibility cross-browser and cross-platform', () => {
  test('TC-043 core journey renders on configured browser/platform', async ({ page, login, inventory }) => { await login.goto(); await login.login(users.standard.username, users.standard.password); await inventory.expectLoaded(); await inventory.add(products[0].name); await inventory.expectCartCount(1); await expect(page.locator('body')).toBeVisible(); });
  test('TC-044 responsive inventory has no horizontal overflow', async ({ page, login }) => { await login.goto(); await login.login(users.standard.username, users.standard.password); const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})); expect(sizes.scroll).toBeLessThanOrEqual(sizes.client+1); });
  test('TC-045 navigation and cart remain usable at mobile viewport', async ({ page, login, inventory }) => { await page.setViewportSize({width:390,height:844}); await login.goto(); await login.login(users.standard.username, users.standard.password); await inventory.add(products[0].name); await expect(page.getByTestId('shopping-cart-link')).toBeVisible(); });
});
