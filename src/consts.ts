/** Site genelinde kullanılan sabitler: seviyeler, modüller, renkler, i18n UI metinleri. */

export type Locale = 'tr' | 'en';

export const SITE = {
  name: 'DevOps Yolculuğu',
  description:
    'Sıfırdan ileri seviyeye interaktif DevOps öğrenme platformu — quiz, lab ve terminal simülatörüyle.',
};

/** GitHub Pages alt yolu (astro.config.mjs'teki base ile uyumlu). */
export const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

/** İç linkleri base alt yoluna uyumlu üretir: withBase('/ders/x') → '/devops-yolculugu/ders/x' */
export function withBase(path: string): string {
  if (path.startsWith('http') || path.startsWith('#') || path.startsWith('//')) return path;
  return path === '/' ? `${BASE}/` : `${BASE}${path}`;
}

export interface LevelMeta {
  id: number;
  slug: string; // klasör adı
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  emoji: string;
  color: string;
}

export const LEVELS: LevelMeta[] = [
  {
    id: 0,
    slug: 'seviye-0',
    name: 'Yolculuğa Başlangıç',
    nameEn: 'Getting Started',
    tagline: 'DevOps nedir, kültürü neye dayanır, kariyer yolları nelerdir?',
    taglineEn: 'What is DevOps, what is it built on, which career paths exist?',
    emoji: '🧭',
    color: '#64748b',
  },
  {
    id: 1,
    slug: 'seviye-1',
    name: 'Temeller',
    nameEn: 'Foundations',
    tagline: 'Linux, ağ ve Git — her DevOps aracının üstüne kurulduğu üç temel taş.',
    taglineEn: 'Linux, networking and Git — the three foundations every DevOps tool builds on.',
    emoji: '🌱',
    color: '#059669',
  },
  {
    id: 2,
    slug: 'seviye-2',
    name: 'Otomasyon & CI/CD',
    nameEn: 'Automation & CI/CD',
    tagline: 'Pipeline kavramları ve GitHub Actions ile gerçek otomasyon.',
    taglineEn: 'Pipeline concepts and real automation with GitHub Actions.',
    emoji: '⚙️',
    color: '#d97706',
  },
  {
    id: 3,
    slug: 'seviye-3',
    name: 'Konteynerler & Bulut',
    nameEn: 'Containers & Cloud',
    tagline: 'Docker, Kubernetes, bulut kavramları ve Infrastructure as Code.',
    taglineEn: 'Docker, Kubernetes, cloud concepts and Infrastructure as Code.',
    emoji: '📦',
    color: '#0284c7',
  },
  {
    id: 4,
    slug: 'seviye-4',
    name: 'Operasyon & Güven',
    nameEn: 'Operations & Security',
    tagline: 'Observability, SRE pratikleri ve DevSecOps ile güvenilirlik.',
    taglineEn: 'Reliability through observability, SRE practices and DevSecOps.',
    emoji: '🛡️',
    color: '#7c3aed',
  },
  {
    id: 5,
    slug: 'seviye-5',
    name: 'Ustalık & Capstone',
    nameEn: 'Mastery & Capstone',
    tagline: 'GitOps, ileri deployment desenleri ve uçtan uca bitirme projesi.',
    taglineEn: 'GitOps, advanced deployment patterns and an end-to-end capstone.',
    emoji: '🏆',
    color: '#e11d48',
  },
];

export interface ModuleMeta {
  id: string;
  level: number;
  name: string;
  nameEn: string;
  description: string;
}

/** Modüller — seviyelerin altındaki tematik gruplar. Sidebar sırası buradaki tanım sırasıdır. */
export const MODULES: ModuleMeta[] = [
  { id: 'giris', level: 0, name: 'Başlangıç', nameEn: 'Getting Started', description: 'DevOps’un ne olduğunu ve bu yolculuğun nasıl işlediğini anlama' },
  { id: 'linux', level: 1, name: 'Linux & Terminal', nameEn: 'Linux & Terminal', description: 'Sunucuların ana dili: komut satırı, izinler, süreçler ve scriptler' },
  { id: 'ag', level: 1, name: 'Ağ (Networking)', nameEn: 'Networking', description: 'IP, DNS, HTTP, TLS ve SSH — servislerin birbiriyle konuşma biçimi' },
  { id: 'git', level: 1, name: 'Git & Versiyon Kontrol', nameEn: 'Git & Version Control', description: 'Modern ekiplerin tek doğruluk kaynağı: branch, PR ve iyi pratikler' },
  { id: 'cicd', level: 2, name: 'CI/CD Kavramları', nameEn: 'CI/CD Concepts', description: 'Pipeline nedir, test otomasyonu neden kritiktir' },
  { id: 'github-actions', level: 2, name: 'GitHub Actions', nameEn: 'GitHub Actions', description: 'Bu repoya gerçek bir pipeline kurarak öğrenme' },
  { id: 'docker', level: 3, name: 'Docker', nameEn: 'Docker', description: 'Konteyner temelleri ve bu sitenin Dockerfile’ını yazma' },
  { id: 'kubernetes', level: 3, name: 'Kubernetes', nameEn: 'Kubernetes', description: 'Orkestrasyon, Pod/Deployment/Service ve lokal küme lab’ları' },
  { id: 'bulut-iac', level: 3, name: 'Bulut & IaC', nameEn: 'Cloud & IaC', description: 'Vendor-neutral bulut kavramları, Terraform ve Ansible' },
  { id: 'observability', level: 4, name: 'Monitoring & Observability', nameEn: 'Monitoring & Observability', description: 'Log, metric, trace üçlüsü ve bu siteyi izlemeye alma' },
  { id: 'sre', level: 4, name: 'SRE Pratikleri', nameEn: 'SRE Practices', description: 'SLO’lar, error budget, incident yönetimi ve postmortem kültürü' },
  { id: 'devsecops', level: 4, name: 'DevSecOps', nameEn: 'DevSecOps', description: 'Secret yönetimi, supply chain güvenliği ve shift-left' },
  { id: 'gitops', level: 5, name: 'GitOps & İleri Desenler', nameEn: 'GitOps & Advanced Patterns', description: 'ArgoCD/Flux, blue-green/canary ve platform engineering' },
  { id: 'sektorel', level: 5, name: 'Sektörel Pratikler', nameEn: 'Industry Practices', description: 'DevOps’un finans, sağlık, e-ticaret ve oyun dünyasındaki gerçek halleri' },
  { id: 'capstone', level: 5, name: 'Capstone', nameEn: 'Capstone', description: 'Öğrendiklerini bu siteyi uçtan uca prod’a taşıyarak kanıtla' },
];

export function levelBySlug(slug: string): LevelMeta | undefined {
  return LEVELS.find((l) => l.slug === slug);
}

export function levelById(id: number): LevelMeta | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function moduleById(id: string): ModuleMeta | undefined {
  return MODULES.find((m) => m.id === id);
}

/** Arayüz metinleri — layout ve bileşenlerde kullanılır. */
export const UI = {
  tr: {
    home: '🏠 Ana Sayfa',
    objectives: '🎯 Bu derste',
    toc: '📑 İçindekiler',
    prev: '← Önceki ders',
    next: 'Sonraki ders →',
    minutes: '⏱ ~{d} dk',
    lessonOf: '📖 Ders {i}/{t}',
    completeTitle: 'Bu dersi bitirdin mi?',
    completeHint: 'İşaretlediğinde dashboard’daki ilerlemen güncellenir.',
    completeBtn: '✓ Tamamlandı olarak işaretle',
    completeDone: '✓ Tamamlandı',
    completeDoneHint: 'Harika! Dashboard’daki ilerlemen güncellendi.',
    searchPlaceholder: 'Ders ara…  (Ctrl+K)',
    printBtn: '🖨 Yazdır / PDF olarak kaydet',
    continue: '▶ Kaldığın yerden devam et',
    browse: '📚 Müfredata göz at',
    glossary: '📖 Sözlük',
    statDone: 'tamamlanan ders',
    statTotal: 'toplam ders',
    statLevels: 'seviye',
    statHours: 'toplam içerik',
    statPct: 'genel ilerleme',
    statQuiz: 'quiz doğruluğu',
    resetBtn: '↺ Tüm ilerlemeyi sıfırla',
    footer: 'interaktif öğrenme reposu',
    glossaryLink: '📚 Sözlük',
    instructorLink: '🎓 Eğitmen Cevapları',
  },
  en: {
    home: '🏠 Home',
    objectives: '🎯 In this lesson',
    toc: '📑 Contents',
    prev: '← Previous lesson',
    next: 'Next lesson →',
    minutes: '⏱ ~{d} min',
    lessonOf: '📖 Lesson {i}/{t}',
    completeTitle: 'Finished this lesson?',
    completeHint: 'Marking it updates your progress on the dashboard.',
    completeBtn: '✓ Mark as completed',
    completeDone: '✓ Completed',
    completeDoneHint: 'Nice! Your dashboard progress has been updated.',
    searchPlaceholder: 'Search lessons…  (Ctrl+K)',
    printBtn: '🖨 Print / Save as PDF',
    continue: '▶ Continue where you left off',
    browse: '📚 Browse the curriculum',
    glossary: '📖 Glossary',
    statDone: 'lessons completed',
    statTotal: 'total lessons',
    statLevels: 'levels',
    statHours: 'hours of content',
    statPct: 'overall progress',
    statQuiz: 'quiz accuracy',
    resetBtn: '↺ Reset all progress',
    footer: 'interactive learning repo',
    glossaryLink: '📚 Glossary',
    instructorLink: '🎓 Instructor Answers',
  },
} as const;

export function ui(lang: Locale) {
  return UI[lang];
}
