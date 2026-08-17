import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = join(__dirname, '..', 'src', 'locales');

function flattenKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenKeys(value, path);
    }
    return [path];
  });
}

const tr = JSON.parse(readFileSync(join(localesDir, 'tr.json'), 'utf-8'));
const en = JSON.parse(readFileSync(join(localesDir, 'en.json'), 'utf-8'));

const trKeys = new Set(flattenKeys(tr));
const enKeys = new Set(flattenKeys(en));

const missingInEn = [...trKeys].filter((k) => !enKeys.has(k));
const missingInTr = [...enKeys].filter((k) => !trKeys.has(k));

if (missingInEn.length || missingInTr.length) {
  if (missingInEn.length) {
    console.error('en.json içinde eksik anahtarlar:', missingInEn);
  }
  if (missingInTr.length) {
    console.error('tr.json içinde eksik anahtarlar:', missingInTr);
  }
  process.exit(1);
}

console.log(`Key parity OK (${trKeys.size} anahtar, tr/en eşleşiyor).`);
