# CLAUDE.md

msarinc'in kişisel projeleri arasında paylaşılan tema/i18n/UI kütüphanesi. npm workspaces monorepo.

## Mimari kararlar (sorgulamadan tekrar etme)

- **Sadece Expo/React Native, Vite/DOM paketi yok.** Tüketici projeler (msarinc, msarinc-blog) zamanla Expo'ya taşınacak; bu yüzden kütüphane baştan `react-native-web` üzerine kurulu tek bir UI paketi (`packages/ui`) olarak tasarlandı. Web için ayrı bir paket eklemeyi önerme.
- Renk paleti ve tema state mantığı `packages/core`'da framework-agnostic tutulur (React'a bağımlı değil).
- `packages/i18n` sadece statik kaynak (JSON + tip) export eder, kendi i18next instance'ı kurmaz — tüketen proje kendi i18n.init()'ine `common` namespace olarak ekler.
- `apps/demo` tek bir Expo app'tir (hem native hem web test için); ayrı bir web-demo yoktur.
- Bu repoda **henüz** `msarinc`/`msarinc-blog`/`NeLazim`/`QuranApp`'a entegrasyon (submodule, rewrite) yapılmadı — bu ayrı bir aşama, kendiliğinden başlatma.

## Komutlar

```bash
npm install
npm run dev        # core+i18n+ui watch build + Expo dev server (concurrently)
npm run build       # tüm workspace'leri build eder
npm run typecheck   # tüm workspace'lerde tsc --noEmit
```

## Monorepo + Expo tuzağı

`apps/demo`'nun `main` alanı `./index.js`'dir, `node_modules/expo/AppEntry.js` **değil**. npm workspaces `expo` paketini kök `node_modules`'e hoist ettiği için, `AppEntry.js` içindeki göreli `../../App` importu yanlış dizine (repo köküne) çözülüyordu. Kendi `index.js` (`registerRootComponent(App)`) bunu çözüyor. Yeni bir Expo app eklenirse aynı deseni kullan.

## Kod stili

- Yorum yazma alışkanlığını minimumda tut: sadece WHY'ı açıklayan, non-obvious yorumlar ekle (bkz. üst seviye CLAUDE talimatları). JSDoc'u sadece prop/parametre davranışı isimden anlaşılmıyorsa kullan.
- `packages/*` içindeki paketler `tsup` ile build edilir, `dist/` gitignore'da — build çıktısını commit'leme.
