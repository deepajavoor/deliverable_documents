import { expect, Locator, Page } from '@playwright/test';

type Customer = { firstName: string; lastName: string; postalCode: string };

export class LoginPage {
  readonly error: Locator;
  constructor(private readonly page: Page) { this.error = page.getByTestId('error'); }
  async goto() { await this.page.goto('/'); }
  async login(username: string, password: string) {
    await this.page.getByRole('username').fill(username);
    await this.page.getByRole('password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
  async expectError(text: string) { await expect(this.error).toContainText(text); }
}

export class InventoryPage {
  readonly items: Locator;
  constructor(private readonly page: Page) { this.items = page.getByTestId('inventory-item'); }
  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.page.getByTestId('title')).toHaveText('Products');
    await expect(this.items).toHaveCount(6);
  }
  item(name: string) { return this.items.filter({ hasText: name }); }
  async add(name: string) { await this.item(name).getByRole('button', { name: 'Add to cart' }).click(); }
  async remove(name: string) { await this.item(name).getByRole('button', { name: 'Remove' }).click(); }
  async expectCartCount(count: number) {
    const badge = this.page.getByTestId('shopping-cart-badge');
    if (count === 0) await expect(badge).toHaveCount(0); else await expect(badge).toHaveText(String(count));
  }
  async openCart() { await this.page.getByTestId('shopping-cart-link').click(); }
}

export class CartPage {
  readonly items: Locator;
  constructor(private readonly page: Page) { this.items = page.getByTestId('inventory-item'); }
  async expectItem(name: string, price: string, quantity = 1) {
    const row = this.items.filter({ hasText: name });
    await expect(row).toBeVisible();
    await expect(row.getByTestId('inventory-item-price')).toHaveText(price);
    await expect(row.getByTestId('item-quantity')).toHaveText(String(quantity));
  }
  async remove(name: string) { await this.items.filter({ hasText: name }).getByRole('button', { name: 'Remove' }).click(); }
  async checkout() { await this.page.getByTestId('checkout').click(); }
}

export class CheckoutPage {
  constructor(private readonly page: Page) {}
  async fill(data: Partial<Customer>) {
    if (data.firstName !== undefined) await this.page.getByTestId('firstName').fill(data.firstName);
    if (data.lastName !== undefined) await this.page.getByTestId('lastName').fill(data.lastName);
    if (data.postalCode !== undefined) await this.page.getByTestId('postalCode').fill(data.postalCode);
  }
  async continue() { await this.page.getByTestId('continue').click(); }
  async finish() { await this.page.getByTestId('finish').click(); }
  async expectError(text: string) { await expect(this.page.getByTestId('error')).toContainText(text); }
  async expectConfirmation() {
    await expect(this.page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
  }
}
