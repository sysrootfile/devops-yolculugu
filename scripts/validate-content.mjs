#!/usr/bin/env node
/**
 * İçerik doğrulama testleri — DevOps Yolculuğu
 * Çalıştır: npm test
 * CI'da build öncesi ayrı bir adım olarak koşar; kırmızıysa site derlenmez.
 *
 * Kontroller:
 *  1. Zorunlu frontmatter alanları (title, description, level, module, order, duration, objectives)
 *  2. Ders id'leri (klasör yolu) benzersiz
 *  3. Aynı (seviye, modül) içinde order çakışması yok
 *  4. module alanı consts.ts'te tanımlı ve seviyesi eşleşiyor
 *  5. prerequisites referansları gerçek derslere işaret ediyor
 *  6. Quiz/Terminal/LabBox/Flashcards id="..." değerleri tüm sitede benzersiz
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DOCS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'docs');
const CONSTS_FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'consts.ts');

const errors = [];
const warnings = [];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = { _raw: m[1] };
  let currentKey = null;
  for (const line of m[1].split(/\r?\n/)) {
    const scalar = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (scalar && !line.startsWith(' ')) {
      currentKey = scalar[1];
      fm[currentKey] = scalar[2].trim().replace(/^['"]|['"]$/g, '');
      continue;
    }
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && currentKey) {
      fm[currentKey] = Array.isArray(fm[currentKey]) ? fm[currentKey] : [];
      fm[currentKey].push(item[1].trim());
    }
  }
  return fm;
}

// --- modül tanımlarını consts.ts'ten oku ---
const constsText = readFileSync(CONSTS_FILE, 'utf8');
const moduleMap = new Map();
for (const [, id, level] of constsText.matchAll(/\{\s*id:\s*'([\w-]+)',\s*level:\s*(\d)/g)) {
  moduleMap.set(id, Number(level));
}

const files = walk(DOCS_DIR);
const lessonIds = new Set(files.map((f) => relative(DOCS_DIR, f).replace(/\\/g, '/').replace(/\.mdx$/, '')));
const orderKeys = new Map();
const componentIds = new Map();

for (const file of files) {
  const rel = relative(DOCS_DIR, file).replace(/\\/g, '/');
  const id = rel.replace(/\.mdx$/, '');
  const fm = parseFrontmatter(readFileSync(file, 'utf8'));

  if (!fm) {
    errors.push(`${id}: frontmatter bulunamadı`);
    continue;
  }

  // 1. zorunlu alanlar
  for (const key of ['title', 'description', 'level', 'module', 'order', 'duration']) {
    if (!fm[key]) errors.push(`${id}: "${key}" alanı eksik`);
  }
  if (!Array.isArray(fm.objectives) || fm.objectives.length === 0) {
    errors.push(`${id}: objectives listesi boş olmamalı`);
  }

  const level = Number(fm.level);
  const order = Number(fm.order);
  const duration = Number(fm.duration);

  if (fm.level !== undefined && (Number.isNaN(level) || level < 0 || level > 5)) {
    errors.push(`${id}: level 0-5 arasında olmalı (şu an: ${fm.level})`);
  }
  if (!Number.isNaN(duration) && duration < 5) {
    warnings.push(`${id}: duration 5 dk'dan az — gerçekçi mi?`);
  }

  // 3. order çakışması
  if (!Number.isNaN(order)) {
    const key = `${fm.level}|${fm.module}|${order}`;
    if (orderKeys.has(key)) errors.push(`${id}: order ${order}, "${orderKeys.get(key)}" dersiyle çakışıyor (aynı seviye+modül)`);
    orderKeys.set(key, id);
  }

  // 4. modül tanımlı ve seviye eşleşiyor
  if (fm.module && !moduleMap.has(fm.module)) {
    errors.push(`${id}: modül "${fm.module}" consts.ts'te tanımlı değil`);
  } else if (fm.module && !Number.isNaN(level) && moduleMap.get(fm.module) !== level) {
    errors.push(`${id}: modül "${fm.module}" seviyesi ${moduleMap.get(fm.module)} ama dersin seviyesi ${level}`);
  }

  // 5. prerequisites geçerli mi
  for (const prereq of Array.isArray(fm.prerequisites) ? fm.prerequisites : []) {
    const clean = prereq.replace(/^['"]|['"]$/g, '');
    if (!lessonIds.has(clean)) errors.push(`${id}: prerequisite "${clean}" diye bir ders yok`);
  }

  // 6. interaktif bileşen id'leri benzersiz mi
  const body = readFileSync(file, 'utf8').replace(/^---[\s\S]*?---/, '');
  for (const [, cid] of body.matchAll(/\bid="([\w-]+)"/g)) {
    if (componentIds.has(cid)) {
      errors.push(`${id}: bileşen id "${cid}" zaten "${componentIds.get(cid)}" dersinde kullanılıyor`);
    } else {
      componentIds.set(cid, id);
    }
  }
}

// --- rapor ---
console.log(`📚 ${files.length} ders tarandı, ${componentIds.size} interaktif bileşen id'si doğrulandı`);
for (const w of warnings) console.log(`⚠️  ${w}`);
if (errors.length) {
  console.error(`\n❌ ${errors.length} hata:`);
  for (const e of errors) console.error(`   - ${e}`);
  process.exit(1);
}
console.log('✅ Tüm içerik testleri geçti');
