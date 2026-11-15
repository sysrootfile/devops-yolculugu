import { test, expect } from '@playwright/test';

// Site alt yolu (GitHub Pages base — astro.config.mjs ile uyumlu)
const BASE = '/devops-yolculugu';

test('ana sayfa yüklenir ve müfredatı listeler', async ({ page }) => {
  await page.goto(`${BASE}/`);
  await expect(page.locator('h1')).toHaveText('DevOps Yolculuğu');
  await expect(page.locator('a.lesson-row')).not.toHaveCount(0);
  await expect(page.locator('#stat-pct')).toBeVisible();
});

test('ders sayfası açılır ve quiz doğru cevabı işaretler', async ({ page }) => {
  await page.goto(`${BASE}/ders/seviye-0/devops-nedir/`);
  const correct = page
    .locator('section[data-quiz-id="s0-devops-nedir"] .q-item[data-q="0"] .q-option[data-answer="1"]')
    .first();
  await correct.click();
  await expect(correct).toHaveClass(/correct/);
  await expect(page.locator('section[data-quiz-id="s0-devops-nedir"] .score-text')).toContainText('1 doğru');
});

test('tema değişimi kalıcıdır', async ({ page }) => {
  await page.goto(`${BASE}/`);
  const before = await page.locator('html').getAttribute('data-theme');
  await page.locator('button.theme-toggle').click();
  const after = await page.locator('html').getAttribute('data-theme');
  expect(after).not.toBe(before);
  const stored = await page.evaluate(() => localStorage.getItem('dy:theme'));
  expect(stored).toBe(after);
});

test('arama kutusu sonuç döndürür', async ({ page }) => {
  await page.goto(`${BASE}/`);
  await page.locator('input[aria-label="Derslerde ara"]').fill('docker');
  await expect(page.locator('.search-results a').first()).toBeVisible();
});

test('terminal simülatörü komuta yanıt verir', async ({ page }) => {
  await page.goto(`${BASE}/ders/seviye-1/linux/temel-komutlar/`);
  const term = page.locator('div.term[data-term-id="s1-linux-temel-komutlar"]');
  await term.locator('.term-input').fill('pwd');
  await term.locator('.term-input').press('Enter');
  await expect(term.locator('.term-body')).toContainText('/home/ogrenci');
});

test('tamamlama butonu ilerlemeyi kaydeder', async ({ page }) => {
  await page.goto(`${BASE}/ders/seviye-0/kariyer-yollari/`);
  await page.locator('div.complete-row .complete-btn').click();
  const done = await page.evaluate(() => localStorage.getItem('dy:done:seviye-0/kariyer-yollari'));
  expect(done).toBe('1');
  await expect(page.locator('div.complete-row .complete-btn')).toHaveText('✓ Tamamlandı');
});

test('içindekiler listesi görünür ve linklidir', async ({ page }) => {
  await page.goto(`${BASE}/ders/seviye-0/devops-nedir/`);
  const tocLinks = page.locator('.toc a');
  const count = await tocLinks.count();
  expect(count).toBeGreaterThanOrEqual(3);
  const firstHref = await tocLinks.first().getAttribute('href');
  expect(firstHref).toMatch(/^#/);
});
