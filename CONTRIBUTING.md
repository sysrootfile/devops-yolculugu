# Katkı Rehberi

Bu repo bir öğrenme projesidir — katkı da öğrenmenin parçasıdır. İçerik eklemek
istediğinde aşağıdaki akış, sitenin kendi CI'ının koyduğu kurallarla aynıdır.

## Yeni ders ekleme

1. `src/content/docs/seviye-<n>/<modül>/` altına `.mdx` dosyası oluştur
   (modül tanımlı değilse önce `src/consts.ts` → `MODULES` listesine ekle).
2. Frontmatter'ı eksiksiz doldur — CI bu alanları test eder (`npm test`):

   ```yaml
   title: '...'          # zorunlu
   description: '...'    # zorunlu
   level: 0-5            # zorunlu; modülün seviyesiyle eşleşmeli
   module: '...'         # zorunlu; consts.ts'te tanımlı olmalı
   order: <n>            # zorunlu; aynı seviye+modül içinde benzersiz
   duration: <dk>        # zorunlu (>= 5)
   objectives:           # zorunlu; en az bir madde
     - '...'
   prerequisites:        # isteğe bağlı; var olan ders id'leri olmalı
     - 'seviye-1/linux/temel-komutlar'
   tags: [...]
   ```

3. İnteraktif bileşenleri kullan: `<Quiz />`, `<TerminalSim />`, `<LabBox />`,
   `<Flashcards />`, `<Mermaid />`, `<Callout />`. **`id` değerleri tüm sitede
   benzersiz olmalı** (test bunu yakalar).
4. Gerçek olay/example kutuları için kamuya açık, doğrulanabilir kaynaklara
   dayan; sayısal iddialarda “yaklaşık/raporlanan” dilini kullan.

## Doğrulama (PR açmadan önce)

```bash
npm test          # içerik testleri — id/order/prereq çakışmaları
npm run build     # derleme + Zod şema doğrulaması
npm run test:e2e  # tarayıcı testleri (ilk kez: npx playwright install chromium)
```

CI dört iş yapar: **içerik testleri → build → E2E → Docker imajı → Pages
deploy**. Kırmızı bir adım, PR'ın birleşmesini engeller — hızlıca düzeltmek
için Actions sekmesindeki kırmızı step'in son satırlarına bak.

## Commit ve PR

- Conventional Commits kullan (`feat:`, `fix:`, `docs:`, `chore:`...) — repo,
  kendi öğrettiği standardı uygular.
- Küçük ve tek amaçlı PR'lar: “bu PR neyi değiştiriyor?” tek cümleyle
  cevaplanabilmeli.

## İçerik ilkeleri

- Anlatım Türkçe, teknik terimler İngilizce kalır.
- Her ders: hedefler → anlatım → diyagram/örnek → pratik (lab/terminal) → quiz.
- Suçlayıcı dil yok (blameless), gerçek olaylarda kanıta dayalı anlatım var.
