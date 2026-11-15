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

test('sözlük sayfası filtrelenir', async ({ page }) => {
  await page.goto(`${BASE}/sozluk/`);
  const total = await page.locator('.gl-item').count();
  expect(total).toBeGreaterThan(30);
  await page.locator('#glossary-filter').fill('argo');
  const visible = await page.locator('.gl-item:visible').count();
  expect(visible).toBeGreaterThan(0);
  expect(visible).toBeLessThan(total);
  await expect(page.locator('.gl-item:visible').first()).toContainText(/Argo/i);
});

test('sözlük terimleri derslerde otomatik linklenir', async ({ page }) => {
  await page.goto(`${BASE}/ders/seviye-0/devops-nedir/`);
  const glLink = page.locator('.prose a[href*="/sozluk/#term-"]').first();
  await expect(glLink).toBeVisible();
  // hover tooltip = tanım
  const title = await glLink.getAttribute('title');
  expect(title?.length ?? 0).toBeGreaterThan(10);
});

test('quiz rozeti dashboardda görünür', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('dy:quiz:s0-devops-nedir', JSON.stringify({ c: 4, t: 4 }));
  });
  await page.goto(`${BASE}/`);
  const badge = page.locator('a.lesson-row[data-lesson-id="seviye-0/devops-nedir"] .lr-quiz');
  await expect(badge).toHaveAttribute('data-filled', 'true');
  await expect(badge).toHaveText('4/4');
  await expect(badge).toHaveAttribute('data-perfect', 'true');
});

test('dil değiştirici EN ders sayfasına gider', async ({ page }) => {
  await page.goto(`${BASE}/ders/seviye-0/devops-nedir/`);
  await page.locator('a.lang-switch').click();
  await expect(page).toHaveURL(/\/en\/ders\/seviye-0\/devops-nedir/);
  await expect(page.locator('h1')).toContainText('What Is DevOps');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('EN dashboard yüklenir ve EN dersleri listeler', async ({ page }) => {
  await page.goto(`${BASE}/en/`);
  await expect(page.locator('h1')).toHaveText('DevOps Yolculuğu');
  await expect(page.locator('a.lesson-row').first()).toContainText('What Is DevOps');
  const rows = await page.locator('a.lesson-row').count();
  expect(rows).toBe(6);
  // TR'ye dönüş
  await page.locator('a.lang-switch').click();
  await expect(page).not.toHaveURL(/\/en\//);
});

test('mermaid diyagramı vendor dosyadan render olur', async ({ page }) => {
  await page.goto(`${BASE}/ders/seviye-0/bu-site-bir-devops-projesi/`);
  await expect(page.locator('.mermaid-target svg').first()).toBeVisible({ timeout: 10000 });
});

test('egitmen sayfası tüm cevapları listeler', async ({ page }) => {
  await page.goto(`${BASE}/egitmen/`);
  await expect(page.locator('.quiz-block').first()).toBeVisible();
  const blocks = await page.locator('.quiz-block').count();
  expect(blocks).toBeGreaterThan(50);
  const answers = await page.locator('.qa').count();
  expect(answers).toBeGreaterThan(200);
  await expect(page.locator('.qa').first()).toContainText('✓');
});
