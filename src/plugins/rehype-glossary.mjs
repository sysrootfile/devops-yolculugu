import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Rehype plugin: ders metinlerindeki sözlük terimlerini (ilk geçtiği yerde)
 * /sozluk/#<terim> sayfasına linkler; hover'da tanımı tooltip olarak gösterir.
 * a/pre/code/başlık/script/style içindeki metinlere dokunmaz.
 */

const curated = JSON.parse(
  readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../src/data/glossary.json'), 'utf8')
);

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function slugify(s) {
  const map = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' };
  return s
    .toLocaleLowerCase('tr')
    .replace(/[çğıöşü]/g, (ch) => map[ch] ?? ch)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function rehypeGlossary({ base = '/' } = {}) {
  const terms = curated
    .map((t) => ({ term: t.term, def: t.def, slug: slugify(t.term) }))
    .sort((a, b) => b.term.length - a.term.length); // uzun terim önce eşleşsin

  const pattern = new RegExp(
    `(?<![\\p{L}\\p{N}])(${terms.map((t) => escapeRegExp(t.term)).join('|')})(?![\\p{L}\\p{N}])`,
    'giu'
  );
  const byTerm = new Map(terms.map((t) => [t.term.toLocaleLowerCase('tr'), t]));

  const SKIP = new Set(['a', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style']);

  return (tree) => {
    const seen = new Set(); // sayfa başına her terimden bir link
    walk(tree);

    function walk(node) {
      if (!node.children || node.children.length === 0) return;
      if (node.tagName && SKIP.has(node.tagName)) return;

      const newChildren = [];
      for (const child of node.children) {
        if (child.type === 'text' && child.value) {
          const value = child.value;
          pattern.lastIndex = 0;
          let lastIndex = 0;
          let replaced = false;
          let match;
          const parts = [];

          while ((match = pattern.exec(value)) !== null) {
            const key = match[1].toLocaleLowerCase('tr');
            const info = byTerm.get(key);
            if (!info || seen.has(key)) continue;
            parts.push({ text: value.slice(lastIndex, match.index) });
            parts.push({
              link: match[1],
              href: `${base}/sozluk/#term-${info.slug}`,
              title: info.def,
            });
            lastIndex = match.index + match[1].length;
            seen.add(key);
            replaced = true;
          }

          if (!replaced) {
            newChildren.push(child);
            continue;
          }
          parts.push({ text: value.slice(lastIndex) });

          for (const part of parts) {
            if (part.text !== undefined && part.text !== '') {
              newChildren.push({ type: 'text', value: part.text });
            } else if (part.link) {
              newChildren.push({
                type: 'element',
                tagName: 'a',
                properties: {
                  href: part.href,
                  title: part.title,
                },
                children: [{ type: 'text', value: part.link }],
              });
            }
          }
        } else if (child.children) {
          walk(child);
          newChildren.push(child);
        } else {
          newChildren.push(child);
        }
      }
      node.children = newChildren;
    }
  };
}
