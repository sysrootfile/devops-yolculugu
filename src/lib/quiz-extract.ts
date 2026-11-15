export interface ExtractedQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface ExtractedQuiz {
  lessonId: string;
  lessonTitle: string;
  level: number;
  quizId: string;
  title: string;
  questions: ExtractedQuestion[];
}

/** Ders dosyalarının ham metinleri (build sırasında okunur). */
const rawDocs = import.meta.glob('/src/content/docs/**/*.mdx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/**
 * Tüm derslerden Quiz bileşenlerini çıkarır (/egitmen sayfası için).
 * Dersler tek formatta yazıldığı için block-level regex güvenilirdir;
 * format değişirse `npm test` + /egitmen sayfasındaki sayaç bunu ele verir.
 */
export function extractQuizzes(): ExtractedQuiz[] {
  const out: ExtractedQuiz[] = [];

  for (const [filePath, text] of Object.entries(rawDocs)) {
    const lessonId = filePath.replace(/^\/src\/content\/docs\//, '').replace(/\.mdx$/, '');
    const lessonTitle = text.match(/^title:\s*'([^']*)'/m)?.[1] ?? lessonId;
    const levelMatch = filePath.match(/seviye-(\d)/);
    const level = levelMatch ? Number(levelMatch[1]) : 0;

    for (const block of text.matchAll(/<Quiz\b([\s\S]*?)\/>/g)) {
      const bt = block[1];
      const quizId = bt.match(/id="([\w-]+)"/)?.[1] ?? `${lessonId}-quiz`;
      const title = bt.match(/title="([^"]*)"/)?.[1] ?? 'Bilgi Kontrolü';
      const questions: ExtractedQuestion[] = [];

      for (const qm of bt.matchAll(
        /q:\s*'((?:[^'\\])*)',\s*options:\s*\[([^\]]*)\],\s*answer:\s*(\d+)/g
      )) {
        const options = qm[2]
          .split(/,\s*(?=(?:'[^']*'))/g)
          .map((s) => s.trim().replace(/^'|'$/g, ''))
          .filter(Boolean);
        const rest = bt.slice(qm.index ?? 0);
        const explain = rest.match(/explain:\s*'((?:[^'\\])*)'/)?.[1] ?? '';
        questions.push({ q: qm[1], options, answer: Number(qm[3]), explain });
      }

      if (questions.length > 0) {
        out.push({ lessonId, lessonTitle, level, quizId, title, questions });
      }
    }
  }

  return out;
}
