import { test, expect } from '../fixtures/test-fixtures';
import { users, products, performanceBudgetMs } from '../test-data/data';

async function elapsed(action:()=>Promise<void>) { const start=Date.now(); await action(); return Date.now()-start; }
test.describe('@performance lightweight browser performance budgets', () => {
  test('TC-040 inventory navigation meets budget', async ({ login }) => { await login.goto(); const ms=await elapsed(()=>login.login(users.standard.username, users.standard.password)); expect(ms).toBeLessThan(performanceBudgetMs.inventoryLoad); });
  test('TC-041 add-to-cart interaction meets budget', async ({ login, inventory }) => { await login.goto(); await login.login(users.standard.username, users.standard.password); const ms=await elapsed(()=>inventory.add(products[0].name)); expect(ms).toBeLessThan(performanceBudgetMs.addToCart); });
  test('TC-042 checkout navigation meets budget', async ({ login, inventory, cart }) => { await login.goto(); await login.login(users.standard.username, users.standard.password); await inventory.add(products[0].name); await inventory.openCart(); const ms=await elapsed(()=>cart.checkout()); expect(ms).toBeLessThan(performanceBudgetMs.checkoutNavigation); });
});
