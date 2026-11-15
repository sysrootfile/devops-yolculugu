export interface GlossaryTerm {
  term: string;
  def: string;
  level: number;
  lessonId?: string;
}

/** Ders dosyalarının ham metinleri — Flashcards terimlerini çekmek için. */
const rawDocs = import.meta.glob('/src/content/docs/**/*.mdx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

import glossaryJson from '@data/glossary.json';

/** Flashcards bileşenlerinden terim çıkarımı — tek doğruluk kaynağı derslerin kendisi. */
function extractFromFlashcards(): GlossaryTerm[] {
  const out: GlossaryTerm[] = [];
  for (const [filePath, text] of Object.entries(rawDocs)) {
    const lessonId = filePath.replace(/^\/src\/content\/docs\//, '').replace(/\.mdx$/, '');
    const levelMatch = filePath.match(/seviye-(\d)/);
    const level = levelMatch ? Number(levelMatch[1]) : 0;
    for (const [, front, back] of text.matchAll(/front:\s*'([^']*)',\s*back:\s*'([^']*)'/g)) {
      out.push({ term: front.trim(), def: back.trim(), level, lessonId });
    }
  }
  return out;
}

const curated = glossaryJson as GlossaryTerm[];

/** Flashcard terimleri + kürasyonlu sözlüğü birleştirir, alfabetik sıralar (çiftler json lehine). */
export function getGlossaryTerms(): GlossaryTerm[] {
  const map = new Map<string, GlossaryTerm>();
  for (const t of extractFromFlashcards()) {
    map.set(t.term.toLocaleLowerCase('tr-TR'), t);
  }
  for (const t of curated) {
    map.set(t.term.toLocaleLowerCase('tr-TR'), t);
  }
  return [...map.values()].sort((a, b) => a.term.localeCompare(b.term, 'tr'));
}
