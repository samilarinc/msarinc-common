# CLAUDE.md

Theme, i18n and UI library shared across msarinc's personal projects. npm workspaces monorepo.

## Architecture decisions (don't relitigate)

- **Expo / React Native only, no Vite/DOM package.** Consuming projects are moving to Expo, so the library is a single UI package (`packages/ui`) built on `react-native-web`. Don't suggest adding a separate web package.
- Palettes and theme state logic live in `packages/core` and stay framework-agnostic (no React dependency).
- `packages/i18n` only exports static resources (JSON + types) and never creates its own i18next instance; consuming apps register it as the `common` namespace in their own `i18n.init()`.
- `apps/demo` is a single Expo app used for both native and web testing; there is no separate web demo.
- Consumers pull this repo in as a git submodule (QuranApp does). Don't start integrating it into other projects on your own.
- `packages/firebase` (`@msarinc/firebase`): Firebase app/auth/Firestore setup, Google sign-in (`AuthProvider` / `useAuth`) and generic Firestore helpers (`useFirestoreCollection`, `addFirestoreDoc`, ...). It holds no config of its own: each app calls `initFirebase(loadFirebaseConfigFromEnv())` with its own `EXPO_PUBLIC_FIREBASE_*` / `EXPO_PUBLIC_GOOGLE_*` values.
- `packages/supabase` (`@msarinc/supabase`): first step of a gradual Firebase → Supabase move. Storage only for now (`initSupabase`, `uploadImage`, `deleteImage`); auth and data are still on Firebase. Config comes from the app's `EXPO_PUBLIC_SUPABASE_*` values.

## Commands

```bash
npm install
npm run dev         # watch-build core + i18n + ui and start the Expo dev server
npm run build       # build every workspace
npm run typecheck   # tsc --noEmit in every workspace
```

## Monorepo + Expo pitfall

`apps/demo` uses `./index.js` as its `main`, **not** `node_modules/expo/AppEntry.js`. npm workspaces hoist `expo` to the root `node_modules`, so the relative `../../App` import inside `AppEntry.js` resolved to the repo root. The local `index.js` (`registerRootComponent(App)`) avoids that; use the same pattern for any new Expo app.

## Code style

- Keep comments to a minimum: only non-obvious "why" comments. Use JSDoc only when a prop or parameter's behavior isn't clear from its name.
- Comments, docs and error messages are in English.
- Packages under `packages/*` are built with `tsup`; `dist/` is gitignored, never commit build output.
