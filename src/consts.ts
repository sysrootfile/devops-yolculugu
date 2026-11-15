/** Site genelinde kullanılan sabitler: seviyeler, modüller, renkler. */

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
  tagline: string;
  emoji: string;
  color: string;
}

export const LEVELS: LevelMeta[] = [
  {
    id: 0,
    slug: 'seviye-0',
    name: 'Yolculuğa Başlangıç',
    tagline: 'DevOps nedir, kültürü neye dayanır, kariyer yolları nelerdir?',
    emoji: '🧭',
    color: '#64748b',
  },
  {
    id: 1,
    slug: 'seviye-1',
    name: 'Temeller',
    tagline: 'Linux, ağ ve Git — her DevOps aracının üstüne kurulduğu üç temel taş.',
    emoji: '🌱',
    color: '#059669',
  },
  {
    id: 2,
    slug: 'seviye-2',
    name: 'Otomasyon & CI/CD',
    tagline: 'Pipeline kavramları ve GitHub Actions ile gerçek otomasyon.',
    emoji: '⚙️',
    color: '#d97706',
  },
  {
    id: 3,
    slug: 'seviye-3',
    name: 'Konteynerler & Bulut',
    tagline: 'Docker, Kubernetes, bulut kavramları ve Infrastructure as Code.',
    emoji: '📦',
    color: '#0284c7',
  },
  {
    id: 4,
    slug: 'seviye-4',
    name: 'Operasyon & Güven',
    tagline: 'Observability, SRE pratikleri ve DevSecOps ile güvenilirlik.',
    emoji: '🛡️',
    color: '#7c3aed',
  },
  {
    id: 5,
    slug: 'seviye-5',
    name: 'Ustalık & Capstone',
    tagline: 'GitOps, ileri deployment desenleri ve uçtan uca bitirme projesi.',
    emoji: '🏆',
    color: '#e11d48',
  },
];

export interface ModuleMeta {
  id: string;
  level: number;
  name: string;
  description: string;
}

/** Modüller — seviyelerin altındaki tematik gruplar. Sidebar sırası buradaki tanım sırasıdır. */
export const MODULES: ModuleMeta[] = [
  { id: 'giris', level: 0, name: 'Başlangıç', description: 'DevOps’un ne olduğunu ve bu yolculuğun nasıl işlediğini anlama' },
  { id: 'linux', level: 1, name: 'Linux & Terminal', description: 'Sunucuların ana dili: komut satırı, izinler, süreçler ve scriptler' },
  { id: 'ag', level: 1, name: 'Ağ (Networking)', description: 'IP, DNS, HTTP, TLS ve SSH — servislerin birbiriyle konuşma biçimi' },
  { id: 'git', level: 1, name: 'Git & Versiyon Kontrol', description: 'Modern ekiplerin tek doğruluk kaynağı: branch, PR ve iyi pratikler' },
  { id: 'cicd', level: 2, name: 'CI/CD Kavramları', description: 'Pipeline nedir, test otomasyonu neden kritiktir' },
  { id: 'github-actions', level: 2, name: 'GitHub Actions', description: 'Bu repoya gerçek bir pipeline kurarak öğrenme' },
  { id: 'docker', level: 3, name: 'Docker', description: 'Konteyner temelleri ve bu sitenin Dockerfile’ını yazma' },
  { id: 'kubernetes', level: 3, name: 'Kubernetes', description: 'Orkestrasyon, Pod/Deployment/Service ve lokal küme lab’ları' },
  { id: 'bulut-iac', level: 3, name: 'Bulut & IaC', description: 'Vendor-neutral bulut kavramları, Terraform ve Ansible' },
  { id: 'observability', level: 4, name: 'Monitoring & Observability', description: 'Log, metric, trace üçlüsü ve bu siteyi izlemeye alma' },
  { id: 'sre', level: 4, name: 'SRE Pratikleri', description: 'SLO’lar, error budget, incident yönetimi ve postmortem kültürü' },
  { id: 'devsecops', level: 4, name: 'DevSecOps', description: 'Secret yönetimi, supply chain güvenliği ve shift-left' },
  { id: 'gitops', level: 5, name: 'GitOps & İleri Desenler', description: 'ArgoCD/Flux, blue-green/canary ve platform engineering' },
  { id: 'sektorel', level: 5, name: 'Sektörel Pratikler', description: 'DevOps’un finans, sağlık, e-ticaret ve oyun dünyasındaki gerçek halleri' },
  { id: 'capstone', level: 5, name: 'Capstone', description: 'Öğrendiklerini bu siteyi uçtan uca prod’a taşıyarak kanıtla' },
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
