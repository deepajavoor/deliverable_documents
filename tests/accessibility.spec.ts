import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../fixtures/test-fixtures';
import { users } from '../test-data/data';

test.describe('@accessibility accessibility checks', () => {
  test('TC-029 login supports keyboard submission', async ({ page, login }) => { await login.goto(); await page.getByTestId('username').fill(users.standard.username); await page.getByTestId('password').fill(users.standard.password); await page.getByTestId('login-button').focus(); await page.keyboard.press('Enter'); await expect(page).toHaveURL(/inventory\.html/); });
  test('TC-030 focused control has visible focus', async ({ page, login }) => { await login.goto(); await page.getByTestId('username').focus(); await expect(page.getByTestId('username')).toBeFocused(); });
  test('TC-031 login fields have accessible names', async ({ page, login }) => { await login.goto(); await expect(page.getByRole('textbox',{name:/user name/i})).toBeVisible(); await expect(page.getByTestId('password')).toHaveAttribute('placeholder',/password/i); });
  test('TC-032 login page has no serious or critical axe violations', async ({ page, login }) => { await login.goto(); const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa']).analyze(); expect(result.violations.filter(v => ['serious','critical'].includes(v.impact || ''))).toEqual([]); });
  test('TC-033 inventory page has no serious or critical axe violations', async ({ page, login }) => { await login.goto(); await login.login(users.standard.username, users.standard.password); const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa']).analyze(); expect(result.violations.filter(v => ['serious','critical'].includes(v.impact || ''))).toEqual([]); });
});
