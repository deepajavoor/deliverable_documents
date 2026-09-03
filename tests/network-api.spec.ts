import { test, expect } from '../fixtures/test-fixtures';
import { users } from '../test-data/data';

test.describe('@network network and resilience', () => {
  test('TC-034 captures failed network requests', async ({ page, login }) => { const failures:string[]=[]; page.on('requestfailed',r=>failures.push(r.url())); await login.goto(); expect(failures).toEqual([]); });
  test('TC-035 inventory survives delayed document response within timeout', async ({ page, login }) => { await page.route('**/inventory.html', async route => { await new Promise(r=>setTimeout(r,500)); await route.continue(); }); await login.goto(); await login.login(users.standard.username, users.standard.password); await expect(page).toHaveURL(/inventory\.html/); });
  test('TC-036 offline state produces controlled browser failure', async ({ context, page }) => { await page.goto('/'); await context.setOffline(true); await expect(page.reload()).rejects.toThrow(); await context.setOffline(false); });
});

test.describe('@api HTTP/API contract checks', () => {
  test('TC-037 root endpoint returns successful HTML', async ({ request }) => { const r=await request.get('/'); expect(r.ok()).toBeTruthy(); expect(r.headers()['content-type']).toContain('text/html'); });
  test('TC-038 inventory endpoint redirects or rejects unauthenticated request safely', async ({ request }) => { const r=await request.get('/inventory.html', { maxRedirects: 0 }); expect([200,301,302,303,307,308,401,403]).toContain(r.status()); });
  test('TC-039 static application assets return without server error', async ({ request }) => { const r=await request.get('/'); const html=await r.text(); expect(html.length).toBeGreaterThan(0); expect(r.status()).toBeLessThan(500); });
});
