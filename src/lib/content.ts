import { getCollection, type CollectionEntry } from 'astro:content';
import {
  LEVELS,
  MODULES,
  moduleById,
  BASE,
  type LevelMeta,
  type ModuleMeta,
} from '@consts';

export type Doc = CollectionEntry<'docs'>;

export interface LessonVM {
  id: string;
  title: string;
  description: string;
  level: number;
  module: string;
  order: number;
  duration: number;
  objectives: string[];
  prerequisites: string[];
  tags: string[];
  url: string;
}

export function toVM(doc: Doc): LessonVM {
  return { id: doc.id, url: `${BASE}/ders/${doc.id}`, ...doc.data };
}

/** MODULES tanım sırası = müfredat sırası. */
const MODULE_ORDER = new Map<string, number>(MODULES.map((m, i) => [m.id, i]));

export function sortLessons(docs: Doc[]): Doc[] {
  return [...docs].sort((a, b) => {
    if (a.data.level !== b.data.level) return a.data.level - b.data.level;
    const am = MODULE_ORDER.get(a.data.module) ?? 999;
    const bm = MODULE_ORDER.get(b.data.module) ?? 999;
    if (am !== bm) return am - bm;
    return a.data.order - b.data.order;
  });
}

export interface NavModule {
  meta: ModuleMeta;
  lessons: LessonVM[];
}

export interface NavLevel {
  meta: LevelMeta;
  modules: NavModule[];
  total: number;
}

/** Tüm dersleri seviye → modül → ders ağacına dönüştürür (sidebar/dashboard için). */
export function buildNavTree(docs: Doc[]): NavLevel[] {
  const sorted = sortLessons(docs);
  const tree: NavLevel[] = [];

  for (const level of LEVELS) {
    const levelLessons = sorted.filter((d) => d.data.level === level.id);
    if (levelLessons.length === 0) continue;
    const modules: NavModule[] = [];
    const seen = new Set<string>();
    for (const doc of levelLessons) {
      const moduleId = doc.data.module;
      if (seen.has(moduleId)) continue;
      seen.add(moduleId);
      const meta = moduleById(moduleId);
      modules.push({
        meta: meta ?? { id: moduleId, level: level.id, name: moduleId, description: '' },
        lessons: levelLessons.filter((d) => d.data.module === moduleId).map(toVM),
      });
    }
    tree.push({ meta: level, modules, total: levelLessons.length });
  }
  return tree;
}

/** Verilen dersin sıradaki/önceki dersi (müfredat sırasına göre). */
export function getNeighbors(docs: Doc[], currentId: string) {
  const sorted = sortLessons(docs).map(toVM);
  const idx = sorted.findIndex((l) => l.id === currentId);
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}

export async function getAllDocs(): Promise<Doc[]> {
  return getCollection('docs');
}
