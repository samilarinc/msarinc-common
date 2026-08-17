# msarinc-common

Şamil'in projeleri (msarinc, msarinc-blog, NeLazim, QuranApp) arasında paylaşılan tema, renk paleti, i18n ve UI bileşenleri kütüphanesi. Tüm projeler Expo/React Native'e taşınacağı için kütüphane baştan Expo + `react-native-web` üzerine kuruludur — ayrı bir web (DOM) paketi yoktur.

## Paketler

- **`packages/core`** (`@msarinc/theme-core`) — framework-agnostic. `ThemeName`, `Palette`, `PALETTES` (light/dark/lights-out) ve `createThemeStore` (pluggable storage adapter ile tema state mantığı). Ayrıca DOM tabanlı eski siteler geçiş döneminde kullanabilsin diye düz CSS custom property karşılığı: `@msarinc/theme-core/theme.css`.
- **`packages/i18n`** (`@msarinc/i18n-common`) — ortak çeviri anahtarları (`tr`/`en`). `commonResources` export eder, tüketen proje kendi i18next kurulumuna ikinci bir `common` namespace olarak ekler.
- **`packages/ui`** (`@msarinc/ui`) — React Native bileşenleri: `ThemeProvider`, `useTheme`, `ThemeToggle`, `AboutScreen`. `react-native-web` sayesinde hem native hem web'de çalışır.
- **`apps/demo`** — Expo demo app. Paketleri gerçek bir ortamda görsel olarak test etmek için.

## Geliştirme

```bash
npm install
npm run dev   # core/i18n/ui'yi watch modunda build eder + Expo dev server'ı başlatır
```

`npm run dev` çalıştıktan sonra terminaldeki Expo CLI'da `w` tuşuna basarak tarayıcıda, `a`/`i` ile Android/iOS simulator'de açabilirsiniz.

Diğer script'ler: `npm run build`, `npm run typecheck` (tüm workspace'lerde).

## Kullanım (tüketen proje tarafında)

```tsx
import { ThemeProvider, ThemeToggle, AboutScreen, useTheme } from '@msarinc/ui';
import { commonResources } from '@msarinc/i18n-common';

// i18n.init() içinde:
// resources: { tr: { translation: appTr, common: commonResources.tr }, en: { ... } }
```

`ThemeToggle` ekran genişliğine göre otomatik davranır: geniş ekranda 3'lü switch (light/dark/lights-out), dar ekranda (< 640px, `breakpoint` prop'uyla değiştirilebilir) tek dönüşümlü toggle butonu gösterir. `compact` prop'u açıkça verilirse bu otomatik davranışı geçersiz kılar.

`AboutScreen`, hiçbir sabit metin içermeyen presentational bir component'tir — çağıran taraf kendi i18n çevirisini yapıp `profile`/`sections` prop'larına hazır string geçer. `profile.avatar` düz bir URL string'i veya `ImageSourcePropType` (örn. `require(...)`) kabul eder.

## Kapsam dışı

`msarinc`, `msarinc-blog`, `NeLazim`, `QuranApp` reponun bu kütüphaneyi kullanacak şekilde yeniden yazılması ve bu reponun oralara git submodule olarak eklenmesi ayrı bir aşamada yapılacak.
