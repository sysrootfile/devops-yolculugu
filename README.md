# 🚀 DevOps Yolculuğu

**🌐 Canlı: https://sysrootfile.github.io/devops-yolculugu/**

Sıfırdan ileri seviyeye **interaktif DevOps öğrenme platformu** — [Astro 6](https://astro.build) ile üretildi.

> Bu site **kendisi de bir DevOps projesidir**: İçeriği Astro Content Collections ile
> versiyonlanır, GitHub Actions ile derlenir ve derslerde bu altyapının kendisi canlı
> ders malzemesi olarak kullanılır (dogfooding).

## ✨ Özellikler

- **6 seviye · 15 modül · 53 ders** — Linux'tan GitOps'a, sektör pratiklerine kadar tam müfredat
- 🧠 Her derste **quiz** — anlık geri bildirim, skor localStorage'da saklanır
- 💻 Tarayıcıda çalışan **terminal simülatörü** — komutları güvenle dene
- 🧪 Adım adım **lab kutuları** — kendi makinende uygula, doğrula, işaretle
- 🃏 **Flashcards** — terim kartlarıyla tekrar
- 📊 **İlerleme takibi** — seviye bazlı barlar, kaldığın yerden devam et
- 🔍 **Ctrl+K arama**, koyu/açık tema, kopyalanabilir kod blokları, Mermaid diyagramları

## 🗺️ Müfredat

| Seviye | Konular |
| --- | --- |
| 🧭 **0 — Yolculuğa Başlangıç** | DevOps nedir, kültür/tarihçe, kariyer yolları, repo turu, araç kurulum rehberi |
| 🌱 **1 — Temeller** | Linux & terminal, ağ (IP/DNS/HTTP/TLS/SSH), Git |
| ⚙️ **2 — Otomasyon & CI/CD** | Pipeline kavramları, GitHub Actions, secrets, cache, deploy |
| 📦 **3 — Konteynerler & Bulut** | Docker, Kubernetes, bulut kavramları, Terraform/Ansible, maliyet |
| 🛡️ **4 — Operasyon & Güven** | Observability, Prometheus/Grafana, SRE, DevSecOps |
| 🏆 **5 — Ustalık & Capstone** | GitOps, deployment desenleri, platform engineering, sektör pratikleri (finans/e-ticaret/sağlık/oyun), gerçek olay arşivi, uçtan uca prod |

## 🚀 Kurulum

```bash
npm install     # bağımlılıklar (Node 22+ gerekir)
npm run dev     # geliştirme sunucusu → http://localhost:4321/devops-yolculugu/
npm run build   # statik siteyi dist/ klasörüne üret
npm run preview # build çıktısını önizle (aynı alt yol ile)
```

> **Not:** Site GitHub Pages proje sitesi olarak `/devops-yolculugu/` alt yolunda
> servis edilir (`astro.config.mjs` → `base`). Yerel geliştirmeye de aynı alt yolla
> erişilir. Kendi alan adına geçersen `base` satırını silmen yeterli.

## 📁 Yapı

```
src/
├── content/docs/        # tüm dersler (MDX) — seviye/<modül>/<ders>.mdx
├── content.config.ts    # içerik şeması (Zod ile build zamanında doğrulanır)
├── consts.ts            # seviye/modül metadata
├── components/          # Quiz, TerminalSim, LabBox, Flashcards, Mermaid...
├── layouts/             # Base + Lesson şablonları
├── pages/               # / (dashboard) ve /ders/[...slug]
└── styles/global.css    # tasarım sistemi
.github/workflows/ci.yml # CI pipeline (Seviye 2'nin canlı örneği!)
```

## ➕ Yeni ders ekleme

1. `src/content/docs/seviye-<n>/<modül>/` altına `.mdx` dosyası oluştur
2. Frontmatter'ı doldur (`title, description, level, module, order, duration, objectives`)
3. İnteraktif bileşenleri MDX içinde kullan: `<Quiz />`, `<TerminalSim />`, `<LabBox />`...
4. `npm run build` — şema hatası varsa build başarısız olur (cieste kalite kontrolü!)

## 📄 Lisans

İçerik ve kod kişisel öğrenme kullanımına açıktır.
