export const users = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  invalid: { username: 'invalid_user', password: 'wrong_password' }
} as const;

export const customer = { firstName: 'Alex', lastName: 'Morgan', postalCode: '560001' } as const;
export const products = [
  { name: 'Sauce Labs Backpack', price: '$29.99' },
  { name: 'Sauce Labs Bike Light', price: '$9.99' }
] as const;
export const performanceBudgetMs = {
  inventoryLoad: Number(process.env.INVENTORY_BUDGET_MS || 4000),
  addToCart: Number(process.env.CART_BUDGET_MS || 1500),
  checkoutNavigation: Number(process.env.CHECKOUT_BUDGET_MS || 2000)
};
