import { Page } from '@playwright/test';
import { LoginPage, InventoryPage } from '../pages/AppPages';
import { users } from '../test-data/data';
export async function loginStandard(page: Page) {
  const login = new LoginPage(page); const inventory = new InventoryPage(page);
  await login.goto(); await login.login(users.standard.username, users.standard.password); await inventory.expectLoaded();
}
