import { test } from '../fixtures/test-fixtures';
import { users, products } from '../test-data/data';

test.describe('@functional @negative validation', () => {
  const logins = [
    ['TC-013 locked user', users.locked.username, users.locked.password, 'locked out'],
    ['TC-014 invalid credentials', users.invalid.username, users.invalid.password, 'do not match'],
    ['TC-015 blank username', '', users.standard.password, 'Username is required'],
    ['TC-016 blank password', users.standard.username, '', 'Password is required']
  ] as const;
  for (const [name,u,p,error] of logins) test(name, async ({ login }) => { await login.goto(); await login.login(u,p); await login.expectError(error); });
  const missing = [
    ['TC-017 missing first name', { lastName:'Morgan', postalCode:'560001' }, 'First Name is required'],
    ['TC-018 missing last name', { firstName:'Alex', postalCode:'560001' }, 'Last Name is required'],
    ['TC-019 missing postal code', { firstName:'Alex', lastName:'Morgan' }, 'Postal Code is required']
  ] as const;
  for (const [name,data,error] of missing) test(name, async ({ login, inventory, cart, checkout }) => { await login.goto(); await login.login(users.standard.username, users.standard.password); await inventory.add(products[0].name); await inventory.openCart(); await cart.checkout(); await checkout.fill(data); await checkout.continue(); await checkout.expectError(error); });
  test('TC-020 invalid route does not expose protected data', async ({ page }) => { await page.goto('/checkout-step-two.html'); await page.waitForLoadState('domcontentloaded'); });
});
