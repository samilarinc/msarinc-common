# msarinc-common

Shared theme, localization and UI building blocks for Expo / React Native apps. The UI runs on
native and on the web through `react-native-web`, so there is no separate DOM package.

## Packages

| Package | Path | Contents |
| --- | --- | --- |
| `@msarinc/theme-core` | `packages/core` | Palettes (`light`, `dark`, `lights-out`), design tokens (`SPACING`, `RADIUS`, `FONT_SIZES`) and a storage-agnostic theme store. No React dependency. |
| `@msarinc/ui` | `packages/ui` | `ThemeProvider`, `ThemeToggle`, `LanguageSelector`, `FontSizeToggle`, `HeaderNavButtons`, `HeaderMenu`, `AboutScreen` and a base style kit (`createBaseStyles`). |
| `@msarinc/i18n-common` | `packages/i18n` | Translation strings shared by every app (`tr`, `en`), exported as plain resources. |
| `@msarinc/firebase` | `packages/firebase` | Firebase setup, Google sign-in (`AuthProvider`, `useAuth`) and Firestore helpers. |
| `@msarinc/supabase` | `packages/supabase` | Supabase Storage helpers (`uploadImage`, `deleteImage`). |

`apps/demo` is an Expo app for trying the packages on a device or in the browser.

## Using it in an app

Add the repository as a git submodule and reference the packages you need:

```bash
git submodule add https://github.com/samilarinc/msarinc-common.git
```

```json
{
  "dependencies": {
    "@msarinc/theme-core": "file:msarinc-common/packages/core",
    "@msarinc/ui": "file:msarinc-common/packages/ui",
    "@msarinc/i18n-common": "file:msarinc-common/packages/i18n"
  }
}
```

The packages are consumed from their `dist/` output, so build them once after cloning or updating
the submodule:

```bash
cd msarinc-common && npm install && npm run build
```

The submodule has its own `node_modules`. Block its copies of `react` and `react-native` in the
app's `metro.config.js` so only one instance gets bundled:

```js
const exclusionList = require('metro-config/src/defaults/exclusionList');

config.resolver.blockList = exclusionList([
  /msarinc-common\/.*node_modules\/react\/.*/,
  /msarinc-common\/.*node_modules\/react-native\/.*/,
]);
```

### Theme

```tsx
import { ThemeProvider, ThemeToggle, useTheme } from '@msarinc/ui';

export default function App() {
  return (
    <ThemeProvider>
      <Screen />
    </ThemeProvider>
  );
}

function Screen() {
  const { colors, theme, setTheme } = useTheme();
  return <ThemeToggle />;
}
```

The selected theme is persisted with AsyncStorage. Apps with their own brand colors can pass
`palettes` to `ThemeProvider`. Toggles such as `ThemeToggle` and `LanguageSelector` switch to a
compact single button below 640px; set `compact` or `breakpoint` to override this.

### Localization

`@msarinc/i18n-common` does not create an i18next instance. Register its resources as a second
namespace in the app's own setup:

```ts
import { commonResources } from '@msarinc/i18n-common';

i18n.init({
  resources: {
    tr: { translation: appTr, common: commonResources.tr },
    en: { translation: appEn, common: commonResources.en },
  },
});
```

Components such as `AboutScreen` contain no text of their own; pass already translated strings
through their props.

### Firebase

```ts
import { initFirebase, loadFirebaseConfigFromEnv } from '@msarinc/firebase';

initFirebase(loadFirebaseConfigFromEnv());
```

The config is read from the app's `EXPO_PUBLIC_FIREBASE_*` environment variables, and the Google
client ids from `EXPO_PUBLIC_GOOGLE_*`. Wrap the app in `AuthProvider` and use `useAuth()` for
`user`, `signInWithGoogle` and `signOutUser`.

## Development

```bash
npm install
npm run dev         # watch-build core, i18n and ui, and start the demo app
npm run build       # build every package
npm run typecheck   # type-check every package
```

With `npm run dev` running, press `w` in the Expo CLI to open the demo in a browser, or `a` / `i`
for an Android emulator / iOS simulator.

`npm run check:keys -w @msarinc/i18n-common` verifies that `tr.json` and `en.json` have the same keys.
