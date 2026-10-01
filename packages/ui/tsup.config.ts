import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'react-native', '@react-native-async-storage/async-storage', 'lucide-react-native'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
