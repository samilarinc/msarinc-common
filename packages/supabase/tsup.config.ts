import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['@supabase/supabase-js', 'react-native', '@react-native-async-storage/async-storage', 'expo-linking', 'expo-web-browser'],
});
