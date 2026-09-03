import { test as base } from '@playwright/test';
import { LoginPage, InventoryPage, CartPage, CheckoutPage } from '../pages/AppPages';

type Fixtures = { login: LoginPage; inventory: InventoryPage; cart: CartPage; checkout: CheckoutPage };
export const test = base.extend<Fixtures>({
  login: async ({ page }, use) => use(new LoginPage(page)),
  inventory: async ({ page }, use) => use(new InventoryPage(page)),
  cart: async ({ page }, use) => use(new CartPage(page)),
  checkout: async ({ page }, use) => use(new CheckoutPage(page))
});
export { expect } from '@playwright/test';
